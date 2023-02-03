import {
  APIPartialChannel,
  APIPartialGuild,
  APIWebhook,
  RESTPostAPIChannelWebhookJSONBody,
  WebhookType,
} from "discord-api-types/v10";
import { Rest } from "../rest/Rest";
import { DataWithClient, MessagePostData } from "@typings/index";
import { Base } from "./Base";
import { User } from "./User";

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
  sourceGuild?: APIPartialGuild;
  /**
   * the channel that this webhook is following (returned for Channel Follower Webhooks)
   */
  sourceChannel?: APIPartialChannel;
  /**
   * the url used for executing the webhook (returned by the webhooks OAuth2 flow)
   */
  url?: string;
  rest: Rest;

  constructor(data: DataWithClient<APIWebhook>) {
    super(data, data.client);

    this.type = data.type;
    this.guildId = data.guild_id;
    this.channelId = data.channel_id;
    this.user = data.user
      ? new User({ ...data.user, client: this._client })
      : null;
    this.name = data.name;
    this.avatar = data.avatar;
    this.token = data.token;
    this.applicationId = data.application_id;
    this.sourceGuild = data.source_guild;
    this.sourceChannel = data.source_channel;
    this.url = data.url;

    this.rest = new Rest(this.token);
  }

  sendMessage(data: MessagePostData) {
    if (!this.token) return Promise.resolve()
    return this.rest.executeWebhook(this.id, this.token, data);
  }

  delete() {
    if (!this.token) return Promise.resolve()
    return this.rest.deleteWebhookWithToken(this.id, this.token);
  }

  edit(data: RESTPostAPIChannelWebhookJSONBody) {
    if (!this.token) return Promise.resolve()
    return this.rest.modifyWebhookWithToken(this.id, this.token, data);
  }
}
