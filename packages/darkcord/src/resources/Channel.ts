import { GuildChannelDataManager } from "@manager/ChannelDataManager";
import { DataCache } from "@manager/DataManager";
import { MemberDataManager } from "@manager/MemberDataManager";
import { MessageDataManager } from "@manager/MessageDataManager";
import {
  DataWithClient,
  KeysToCamelCase,
  MessagePostData,
} from "@typings/index";
import { channelMention } from "@utils/Constants";
import { Resolvable } from "@utils/Resolvable";
import { transformMessagePostData } from "@utils/index";
import {
  APIChannel,
  APIChannelBase,
  APIDMChannel,
  APIGuildCategoryChannel,
  APIGuildChannelResolvable,
  APIGuildForumChannel,
  APIGuildForumDefaultReactionEmoji,
  APIGuildForumTag,
  APIGuildStageVoiceChannel,
  APIGuildVoiceChannel,
  APIGuildWelcomeScreenChannel,
  APIOverwrite,
  APITextBasedChannel,
  APITextChannel,
  APIThreadChannel,
  APIUser,
  APIVoiceChannelBase,
  ChannelFlags as CFlags,
  ChannelType,
  ForumLayoutType,
  GuildTextChannelType,
  RESTPatchAPIChannelJSONBody,
  RESTPostAPIChannelWebhookJSONBody,
  RESTPostAPIStageInstanceJSONBody,
  SortOrderType,
  ThreadAutoArchiveDuration,
  VideoQualityMode,
} from "discord-api-types/v10";
import { Mixin } from "ts-mixer";
import { Base } from "./Base";
import { BitField } from "./BitField";
import { Emoji } from "./Emoji";
import { Guild } from "./Guild";
import { ThreadMember } from "./Member";
import { Message } from "./Message";
import { PermissionOverwrite } from "./Permission";
import { User } from "./User";
import { Webhook } from "./Webhook";

export class ChannelFlags extends BitField<CFlags, typeof CFlags> {
  constructor(flags: CFlags) {
    super(flags, CFlags);
  }

  static Flags = CFlags;
}

export class Channel extends Base {
  /**
   * The type of the channel
   *
   * @See https://discord.com/developers/docs/resources/channel#channel-object-channel-types
   */
  type: ChannelType;
  /**
   * The name of the channel (2-100 characters)
   */
  name: string | null;
  /**
   * The flags of the channel
   */
  flags: ChannelFlags | null;

  declare rawData: APIChannel;
  constructor(data: DataWithClient<APIChannelBase<ChannelType>>) {
    super(data, data.client);

    this.type = data.type;
    this.name = typeof data.name === "string" ? data.name : null;
    this.flags = data.flags ? new ChannelFlags(data.flags) : null;
  }

  async edit(
    options: KeysToCamelCase<RESTPatchAPIChannelJSONBody>,
    reason?: string,
  ) {
    const data = await this._client.rest.modifyChannel(
      this.id,
      {
        name: options.name,
        locked: options.locked,
        type: options.type,
        invitable: options.invitable,
        default_auto_archive_duration: options.defaultAutoArchiveDuration,
        default_reaction_emoji: options.defaultReactionEmoji,
        default_sort_order: options.defaultSortOrder,
        default_thread_rate_limit_per_user:
          options.defaultThreadRateLimitPerUser,
        topic: options.topic,
        bitrate: options.bitrate,
        available_tags: options.availableTags,
        auto_archive_duration: options.autoArchiveDuration,
        video_quality_mode: options.videoQualityMode,
        rtc_region: options.rtcRegion,
        user_limit: options.userLimit,
        position: options.position,
      },
      reason,
    );

    return this._update(data);
  }

  toString() {
    return channelMention(this.id);
  }

  toJSON() {
    return Base.toJSON(this as Channel, [
      "type",
      "name",
      "flags",
      "rawData",
      "id",
      "createdAt",
    ]);
  }

  _update(
    data: APIChannel,
  ):
    | GuildChannel
    | GuildTextChannel
    | DMChannel
    | CategoryChannel
    | ForumChannel
    | Channel
    | ThreadChannel
    | StageChannel
    | VoiceChannel {
    if ("name" in data) this.name = data.name;
    if ("flags" in data)
      this.flags = (data.flags && new ChannelFlags(data.flags)) ?? null;

    return this;
  }

  isDM(): this is DMChannel {
    return this instanceof DMChannel;
  }

