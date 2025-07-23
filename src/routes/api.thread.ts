import type { ThreadMessage } from '@/ai/types';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { smoothStream, stepCountIs } from 'ai';
import z from 'zod';
import { auth } from '@/lib/auth';
import { ThreadError } from '@/ai/error';
import {
    generateThreadTitle,
    prepareThread,
    saveMessageAndResetThreadStatus,
    streamContext,
} from '@/ai/service';
import { convertUIMessagesToModelMessages, createUIMessageStreamResponse } from '@/ai/stream';
import { nanoid } from '@/lib/utils';
import { getTools } from '@/ai/tools';
import { getSystemPrompt } from '@/ai/prompt';

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
                const session = await auth.api.getSession({
                    headers: request.headers,
                });

                if (!session) {
                    throw new ThreadError('NotAuthorized');
                }

                const streamId = nanoid();

                const { history, thread, message, model, settings } = await prepareThread({
                    streamId,
                    modelId: body.modelId,
                    userId: session.user.id,
                    threadId: body.id,
                    message: body.message,
                });

                return {
                    streamId,
                    threadId: thread.id,
                    userId: session.user.id,
                    model,
                    thread,
                    settings,
                    message,
                    tool: body.tool,
                    messages: await convertUIMessagesToModelMessages(history, {
                        supportsImages: model.capabilities.includes('vision'),
                        supportsDocuments: model.capabilities.includes('documents'),
                    }),
                };
            },
            onStream: ({ context: { messages, model, settings, tool }, writer }) => {
                return {
                    model: model.model,
                    messages,
                    temperature: 0.8,
                    stopWhen: stepCountIs(3),
                    system: getSystemPrompt(settings, tool ? [tool] : []),
                    tools: getTools({ writer }, tool ? [tool] : []),
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
            onAfterStream: async ({ context: { threadId, message, streamId, thread }, stream }) => {
                const promises: Promise<any>[] = [];

                if (!thread.title) {
                    promises.push(generateThreadTitle(threadId, message.message));
                }

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
            onFinish: async ({ responseMessage, context: { threadId, userId } }) => {
                await saveMessageAndResetThreadStatus({
                    threadId,
                    userId,
                    message: responseMessage,
                });
            },
        });
    },
});
