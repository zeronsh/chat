import { db } from '@/database';
import { ThreadMessage } from '@/ai/types';
import * as queries from '@/database/queries';
import { ThreadError } from '@/ai/error';
import { convertToModelMessages, generateText } from 'ai';
import { createResumableStreamContext } from 'resumable-stream';
import { UserId } from '@/database/types';

export const streamContext = createResumableStreamContext({
    waitUntil: promise => promise,
});

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
    try {
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

        await db.transaction(async tx => {
            await queries.updateThreadTitle(tx, {
                threadId,
                title: text,
            });
        });
    } catch (error) {
        console.error(error);
    }
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

export async function incrementUsage(
    userId: UserId,
    type: 'search' | 'research' | 'credits',
    amount: number
) {
    await queries.incrementUsage(
        db,
        {
            userId,
            type,
        },
        amount
    );
}

export async function decrementUsage(
    userId: UserId,
    type: 'search' | 'research' | 'credits',
    amount: number
) {
    await queries.decrementUsage(
        db,
        {
            userId,
            type,
        },
        amount
    );
}