  isText(): this is TextBasedChannel {
    return TextBasedChannel.isBased(this);
  }

  isGuildText(): this is GuildTextChannel {
    return this instanceof GuildTextChannel;
  }

  isGuildChannel(): this is GuildChannel {
    return (
      this instanceof GuildChannel ||
      this.isGuildText() ||
      this.isVoice() ||
      this.isThread() ||
      this.isStage()
    );
  }

  isThread(): this is ThreadChannel {
    return this instanceof ThreadChannel;
  }

  isStage(): this is StageChannel {
    return this instanceof StageChannel;
  }

  isVoice(): this is VoiceChannel {
    return this instanceof VoiceChannel;
  }

  get forged() {
    return Boolean(this.id && !this.flags && !this.name);
  }

  /**
   * Update information of this channel
   *
   * Util if this is forged
   * @returns
   */
  async fetchInformation() {
    const data = await this._client.rest.getChannel(this.id);
    return this._update(data);
  }

  static from(data: DataWithClient<APIChannel>, guild?: Guild) {
    switch (data.type) {
      case ChannelType.GuildText: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!guild) return new Channel(data);
        return new GuildTextChannel(data, guild);
      }
      case ChannelType.DM: {
        return new DMChannel(data);
      }
      case ChannelType.GuildCategory: {
        if (!guild) return new Channel(data);
        return new CategoryChannel(data, guild);
      }
      case ChannelType.GuildForum: {
        if (!guild) return new Channel(data);
        return new ForumChannel(data, guild);
      }
      case ChannelType.GuildVoice: {
        if (!guild) return new Channel(data);
        return new VoiceChannel(data, guild);
      }
      case ChannelType.GuildStageVoice: {
        if (!guild) return new Channel(data);
        return new StageChannel(data, guild);
      }
      case ChannelType.PrivateThread:
      case ChannelType.PublicThread: {
        if (!guild) return new Channel(data);
        return new ThreadChannel(data, guild);
      }
      default: {
        return new Channel(data);
      }
    }
  }
}

export class TextBasedChannel extends Channel {
  /**
   * The id of the last message sent in this channel (may not point to an existing or valid message)
   */
  lastMessageId?: string | null;
  /**
   * When the last pinned message was pinned.
   */
  lastPinTimestamp?: number | null;
  /**
   * Channel messages
   */
  messages: MessageDataManager;

  constructor(data: DataWithClient<APITextBasedChannel<ChannelType>>) {
    super(data);

    this.messages = new MessageDataManager(
      this._client.options.cache?.messageCacheLimitPerChannel || Infinity,
      this._client.cache,
      this,
    );

    this.lastMessageId = data.last_message_id;
    this.lastPinTimestamp = data.last_pin_timestamp
      ? Date.parse(data.last_pin_timestamp)
      : null;
  }

  async createMessage(content: MessagePostData | string) {
    const message = await this._client.rest.createMessage(
      this.id,
      transformMessagePostData(content),
    );

    return Resolvable.resolveMessage(
      new Message({
        client: this._client,
        ...message,
      }),
      this._client,
    );
  }

  deleteMessage(id: string, reason?: string) {
    return this._client.rest.deleteMessage(this.id, id, reason);
  }

  async bulkDeleteMessages(messages: number | Message[] | string[]) {
    if (typeof messages === "number") {
      messages = await this.messages
        .fetch({
          limit: messages,
        })
        .then((messageArr) => messageArr.map((message) => message.id));
    }

    // Resolving message array
    messages = (messages as [Message | string]).map((message) =>
      typeof message === "string" ? message : message.id,
    );

    return this._client.rest.bulkDeleteMessages(this.id, messages);
  }

  sendTyping() {
    return this._client.rest.triggerTyping(this.id);
  }

  toJSON() {
    return Base.toJSON(this as TextBasedChannel, [
      "createdAt",
      "flags",
      "id",
      "messages",
      "lastMessageId",
      "lastPinTimestamp",
      "name",
      "type",
      "rawData",
    ]);
  }

  static isBased(channel: Channel): channel is TextBasedChannel {
    return (
      channel instanceof TextBasedChannel ||
      channel instanceof GuildTextChannel ||
      channel instanceof StageChannel ||
      channel instanceof VoiceChannel ||
      channel instanceof DMChannel ||
      channel instanceof ThreadChannel
    );
  }
}

