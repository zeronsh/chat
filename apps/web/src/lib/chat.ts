import { db } from '@/database';
import { ThreadMessage } from '@/lib/types';
import * as queries from '@/database/queries';
import { ThreadError } from '@/lib/error';
import { convertToModelMessages, generateText } from 'ai';

export function prepareThread(args: {
    userId: string;
    threadId: string;
    nextMessageId: string;
    message: ThreadMessage;
}) {
    return db.transaction(async tx => {
        let [thread, message] = await Promise.all([
            queries.getThreadById(tx, args.threadId),
            queries.getMessageById(tx, args.message.id),
        ]);

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
            thread,
            message,
            history,
        };
    });
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
            }),
        ]);
    });
}
