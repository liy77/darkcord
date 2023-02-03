import { GuildChannelCache } from "@cache/ChannelCache";
import { GuildEmojiCache } from "@cache/EmojiCache";
import { MemberCache } from "@cache/MemberCache";
import { GuildRoleCache } from "@cache/RoleCache";
import { GuildStickerCache } from "@cache/StickerCache";
import {
  APIGuildWithShard,
  CreateChannelOptions,
  DataWithClient,
  KeysToCamelCase,
} from "@typings/index";
import { Resolvable } from "@utils/Resolvable";
import {
  APIAutoModerationRuleTriggerMetadata,
  APIGuild,
  APIGuildScheduledEvent,
  APIGuildScheduledEventEntityMetadata,
  APIGuildWelcomeScreen,
  APIInviteGuild,
  APIPartialGuild,
  APIStageInstance,
  APIUser,
  CDNRoutes,
  GatewayPresenceUpdate,
  GuildBannerFormat,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildFeature,
  GuildHubType,
  GuildIconFormat,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildPremiumTier,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  GuildScheduledEventStatus,
  GuildSystemChannelFlags,
  GuildVerificationLevel,
  ImageFormat,
  RESTGetAPIGuildBansQuery,
  RESTPatchAPIApplicationCommandJSONBody,
  RESTPatchAPIAutoModerationRuleJSONBody,
  RESTPatchAPICurrentGuildMemberJSONBody,
  RESTPatchAPIGuildJSONBody,
  RESTPatchAPIGuildMemberJSONBody,
  RESTPatchAPIGuildRoleJSONBody,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIAutoModerationRuleJSONBody,
  RESTPostAPIGuildPruneJSONBody,
  RESTPostAPIGuildRoleJSONBody,
  RESTPostAPIGuildScheduledEventJSONBody,
  RESTPutAPIApplicationCommandsJSONBody,
  RESTPutAPIGuildBanJSONBody,
  RouteBases,
} from "discord-api-types/v10";

import { Base } from "./Base";
import { Channel, WelcomeChannel } from "./Channel";
import { Invite } from "./Invite";
import { Member } from "./Member";
import { Permissions } from "./Permission";
import { User } from "./User";
import { VoiceState } from "./VoiceState";

export class BaseGuild extends Base {
  /**
   * Banner hash
   */
  banner: string | null;
  /**
   * icon hash
   */
  icon: string | null;
  /**
   * Enabled guild features
   */
  features: GuildFeature[];
  /**
   * Splash hash
   */
  splash: string | null;
  /**
   * The description of a guild
   */
  description: string | null;
  /**
   * Verification level required for the guild
   */
  verificationLevel!: GuildVerificationLevel;
  /**
   * The vanity url code for the guild
   */
  vanityUrlCode: string | null;
  /**
   * Guild name (2-100 characters, excluding trailing and leading whitespace)
   */
  name: string;
  constructor(data: DataWithClient<APIPartialGuild>) {
    super(data, data.client);

    this._update(data);
  }

  iconURL(format?: GuildIconFormat) {
    return (
      this.icon &&
      RouteBases.cdn +
        CDNRoutes.guildIcon(
          this.id,
          this.icon,
          format ?? this.icon.startsWith("a_")
            ? ImageFormat.GIF
            : ImageFormat.PNG
        )
    );
  }

  bannerURL(format?: GuildBannerFormat) {
    return (
      this.banner &&
      RouteBases.cdn +
        CDNRoutes.guildBanner(
          this.id,
          this.banner,
          format ?? this.icon!.startsWith("a_")
            ? ImageFormat.GIF
            : ImageFormat.PNG
        )
    );
  }

  _update(data: APIPartialGuild) {
    if ("name" in data) this.name = data.name;
    if ("banner" in data) this.banner = data.banner ?? null;
    if ("icon" in data) this.icon = data.icon ?? null;
    if ("features" in data) this.features = data.features as GuildFeature[];
    if ("splash" in data) this.splash = data.splash ?? null;
    if ("description" in data) this.description = data.description ?? null;
    if ("verification_level" in data)
      this.verificationLevel =
        data.verification_level as GuildVerificationLevel;
    if ("vanity_url_code" in data)
      this.vanityUrlCode = data.vanity_url_code ?? null;
    return this;
  }
}

