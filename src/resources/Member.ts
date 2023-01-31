import {
  DataWithClient,
  DisplayUserAvatarOptions,
  KeysToCamelCase,
} from "@typings/index";
import {
  APIGuildMember,
  APIThreadMember,
  CDNRoutes,
  ImageFormat,
  RESTPatchAPIGuildMemberJSONBody,
  RESTPutAPIGuildBanJSONBody,
  RouteBases,
  ThreadMemberFlags,
} from "discord-api-types/v10";

import { Base } from "./Base";
import { BitField } from "./BitField";
import { ThreadChannel } from "./Channel";
import { Guild } from "./Guild";
import { Permissions } from "./Permission";
import { User } from "./User";

export class Member extends Base {
  /**
   * the member's guild avatar hash
   */
  avatar: string;
  /**
   * Timestamp of when the time out will be removed; until then, they cannot interact with the guild
   */
  communicationDisabledUntil: string;
  /**
   * When the user joined the guild
   */
  joinedAt: number;
  /**
   * The user this guild member represents
   */
  user: User | null;
  /**
   * Whether the user is deafened in voice channels
   */
  deaf: boolean;
  /**
   * When the user started boosting the guild
   */
  premiumSince: Date;
  /**
   * Whether the user has not yet passed the guild's Membership Screening requirements
   */
  pending: boolean;
  /**
   * Member roles
   */
  roles: string[];
  /**
   * Member permissions bitfield
   */
  permissions: Permissions;
  /**
   * Whether the user is muted in voice channels
   */
  mute: boolean;
  constructor(data: APIGuildMember, public guild: Guild) {
    super(data, guild._client, data.user.id);

    this.avatar = data.avatar;
    this.communicationDisabledUntil = data.communication_disabled_until;
    this.joinedAt = new Date(data.joined_at).getTime();
    this.user = null;

    if (data.user) {
      const rawUser = this._client.cache.users.add(data.user);

      this.user =
        rawUser instanceof User
          ? rawUser
          : new User({
              ...rawUser,
              client: guild._client,
            });
    }

    this.deaf = data.deaf;
    this.premiumSince = data.premium_since
      ? new Date(data.premium_since)
      : null;
    this.pending = Boolean(data.pending);
    this.roles = data.roles;
    this.mute = data.mute;
    this.permissions = this.guild.permissionsOf(this);
  }

  /**
   * The member's guild avatar url
   * @param options
   * @returns
   */
  avatarURL(options?: DisplayUserAvatarOptions) {
    if (!this.avatar) {
      return null;
    }

    return RouteBases.cdn +
      CDNRoutes.guildMemberAvatar(
        this.guild.id,
        this.id,
        this.avatar,
        options?.format ?? this.avatar.startsWith("a_")
          ? ImageFormat.GIF
          : ImageFormat.PNG
      ) +
      options?.size
      ? "?size=" + options?.size?.toString()
      : "";
  }

  displayAvatarURL(options?: DisplayUserAvatarOptions) {
    return (
      this.avatarURL(options) ?? this.user?.displayAvatarURL(options) ?? null
    );
  }

  addRole(roleId: string, reason?: string) {
    return this.guild.addMemberRole(this.id, roleId, reason);
  }

  removeRole(roleId: string, reason?: string) {
    return this.guild.removeMemberRole(this.id, roleId, reason);
  }

  ban(options?: KeysToCamelCase<RESTPutAPIGuildBanJSONBody>, reason?: string) {
    return this.guild.createMemberBan(this.id, options, reason);
  }

  edit(
    options: KeysToCamelCase<RESTPatchAPIGuildMemberJSONBody>,
    reason?: string
  ) {
    return this.guild.editMember(this.id, options, reason);
  }
}

export class ThreadMember extends Base {
  /**
   * Thread guild
   */
  guild: Guild;
  /**
   * An timestamp for when the member last joined
   */
  joinTimestamp: Date;
  /**
   * Member flags combined as a bitfield
   */
  flags: BitField<ThreadMemberFlags, typeof ThreadMemberFlags>;
  /**
   * The thread of member is in
   */
  thread: ThreadChannel;
  /**
   * The id of the thread
   */
  threadId: string;
  constructor(data: DataWithClient<APIThreadMember>, thread: ThreadChannel) {
    super(data, data.client, data.user_id);

    this.thread = thread;
    this.threadId = data.id || thread.id;
    this.guild = thread.guild;
    this.joinTimestamp = new Date(data.join_timestamp);
    this.flags = new BitField(data.flags, ThreadMemberFlags);
  }

  /**
   * The guild member associated with this thread member
   */
  get guildMember() {
    return this.guild.members.get(this.id);
  }

  /**
   * The user associated with this this thread member
   */
  get user() {
    return this._client.cache.users.get(this.id);
  }
}
