import { AnyClient, DataWithClient } from "@typings/index";
import {
  APIInvite,
  APIPartialChannel,
  APIUser,
  InviteTargetType
} from "discord-api-types/v10";

import { GuildChannel } from "./Channel";
import { Guild, InviteGuild, ScheduledEvent } from "./Guild";
import { User } from "./User";

export class Invite {
  /**
   * The guild this invite is for
   */
  guild: Guild | InviteGuild | null;
  /**
   * The expiration date of this invite
   */
  expiresAt: number | null;
  /**
   * The user who created the invite
   */
  inviter: User | APIUser | null;
  /**
   * The invite code (unique ID)
   */
  code: string;
  /**
   * The channel this invite is for
   */
  channel?: GuildChannel | APIPartialChannel | null;
  /**
   * The type of target for this voice channel invite
   */
  targetType: InviteTargetType;
  /**
   * The user whose stream to display for this voice channel stream invite
   */
  targetUser: User | APIUser | null;
  /**
   * Approximate count of total members
   */
  approximateMemberCount: number;
  /**
   * Approximate count of online members
   */
  approximatePresenceCount: number;
  /**
   * The guild scheduled event
   */
  guildScheduledEvent: ScheduledEvent | null;
  _client: AnyClient;
  constructor(data: DataWithClient<Partial<APIInvite>>) {

    this._client = data.client
    this.guild = null
    this.expiresAt = null
    this.inviter = null

    this.code = data.code as string;

    this.approximateMemberCount = 0
    this.approximatePresenceCount = 0
    this.targetType = data.target_type!;
    this.targetUser = data.target_user
      ? data.client.cache.users.add(data.target_user)
      : null;
    this.guildScheduledEvent = null

    this._update(data)
  }

  _update(data: Partial<APIInvite>) {
    if (data.guild) {
      this.guild = data.guild
      ? this._client.guilds.cache.get(data.guild.id) ??
        new InviteGuild({ ...data.guild, client: this._client })
      : null;
    }

    if ("expires_at" in data) {
      this.expiresAt = data.expires_at ? Date.parse(data.expires_at) : null;
    }

    if ("inviter" in data) {
      this.inviter = data.inviter
      ? this._client.cache.users.add(data.inviter)
      : null;
    }

    if ("channel" in data) {
      this.channel = this._client.channels.cache.get(data.channel!.id) ?? data.channel;
    }

    if ("approximate_member_count" in data) {
      this.approximateMemberCount = data.approximate_member_count || 0;
    }

    if ("approximate_presence_count" in data) {
      this.approximatePresenceCount = data.approximate_presence_count || 0;
    }

    if ("guild_scheduled_event" in data) {
      this.guildScheduledEvent = data.guild_scheduled_event && this.guild
        ? new ScheduledEvent(data.guild_scheduled_event, this.guild)
        : null;

        if (this.guildScheduledEvent && this.guild instanceof Guild) {
          this.guild!.scheduledEvents.set(
            this.guildScheduledEvent.id,
            this.guildScheduledEvent,
          );
        }
    }
  }
}
