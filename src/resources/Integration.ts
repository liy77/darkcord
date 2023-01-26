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
  syncedAt: string;
  /**
   * Integration type
   */
  type: APIGuildIntegrationType;
  /**
   * User for this integration
   */
  user: User | APIUser;
  /**
   * The integration guild
   */
  guild: Guild;
  constructor(data: APIGuildIntegration, guild: Guild) {
    super(data, guild._client);

    this.account = data.account;
    this.application = data.application;
    this.enabled = data.enabled;
    this.expireBehavior = data.expire_behavior;
    this.enableEmoticons = data.enable_emoticons;
    this.expireGracePeriod = data.expire_grace_period;
    this.name = data.name;
    this.revoked = data.revoked;
    this.roleId = data.role_id;
    this.scopes = data.scopes;
    this.subscriberCount = data.subscriber_count;
    this.syncedAt = data.synced_at;
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
