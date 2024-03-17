import { CacheManager } from "@cache/CacheManager";
import {
  CategoryChannel,
  Channel,
  DMChannel,
  ForumChannel,
  GuildTextChannel,
  StageChannel,
  ThreadChannel,
  VoiceChannel,
} from "@resources/Channel";
import { Guild } from "@resources/Guild";
import { BaseCacheOptions, DataWithClient } from "@typings/index";
import {
  APIChannel,
  APIGuildChannel,
  ChannelType,
} from "discord-api-types/v10";
import { DataManager } from "./DataManager";
import { AnyChannel, GuildResolvable, Resolvable } from "@utils/Resolvable";
import { Forge, Forged } from "@resources/forge/Forgified";

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

  add(channel: Channel | APIChannel, replace = true): Channel {
    if (!channel || !channel.id) {
      return null as unknown as Channel;
    }

    return super.add(this._resolve(channel), replace, channel.id);
  }

  get(id: string) {
    return this.cache.get(id);
  }

  forge(id: string): Channel;
  forge(data: Forged<APIChannel>): Channel;
  forge(data: Forged<APIChannel> | string, guild?: Guild) {
    let base: new (...args: any) => AnyChannel = Channel;

    if (typeof data === "string") {
      data = { id: data } as DataWithClient<APIChannel>;
    }

    if ("type" in data && data.type) {
      switch (data.type as ChannelType) {
        case ChannelType.DM: {
          base = DMChannel;
          break;
        }
        case ChannelType.GuildText: {
          base = GuildTextChannel;
          break;
        }
        case ChannelType.GuildVoice: {
          base = VoiceChannel;
          break;
        }
        case ChannelType.PublicThread:
        case ChannelType.PrivateThread: {
          base = ThreadChannel;
          break;
        }
        case ChannelType.GuildStageVoice: {
          base = StageChannel;
          break;
        }
        case ChannelType.GuildCategory: {
          base = CategoryChannel;
          break;
        }
        case ChannelType.GuildForum: {
          base = ForumChannel;
          break;
        }
        default: {
          base = Channel;
          break;
        }
      }
    }

    return this.add(
      new Forge<typeof Channel>(
        this.manager.client,
        base as unknown as typeof Channel,
      ).forge(...[data, guild]),
      false,
    );
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

export class ClientChannelsDataManager extends ChannelDataManager {
  _add(channel: APIChannel | Channel, guild?: GuildResolvable, replace = true) {
    return super.add(
      super._resolve(
        channel,
        guild ? Resolvable.resolveGuild(guild, this.manager.client) : undefined,
      ),
      replace,
    );
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
