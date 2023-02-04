import { Channel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import { BaseCacheOptions } from "@typings/index";
import { Partials } from "@utils/Constants";
import {
  APIChannel,
  APIGuildChannel,
  ChannelType,
} from "discord-api-types/v10";

import { Cache } from "./Cache";
import { CacheManager } from "./CacheManager";

export class ChannelCache extends Cache<Channel> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager
  ) {
    super(options, manager.adapter);
  }

  get(id: string, guild?: Guild) {
    const channel = super.get(id);
    return channel && this._resolve(channel, guild, true);
  }

  _resolve(channel: APIChannel | Channel, guild?: Guild, addInCache = false): Channel {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      channel &&
      !(channel instanceof Channel)
    ) {
      if (
        (channel as APIGuildChannel<ChannelType> | undefined)?.guild_id &&
        !guild
      ) {
        guild = this.manager.guilds.get(
          (channel as APIGuildChannel<ChannelType>).guild_id!
        ) as Guild;
      }

      channel = Channel.from(
        {
          ...channel,
          client: this.manager.client,
        },
        guild
      );

      if (addInCache) this.add(channel);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return channel;
  }

  add(channel: APIChannel | Channel, replace = true) {
    return super._add(channel, replace, channel.id);
  }

  async fetch(id: string) {
    const item = await this.manager.client.rest.getChannel(id);

    const i = Channel.from({
      ...item,
      client: this.manager.client,
    });

    return this.add(i);
  }
}

export class GuildChannelCache extends ChannelCache {
  constructor(
    options: number | BaseCacheOptions,
    manager: CacheManager,
    public guild: Guild
  ) {
    super(options, manager);
  }

  get(id: string) {
    return super.get(id, this.guild);
  }

  add(channel: APIChannel | Channel, replace = true) {
    return super.add(super._resolve(channel, this.guild), replace);
  }
}
