import { BaseCacheOptions } from "@typings/index";

export type CacheEntries<K, V> =
  | Readonly<Readonly<[K, V]>[]>
  | Iterable<Readonly<[K, V]>>;

export class Cache<V> extends Map<string, V> {
  limit: Readonly<number>;
  #sweeper: null | {
    lifetime: number | undefined;
    keep: ((value: V) => boolean) | undefined;
    filter: ((value: V) => boolean) | undefined;
  };

  constructor(entries?: CacheEntries<string, V>);
  constructor(entries?: Readonly<Readonly<[string, V]>[]>);
  constructor(entries?: Iterable<Readonly<[string, V]>>);
  constructor(limit?: number, entries?: Readonly<Readonly<[string, V]>[]>);
  constructor(limit?: number, entries?: Readonly<Readonly<[string, V]>[]>);
  constructor(limit?: number, entries?: Iterable<Readonly<[string, V]>>);
  constructor(
    limit?: BaseCacheOptions<V> | number | CacheEntries<string, V>,
    entries?: CacheEntries<string, V>,
  );
  constructor(limit?: BaseCacheOptions<V>, entries?: CacheEntries<string, V>);
  constructor(
    limit?: BaseCacheOptions<V>,
    entries?: Readonly<Readonly<[string, V]>[]>,
  );
  constructor(
    limit?: BaseCacheOptions<V>,
    entries?: Iterable<Readonly<[string, V]>>,
  );
  constructor(
    limit?: number | CacheEntries<string, V> | BaseCacheOptions<V>,
    entries?: CacheEntries<string, V>,
  ) {
    super();
    this.#sweeper = null;
    if (
      Number.isNaN(Number(limit)) &&
      (Array.isArray(limit) ||
        (typeof limit === "object" && Symbol.iterator in limit))
    ) {
      entries = limit as CacheEntries<string, V>;
      limit = Infinity;
    } else if (typeof limit === "object" && "maxSize" in limit) {
      const options = limit;
      this.#sweeper = {
        lifetime: options.sweeper?.lifetime,
        keep: options.sweeper?.keepFilter,
        filter: options.sweeper?.filter,
      };

      limit = limit.maxSize;
    }

    if (entries) {
      for (const [key, value] of entries) {
        this.set(key, value)
      }
    }

    this.limit = Number(limit);
  }

  set(key: string, value: V) {
    super.set(key, value);

    if (this.size > this.limit) {
      while (this.size > this.limit) {
        this.delete(this.keys().next().value);
      }
    }

    if (this.#sweeper && this.#sweeper.filter && !this.#sweeper.keep?.(value)) {
      setTimeout(
        () => this.sweep(this.#sweeper!.filter!),
        this.#sweeper.lifetime || 120_000,
      );
    }

    return this;
  }

  forEach(fn: (value: V, key: string, cache: Cache<V>) => void) {
    for (const [key, value] of this.entries()) {
      fn(value, key, this);
    }
  }

  filter(fn: (value: V, key: string, cache: Cache<V>) => boolean) {
    const filteredCache = new Cache<V>(this.limit);

    for (const [key, value] of this.entries()) {
      if (fn(value, key, this)) {
        filteredCache.set(key, value);
      }
    }

    return filteredCache;
  }

  find(
    fn: (value: V, key: string, cache: Cache<V>) => boolean,
  ): [string, V] | undefined {
    for (const [key, value] of this) {
      if (fn(value, key, this)) {
        return [key, value];
      }
    }

    return undefined;
  }

  every(fn: (value: V, key: string, cache: Cache<V>) => boolean): boolean {
    return [...this.entries()].every(([key, value]) => fn(value, key, this));
  }

  some(fn: (value: V, key: string, cache: Cache<V>) => boolean): boolean {
    return [...this.entries()].some(([key, value]) => fn(value, key, this));
  }

  map<MV>(
    fn: (value: V, key: string, cache: Cache<V>) => { key: string; value: MV },
  ): Cache<MV> {
    const mappedCachedMap = new Cache<MV>(this.limit);

    for (const [key, value] of this) {
      const e = fn(value, key, this);

      if (typeof e === "object" && "key" in e && "value" in e) {
        mappedCachedMap.set(e.key, e.value);
      }
    }

    return mappedCachedMap;
  }

  first(): V;
  first(amount?: number): V[];
  first(amount?: number) {
    if (amount && amount > 0) {
      amount = Math.min(this.size, amount);

      const arr = Array.from(
        { length: amount },
        () => this.values().next().value,
      );

      return amount > this.limit ? arr.splice(this.limit, amount) : arr;
    } else if (amount && amount < 0) {
      return this.last(amount * -1);
    }

    return this.values().next().value;
  }

  last(): V;
  last(amount?: number): V[];
  last(amount?: number): V | V[] {
    const arr = [...this.values()];

    if (amount && amount < 0) {
      return this.first(amount * -1);
    } else if (amount || amount === 0) {
      return arr.slice(-amount);
    }

    return arr[arr.length - 1];
  }

  at(index: number) {
    index = Math.floor(index);

    const arr = [...this.values()];

    return arr.at(index);
  }

  reverse() {
    return new Cache(this.limit, [...this.entries()].reverse());
  }

  indexOf(value: V) {
    const arr = [...this.values()];
    return arr.indexOf(value);
  }

  reduce(
    fn: (previous: [string, V], current: [string, V]) => [string, V],
    initialValue: [string, V],
  ) {
    return [...this.entries()].reduce(fn, initialValue);
  }

  keyOf(value: V) {
    const indexOf = this.indexOf(value);
    const arr = [...this.keys()];

    return arr[indexOf];
  }

  sweep(fn: (value: V, key: string, cache: Cache<V>) => boolean) {
    const previousSize = this.size;

    for (const [key, value] of this) {
      if (fn(value, key, this)) {
        this.delete(key);
      }
    }

    return previousSize - this.size;
  }

  partition(
    fn: (value: V, key: string, cache: Cache<V>) => boolean,
  ): [Cache<V>, Cache<V>] {
    const [cachedTrue, cachedFalse] = [new Cache<V>(), new Cache<V>()];

    for (const [key, value] of this) {
      if (fn(value, key, this)) {
        cachedTrue.set(key, value);
      } else {
        cachedFalse.set(key, value);
      }
    }

    return [cachedTrue, cachedFalse];
  }
}
