import { useParams } from '@tanstack/react-router';

export function useParamsThreadId() {
    const params = useParams({ from: '/_thread/$threadId', shouldThrow: false });

    const { threadId } = params ?? { threadId: undefined };

    return threadId;
}

export function useThreadIdOrThrow() {
    const threadId = useParamsThreadId();
    if (!threadId) {
        throw new Error('Thread ID is required');
    }
    return threadId;
}
