import { InteractionClient } from "@client/Client";
import {
  CategoryChannel,
  Channel,
  DMChannel,
  GuildChannel,
  GuildTextChannel,
  StageChannel,
  TextBasedChannel,
  VoiceChannel,
} from "@resources/Channel";
import { Guild } from "@resources/Guild";
import { Interaction } from "@resources/Interaction";
import { Member } from "@resources/Member";
import { Message } from "@resources/Message";
import { AnyClient } from "@typings/index";
import { APIChannel, APIGuild, APIMessage } from "discord-api-types/v10";

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
    client: AnyClient,
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
      resolved.guild!,
    ) as TextBasedChannel;

    resolved.channel = channel;
    resolved.isResolved = true;
    channel.messages?.add(resolved);

    return resolved;
  }

  export function resolveGuild(
    guildResolvable: GuildResolvable,
    client: AnyClient,
  ) {
    let resolved: Guild;

    if (!(guildResolvable instanceof Guild)) {
      if (typeof guildResolvable === "string") {
        resolved = client.guilds.cache.get(guildResolvable)!;
      } else {
        resolved = new Guild({ ...guildResolvable, client });
      }
    } else {
      resolved = guildResolvable;
    }

    if (Array.isArray(resolved.rawData.roles)) {
      for (const role of resolved.rawData.roles) {
        resolved.roles.add(role);
        client.roles.cache._add(role);
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
    guildResolvable?: GuildResolvable,
  ) {
    let resolved: AnyChannel | undefined;
    let guild: Guild | undefined;

    if (guildResolvable) {
      guild = Resolvable.resolveGuild(guildResolvable, client);
    }

    if (!(channelResolvable instanceof Channel)) {
      if (typeof channelResolvable === "string") {
        const c =
          client.channels.cache.get(channelResolvable) ??
          client.threads.get(channelResolvable);
        resolved = c;
      } else {
        resolved = Channel.from({ ...channelResolvable, client }, guild!);
      }
    } else {
      resolved = channelResolvable;
    }

    if (resolved!.isGuildChannel()) {
      resolved.guild.channels.add(resolved);
    }

    client.channels.add(resolved!);

    return resolved;
  }

  export async function resolvePartialHTTPInteractionValues(
    interaction: Interaction<false> | Interaction<true>,
    client: InteractionClient,
  ): Promise<Interaction<false>> {
    if (
      (interaction.isCommand() ||
        interaction.isComponent() ||
        interaction.isModalSubmit()) &&
      interaction.isHTTP
    ) {
      let guild: Guild | undefined;

      if ("guildId" in interaction) {
        if (client.guilds.cache.has(interaction.guildId!)) {
          guild = client.guilds.cache.get(interaction.guildId!);
        } else if (interaction.guildId) {
          // Slower, but functional
          guild = await client.guilds.fetch(interaction.guildId, {
            fetchMembers: true,
          });
        }

        interaction.guild = guild;
      }

      if (interaction.channel) {
        interaction.channel = resolveChannel(
          interaction.channel as APIChannel,
          client,
          guild,
        )!;
      }

      if (
        "member" in interaction &&
        interaction.member &&
        !(interaction.member instanceof Member) &&
        guild
      ) {
        interaction.member =
          guild.members.cache.get(
            (interaction as Interaction<true>).member!.user?.id!,
          ) ?? guild.members.add(new Member(interaction.rawData.member!, guild));
      }
    }

    return interaction as Interaction<false>;
  }
}