export class GuildChannel extends Channel {
  guild: Guild;
  /**
   * The id of the guild (may be missing for some channel objects received over gateway guild dispatches)
   */
  guildId: string;
  /**
   * ID of the parent category for a channel (each parent category can contain up to 50 channels)
   * OR
   * ID of the parent channel for thread
   */
  parentId: string;
  /**
   * Explicit permission overwrites for members and roles
   */
  permissionOverwrites: DataCache<PermissionOverwrite>;
  /**
   * Sorting position of the channel
   */
  position: number;
  /**
   * Whether the channel is nsfw
   */
  nsfw: boolean;
  /**
   * The threads in this channel
   */
  threads: DataCache<ThreadChannel>;
  constructor(data: DataWithClient<APIGuildChannelResolvable>, guild: Guild) {
    super(data);

    this.guild = guild;
    this.guildId = data.guild_id!;
    this.permissionOverwrites = new DataCache();
    this.threads = new DataCache<ThreadChannel>(
      this._client.cache._cacheLimit("threads"),
    );

    this._update(data);

    if (data.permission_overwrites) {
      for (const perm of data.permission_overwrites) {
        const perms = new PermissionOverwrite(
          {
            ...perm,
            client: this._client,
          },
          this,
        );
        this.permissionOverwrites._add(perms);
      }
    }
  }

  /**
   *
   * @param overwriteId User or Role id
   * @param options Options to edit permissions
   */
  editPermissions(overwriteId: string, options: APIOverwrite, reason?: string) {
    return this._client.rest.editChannelPermissions(
      this.id,
      overwriteId,
      options,
      reason,
    );
  }

  _update(data: APIGuildChannelResolvable) {
    if ("position" in data) this.position = data.position;
    if ("nsfw" in data) this.nsfw = Boolean(data.nsfw);
    if ("parent_id" in data) this.parentId = data.parent_id!;

    super._update(data as APIChannel);
    return this;
  }

  toJSON() {
    return Base.toJSON(this as GuildChannel, [
      "createdAt",
      "flags",
      "guild",
      "guildId",
      "id",
      "name",
      "nsfw",
      "parentId",
      "permissionOverwrites",
      "position",
      "rawData",
      "threads",
      "type",
    ]);
  }
}

export class GuildTextChannel extends Mixin(GuildChannel, TextBasedChannel) {
  declare type: GuildTextChannelType;
  /**
   * The channel topic (0-4096 characters for forum channels, 0-1024 characters for all others)
   */
  topic?: string;
  /**
   * Amount of seconds a user has to wait before sending another message (0-21600)
   */
  rateLimitPerUser?: number;
  constructor(data: DataWithClient<APITextChannel>, guild: Guild) {
    super(data, guild);

    this._update(data);
    this.messages = new MessageDataManager(
      this._client.options.cache?.messageCacheLimitPerChannel || Infinity,
      this._client.cache,
      this as TextBasedChannel,
    );
  }

  // Override TextBasedChannel.createMessage for guild
  async createMessage(content: MessagePostData) {
    const message = await this._client.rest.createMessage(
      this.id,
      transformMessagePostData(content),
    );

    return Resolvable.resolveMessage(
      new Message(
        {
          client: this._client,
          ...message,
        },
        this.guild,
      ),
      this._client,
    );
  }

  async createWebhook(data: RESTPostAPIChannelWebhookJSONBody) {
    const rawWebhook = await this._client.rest.createWebhook(this.id, data);
    const webhook = new Webhook({ ...rawWebhook, client: this._client });

    return webhook;
  }

  async fetchWebhook(webhookId: string) {
    const data = await this._client.rest.getWebhook(webhookId);

    return new Webhook({ ...data, client: this._client });
  }

  async fetchWebhooks() {
    const data = await this._client.rest.getChannelWebhooks(this.id);

    return data.map((d) => new Webhook({ ...d, client: this._client }));
  }

  _update(data: APITextChannel) {
    if ("topic" in data) this.topic = data.topic!;
    if ("rate_limit_per_user" in data)
      this.rateLimitPerUser = data.rate_limit_per_user;

    super._update(data);
    return this;
  }

  toJSON() {
    return Base.toJSON(this as GuildTextChannel, [
      "createdAt",
      "flags",
      "guild",
      "guildId",
      "id",
      "lastMessageId",
      "lastPinTimestamp",
      "messages",
      "name",
      "nsfw",
      "parentId",
      "permissionOverwrites",
      "position",
      "rateLimitPerUser",
      "rawData",
      "threads",
      "topic",
      "type",
    ]);
  }
}