export class WelcomeScreen {
  /**
   * The guild for this welcome screen
   */
  guild: BaseGuild;
  /**
   * The welcome screen short message
   */
  description: string | null;
  /**
   * Suggested channels
   */
  welcomeChannels: Map<string, WelcomeChannel>;
  constructor(data: APIGuildWelcomeScreen, guild: BaseGuild) {
    this.guild = guild;
    this.description = data.description;
    this.welcomeChannels = new Map();

    for (const raw of data.welcome_channels) {
      const welcomeChannel = new WelcomeChannel({
        ...raw,
        client: guild._client,
      });

      this.welcomeChannels.set(welcomeChannel.id, welcomeChannel);
    }
  }
}

export class InviteGuild extends BaseGuild {
  /**
   * Guild NSFW level
   */
  nsfwLevel: GuildNSFWLevel;
  /**
   * The number of boosts this guild currently has
   */
  premiumSubscriptionCount: number | null;
  /**
   * The welcome screen of a Community guild, shown to new members
   */
  welcomeScreen: WelcomeScreen | null;
  constructor(
    data: DataWithClient<APIInviteGuild & Pick<APIGuild, "welcome_screen">>
  ) {
    super(data);

    this.nsfwLevel = data.nsfw_level;
    this.premiumSubscriptionCount = data.premium_subscription_count ?? null;
    this.welcomeScreen = data.welcome_screen
      ? new WelcomeScreen(data.welcome_screen, this)
      : null;
  }
}

