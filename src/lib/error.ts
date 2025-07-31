import { Data, Effect } from 'effect';

export class APIError extends Data.TaggedError('APIError')<{
    status: number;
    message?: string;
    metadata?: Record<string, unknown>;
    cause?: unknown;
}> {
    public static map({
        status,
        message,
        metadata,
    }: {
        status: number;
        message?: string;
        metadata?: Record<string, unknown>;
    }) {
        return Effect.mapError(cause => {
            if (cause instanceof APIError) {
                return cause;
            }

            return new APIError({
                status,
                message,
                metadata,
                cause,
            });
        });
    }

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
