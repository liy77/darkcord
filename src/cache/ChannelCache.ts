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

export class ChannelCache extends Cache<Channel | APIChannel> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager
  ) {
    super(options, manager.adapter);
  }

  get(id: string, guild?: Guild) {
    return this._resolve(super.get(id), guild, true)
  }

  _resolve(channel: APIChannel | Channel, guild?: Guild, addInCache = false) {
    if (
      channel &&
      !this.manager._partial(Partials.Channel) &&
      !(channel instanceof Channel)
    ) {
      if ((channel as APIGuildChannel<ChannelType>)?.guild_id && !guild) {
        guild = this.manager.guilds.get(
          (channel as APIGuildChannel<ChannelType>).guild_id
        );
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

    return channel
  }

  add(channel: APIChannel | Channel, replace = true) {
    return super._add(channel, replace, channel.id);
  }

  async fetch(id: string) {
    const item = await this.manager.client.rest.getChannel(id);

    if (
      !this.manager._partial(Partials.Channel) &&
      !(item instanceof Channel)
    ) {
      const i = Channel.from({
        ...item,
        client: this.manager.client,
      });

      return this.add(i);
    }

    return this.add(item);
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
    return super.add(super._resolve(channel, this.guild), replace)
  }
}