export class Guild extends BaseGuild {
  /**
   * Cache of channels
   */
  channels: GuildChannelCache;
  /**
   * Icon hash, returned when in the template object
   */
  iconHash?: string | null | undefined;
  /**
   * Discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
   */
  discoverySplash: string | null;
  /**
   * True if the user is the owner of the guild
   */
  owner?: boolean | undefined;
  /**
   * Id of owner
   */
  ownerId: string;
  /**
   * Total permissions for the user in the guild (excludes overwrites)
   */
  permissions?: string | undefined;
  /**
   * Id of afk channel
   */
  afkChannelId: string | null;
  /**
   * Afk timeout in seconds, can be set to: 60, 300, 900, 1800, 3600
   */
  afkTimeout: 60 | 300 | 900 | 1800 | 3600;
  /**
   * True if the server widget is enabled
   */
  widgetEnabled?: boolean | undefined;
  /**
   * The channel id that the widget will generate an invite to, or null if set to no invite
   */
  widgetChannelId?: string | null | undefined;
  /**
   * Default message notifications level
   */
  defaultMessageNotifications: GuildDefaultMessageNotifications;
  /**
   * Explicit content filter level
   */
  explicitContentFilter: GuildExplicitContentFilter;
  /**
   * Roles in the guild
   */
  roles: GuildRoleCache;
  /**
   * Custom guild emojis
   */
  emojis: GuildEmojiCache;
  /**
   * Required MFA level for the guild
   */
  mfaLevel: GuildMFALevel;
  /**
   * Application id of the guild creator if it is bot-created
   */
  applicationId: string | null;
  /**
   * The id of the channel where guild notices such as welcome messages and boost events are posted
   */
  systemChannelId: string | null;
  /**
   * System channel flags
   */
  systemChannelFlags: GuildSystemChannelFlags;
  /**
   * The id of the channel where Community guilds can display rules and/or guidelines
   */
  rulesChannelId: string | null;
  /**
   * The maximum number of presences for the guild (null is always returned, apart from the largest of guilds)
   */
  maxPresences?: number | null | undefined;
  /**
   * The maximum number of members for the guild
   */
  maxMembers?: number | undefined;
  /**
   * Premium tier (Server Boost level)
   */
  premiumTier: GuildPremiumTier;
  /**
   * The preferred locale of a Community guild; used in server discovery and notices from Discord, and sent in interactions; defaults to "en-US"
   */
  preferredLocale: string;
  /**
   * The id of the channel where admins and moderators of Community guilds receive notices from Discord
   */
  publicUpdatesChannelId: string | null;
  /**
   * The maximum amount of users in a video channel
   */
  maxVideoChannelUsers?: number;
  /**
   * Approximate number of members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is true
   */
  approximateMemberCount?: number;
  /**
   * Approximate number of non-offline members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is true
   */
  approximatePresenceCount?: number;
  /**
   * The welcome screen of a Community guild, shown to new members, returned in an Invite's guild object
   */
  welcomeScreen?: APIGuildWelcomeScreen;
  /**
   * Custom guild stickers
   */
  stickers: GuildStickerCache;
  /**
   * Whether the guild has the boost progress bar enabled
   */
  premiumProgressBarEnabled: boolean;
  /**
   * The type of Student Hub the guild is
   */
  hubType: GuildHubType | null;
  declare partial: DataWithClient<APIGuild>;
  /**
   * Members of guild
   */
  members: MemberCache;
  /**
   * Guild NSFW level
   */
  nsfwLevel: GuildNSFWLevel;
  /**
   * The number of boosts this guild currently has
   */
  premiumSubscriptionCount: number | null;
  /**
   * Guild presences
   */
  presences: GatewayPresenceUpdate[];
  /**
   * Guild shard id (only in Gateway Client)
   */
  shardId: string | null;
  /**
   * Stage Instances in this guild
   */
  stageInstances: Map<string, APIStageInstance>;
  /**
   * Voice states in this guild
   */
  voiceStates: Map<string, VoiceState>;
  /**
   * This guild scheduled events
   */
  scheduledEvents: Map<string, ScheduledEvent>;
  /**
   * Guild invites
   */
  invites: Map<string, Invite>;
  constructor(data: DataWithClient<APIGuild | APIGuildWithShard>) {
    super(data);

    this.channels = new GuildChannelCache(
      this._client.cache._cacheLimit("channels"),
      this._client.cache,
      this
    );
    this.roles = new GuildRoleCache(
      this._client.cache._cacheLimit("roles"),
      this._client.cache,
      this
    );
    this.emojis = new GuildEmojiCache(
      this._client.cache._cacheLimit("emojis"),
      this._client.cache,
      this
    );
    this.stickers = new GuildStickerCache(
      this._client.cache._cacheLimit("stickers"),
      this._client.cache,
      this
    );
    this.members = new MemberCache(
      this._client.cache._cacheLimit("members"),
      this._client.cache,
      this
    );
    this.voiceStates = new Map();
    this.scheduledEvents = new Map();
    this.maxMembers = data.max_members;
    this.approximateMemberCount = data.approximate_member_count;
    this.approximatePresenceCount = data.approximate_presence_count;
    this.shardId = "shard_id" in data ? data.shard_id : null;

    this._update(data);

    if (Array.isArray(this.partial.roles)) {
      for (const role of this.partial.roles) {
        this.roles.add(role);
        this._client.cache.roles.add(role);
      }
    }

    if (Array.isArray(this.partial.emojis)) {
      for (const emoji of this.partial.emojis) {
        this.emojis.add(emoji);
        this._client.cache.emojis.add(emoji);
      }
    }

    if (Array.isArray(this.partial.stickers)) {
      for (const sticker of this.partial.stickers) {
        this.stickers.add(sticker);
      }
    }
  }

  /**
   * Returns a ban object for the given user
   * @param userId
   * @returns
   */
  getMemberBan(userId: string) {
    return this._client.rest.getGuildBan(this.id, userId);
  }

  getBanList(options?: RESTGetAPIGuildBansQuery) {
    return this._client.rest.getGuildBans(this.id, options);
  }

  /**
   * Create a guild ban, and optionally delete previous messages sent by the banned user.
   * @param userId
   * @param reason
   * @returns
   */
  createMemberBan(
    userId: string,
    options: KeysToCamelCase<RESTPutAPIGuildBanJSONBody> = {},
    reason?: string
  ) {
    if (
      options.deleteMessageDays &&
      !Number.isNaN(options.deleteMessageDays) &&
      !options.deleteMessageSeconds
    ) {
      // Converting days to seconds
      options.deleteMessageSeconds = options.deleteMessageDays * 86400;
    }

    const opts: RESTPutAPIGuildBanJSONBody = {
      delete_message_seconds: options.deleteMessageSeconds || 0,
    };

    return this._client.rest.createGuildBan(this.id, userId, opts, reason);
  }

