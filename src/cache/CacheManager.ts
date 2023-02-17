/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Client, InteractionClient } from "@client/Client";
import { UserDataManager } from "@manager/UserDataManager";
import { ThreadChannel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import { CacheAdapter, ClientOptions } from "@typings/index";
import { Partials } from "@utils/Constants";

import { Cache } from "./Cache";
import { ChannelCache } from "./ChannelCache";
import { EmojiCache } from "./EmojiCache";
import { RoleCache } from "./RoleCache";

export class CacheManager {
  channels: ChannelCache;
  guilds: Cache<Guild>;
  emojis: EmojiCache;
  users: UserDataManager;
  roles: RoleCache;
  adapter?: CacheAdapter<any> | Map<string, any>;
  threads: Cache<ThreadChannel>;
  constructor(public client: Client | InteractionClient) {
    this.adapter = client.options?.cache?.adapter;

    this.channels = this._createCache("channels");
    this.threads = this._createCache("threads");
    this.emojis = this._createCache("emojis");
    this.guilds = this._createCache("guilds");
    this.users = this._createCache("users");
    this.roles = this._createCache("roles");
  }

  _createCache(option: string) {
    const options = this.client.options.cache as ClientOptions["cache"];

    let cache: any;

    switch (option) {
      case "guilds": {
        if (this._cacheLimit("guilds")) {
          (this.client as Client).emit(
            "warn",
            "Limiting guild cache can cause problems",
          );
        }
        return new Cache(this.client.options.cache?.guilds, new Map());
      }
      case "channels": {
        cache = ChannelCache;
        break;
      }
      case "roles": {
        cache = RoleCache;
        break;
      }
      case "users": {
        cache = UserDataManager;
        break;
      }
      case "emojis": {
        cache = EmojiCache;
        break;
      }
      default: {
        cache = Cache;
        break;
      }
    }

    return new cache(options?.[option], this);
  }

  _partial(p: Partials) {
    return this.client.options.partials?.includes(p);
  }

  _cacheInstance(o: any): o is Cache<any> {
    return o instanceof Cache;
  }

  _cacheLimit(option: string) {
    const o = this.client.options.cache?.[option] || 0;
    return this._cacheInstance(o)
      ? o.limit
      : typeof o === "number"
      ? o
      : (o as { maxSize: number }).maxSize;
  }
}
