import {
  APIChannel,
  APIGuild,
  APIMessage,
  APITextBasedChannel,
  ChannelType,
} from "discord-api-types/v10";
import { Message } from "@resources/Message";
import { AnyClient } from "@typings/index";
import { VoiceChannel, StageChannel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import {
  TextBasedChannel,
  Channel,
  GuildChannel,
  GuildTextChannel,
  CategoryChannel,
  DMChannel,
} from "@resources/Channel";

export type GuildResolvable = Guild | APIGuild | string;
export type AnyChannel =
  | Channel
  | TextBasedChannel
  | GuildChannel
  | GuildTextChannel
  | CategoryChannel
  | DMChannel
  | VoiceChannel
  | StageChannel;
export type ChannelResolvable = string | APIChannel | AnyChannel;
export type MessageResolvable = Message | (APIMessage & { guild_id?: string });

export namespace Resolvable {
  export function resolveMessage(
    messageResolvable: MessageResolvable,
    client: AnyClient
  ) {
    let resolved: Message;
    if (!(messageResolvable instanceof Message)) {
      let guild: Guild | undefined;

      if (messageResolvable.guild_id) {
        guild = Resolvable.resolveGuild(messageResolvable.guild_id, client);
      }

      resolved = new Message({ ...messageResolvable, client }, guild);
    } else {
      resolved = messageResolvable;
    }

    const channel = Resolvable.resolveChannel(
      resolved.channelId,
      client,
      resolved.guild!
    ) as TextBasedChannel;

    resolved.channel = channel;
    resolved.isResolved = true;
    channel.messages.add(resolved);

    return resolved;
  }

  export function resolveGuild(
    guildResolvable: GuildResolvable,
    client: AnyClient
  ) {
    let resolved: Guild;

    if (!(guildResolvable instanceof Guild)) {
      if (typeof guildResolvable === "string") {
        resolved = client.cache.guilds.get(guildResolvable) as Guild;
      } else {
        resolved = new Guild({ ...guildResolvable, client });
      }
    } else {
      resolved = guildResolvable;
    }

    if (Array.isArray(resolved.rawData.roles)) {
      for (const role of resolved.rawData.roles) {
        resolved.roles.add(role);
        client.cache.roles.add(role);
      }
    }

    if (Array.isArray(resolved.rawData.emojis)) {
      for (const emoji of resolved.rawData.emojis) {
        resolved.emojis.add(emoji);
        client.cache.emojis.add(emoji);
      }
    }

    if (Array.isArray(resolved.rawData.stickers)) {
      for (const sticker of resolved.rawData.stickers) {
        resolved.stickers.add(sticker);
      }
    }

    return resolved;
  }

  export function resolveChannel(
    channelResolvable: ChannelResolvable,
    client: AnyClient,
    guildResolvable?: GuildResolvable
  ) {
    let resolved: AnyChannel | undefined;
    let guild: Guild | undefined;

    if (guildResolvable) {
      guild = Resolvable.resolveGuild(guildResolvable, client);
    }

    if (!(channelResolvable instanceof Channel)) {
      if (typeof channelResolvable === "string") {
        const c = client.cache.channels.get(channelResolvable);
        resolved = c
      } else {
        resolved = Channel.from({ ...channelResolvable, client }, guild!);
      }
    }

    if (resolved!.isGuildChannel()) {
      resolved.guild.channels.add(resolved);
    }

    client.cache.channels.add(resolved!);

    return resolved;
  }
}