  /**
   * Remove the ban for a user
   * @param userId
   * @param reason
   * @returns
   */
  removeMemberBan(userId: string, reason?: string) {
    return this._client.rest.removeGuildBan(this.id, userId, reason);
  }

  setRolePosition(roleId: string, newPosition: number, reason?: string) {
    if (Number.isNaN(newPosition)) {
      throw new TypeError("Invalid position");
    }

    return this._client.rest.modifyRolePosition(
      this.id,
      roleId,
      ~~newPosition,
      reason
    );
  }

  async editRole(
    roleId: string,
    options: KeysToCamelCase<RESTPatchAPIGuildRoleJSONBody>,
    reason?: string
  ) {
    const role = await this._client.rest.modifyGuildRole(
      this.id,
      roleId,
      options,
      reason
    );

    this._client.cache.roles.add(role);
    return this.roles.add(role);
  }

  async createRole(
    options: Omit<
      KeysToCamelCase<RESTPostAPIGuildRoleJSONBody>,
      "permissions"
    > & { permissions: Permissions | bigint },
    reason?: string
  ) {
    const opts: RESTPostAPIGuildRoleJSONBody = {};

    opts.color = options.color;
    opts.hoist = options.hoist;
    opts.icon = options.icon;
    opts.mentionable = options.mentionable;
    opts.name = options.name;
    opts.permissions =
      options.permissions instanceof Permissions
        ? options.permissions.allow.toString()
        : options.permissions.toString();
    options.unicodeEmoji;

    const role = await this._client.rest.createGuildRole(this.id, opts, reason);

    this._client.cache.roles.add(role);
    return this.roles.add(role);
  }

  deleteRole(id: string, reason?: string) {
    return this._client.rest.deleteGuildRole(this.id, id, reason);
  }

  pruneMembers(
    options: KeysToCamelCase<RESTPostAPIGuildPruneJSONBody>,
    reason?: string
  ) {
    return this._client.rest.beginGuildPrune(
      this.id,
      {
        days: options.days,
        include_roles: options.includeRoles,
        compute_prune_count: options.computePruneCount,
      },
      reason
    );
  }

  removeMember(userId: string, reason?: string) {
    return this._client.rest.removeGuildMember(this.id, userId, reason);
  }

  addMemberRole(userId: string, roleId: string, reason?: string) {
    return this._client.rest.addGuildMemberRole(
      this.id,
      userId,
      roleId,
      reason
    );
  }

  removeMemberRole(userId: string, roleId: string, reason?: string) {
    return this._client.rest.removeGuildMemberRole(
      this.id,
      userId,
      roleId,
      reason
    );
  }

  editMember(
    userId: "@me",
    options: RESTPatchAPICurrentGuildMemberJSONBody,
    reason?: string
  ): Promise<Member>;
  editMember(
    userId: string,
    options: KeysToCamelCase<RESTPatchAPIGuildMemberJSONBody>,
    reason?: string
  ): Promise<Member>;
  async editMember(
    userId: string | "@me",
    options: KeysToCamelCase<RESTPatchAPIGuildMemberJSONBody>,
    reason?: string
  ): Promise<Member> {
    const opts: RESTPatchAPIGuildMemberJSONBody = {};

    if (userId !== "@me") {
      opts.channel_id = options.channelId;
      opts.communication_disabled_until = options.communicationDisabledUntil;
      opts.deaf = options.deaf;
      opts.mute = options.mute;
      opts.roles = options.roles;
    }

    opts.nick = options.nick;

    const member = await this._client.rest.modifyGuildMember(
      this.id,
      userId,
      opts,
      reason
    );

    return this.members.add(new Member(member, this));
  }

  getInvites() {
    return this._client.rest.getGuildInvites(this.id);
  }

  getIntegrations() {
    return this._client.rest.getGuildIntegrations(this.id);
  }

  deleteIntegration(id: string) {
    return this._client.rest.deleteGuildIntegration(this.id, id);
  }

  createScheduledEvent(
    options: KeysToCamelCase<RESTPostAPIGuildScheduledEventJSONBody>,
    reason?: string
  ) {
    return this._client.rest.createGuildScheduledEvent(
      this.id,
      {
        channel_id: options.channelId,
        description: options.description,
        entity_metadata: options.entityMetadata,
        entity_type: options.entityType,
        image: options.image,
        name: options.name,
        scheduled_start_time: options.scheduledStartTime,
        scheduled_end_time: options.scheduledEndTime,
        privacy_level: options.privacyLevel,
      },
      reason
    );
  }

