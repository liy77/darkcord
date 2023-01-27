import {
  Awaitable,
  BaseCacheOptions,
  BaseCacheSweeper,
  CacheAdapter,
} from "@typings/index";
import { CacheManager } from "./CacheManager";

export class Cache<T = any> {
  #sweeper?: BaseCacheSweeper<T>;
  adapter: CacheAdapter<T>;

  constructor(limit?: BaseCacheOptions<T> | number, adapter?: CacheAdapter<T>);
  constructor(limit: number);
  constructor(options: BaseCacheOptions<T>, adapter?: CacheAdapter<T>);
  constructor(
    public limit: number | BaseCacheOptions = Infinity,
    adapter?: CacheAdapter<T>
  ) {
    if (typeof limit === "object") {
      this.limit = limit.maxSize;
      this.#sweeper = limit.sweeper;
    } else {
      this.limit = limit;
    }

    // Configuring adapter
    if (adapter instanceof CacheManager) {
      this.adapter = adapter.adapter;
    }

    if (!this.adapter) {
      this.adapter = new Map<string, T>();
    }
  }

  delete(key: string) {
    return this.adapter.delete(key);
  }

  entries() {
    return this.adapter.entries();
  }

  values() {
    return this.adapter.values();
  }

  keys() {
    return this.adapter.keys();
  }

  has(key: string) {
    return this.adapter.has(key);
  }

  get(key: string) {
    return this.adapter.get(key);
  }

  get size(): number {
    return this.adapter.size;
  }

  get extender(): new () => Cache<T> {
    return (
      (
        this.constructor as unknown as {
          [Symbol.species]: typeof Cache;
        }
      )?.[Symbol.species] ?? Cache
    );
  }

  filter(filter: (value: T, key: string) => boolean) {
    const cache = new this.extender() as Cache<T>;

    this.forEach((value, key) => {
      if (filter(value, key) === true) {
        cache.set(key, value);
      }
    });

    return cache;
  }

  forEach(fn: (value: T, key: string) => void) {
    for (const [key, value] of this.entries()) {
      fn(value, key);
    }
  }

  find(findFn: (value: T, key: string) => boolean) {
    for (const [key, value] of this.entries()) {
      if (findFn(value, key) === true) {
        return value;
      }
    }

    return null;
  }

  reduce<I>(
    reduceFn: (accumulator: I, value: T, key: string) => I,
    initialValue?: I
  ) {
    let accumulator = initialValue as I;
    let first = false;

    if (accumulator === undefined) {
      if (this.size === 0) {
        throw new TypeError("Reduce of empty cache with no initial value");
      }

      first = true;
    }

    this.forEach((value, key) => {
      if (first === true) {
        accumulator = value as unknown as I;
        first = false;
      }

      accumulator = reduceFn(accumulator, value, key);
    });

    return accumulator;
  }

  set(key: string, value: T) {
    if (
      this.#sweeper?.filter !== undefined &&
      this.#sweeper.filter(value) === false
    ) {
      return this;
    }

    this.adapter.set(key, value);

    if (this.#sweeper?.lifetime) {
      setTimeout(() => this.delete(key), this.#sweeper.lifetime);
    }

    if (this.size >= this.limit && !this.#sweeper?.keepFilter?.(value)) {
      this.#removeToLimit();
    }

    return this;
  }

  _add(item: any, replace = false, id?: string): T {
    if (!id) {
      id = item.id;
    }

    if (!id || (this.has(id) === true && replace === false)) {
      return item;
    }

    this.set(id, item);
    return item;
  }

  map<R>(mapFn: (value: T, key: string) => R) {
    const mapped = [];

    for (const [key, value] of this.entries()) {
      mapped.push(mapFn(value, key));
    }

    return mapped;
  }

  clear() {
    return this.adapter.clear();
  }

  #removeToLimit() {
    const keys = this.keys();

    while (this.size <= this.limit) {
      const key = keys.next().value as string;
      try {
        const value = this.get(key);

        if (this.#sweeper?.keepFilter?.(value as T)) {
          continue;
        }
      } catch {}

      this.delete(key);
    }
  }
}
