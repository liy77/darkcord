import { UserDataManager } from "@manager/UserDataManager";
import { AnyClient, DataWithClient } from "@typings/index";
import {
  APIEmoji,
  APIReaction as RawAPIReaction,
  CDNRoutes,
  ImageFormat,
  RouteBases,
} from "discord-api-types/v10";
import { Snowflake } from "./Base";
import { Message } from "./Message";

export class Emoji {
  /**
   * Whether this emoji must be wrapped in colons
   */
  requireColons?: boolean;
  /**
   * Whether this emoji is managed
   */
  managed?: boolean;
  /**
   * Whether this emoji can be used, may be false due to loss of Server Boosts
   */
  available?: boolean;
  /**
   * Emoji name (can be null only in reaction emoji objects)
   */
  name: string | null;
  /**
   * Whether this emoji is animated
   */
  animated?: boolean;
  /**
   * Emoji id
   */
  id: string | null;

  rawData: APIEmoji;

  constructor(data: APIEmoji) {
    this._update(data);
  }

  _update(data: APIEmoji) {
    if ("id" in data) this.id = data.id;
    if ("require_colons" in data) this.requireColons = data.require_colons;
    if ("managed" in data) this.managed = data.managed;
    if ("available" in data) this.available = data.available;
    if ("name" in data) this.name = data.name;
    if ("animated" in data) this.animated = Boolean(data.animated);
    else this.animated ??= false;

    this.rawData = Object.assign({}, data, this.rawData);

    return this;
  }

  createdAt() {
    return this.id && Snowflake.getCreatedAt(this.id);
  }

  /**
   * Emoji url
   */
  get url() {
    return (
      this.id &&
      RouteBases.cdn +
        CDNRoutes.emoji(
          this.id,
          this.animated ? ImageFormat.GIF : ImageFormat.PNG,
        )
    );
  }

  get uriComponent() {
    return this.id
      ? `${this.animated ? "a:" : ""}${this.name}:${this.id}`
      : encodeURIComponent(this.name!);
  }

  /**
   * Update information of this emoji
   *
   * Util if this is forged
   * @returns
   */
  async fetchInformation(client: AnyClient, guildId: string) {
    if (!this.id)
      throw new Error("Emoji id is required to fetch emoji information");
    if (!guildId)
      throw new Error("Guild id is required to fetch emoji information");

    const data = await client.rest.getEmoji(guildId, this.id!);
    return this._update(data ?? {});
  }

  toString() {
    return this.id
      ? `<${this.animated ? "a" : ""}:${this.name}:${this.id}>`
      : this.name;
  }

  static from(emoji: string) {
    const r = Emoji.parse(emoji);

    return r && new Emoji(r);
  }

  static parse(emoji: string): APIEmoji | null {
    if (emoji === encodeURIComponent(emoji)) emoji = decodeURIComponent(emoji);
    if (!emoji.includes(":")) return null;

    const r = emoji.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);

    return (
      r && {
        name: r[2],
        id: r[3],
        animated: Boolean(r[1]),
      }
    );
  }

  static getEncodedURI(emoji: string | APIEmoji) {
    if (typeof emoji === "string") {
      emoji = Emoji.parse(emoji) as Emoji;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return emoji && emoji.id
      ? `${emoji.animated ? "a:" : ""}${emoji.name}:${emoji.id}`
      : encodeURIComponent(emoji.name!);
  }
}

export interface ReactionCountDetails {
  /**
   * Count of super reactions
   */
  burst: number;
  /**
   * Count of normal reactions
   */
  normal: number;
}

export interface APIReaction extends RawAPIReaction {
  /**
   * Reaction count details object
   */
  count_details: ReactionCountDetails;
  /**
   * The message id of this reaction
   */
  message_id?: string;
  /**
   * The channel id of the message of this reaction
   */
  channel_id?: string;
}

export interface APISuperReaction extends APIReaction {
  /**
   * HEX colors used for super reaction
   */
  burst_colors: string[];
}

export class Reaction {
  /**
   * Whether the current user reacted using this emoji
   */
  me: boolean;
  /**
   * Emoji information
   */
  emoji: Emoji;
  /**
   * Times this emoji has been used to react
   */
  count: number;
  /**
   * Users reacted
   */
  users: UserDataManager;
  /**
   * HEX colors used for super reaction
   */
  burstColors: string[];
  /**
   * Reaction count details object
   */
  countDetails: ReactionCountDetails;
  _client: AnyClient;
  /**
   * The message of this reaction
   */
  message: Message | null;
  /**
   * The message id of this reaction
   */
  messageId?: string;
  /**
   * The channel id of the message of this reaction
   */
  channelId?: string;
  constructor(data: DataWithClient<APIReaction | APISuperReaction>) {
    Object.defineProperty(this, "_client", { value: data.client });

    this._update(data);
  }

  _update(data: APIReaction | APISuperReaction) {
    if ("me" in data) this.me = data.me;
    if ("emoji" in data) this.emoji = new Emoji(data.emoji);
    if ("count" in data) this.count = data.count;
    if ("users" in data)
      this.users = new UserDataManager(
        this._client.cache._cacheLimit("users"),
        this._client.cache,
      );
    if ("burst_colors" in data) this.burstColors = data.burst_colors;
    if ("count_details" in data) this.countDetails = data.count_details;
    if ("channel_id" in data) this.channelId = data.channel_id;
    if ("message_id" in data) this.messageId = data.message_id;

    if (this.messageId && this.channelId) {
      const channel = this._client.channels.cache.get(this.channelId);

      if (channel && channel.isText()) {
        const message = channel.messages.cache.get(this.messageId);
        this.message = message ?? null;
      }
    }

    return this;
  }

  /**
   * Update information of this reaction
   *
   * Util if this is forged
   * @returns
   */
  async fetchInformation(
    channelId = this.channelId,
    messageId = this.messageId,
  ) {
    if (!channelId || !messageId) {
      throw new Error(
        "Channel id and message id must be provided to fetch information of this reaction",
      );
    }

    const data = await this._client.rest.getMessage(channelId, messageId);

    const updated = data.reactions?.find(
      (r) => r.emoji.id === this.emoji.id || r.emoji.name === this.emoji.name,
    ) as APIReaction;

    return this._update(updated ?? {});
  }
}
