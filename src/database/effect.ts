import { db as instance, Transaction, type Database as DatabaseImpl } from '@/database';
import { Effect, Layer, Runtime } from 'effect';

export class Database extends Effect.Tag('Database')<
    Database,
    {
        readonly instance: DatabaseImpl;
    }
>() {
    static transaction = <TReturn, TError, TService>(
        effect: Effect.Effect<TReturn, TError, Database | TService>
    ) => {
        return Effect.gen(function* () {
            const db = yield* Database.instance;
            const runtime = yield* Effect.runtime<TService>();

            function tranction(instance: Transaction) {
                return Runtime.runPromise(
                    runtime,
                    effect.pipe(
                        Effect.provide(Layer.scoped(Database, Effect.succeed({ instance })))
                    )
                );
            }

            function callback() {
                return db.transaction(tranction);
            }

            return yield* Effect.tryPromise(callback);
        });
    };
}

export const DatabaseLive = Layer.scoped(Database, Effect.succeed({ instance }));
