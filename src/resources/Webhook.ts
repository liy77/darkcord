import {
  APIPartialChannel,
  APIPartialGuild,
  APIWebhook,
  RESTPatchAPIWebhookJSONBody,
  WebhookType,
} from "discord-api-types/v10";
import { Rest } from "../rest/Rest";
import { DataWithClient, MessagePostData } from "@typings/index";
import { Base } from "./Base";
import { User } from "./User";
import { Guild } from "./Guild";
import { GuildChannel } from "./Channel";

export class Webhook extends Base {
  /**
   * the type of the webhook
   */
  type: WebhookType;
  /**
   * the guild id this webhook is for, if any
   */
  guildId?: string;
  /**
   * the channel id this webhook is for, if any
   */
  channelId: string;
  /**
   * the user this webhook was created by (not returned when getting a webhook with its token)
   */
  user?: User | null;
  /**
   * the default name of the webhook
   */
  name: string | null;
  /**
   * the default user avatar hash of the webhook
   */
  avatar: string | null;
  /**
   * the secure token of the webhook (returned for Incoming Webhooks)
   */
  token?: string;
  /**
   * the bot/OAuth2 application that created this webhook
   */
  applicationId: string | null;
  /**
   * the guild of the channel that this webhook is following (returned for Channel Follower Webhooks)
   */
  sourceGuild?: Guild | APIPartialGuild;
  /**
   * the channel that this webhook is following (returned for Channel Follower Webhooks)
   */
  sourceChannel?: GuildChannel | APIPartialChannel;
  /**
   * the url used for executing the webhook (returned by the webhooks OAuth2 flow)
   */
  url?: string;
  /**
   * Rest to make requests
   */
  rest: Rest;

  constructor(data: DataWithClient<APIWebhook>) {
    super(data, data.client);

    this.type = data.type;
    this.guildId = data.guild_id;
    this.user = data.user
      ? new User({ ...data.user, client: this._client })
      : null;
    this.token = data.token;
    this.applicationId = data.application_id;

    this._update(data);
    this.rest = new Rest(this.token);
  }

  sendMessage(data: MessagePostData) {
    if (!this.token) return Promise.resolve();
    return this.rest.executeWebhook(this.id, this.token, data);
  }

  delete() {
    if (!this.token) return Promise.resolve();
    return this.rest.deleteWebhookWithToken(this.id, this.token);
  }

  async edit(data: RESTPatchAPIWebhookJSONBody) {
    if (!this.token) return Promise.resolve();
    const updated = await this.rest.modifyWebhookWithToken(
      this.id,
      this.token,
      data,
    );

    return this._update(updated);
  }

  _update(data: APIWebhook) {
    if ("name" in data) this.name = data.name;
    if ("avatar" in data) this.avatar = data.avatar;
    if ("channel_id" in data) this.channelId = data.channel_id;
    if ("url" in data) this.url = data.url;

    if ("source_guild" in data && data.source_guild) {
      this.sourceGuild =
        this._client.cache.guilds.get(data.source_guild.id) ??
        data.source_guild;
    }
    if ("source_channel" in data && data.source_channel) {
      this.sourceChannel =
        this._client.cache.channels.get(data.source_channel.id) ??
        data.source_channel;
    }
    return this;
  }
}
