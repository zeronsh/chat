import { db } from '@/database';
import { ThreadMessage } from '@/ai/types';
import * as queries from '@/database/queries';
import { ThreadError } from '@/ai/error';
import { convertToModelMessages, generateText } from 'ai';
import { createResumableStreamContext } from 'resumable-stream';

export const streamContext = createResumableStreamContext({
    waitUntil: promise => promise,
});

export async function prepareThread(args: {
    userId: string;
    threadId: string;
    streamId: string;
    modelId: string;
    message: ThreadMessage;
}) {
    return db.transaction(async tx => {
        let [thread, message, model, settings] = await Promise.all([
            queries.getThreadById(tx, args.threadId),
            queries.getMessageById(tx, args.message.id),
            queries.getModelById(tx, args.modelId),
            queries.getSettingsByUserId(tx, args.userId),
        ]);

        if (!settings) {
            throw new ThreadError('SettingsNotFound', {
                status: 404,
                message: 'Settings for user (userId) does not exist',
                metadata: {
                    userId: args.userId,
                },
            });
        }

        if (!model) {
            throw new ThreadError('ModelNotFound', {
                status: 404,
                message: 'Model with (modelId) does not exist',
                metadata: {
                    modelId: args.modelId,
                },
            });
        }

        if (!thread) {
            [thread] = await queries.createThread(tx, {
                userId: args.userId,
                threadId: args.threadId,
            });
        }

        if (thread.status === 'streaming') {
            throw new ThreadError('ThreadAlreadyStreaming', {
                metadata: {
                    threadId: args.threadId,
                },
            });
        }

        if (thread.userId !== args.userId) {
            throw new ThreadError('NotAuthorized', {
                message: 'User is not the owner of the thread',
                metadata: {
                    threadId: args.threadId,
                },
            });
        }

        await queries.updateThread(tx, {
            threadId: args.threadId,
            status: 'streaming',
            streamId: args.streamId,
            updatedAt: new Date(),
        });

        if (!message) {
            [message] = await queries.createMessage(tx, {
                threadId: args.threadId,
                userId: args.userId,
                message: args.message,
            });
        }

        if (message) {
            [[message]] = await Promise.all([
                queries.updateMessage(tx, {
                    messageId: args.message.id,
                    message: args.message,
                    updatedAt: new Date(),
                }),
                queries.deleteTrailingMessages(tx, {
                    threadId: args.threadId,
                    messageId: args.message.id,
                    messageCreatedAt: message.createdAt,
                }),
            ]);
        }

        const history = await queries.getThreadMessageHistory(tx, args.threadId);

        return {
            model,
            thread,
            message,
            history,
            settings,
        };
    });
}

export async function prepareResumeThread(args: { threadId: string; userId: string }) {
    const thread = await queries.getThreadById(db, args.threadId);

    if (!thread) {
        throw new ThreadError('ThreadNotFound', {
            status: 404,
            metadata: {
                threadId: args.threadId,
                userId: args.userId,
            },
        });
    }

    if (thread.userId !== args.userId) {
        throw new ThreadError('NotAuthorized', {
            status: 403,
            metadata: {
                threadId: args.threadId,
                userId: args.userId,
            },
        });
    }

    if (!thread.streamId) {
        throw new ThreadError('StreamNotFound', {
            status: 404,
            metadata: {
                threadId: args.threadId,
                userId: args.userId,
            },
        });
    }

    return thread.streamId;
}

export async function generateThreadTitle(threadId: string, message: ThreadMessage) {
    const { text } = await generateText({
        model: 'google/gemini-2.0-flash-001',
        system: `\nc
        - you will generate a short title based on the first message a user begins a conversation with
        - ensure it is not more than 80 characters long
        - the title should be a summary of the user's message
        - do not use quotes or colons`,
        temperature: 0.8,
        messages: convertToModelMessages([message]),
    });

    await queries.updateThreadTitle(db, {
        threadId,
        title: text,
    });
}

export async function saveMessageAndResetThreadStatus({
    threadId,
    userId,
    message,
}: {
    threadId: string;
    userId: string;
    message: ThreadMessage;
}) {
    await db.transaction(async tx => {
        await Promise.all([
            await queries.createMessage(tx, {
                threadId,
                userId,
                message,
            }),
            await queries.updateThread(tx, {
                threadId,
                status: 'ready',
                streamId: null,
            }),
        ]);
    });
}
