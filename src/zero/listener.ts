import type { TTL, Query, Zero, TypedView } from '@rocicorp/zero';
import type { HumanReadable, ResultType, Schema } from '@rocicorp/zero/react';
type Primitive = undefined | null | boolean | string | number | symbol | bigint;

type Immutable<T> = T extends Primitive
    ? T
    : T extends ReadonlyArray<infer U>
      ? ImmutableArray<U>
      : ImmutableObject<T>;

type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;

type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

type DataListener<TReturn> = (data: HumanReadable<TReturn>, resultType: ResultType) => void;

class SimpleViewManager {
    #views = new Map<string, SimpleView<any, any, any>>();

    getView<TSchema extends Schema, TTable extends keyof TSchema['tables'] & string, TReturn>(
        zero: Zero<TSchema>,
        query: Query<TSchema, TTable, TReturn>,
        ttl?: TTL
    ): SimpleView<TSchema, TTable, TReturn> {
        const hash = query.hash() + zero.clientID;
        let existing = this.#views.get(hash);

        if (!existing) {
            query = query.delegate(zero.queryDelegate);
            existing = new SimpleView(query, ttl, () => {
                this.#views.delete(hash);
            });
            this.#views.set(hash, existing);
        }

        return existing as SimpleView<TSchema, TTable, TReturn>;
    }
}

class SimpleView<TSchema extends Schema, TTable extends keyof TSchema['tables'] & string, TReturn> {
    #view: TypedView<HumanReadable<TReturn>> | undefined;
    #listeners = new Set<DataListener<TReturn>>();
    #query: Query<TSchema, TTable, TReturn>;
    #onDestroy: () => void;

    constructor(
        query: Query<TSchema, TTable, TReturn>,
        ttl: TTL | undefined,
        onDestroy: () => void
    ) {
        this.#query = query;
        this.#onDestroy = onDestroy;
        this.#materialize(ttl);
    }

    #materialize(ttl?: TTL) {
        if (this.#view) return;

        this.#view = this.#query.materialize(ttl);
        this.#view.addListener(
            (data: Immutable<HumanReadable<TReturn>>, resultType: ResultType) => {
                for (const listener of this.#listeners) {
                    listener(data as HumanReadable<TReturn>, resultType);
                }
            }
        );
    }

    subscribe(listener: DataListener<TReturn>): () => void {
        this.#listeners.add(listener);

        return () => {
            this.#listeners.delete(listener);
            if (this.#listeners.size === 0) {
                this.destroy();
            }
        };
    }

    destroy() {
        this.#view?.destroy();
        this.#view = undefined;
        this.#onDestroy();
    }
}

const viewManager = new SimpleViewManager();

export class SimpleListener<
    TSchema extends Schema,
    TTable extends keyof TSchema['tables'] & string,
    TReturn,
> {
    #view: SimpleView<TSchema, TTable, TReturn>;

    constructor({
        zero,
        query,
        listener,
        ttl,
    }: {
        zero: Zero<TSchema>;
        query: Query<TSchema, TTable, TReturn>;
        listener: DataListener<TReturn>;
        ttl?: TTL;
    }) {
        this.#view = viewManager.getView(zero, query, ttl);
        this.#view.subscribe(listener);
    }

    destroy() {
        this.#view.destroy();
    }
}