export class ThreadChannel extends TextBasedChannel {
  /**
   * The client users member for the thread
   */
  member?: ThreadMember | null;
  /**
   * Number of messages (not including the initial message or deleted messages) in a thread
   *
   * If the thread was created before July 1, 2022, it stops counting at 50 messages
   */
  messageCount: number;
  /**
   * The approximate member count of the thread, does not count above 50 even if there are more members
   */
  memberCount?: number;
  /**
   * Id of the thread creato
   */
  ownerId?: string;
  /**
   * Number of messages ever sent in a thread
   */
  totalMessageSent?: number;
  /**
   * The Ids of the set of tags that have been applied to a thread in a forum channel
   */
  appliedTags: string[];

  /**
   * The channel associated with this thread
   */
  channel: GuildTextChannel | null;
  /**
   * The id of the guild
   */
  guildId: string;
  /**
   * The thread guild
   */
  guild: Guild;
  /**
   * Whether the thread is archived
   */
  archived: boolean;
  /**
   * Timestamp when the thread's archive status was last changed, used for calculating recent activity
   */
  archiveTimestamp: number;
  /**
   * Duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080
   */
  autoArchiveDuration: ThreadAutoArchiveDuration;
  /**
   * Timestamp when the thread was created; only populated for threads created after 2022-01-09
   */
  createTimestamp: number | null;
  /**
   * Whether non-moderators can add other non-moderators to the thread; only available on private threads
   */
  invitable: boolean;
  /**
   * Whether the thread is locked
   */
  locked: boolean;
  /**
   * Members in this thread
   */
  members: DataCache<ThreadMember>;
  constructor(data: DataWithClient<APIThreadChannel>, guild: Guild) {
    super(data);

    this.guild = guild;
    this.ownerId = data.owner_id;
    this.guildId = data.guild_id || guild.id;
    this.channel = data.parent_id
      ? (guild.channels.cache.get(data.parent_id) as GuildTextChannel)
      : null;
    this.member = data.member
      ? new ThreadMember({ ...data.member, client: this._client }, this)
      : null;

    this.members = new DataCache();

    this._update(data);
  }

  addMember(userId: string) {
    return this._client.rest.addThreadMember(this.id, userId);
  }

  removeMember(userId: string) {
    return this._client.rest.removeThreadMember(this.id, userId);
  }

  async getMember(userId: string) {
    const member = await this._client.rest.getThreadMember(this.id, userId);

    return new ThreadMember({ ...member, client: this._client }, this);
  }

  /**
   * Removes the current user from a thread
   */
  leave() {
    return this._client.rest.leaveThread(this.id);
  }

  _update(data: APIThreadChannel) {
    if ("applied_tags" in data) this.appliedTags = data.applied_tags;
    if ("total_message_sent" in data)
      this.totalMessageSent = data.total_message_sent;
    if ("message_count" in data) this.messageCount = data.message_count ?? 0;
    if ("member_count" in data) this.memberCount = data.member_count;

    // MetaData
    if ("thread_metadata" in data && data.thread_metadata) {
      const metadata = data.thread_metadata;
      if ("archived" in metadata) this.archived = metadata.archived;
      if ("archive_timestamp" in metadata)
        this.archiveTimestamp = Date.parse(metadata.archive_timestamp);
      if ("auto_archive_duration" in metadata)
        this.autoArchiveDuration = metadata.auto_archive_duration;
      if ("create_timestamp" in metadata)
        this.createTimestamp = metadata.create_timestamp
          ? Date.parse(metadata.create_timestamp)
          : null;
      if ("invitable" in metadata) this.invitable = Boolean(metadata.invitable);
      if ("locked" in metadata) this.locked = Boolean(metadata.locked);
    }

    super._update(data);
    return this;
  }

  toJSON() {
    return Base.toJSON(this as ThreadChannel, [
      "appliedTags",
      "archiveTimestamp",
      "archived",
      "autoArchiveDuration",
      "channel",
      "createTimestamp",
      "createdAt",
      "flags",
      "guild",
      "guildId",
      "id",
      "invitable",
      "autoArchiveDuration",
      "leave",
      "locked",
      "member",
      "memberCount",
      "members",
      "messages",
      "name",
      "ownerId",
      "rawData",
      "totalMessageSent",
      "type",
    ]);
  }
}

