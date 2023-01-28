import { BitField } from "./BitField";
import {
  APIChannel,
  APIChannelBase,
  APIDMChannel,
  APIGuildCategoryChannel,
  APIGuildChannel,
  APIGuildForumChannel,
  APIGuildForumDefaultReactionEmoji,
  APIGuildForumTag,
  APIGuildStageVoiceChannel,
  APIGuildTextChannel,
  APIGuildVoiceChannel,
  APIGuildWelcomeScreenChannel,
  APIOverwrite,
  APITextBasedChannel,
  APIThreadChannel,
  APIUser,
  APIVoiceChannelBase,
  ChannelFlags as CFlags,
  ChannelType,
  ForumLayoutType,
  GuildTextChannelType,
  RESTPatchAPIChannelJSONBody,
  RESTPostAPIStageInstanceJSONBody,
  SortOrderType,
  ThreadAutoArchiveDuration,
  VideoQualityMode,
} from "discord-api-types/v10";
import { Base } from "./Base";
import {
  DataWithClient,
  KeysToCamelCase,
  MessagePostData,
} from "@typings/index";
import { Message } from "./Message";
import { ChannelMessageCache } from "@cache/MessageCache";
import { Guild } from "./Guild";
import { Cache } from "@cache/Cache";
import { PermissionOverwrite } from "./Permission";
import { Mixin } from "ts-mixer";
import { ThreadMember } from "./Member";
import { User } from "./User";
import { GuildChannelCache } from "@cache/ChannelCache";
import { MemberCache } from "../cache/MemberCache";
import { Emoji } from "./Emoji";
import { channelMention } from "@utils/Constants";
import { Resolvable } from "@utils/Resolvable";

export class ChannelFlags extends BitField<CFlags, typeof CFlags> {
  constructor(flags: CFlags) {
    super(flags, CFlags);
  }

  static Flags = CFlags;
}

export class Channel extends Base {
  /**
   * the type of the channel
   *
   * @See https://discord.com/developers/docs/resources/channel#channel-object-channel-types
   */
  type: ChannelType;
  /**
   * the name of the channel (2-100 characters)
   */
  name: string | null;
  /**
   * the flags of the channel
   */
  flags: ChannelFlags | null;

  constructor(data: DataWithClient<APIChannelBase<ChannelType>>) {
    super(data, data.client);

    this.type = data.type;
    this.name = typeof data.name === "string" ? data.name : null;
    this.flags = data.flags ? new ChannelFlags(data.flags) : null;
  }

  edit(options: KeysToCamelCase<RESTPatchAPIChannelJSONBody>, reason?: string) {
    return this._client.rest.modifyChannel(
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
      reason
    );
  }

  toString() {
    return channelMention(this.id);
  }

