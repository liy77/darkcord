import { DataWithClient } from "@typings/index";
import {
  APIGuildIntegration,
  APIGuildIntegrationApplication,
  APIGuildIntegrationType,
  APIIntegrationAccount,
  APIUser,
  IntegrationExpireBehavior,
  OAuth2Scopes,
} from "discord-api-types/v10";
import { Base } from "./Base";
import { Guild } from "./Guild";
import { User } from "./User";

export class Integration extends Base {
  /**
   * Integration account information
   */
  account: APIIntegrationAccount;
  /**
   * The bot/OAuth2 application for discord integrations
   */
  application: APIGuildIntegrationApplication;
  /**
   * Is this integration enabled
   */
  enabled: boolean;
  /**
   * The behavior of expiring subscribers
   */
  expireBehavior: IntegrationExpireBehavior;
  /**
   * Whether emoticons should be synced for this integration (twitch only currently)
   */
  enableEmoticons: boolean;
  /**
   * The grace period (in days) before expiring subscribers
   */
  expireGracePeriod: number;
  /**
   * Integration name
   */
  name: string;
  /**
   * Has this integration been revoked
   */
  revoked: boolean;
  /**
   * ID that this integration uses for "subscribers"
   */
  roleId: string;
  /**
   * The scopes the application has been authorized for
   */
  scopes: OAuth2Scopes[];
  /**
   * How many subscribers this integration has
   */
  subscriberCount: number;
  /**
   * When this integration was last synced
   */
  syncedAt: number | null;
  /**
   * Integration type
   */
  type: APIGuildIntegrationType;
  /**
   * User for this integration
   */
  user: User | APIUser | null;
  /**
   * The integration guild
   */
  guild: Guild;
  constructor(data: APIGuildIntegration, guild: Guild) {
    super(data, guild._client);

    this.account = data.account;
    this.application = data.application as APIGuildIntegrationApplication;
    this.enabled = Boolean(data.enabled);
    this.expireBehavior = data.expire_behavior as IntegrationExpireBehavior;
    this.enableEmoticons = Boolean(data.enable_emoticons);
    this.expireGracePeriod = data.expire_grace_period as number;
    this.name = data.name;
    this.revoked = Boolean(data.revoked);
    this.roleId = data.role_id as string;
    this.scopes = data.scopes as OAuth2Scopes[];
    this.subscriberCount = data.subscriber_count as number;
    this.syncedAt = data.synced_at ? Date.parse(data.synced_at) : null;
    this.type = data.type;
    this.user = data.user ? this._client.cache.users.add(data.user) : null;
    this.guild = guild;
  }

  delete(reason?: string) {
    return this._client.rest.deleteGuildIntegration(
      this.guild.id,
      this.id,
      reason
    );
  }
}