export class DMChannel extends TextBasedChannel {
  /**
   * The user of the dm
   */
  user: APIUser | User;
  /**
   * The user id of the dm
   */
  userId: string;
  constructor(data: DataWithClient<APIDMChannel>) {
    super({ ...data, client: data.client });

    this.user = this._client.cache.users.add(data.recipients?.[0]!)!;
    this.userId = this.user.id;
  }

  toJSON() {
    return Base.toJSON(this as DMChannel, [
      "createdAt",
      "flags",
      "id",
      "messages",
      "lastMessageId",
      "lastPinTimestamp",
      "name",
      "type",
      "rawData",
      "user",
      "userId",
    ]);
  }
}

export class CategoryChannel extends GuildChannel {
  /**
   * The channels present in this category
   */
  channels: GuildChannelDataManager;
  constructor(data: DataWithClient<APIGuildCategoryChannel>, guild: Guild) {
    super(data, guild);

    this.channels = new GuildChannelDataManager(
      this._client.cache._cacheLimit("channels"),
      this._client.cache,
      this.guild,
    );

    for (const [, channel] of this.guild.channels.cache.filter((ch: any) => {
      const parentId = ch.parentId || ch.parent_id;

      return parentId === this.id;
    })) {
      this.channels.add(channel);
    }
  }

  toJSON() {
    return Base.toJSON(this as CategoryChannel, [
      "createdAt",
      "flags",
      "guild",
      "guildId",
      "id",
      "name",
      "nsfw",
      "parentId",
      "permissionOverwrites",
      "position",
      "rawData",
      "threads",
      "type",
      "channels",
    ]);
  }
}

export class ForumChannel extends GuildChannel {
  /**
   * Default duration for newly created threads, in minutes, to automatically archive the thread after recent activity
   */
  defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  /**
   * The default layout type used to display posts in a forum channel. Defaults to 0, which indicates a layout view has not been set by a channel admin
   */
  defaultForumLayout: ForumLayoutType;
  /**
   * The emoji to show in the add reaction button on a thread in a forum channel
   */
  defaultReactionEmoji: KeysToCamelCase<APIGuildForumDefaultReactionEmoji>;
  /**
   * The default sort order type used to order posts in a forum channel
   */
  defaultSortOrder: SortOrderType | null;
  /**
   * The initial rate_limit_per_user to set on newly created threads. This field is copied to the thread at creation time and does not live update
   */
  defaultThreadRateLimitPerUser?: number;
  /**
   * The set of tags that can be used in a forum channel
   */
  availableTags: APIGuildForumTag[];
  constructor(data: DataWithClient<APIGuildForumChannel>, guild: Guild) {
    super(data, guild);

    this._update(data);

    this.threads = new DataCache<ThreadChannel>(
      this._client.cache._cacheLimit("threads"),
    );
  }

  _update(data: APIGuildForumChannel) {
    if ("available_tags" in data) this.availableTags = data.available_tags;
    if ("default_auto_archive_duration" in data)
      this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
    if ("default_forum_layout" in data)
      this.defaultForumLayout = data.default_forum_layout;
    if ("default_sort_order" in data)
      this.defaultSortOrder = data.default_sort_order;
    if ("default_thread_rate_limit_per_user" in data)
      this.defaultThreadRateLimitPerUser =
        data.default_thread_rate_limit_per_user;
    if ("default_reaction_emoji" in data && data.default_reaction_emoji) {
      this.defaultReactionEmoji = {
        emojiId: data.default_reaction_emoji!.emoji_id,
        emojiName: data.default_reaction_emoji!.emoji_name,
      };
    }

    super._update(data);
    return this;
  }

  toJSON() {
    return Base.toJSON(this as ForumChannel, [
      "createdAt",
      "flags",
      "guild",
      "guildId",
      "id",
      "name",
      "nsfw",
      "parentId",
      "permissionOverwrites",
      "position",
      "rawData",
      "threads",
      "type",
      "defaultAutoArchiveDuration",
      "defaultForumLayout",
      "defaultReactionEmoji",
      "defaultSortOrder",
      "defaultThreadRateLimitPerUser",
      "availableTags",
      "threads",
    ]);
  }
}

export class BaseVoiceChannel extends GuildChannel {
  /**
   * Voice region id for the voice or stage channel
   */
  rtcRegion: string;
  /**
   * The bitrate (in bits) of the voice channel
   */
  bitrate: number;
  /**
   * The user limit of the voice channel
   */
  userLimit: number;
  /**
   * Members in this voice channel
   */
  members: MemberDataManager;
  constructor(
    data: DataWithClient<
      APIVoiceChannelBase<ChannelType.GuildVoice | ChannelType.GuildStageVoice>
    >,
    guild: Guild,
  ) {
    super(data, guild);

    this.guild = guild;
    this.guildId = guild.id;

    this._update(data);
    this.members = new MemberDataManager(Infinity, this._client.cache, guild);
  }

