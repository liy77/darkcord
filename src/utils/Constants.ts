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

export enum ShardEvents {
  Connect = "connect",
  Reconnecting = "reconnecting",
  Close = "close",
  Resume = "resume",
  ReconnectRequired = "reconnectRequired",
  Ping = "ping",
  Hello = "hello",
  Debug = "debug",
  PreReady = "preReady",
  Error = "error",
  Dispatch = "dispatch",
  Ready = "ready"
}

export enum Events {
  // Gateway
  Packet = "packet",
  Ready = "ready",
  Reconnecting = "reconnecting",
  Connect = "connect",
  ShardConnect = "shardConnect",
  ShardDebug = "shardDebug",
  ShardClose = "shardClose",
  ShardResume = "shardResume",
  ShardReady = "shardReady",
  ShardReconnectRequired = "shardReconnectRequired",
  ShardPing = "shardPing",
  ShardHello = "shardHello",
  ShardPreReady = "shardPreReady",
  ShardError = "shardError",
  ShardDispatch = "shardDispatch",

  // Message
  MessageCreate = "messageCreate",
  MessageDelete = "messageDelete",
  MessageUpdate = "messageUpdate",
  MessageDeleteBulk = "messageDeleteBulk",
  MessageReactionAdd = "messageReactionAdd",
  MessageReactionRemove = "messageReactionRemove",
  MessageReactionRemoveAll = "messageReactionRemoveAll",
  MessageReactionRemoveEmoji = "messageReactionRemoveEmoji",
  TypingStart = "typingStart",

  // Interaction
  InteractionCreate = "interactionCreate",

  // Guild
  GuildMembersChunk = "guildMembersChunk",
  GuildMembersChunked = "guildMembersChunked",
  GuildCreate = "guildCreate",
  GuildUpdate = "guildUpdate",
  GuildDelete = "guildDelete",
  GuildAuditLogEntryCreate = "guildAuditLogEntryCreate",
  GuildBanAdd = "guildBanAdd",
  GuildBanRemove = "guildBanRemove",
  GuildEmojisUpdate = "guildEmojisUpdate",
  GuildStickersUpdate = "guildStickersUpdate",
  GuildMemberAdd = "guildMemberAdd",
  GuildMemberRemove = "guildMemberRemove",
  GuildMemberUpdate = "guildMemberUpdate",
  GuildIntegrationsUpdate = "guildIntegrationsUpdate",
  GuildRoleCreate = "guildRoleCreate",
  GuildRoleDelete = "guildRoleDelete",
  GuildRoleUpdate = "guildRoleUpdate",
  GuildScheduledEventCreate = "guildScheduledEventCreate",
  GuildScheduledEventDelete = "guildScheduledEventDelete",
  GuildScheduledEventUpdate = "guildScheduledEventUpdate",
  GuildScheduledEventUserAdd = "guildScheduledEventUserAdd",
  GuildScheduledEventUserRemove = "guildScheduledEventUserRemove",

  // Thread
  ThreadCreate = "threadCreate",
  ThreadDelete = "threadDelete",
  ThreadListSync = "threadListSync",
  ThreadMemberUpdate = "threadMemberUpdate",
  ThreadMembersUpdate = "threadMembersUpdate",

  // Stage
  StageInstanceCreate = "stageInstanceCreate",
  StageInstanceDelete = "stageInstanceDelete",
  StageInstanceUpdate = "stageInstanceUpdate",

  // Channels
  ChannelCreate = "channelCreate",
  ChannelDelete = "channelDelete",
  ChannelUpdate = "channelUpdate",
  ChannelPinsUpdate = "channelPinsUpdate",
  
  // User
  UserUpdate = "userUpdate",
  
  // Voice
  VoiceChannelSwitch = "voiceChannelSwitch",
  VoiceChannelLeave = "voiceChannelLeave",
  VoiceChannelJoin = "voiceChannelJoin",
  VoiceServerUpdate = "voiceServerUpdate",
  VoiceStateUpdate = "voiceStateUpdate",

  // Client
  Warn = "warn",
  Debug = "debug",

  // Integration
  IntegrationCreate = "integrationCreate",

  // Invite
  InviteCreate = "inviteCreate",
  InviteDelete = "inviteDelete"
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

export {
  GatewayIntentBits,
  PermissionFlagsBits,
  ChannelFlags,
  MessageFlags,
  UserFlags,
  ThreadMemberFlags,
  GuildSystemChannelFlags,
  ApplicationFlags,
  ActivityFlags,
} from "discord-api-types/v10";
