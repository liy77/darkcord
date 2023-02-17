import { CacheManager } from "@cache/CacheManager";
import { Channel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import { BaseCacheOptions } from "@typings/index";
import {
  APIChannel,
  APIGuildChannel,
  ChannelType,
} from "discord-api-types/v10";
import { DataManager } from "./DataManager";

export class ChannelDataManager extends DataManager<Channel> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
  ) {
    super(options, (get, id) => {
      const channel = get(id);
      return channel && this._resolve(channel);
    });
  }

  _resolve(
    channel: APIChannel | Channel,
    guild?: Guild,
    addInCache = false,
  ): Channel {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      channel &&
      !(channel instanceof Channel)
    ) {
      if (
        (channel as APIGuildChannel<ChannelType> | undefined)?.guild_id &&
        !guild
      ) {
        guild = this.manager.client.guilds.cache.get(
          (channel as APIGuildChannel<ChannelType>).guild_id!,
        )!;
      }

      channel = Channel.from(
        {
          ...channel,
          client: this.manager.client,
        },
        guild,
      );

      if (addInCache) this.add(channel);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return channel;
  }

  add(channel: APIChannel | Channel, replace = true) {
    return super.add(this._resolve(channel), replace, channel.id);
  }

  async fetch(id: string) {
    const item = await this.manager.client.rest.getChannel(id);

    let guild: Guild | undefined;

    if ("guild_id" in item && item.guild_id) {
      guild = this.manager.client.guilds.cache.get(item.guild_id);
    }

    const i = Channel.from(
      {
        ...item,
        client: this.manager.client,
      },
      guild,
    );

    return this.add(i);
  }
}

export class GuildChannelDataManager extends ChannelDataManager {
  constructor(
    options: number | BaseCacheOptions,
    manager: CacheManager,
    public guild: Guild,
  ) {
    super(options, manager);
  }

  add(channel: APIChannel | Channel, replace = true) {
    return super.add(super._resolve(channel, this.guild), replace);
  }
}
