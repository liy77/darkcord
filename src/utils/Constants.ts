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
