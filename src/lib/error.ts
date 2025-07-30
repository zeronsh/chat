import { Data, Effect } from 'effect';

export class APIError extends Data.TaggedError('APIError')<{
    status: number;
    message?: string;
    metadata?: Record<string, unknown>;
    cause?: unknown;
}> {
    private log = Effect.logError('API Error', {
        message: this.message,
        metadata: this.metadata,
        cause: this.cause,
    });

    get response() {
        const response = Response.json(
            {
                message: this.message,
                metadata: this.metadata,
            },
            { status: this.status }
        );

        const thisError = this;

        return Effect.gen(function* () {
            yield* thisError.log;

            return response;
        });
    }
}
