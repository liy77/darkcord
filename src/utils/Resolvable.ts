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
      resolved = new Message(
        { ...messageResolvable, client },
        messageResolvable.guild_id &&
          Resolvable.resolveGuild(messageResolvable.guild_id, client)
      );
    } else {
      resolved = messageResolvable;
    }

    const channel = Resolvable.resolveChannel(
      resolved.channelId,
      client,
      resolved.guild
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
        resolved = client.cache.guilds.get(guildResolvable);
      } else {
        resolved = new Guild({ ...guildResolvable, client });
      }
    } else {
      resolved = guildResolvable;
    }

    if (Array.isArray(resolved.partial.roles)) {
      for (const role of resolved.partial.roles) {
        resolved.roles.add(role);
        client.cache.roles.add(role);
      }
    }

    if (Array.isArray(resolved.partial.emojis)) {
      for (const emoji of resolved.partial.emojis) {
        resolved.emojis.add(emoji);
        client.cache.emojis.add(emoji);
      }
    }

    if (Array.isArray(resolved.partial.stickers)) {
      for (const sticker of resolved.partial.stickers) {
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
    let resolved: AnyChannel;
    let guild: Guild;

    if (guildResolvable) {
      guild = Resolvable.resolveGuild(guildResolvable, client);
    }

    if (!(channelResolvable instanceof Channel)) {
      if (typeof channelResolvable === "string") {
        const c = client.cache.channels.get(channelResolvable);

        resolved =
          c instanceof Channel ? c : Channel.from({ ...c, client }, guild);
      } else {
        resolved = Channel.from({ ...channelResolvable, client }, guild);
      }
    }

    if (resolved instanceof GuildChannel) {
      resolved.guild.channels.add(resolved);
    }

    client.cache.channels.add(resolved);

    return resolved;
  }
}
