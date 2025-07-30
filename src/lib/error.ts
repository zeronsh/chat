import { Data, Effect } from 'effect';

export class APIError extends Data.TaggedError('APIError')<{
    status: number;
    message?: string;
    metadata?: Record<string, unknown>;
    cause?: unknown;
}> {
    get response() {
        const response = Response.json(
            {
                message: this.message,
                metadata: this.metadata,
            },
            { status: this.status }
        );

        return Effect.succeed(response);
    }
}
