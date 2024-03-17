import {
  DataWithClient,
  DisplayUserAvatarOptions,
  KeysToCamelCase,
} from "@typings/index";
import {
  APIGuildMember,
  APIRole,
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
import { Role } from "./Role";
import { Cache } from "@cache/Cache";

export class UncachedClientMemberError extends Error {
  constructor() {
    super(
      "The client member is not cached. This is likely due to the member not being in the guild or the guild not being cached.",
    );
    this.name = "UncachedClientMemberError";
  }
}

export class MemberRoles {
  private _roles: string[];
  cache: Cache<Role>;
  constructor(public guild: Guild, roles: string[]) {
    Object.defineProperty(this, "_roles", {
      value: roles,
      enumerable: false,
    });

    this.cache = guild.roles.cache.filter((role) => roles.includes(role.id));
  }

  /**
   * Get the member role with the highest position
   * @returns
   */
  get highest() {
    return this.cache.reduce(
      ([, prev], [, role]) => {
        return prev && this.guild.roles.comparePositions(role.id, prev.id) > 0
          ? [role.id, role]
          : [prev.id, prev];
      },
      [this.guild.id, this.guild.roles.everyone!],
    )?.[1];
  }

  /**
   * Compare the position of a member role with another guild role
   * @param roleId The member role id
   * @param otherRoleId The guild role id
   * @returns
   */
  comparePositions(roleId: string, otherRoleId: string) {
    const role = this.cache.get(roleId);

    if (!role) {
      throw new TypeError("Role not found in cache");
    }

    return this.guild.roles.comparePositions(role.id, otherRoleId);
  }

  [Symbol.iterator]() {
    return this.cache.values();
  }

  toArray() {
    return this._roles;
  }
}

export class Member extends Base {
  /**
   * The member's guild avatar hash
   */
  avatar: string | null | undefined;
  /**
   * Timestamp of when the time out will be removed; until then, they cannot interact with the guild
   */
  communicationDisabledUntil: string | null | undefined;
  /**
   * The user this guild member represents
   */
  user: User;
  /**
   * Whether the user is deafened in voice channels
   */
  deaf: boolean;
  /**
   * When the user started boosting the guild
   */
  premiumSince: number | null;
  /**
   * Whether the user has not yet passed the guild's Membership Screening requirements
   */
  pending: boolean;
  /**
   * Member roles
   */
  roles: MemberRoles;
  /**
   * Member permissions bitfield
   */
  permissions: Permissions;
  /**
   * Whether the user is muted in voice channels
   */
  mute: boolean;
  /**
   * This member's guild nickname
   */
  nickname: string | null;
  /**
   * When the user joined the guild
   */
  joinedAt: number | null;
  declare rawData: APIGuildMember;
  constructor(data: APIGuildMember, public guild: Guild) {
    super(data, guild._client, data.user?.id);

    this.avatar = data.avatar;
    this.communicationDisabledUntil = data.communication_disabled_until;

    Object.defineProperty(this, "user", {
      value: null,
      writable: true,
      enumerable: false,
    });

    if (data.user) {
      this.user = this._client.cache.users.add(data.user)!;
    }

    this.nickname = data.nick ?? null;
    this.deaf = data.deaf;
    this.premiumSince = data.premium_since
      ? Date.parse(data.premium_since)
      : null;
    this.joinedAt = data.joined_at ? Date.parse(data.joined_at) : null;
    this.pending = Boolean(data.pending);
    this.roles = new MemberRoles(guild, data.roles);
    this.mute = data.mute;
    this.permissions = this.guild.permissionsOf(this);
  }

  /**
   * The current voice state of this member
   */
  get voiceState() {
    return this.guild.voiceStates.get(this.id);
  }

  get manageable() {
    if (this.id === this.guild.ownerId) {
      return false;
    }

    if (this.id === this._client.user!.id) {
      return false;
    }

    if (this._client.user!.id === this.guild.ownerId) {
      return true;
    }

    if (!this.guild.clientMember) {
      throw new UncachedClientMemberError();
    }

    return (
      this.guild.clientMember.roles.comparePositions(
        this.guild.clientMember.roles.highest.id,
        this.roles.highest.id,
      ) > 0
    );
  }

  get bannable() {
    if (!this.guild.clientMember) {
      throw new UncachedClientMemberError();
    }

    return (
      this.manageable &&
      this.guild.clientMember.permissions.has(Permissions.Flags.BanMembers)
    );
  }

  get kickable() {
    if (!this.guild.clientMember) {
      throw new UncachedClientMemberError();
    }

    return (
      this.manageable &&
      this.guild.clientMember.permissions.has(Permissions.Flags.KickMembers)
    );
  }

  /**
   * The member's display name
   */
  displayName() {
    return this.nickname ?? this.user?.displayName();
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

    let url =
      RouteBases.cdn +
      CDNRoutes.guildMemberAvatar(
        this.guild.id,
        this.id,
        this.avatar,
        options?.format ?? this.avatar.startsWith("a_")
          ? ImageFormat.GIF
          : ImageFormat.PNG,
      );

    if (options?.size) {
      url += "?size=" + options.size.toString();
    }

    return url;
  }

  /**
   * The member's display avatar url
   * @param options options for display avatar url
   * @returns
   */
  displayAvatarURL(options?: DisplayUserAvatarOptions) {
    return (
      this.avatarURL(options) ?? this.user?.displayAvatarURL(options) ?? null
    );
  }

  /**
   * Add a role to this member
   * @param roleId Id of role to be added
   * @param reason
   * @returns
   */
  addRole(roleId: string, reason?: string) {
    return this.guild.addMemberRole(this.id, roleId, reason);
  }

  /**
   * Remove a role to this member
   * @param roleId Id of role to be removed
   * @param reason
   * @returns
   */
  removeRole(roleId: string, reason?: string) {
    return this.guild.removeMemberRole(this.id, roleId, reason);
  }

  /**
   * Ban this member from the guild
   * @param options
   * @param reason
   * @returns
   */
  ban(options?: KeysToCamelCase<RESTPutAPIGuildBanJSONBody>, reason?: string) {
    return this.guild.createMemberBan(this.id, options, reason);
  }

  edit(
    options: KeysToCamelCase<RESTPatchAPIGuildMemberJSONBody>,
    reason?: string,
  ) {
    return this.guild.editMember(this.id, options, reason);
  }

  /**
   * Applies timeout to the member for a specified time
   * @param timeout
   * @param reason
   * @returns
   */
  disableCommunicationUntil(timeout: number, reason?: string) {
    return this.edit(
      {
        communicationDisabledUntil: new Date(
          Date.now() > timeout ? Date.now() + timeout : timeout,
        ).toISOString(),
      },
      reason,
    );
  }

  toJSON() {
    return Base.toJSON(this as Member, [
      "avatar",
      "avatarURL",
      "communicationDisabledUntil",
      "createdAt",
      "deaf",
      "guild",
      "id",
      "joinedAt",
      "mute",
      "pending",
      "permissions",
      "premiumSince",
      "rawData",
      "roles",
      "user",
    ]);
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
  joinTimestamp: number;
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
    this.joinTimestamp = Date.parse(data.join_timestamp);
    this.flags = new BitField(data.flags, ThreadMemberFlags);
  }

  /**
   * The guild member associated with this thread member
   */
  get guildMember() {
    return this.guild.members.cache.get(this.id);
  }

  /**
   * The user associated with this this thread member
   */
  get user() {
    return this._client.cache.users.get(this.id);
  }

  toJSON() {
    return Base.toJSON(this as ThreadMember, [
      "createdAt",
      "flags",
      "guild",
      "guildMember",
      "id",
      "joinTimestamp",
      "rawData",
      "thread",
      "threadId",
      "user",
    ]);
  }
}