  createAutoModerationRule(
    options: Omit<
      KeysToCamelCase<RESTPostAPIAutoModerationRuleJSONBody>,
      "triggerMetadata"
    > & {
      triggerMetadata?: KeysToCamelCase<APIAutoModerationRuleTriggerMetadata>;
    },
    reason?: string
  ) {
    return this._client.rest.createGuildAutoModerationRule(
      this.id,
      {
        actions: options.actions,
        enabled: options.enabled,
        event_type: options.eventType,
        exempt_channels: options.exemptChannels,
        exempt_roles: options.exemptRoles,
        name: options.name,
        trigger_type: options.triggerType,
        trigger_metadata: options.triggerMetadata && {
          allow_list: options.triggerMetadata.allowList,
          keyword_filter: options.triggerMetadata.keywordFilter,
          mention_total_limit: options.triggerMetadata.mentionTotalLimit,
          presets: options.triggerMetadata.presets,
          regex_patterns: options.triggerMetadata.regexPatterns,
        },
      },
      reason
    );
  }

  deleteAutoModerationRule(autoModerationRuleId: string, reason?: string) {
    return this._client.rest.deleteGuildAutoModerationRule(
      this.id,
      autoModerationRuleId,
      reason
    );
  }

  editAutoModerationRule(
    autoModerationRuleId: string,
    options: Omit<
      KeysToCamelCase<RESTPatchAPIAutoModerationRuleJSONBody>,
      "triggerMetadata"
    > & {
      triggerMetadata?: KeysToCamelCase<APIAutoModerationRuleTriggerMetadata>;
    },
    reason?: string
  ) {
    return this._client.rest.modifyGuildModerationRule(
      this.id,
      autoModerationRuleId,
      {
        actions: options.actions,
        enabled: options.enabled,
        event_type: options.eventType,
        exempt_channels: options.exemptChannels,
        exempt_roles: options.exemptRoles,
        name: options.name,
        trigger_metadata: options.triggerMetadata && {
          allow_list: options.triggerMetadata.allowList,
          keyword_filter: options.triggerMetadata.keywordFilter,
          mention_total_limit: options.triggerMetadata.mentionTotalLimit,
          presets: options.triggerMetadata.presets,
          regex_patterns: options.triggerMetadata.regexPatterns,
        },
      }
    );
  }

  async createChannel(options: CreateChannelOptions, reason?: string) {
    const opts = {
      position: options.position,
      name: options.name,
      permission_overwrites: options.permissionOverwrites,
      nsfw: options.nsfw,
      parent_id: options.parentId,
      flags: options.flags,
      topic: options.topic,
      bitrate: options.bitrate,
      video_quality_mode: options.videoQualityMode,
      default_auto_archive_duration: options.defaultAutoArchiveDuration,
      default_forum_layout: options.defaultForumLayout,
      default_sort_order: options.defaultSortOrder,
      default_reaction_emoji: options.defaultReactionEmoji,
      rtc_region: options.rtcRegion,
      user_limit: options.userLimit,
      rate_limit_per_user: options.rateLimitPerUser,
    };

    const data = await this._client.rest.createGuildChannel(
      this.id,
      opts,
      reason
    );

    return Resolvable.resolveChannel(
      Channel.from({ ...data, client: this._client }, this),
      this._client,
      this
    );
  }

  deleteChannel(id: string, reason?: string) {
    return this._client.rest.deleteChannel(id, reason);
  }

  permissionsOf(userId: string | Member) {
    let member: Member | undefined | null;

    if (userId instanceof Member) {
      member = userId;
      userId = member.id;
    }

    if (userId === this.ownerId) return new Permissions(Permissions.All);

    const raw = this.roles.get(this.id)?.permissions;
    let perms = typeof raw === "string" ? BigInt(raw) : raw?.allow || 0n;

    if (perms & Permissions.Flags.Administrator)
      return new Permissions(Permissions.All);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!member) member = this.members.get(userId);