  static from(data: DataWithClient<APIChannel>, guild?: Guild) {
    switch (data.type) {
      case ChannelType.GuildText: {
        return new GuildTextChannel(data, guild);
      }
      case ChannelType.DM: {
        return new DMChannel(data);
      }
      case ChannelType.GuildCategory: {
        return new CategoryChannel(data, guild);
      }
      case ChannelType.GuildForum: {
        return new ForumChannel(data, guild);
      }
      case ChannelType.GuildVoice: {
        return new VoiceChannel(data, guild);
      }
      case ChannelType.GuildStageVoice: {
        return new StageChannel(data, guild);
      }
      case ChannelType.PrivateThread:
      case ChannelType.PublicThread: {
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
  lastMessageId?: string;
  /**
   * When the last pinned message was pinned.
   */
  lastPinTimestamp?: string;
  /**
   * Channel messages
   */
  messages: ChannelMessageCache;

  constructor(data: DataWithClient<APITextBasedChannel<ChannelType>>) {
    super(data);

    this.messages = new ChannelMessageCache(
      this._client.options.cache?.messageCacheLimitPerChannel,
      this._client.cache,
      this
    );

    this.lastMessageId = data.last_message_id;
    this.lastPinTimestamp = data.last_pin_timestamp;
  }

  async createMessage(content: MessagePostData) {
    const message = await this._client.rest.createMessage(this.id, content);

    return Resolvable.resolveMessage(
      new Message({
        client: this._client,
        ...message,
      }),
      this._client
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
      typeof message === "string" ? message : message.id
    );

    return this._client.rest.bulkDeleteMessages(this.id, messages);
  }

  sendTyping() {
    return this._client.rest.triggerTyping(this.id);
  }
}

export class GuildChannel extends Channel {
  guild: Guild;
  /**
   * the id of the guild (may be missing for some channel objects received over gateway guild dispatches)
   */
  guildId: string;
  /**
   * ID of the parent category for a channel (each parent category can contain up to 50 channels)
   * OR
   * ID of the parent channel for thread
   */
  parentId: string;
  /**
   * explicit permission overwrites for members and roles
   */
  permissionOverwrites: Cache<PermissionOverwrite>;
  /**
   * sorting position of the channel
   */
  position: number;
  /**
   * whether the channel is nsfw
   */
  nsfw: boolean;
  /**
   * The threads in this channel
   */
  threads: Cache<ThreadChannel>;
  constructor(
    data: DataWithClient<APIGuildChannel<ChannelType>>,
    guild: Guild
  ) {
    super(data);

    this.guild = guild;
    this.guildId = data.guild_id;
    this.parentId = data.parent_id;
    this.permissionOverwrites = new Cache();
    this.position = data.position;
    this.nsfw = data.nsfw;
    this.threads = new Cache(this._client.cache._cacheLimit("threads"));

    for (const perm of data.permission_overwrites) {
      this.permissionOverwrites._add(
        new PermissionOverwrite(
          {
            ...perm,
            client: this._client,
          },
          this
        )
      );
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
      reason
    );
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
  constructor(
    data: DataWithClient<APIGuildTextChannel<GuildTextChannelType>>,
    guild: Guild
  ) {
    super(data, guild);

    this.topic = data.topic;
    this.rateLimitPerUser = data.rate_limit_per_user;
    this.messages = new ChannelMessageCache(
      this._client.options.cache?.messageCacheLimitPerChannel,
      this._client.cache,
      this
    );
  }

  async createMessage(content: MessagePostData) {
    const message = await this._client.rest.createMessage(this.id, content);

    return Resolvable.resolveMessage(
      new Message({
        client: this._client,
        ...message,
      }, this.guild),
      this._client
    );
  }
}

export class ThreadChannel extends TextBasedChannel {
  /**
   * The client users member for the thread
   */
  member?: ThreadMember;
  /**
   * Number of messages (not including the initial message or deleted messages) in a thread
   *
   * If the thread was created before July 1, 2022, it stops counting at 50 messages
   */
  messageCount?: number;
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
  channel: GuildTextChannel;
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
  archiveTimestamp: Date;
  /**
   * Duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080
   */
  autoArchiveDuration: ThreadAutoArchiveDuration;
  /**
   * Timestamp when the thread was created; only populated for threads created after 2022-01-09
   */
  createTimestamp: Date;
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
  members: Cache<ThreadMember>;
  constructor(data: DataWithClient<APIThreadChannel>, guild: Guild) {
    super(data);

    this.guild = guild;
    this.ownerId = data.owner_id;
    this.appliedTags = data.applied_tags;
    this.totalMessageSent = data.total_message_sent;
    this.memberCount = data.member_count;
    this.guildId = data.guild_id || guild.id;
    this.flags = new ChannelFlags(data.flags);
    this.messageCount = data.message_count;
    this.channel = data.parent_id
      ? (guild.channels.get(data.parent_id) as GuildTextChannel)
      : null;
    this.member = data.member
      ? new ThreadMember({ ...data.member, client: this._client }, this)
      : null;

    this.members = new Cache();

    // MetaData
    const metadata = data.thread_metadata;
    this.archived = metadata.archived;
    this.archiveTimestamp = new Date(metadata.archive_timestamp);
    this.autoArchiveDuration = metadata.auto_archive_duration;
    this.createTimestamp = metadata.create_timestamp
      ? new Date(data.thread_metadata.create_timestamp)
      : null;
    this.invitable = Boolean(metadata.invitable);
    this.locked = Boolean(metadata.locked);
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

    this.user = this._client.cache.users.add(data.recipients[0]);
    this.userId = this.user.id;
  }
}

export class CategoryChannel extends GuildChannel {
  /**
   * The channels present in this category
   */
  channels: GuildChannelCache;
  constructor(data: DataWithClient<APIGuildCategoryChannel>, guild: Guild) {
    super(data, guild);

    this.channels = this.guild.channels.filter((ch: any) => {
      const parentId = ch.parentId || ch.parent_id;

      return parentId === this.id;
    }) as GuildChannelCache;
  }
}

export class ForumChannel extends GuildChannel {
  /**
   * Default duration for newly created threads, in minutes, to automatically archive the thread after recent activity
   */
  defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
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
  defaultSortOrder: SortOrderType;
  /**
   * The initial rate_limit_per_user to set on newly created threads. This field is copied to the thread at creation time and does not live update
   */
  defaultThreadRateLimitPerUser: number;
  /**
   * The set of tags that can be used in a forum channel
   */
  availableTags: APIGuildForumTag[];
  constructor(data: DataWithClient<APIGuildForumChannel>, guild: Guild) {
    super(data, guild);

    this.availableTags = data.available_tags;
    this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
    this.defaultForumLayout = data.default_forum_layout;
    this.defaultReactionEmoji = {
      emojiId: data.default_reaction_emoji.emoji_id,
      emojiName: data.default_reaction_emoji.emoji_name,
    };
    this.defaultSortOrder = data.default_sort_order;
    this.defaultThreadRateLimitPerUser =
      data.default_thread_rate_limit_per_user;
    this.threads = new Cache(this._client.cache._cacheLimit("threads"));
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
  members: MemberCache;
  constructor(
    data: DataWithClient<APIVoiceChannelBase<ChannelType>>,
    guild: Guild
  ) {
    super(data, guild);

    this.bitrate = data.bitrate;
    this.rtcRegion = data.rtc_region;
    this.userLimit = data.user_limit;
    this.members = new MemberCache(Infinity, this._client.cache, guild);
  }
}

export class VoiceChannel extends Mixin(BaseVoiceChannel, TextBasedChannel) {
  /**
   * The camera video quality mode of the voice channel
   */
  videoQualityMode: VideoQualityMode;

  constructor(data: DataWithClient<APIGuildVoiceChannel>, guild: Guild) {
    super(data, guild);

    this.videoQualityMode = data.video_quality_mode;
    this.messages = new ChannelMessageCache(
      this._client.options.cache?.messageCacheLimitPerChannel,
      this._client.cache,
      this
    );
  }
}

export class StageChannel extends BaseVoiceChannel {
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
    options: KeysToCamelCase<RESTPostAPIStageInstanceJSONBody>
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
  emojiId: string;
  /**
   * The emoji name of the emoji that is shown on the left of the channel
   */
  emojiName: string;
  constructor(data: DataWithClient<APIGuildWelcomeScreenChannel>) {
    super(data, data.client, data.channel_id);

    this.channelId = data.channel_id;
    this.description = data.description;
    this.emojiId = data.emoji_id;
    this.emojiName = data.emoji_name;
  }

  get channel() {
    return this._client.cache.channels.get(this.channelId);
  }

  get emoji() {
    return (
      this._client.cache.emojis.get(this.emojiId) ??
      new Emoji({
        id: this.emojiId,
        name: this.emojiName,
      })
    );
  }
}