  _update(
    data: APIVoiceChannelBase<
      ChannelType.GuildVoice | ChannelType.GuildStageVoice
    >,
  ) {
    if ("bitrate" in data && data.bitrate) this.bitrate = data.bitrate;
    if ("rtc_region" in data && data.rtc_region)
      this.rtcRegion = data.rtc_region;
    if ("user_limit" in data && data.user_limit)
      this.userLimit = data.user_limit;
    return this;
  }

  toJSON() {
    return Base.toJSON(this as BaseVoiceChannel, [
      "createdAt",
      "flags",
      "guild",
      "guildId",
      "id",
      "name",
      "nsfw",
      "parentId",
      "permissionOverwrites",
      "position",
      "rawData",
      "threads",
      "type",
      "bitrate",
      "userLimit",
      "rtcRegion",
      "members",
    ]);
  }
}

export class VoiceChannel extends Mixin(BaseVoiceChannel, TextBasedChannel) {
  /**
   * The camera video quality mode of the voice channel
   */
  videoQualityMode: VideoQualityMode | null;

  constructor(data: DataWithClient<APIGuildVoiceChannel>, guild: Guild) {
    super(data, guild);

    this.videoQualityMode = data.video_quality_mode ?? null;
    this.messages = new MessageDataManager(
      this._client.options.cache?.messageCacheLimitPerChannel || Infinity,
      this._client.cache,
      this as TextBasedChannel,
    );
  }

  // Override TextBasedChannel.createMessage for guild
  async createMessage(content: MessagePostData) {
    const message = await this._client.rest.createMessage(
      this.id,
      transformMessagePostData(content),
    );

    return Resolvable.resolveMessage(
      new Message(
        {
          client: this._client,
          ...message,
        },
        this.guild,
      ),
      this._client,
    );
  }

  toJSON() {
    return Base.toJSON(this as VoiceChannel, [
      "createdAt",
      "flags",
      "guild",
      "guildId",
      "id",
      "name",
      "nsfw",
      "parentId",
      "permissionOverwrites",
      "position",
      "rawData",
      "threads",
      "type",
      "bitrate",
      "userLimit",
      "rtcRegion",
      "members",
      "messages",
      "videoQualityMode",
    ]);
  }
}

export class StageChannel extends Mixin(BaseVoiceChannel, TextBasedChannel) {
  constructor(data: DataWithClient<APIGuildStageVoiceChannel>, guild: Guild) {
    super(data, guild);
  }

  get stageInstance() {
    for (const instance of this.guild.stageInstances.values()) {
      if (instance.channel_id === this.id) return instance;
    }

    return null;
  }

  async createStageInstance(
    options: KeysToCamelCase<RESTPostAPIStageInstanceJSONBody>,
  ) {
    const instance = await this._client.rest.createStageInstance({
      channel_id: options.channelId,
      privacy_level: options.privacyLevel,
      send_start_notification: options.sendStartNotification,
      topic: options.topic,
    });

    this.guild.stageInstances.set(instance.id, instance);
    return instance;
  }
}

export class WelcomeChannel extends Base {
  /**
   * The channel id that is suggested
   */
  channelId: string;
  /**
   * The description shown for the channel
   */
  description: string;
  /**
   * The emoji id of the emoji that is shown on the left of the channel
   */
  emojiId: string | null;
  /**
   * The emoji name of the emoji that is shown on the left of the channel
   */
  emojiName: string | null;
  constructor(data: DataWithClient<APIGuildWelcomeScreenChannel>) {
    super(data, data.client, data.channel_id);

    this.channelId = data.channel_id;
    this.description = data.description;
    this.emojiId = data.emoji_id;
    this.emojiName = data.emoji_name;
  }

  get channel() {
    return this._client.channels.cache.get(this.channelId);
  }

  get emoji() {
    return (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this._client.cache.emojis.cache.get(this.emojiId!) ??
      new Emoji({
        id: this.emojiId,
        name: this.emojiName,
      })
    );
  }

  toJSON() {
    return Base.toJSON(this as WelcomeChannel, [
      "channel",
      "channelId",
      "emoji",
      "emojiId",
      "description",
      "emojiName",
    ]);
  }
}
