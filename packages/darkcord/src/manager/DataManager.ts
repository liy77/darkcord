import { Cache, CacheEntries } from "@cache/Cache";
import { BaseCacheOptions } from "@typings/index";

type DataResolver<V> = (
  this: Cache<V>,
  getFn: (key: string) => V | undefined,
  key: string,
) => V | undefined;

export class DataCache<V extends Record<string, any>> extends Cache<V> {
  #resolver?: DataResolver<V>;
  _setResolver(resolver: DataResolver<V>) {
    this.#resolver = resolver.bind(this);
  }

  get(key: string): V | undefined {
    if (this.#resolver) {
      return this.#resolver((key_1) => super.get(key_1), key);
    }

    return super.get(key);
  }

  _add(item: V, replace = true, id?: string) {
    if ("id" in item && !id) {
      id = item.id;
    }

    if (this.has(id!) && !replace) return item;
    this.set(id!, item);
    return item;
  }
}

export class DataManager<V extends Record<string, any>> {
  cache: DataCache<V>;

  constructor(entries?: CacheEntries<string, V>, resolver?: DataResolver<V>);
  constructor(
    entries?: Readonly<Readonly<[string, V]>[]>,
    resolver?: DataResolver<V>,
  );
  constructor(
    entries?: Iterable<Readonly<[string, V]>>,
    resolver?: DataResolver<V>,
  );
  constructor(
    limit?: number,
    entries?: Readonly<Readonly<[string, V]>[]>,
    resolver?: DataResolver<V>,
  );
  constructor(
    limit?: number,
    entries?: Readonly<Readonly<[string, V]>[]>,
    resolver?: DataResolver<V>,
  );
  constructor(
    limit?: number,
    entries?: Iterable<Readonly<[string, V]>>,
    resolver?: DataResolver<V>,
  );
  constructor(
    limit?: BaseCacheOptions<V> | number | CacheEntries<string, V>,
    entries?: CacheEntries<string, V> | DataResolver<V>,
    resolver?: DataResolver<V>,
  );
  constructor(
    limit?: BaseCacheOptions<V> | number,
    entries?: CacheEntries<string, V> | DataResolver<V>,
    resolver?: DataResolver<V>,
  );
  constructor(
    limit?: BaseCacheOptions<V> | number,
    entries?: Readonly<Readonly<[string, V]>[]> | DataResolver<V>,
    resolver?: DataResolver<V>,
  );
  constructor(
    limit?: BaseCacheOptions<V> | number,
    entries?: Iterable<Readonly<[string, V]>> | DataResolver<V>,
    resolver?: DataResolver<V>,
  );
  constructor(
    limit?: number | CacheEntries<string, V> | BaseCacheOptions<V>,
    entries?: CacheEntries<string, V> | DataResolver<V>,
    resolver?: DataResolver<V>,
  ) {
    if (
      typeof entries === "function" &&
      !Array.isArray(entries) &&
      !(typeof limit === "object" && Symbol.iterator in limit)
    ) {
      resolver = entries;
      entries = undefined;
    }

    this.cache = new DataCache(limit, entries as CacheEntries<string, V>);

    if (typeof resolver === "function") {
      this.cache._setResolver(resolver);
    }
  }

  add(item: V, replace = true, id?: string) {
    return this.cache._add(item, replace, id);
  }
}