    for (const roleId of member!.roles) {
      const role = this.roles.get(roleId);

      const perm =
        typeof role!.permissions === "string"
          ? BigInt(role!.permissions)
          : role!.permissions.allow;

      if (perm & Permissions.Flags.Administrator) perms = Permissions.All;
      else perms |= perm;
    }

    return new Permissions(perms);
  }

  createApplicationCommand(options: RESTPostAPIApplicationCommandsJSONBody) {
    return this._client.application!.createGuildCommand(this.id, options);
  }

  editApplicationCommand(
    commandId: string,
    options: RESTPatchAPIApplicationCommandJSONBody
  ) {
    return this._client.application!.editGuildCommand(
      this.id,
      commandId,
      options
    );
  }

  deleteApplicationCommand(commandId: string) {
    return this._client.application!.deleteGuildCommand(this.id, commandId);
  }

  bulkOverwriteApplicationCommands(
    commands: RESTPutAPIApplicationCommandsJSONBody
  ) {
    return this._client.application!.bulkOverwriteGuildCommands(
      this.id,
      commands
    );
  }

  async edit(
    options: KeysToCamelCase<RESTPatchAPIGuildJSONBody>,
    reason?: string
  ) {
    const data = await this._client.rest.modifyGuild(this.id, options, reason);

    return this._update(data);
  }

  _update(data: APIGuild) {
    if ("nsfw_level" in data) this.nsfwLevel = data.nsfw_level;
    if ("premium_subscription_count" in data)
      this.premiumSubscriptionCount = data.premium_subscription_count ?? null;
    if ("icon_hash" in data) this.iconHash = data.icon_hash;
    if ("widget_channel_id" in data)
      this.widgetChannelId = data.widget_channel_id;
    if ("widget_enabled" in data) this.widgetEnabled = data.widget_enabled;
    if ("owner_id" in data) this.ownerId = data.owner_id;
    if ("owner" in data) this.owner = data.owner;
    if ("discovery_splash" in data)
      this.discoverySplash = data.discovery_splash;
    if ("afk_channel_id" in data) this.afkChannelId = data.afk_channel_id;
    if ("afk_timeout" in data) this.afkTimeout = data.afk_timeout;
    if ("public_updates_channel_id" in data)
      this.publicUpdatesChannelId = data.public_updates_channel_id;

    super._update(data);
    return this;
  }
}

export class ScheduledEvent extends Base {
  /**
   * The channel id in which the scheduled event will be hosted, or null if entity type is EXTERNAL The channel id in which the scheduled event will be hosted, or null if entity type is EXTERNAL The channel id in which the scheduled event will be hosted, or null if entity type is EXTERNAL
   */
  channelId: string | null;
  /**
   * The user that created the scheduled event
   */
  creator: User | APIUser | null;
  /**
   * The id of the user that created the scheduled event
   */
  creatorId?: string | null;
  /**
   * The description of the scheduled event
   */
  description?: string | null;
  /**
   * The id of the hosting entity associated with the scheduled event
   */
  entityId: string | null;
  /**
   * The type of hosting entity associated with the scheduled event
   */
  entityType: GuildScheduledEventEntityType;
  /**
   * The entity metadata for the scheduled event The entity metadata for the scheduled event The entity metadata for the scheduled event
   */
  entityMetadata: APIGuildScheduledEventEntityMetadata | null;
  /**
   * The privacy level of the scheduled event
   */
  privacyLevel: GuildScheduledEventPrivacyLevel;
  /**
   * The number of users subscribed to the scheduled event
   */
  userCount?: number | null;
  /**
   * The status of the scheduled event
   */
  status: GuildScheduledEventStatus;
  /**
   * The guild of scheduled event
   */
  guild: BaseGuild;
  constructor(data: APIGuildScheduledEvent, guild: BaseGuild) {
    super(data, guild._client);

    this.guild = guild;
    this.channelId = data.channel_id;
    this.creator = data.creator
      ? this._client.cache.users.add(data.creator)
      : null;
    this.creatorId = data.creator_id;
    this.description = data.description;
    this.entityId = data.entity_id;
    this.entityType = data.entity_type;
    this.entityMetadata = data.entity_metadata;
    this.privacyLevel = data.privacy_level;
    this.userCount = data.user_count;
    this.status = data.status;
  }
}
