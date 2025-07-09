import { useParams } from '@tanstack/react-router';

export function useParamsThreadId() {
    const params = useParams({ from: '/_thread/$threadId', shouldThrow: false });

    const { threadId } = params ?? { threadId: undefined };

    return threadId;
}
