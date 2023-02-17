import { Cache, CacheEntries } from "@cache/Cache";
import { BaseCacheOptions } from "@typings/index";

type DataResolver<V> = (cache: Cache<V>, key: string) => V | undefined;

export class DataManager<V extends Record<string, any>> {
  cache: Cache<V>;

  constructor(entries?: CacheEntries<string, V>, resolver?: DataResolver<V>);
  constructor(
    entries?: Readonly<Array<Readonly<[string, V]>>>,
    resolver?: DataResolver<V>,
  );
  constructor(
    entries?: Iterable<Readonly<[string, V]>>,
    resolver?: DataResolver<V>,
  );
  constructor(
    limit?: number,
    entries?: Readonly<Array<Readonly<[string, V]>>>,
    resolver?: DataResolver<V>,
  );
  constructor(
    limit?: number,
    entries?: Readonly<Array<Readonly<[string, V]>>>,
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
    entries?: Readonly<Array<Readonly<[string, V]>>> | DataResolver<V>,
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

    this.cache = new Cache(limit, entries as CacheEntries<string, V>);

    if (typeof resolver === "function") {
      this.cache.get = function (key: string) {
        return resolver?.(this, key);
      };
    }
  }

  add(item: V, replace = true, id?: string) {
    if ("id" in item && !id) {
      id = item.id;
    }

    if (this.cache.has(id as string) && !replace) return item;
    this.cache.set(id as string, item);
    return item;
  }
}
