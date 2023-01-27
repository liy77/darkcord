import { MessageTimestampStyle } from "@typings/index";

export enum Partials {
  Channel,
  Emoji,
  User,
  Reaction,
  Role,
  Sticker,
}

export enum GatewayStatus {
  Connected,
  Disconnected,
  Resuming,
  Closing,
  Identifying,
  Connecting,
  Reconnecting,
  Handshaking,
  Destroyed,
  Ready,
  WaitingGuilds,
}

export const InvitePattern =
  /discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/(?<code>[\w-]{2,255})/i;

export function timestampFormat<S extends MessageTimestampStyle>(
  time: number | string,
  style?: S
): `<t:${string}:${S}>` | `<t:${string}>` {
  return `<t:${time}${style ? `:${style}` : ""}>`;
}

export function userMention(userId: string): `<@${string}>` {
  return `<@${userId}>`;
}

export function roleMention(roleId: string): `<@&${string}>` {
  return `<@&${roleId}>`;
}

export function channelMention(channelId: string): `<#${string}>` {
  return `<#${channelId}>`;
}
