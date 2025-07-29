import type { ThreadMessage } from '@/ai/types';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { smoothStream, stepCountIs } from 'ai';
import z from 'zod';
import { auth } from '@/lib/auth';
import { ThreadError } from '@/ai/error';
import {
    generateThreadTitle,
    incrementUsage,
    prepareThread,
    saveMessageAndResetThreadStatus,
    streamContext,
} from '@/ai/service';
import { convertUIMessagesToModelMessages, createUIMessageStreamResponse } from '@/ai/stream';
import { nanoid } from '@/lib/utils';
import { getTools } from '@/ai/tools';
import { getSystemPrompt } from '@/ai/prompt';
import { UserId } from '@/database/types';

export const ServerRoute = createServerFileRoute('/api/thread').methods({
    async POST({ request }) {
        return createUIMessageStreamResponse<ThreadMessage>()({
            request,
            schema: z.object({
                id: z.string(),
                modelId: z.string(),
                message: z.any(),
                tool: z.string().optional(),
            }),
            onPrepare: async ({ body, request }) => {
                const state = { ready: false };
                const session = await auth.api.getSession({
                    headers: request.headers,
                });

                if (!session) {
                    throw new ThreadError('NotAuthorized');
                }

                const streamId = nanoid();

                const { history, thread, message, model, settings, usage, limits } =
                    await prepareThread({
                        isAnonymous: session.user.isAnonymous ?? false,
                        streamId,
                        modelId: body.modelId,
                        userId: session.user.id,
                        threadId: body.id,
                        message: body.message,
                    });

                return {
                    state,
                    streamId,
                    threadId: thread.id,
                    userId: UserId(session.user.id),
                    model,
                    thread,
                    settings,
                    message,
                    tool: body.tool,
                    usage,
                    limits,
                    messages: await convertUIMessagesToModelMessages(history, {
                        supportsImages: model.capabilities.includes('vision'),
                        supportsDocuments: model.capabilities.includes('documents'),
                    }),
                };
            },
            onStream: ({
                context: { messages, model, settings, tool, usage, userId, limits },
                writer,
            }) => {
                return {
                    model: model.model,
                    messages,
                    temperature: 0.8,
                    stopWhen: stepCountIs(3),
                    system: getSystemPrompt(settings, tool ? [tool] : []),
                    tools: getTools({ writer, usage, userId, limits }, tool ? [tool] : []),
                    experimental_transform: smoothStream({
                        chunking: 'word',
                    }),
                    providerOptions: {
                        gateway: {
                            order: ['groq'],
                        },
                    },
                };
            },
            onStreamMessageMetadata: ({ part, context: { model } }) => {
                if (part.type === 'start') {
                    return {
                        model: {
                            id: model.id,
                            name: model.name,
                            icon: model.icon,
                        },
                    };
                }
            },
            onAfterStream: async ({
                context: { threadId, message, streamId, thread, userId, model, state },
                stream,
            }) => {
                const promises: Promise<any>[] = [];

                if (!thread.title) {
                    promises.push(
                        (async () => {
                            await generateThreadTitle(threadId, message.message);
                            state.ready = true;
                        })()
                    );
                }
                promises.push(incrementUsage(UserId(userId), 'credits', model.credits));

                promises.push(streamContext.createNewResumableStream(streamId, () => stream));

                await Promise.all(promises);
            },
            onStreamError: ({ error, writer }) => {
                console.error(error);
                writer.write({
                    type: 'data-error',
                    data: 'Error generating response.',
                });
            },
            onFinish: async ({ responseMessage, context: { threadId, userId, state, thread } }) => {
                while (!state.ready && !thread.title) {
                    console.log('waiting for thread title to be generated');
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                await saveMessageAndResetThreadStatus({
                    threadId,
                    userId,
                    message: responseMessage,
                });
            },
        });
    },
});
