import {
  APIDMChannel,
  APIUser,
  CDNRoutes,
  ChannelType,
  DefaultUserAvatarAssets,
  ImageFormat,
  LocaleString,
  RouteBases,
  UserAvatarFormat,
  UserFlags,
  UserPremiumType,
} from "discord-api-types/v10";
import { DataWithClient, DisplayUserAvatarOptions } from "@typings/index";
import { Base } from "./Base";
import { DMChannel } from "./Channel";

export class User extends Base {
  /**
   * the user's username, not unique across the platform
   */
  username: string;
  /**
   * the user's 4-digit discord-tag
   */
  discriminator: string;
  /**
   * the user's avatar hash
   */
  avatar: string | null;
  /**
   * whether the user belongs to an OAuth2 application
   */
  bot?: boolean | undefined;
  /**
   * whether the user is an Official Discord System user (part of the urgent message system)
   */
  system?: boolean | undefined;
  /**
   * whether the user has two factor enabled on their account
   */
  mfaEnabled?: boolean | undefined;
  /**
   * the user's banner hash
   */
  banner?: string | null | undefined;
  /**
   * the user's banner color encoded as an integer representation of hexadecimal color code
   */
  accentColor?: number | null | undefined;
  /**
   * the user's chosen language option
   */
  locale?: LocaleString;
  /**
   * whether the email on this account has been verified
   */
  verified?: boolean | undefined;
  /**
   * the user's email
   */
  email?: string | null | undefined;
  /**
   * the flags on a user's account
   */
  flags?: UserFlags | undefined;
  /**
   * the type of Nitro subscription on a user's account
   */
  premiumType?: UserPremiumType | undefined;
  /**
   * the public flags on a user's account
   */
  publicFlags?: UserFlags | undefined;

  constructor(data: DataWithClient<APIUser>) {
    super(data);
    this._client = data.client;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar;
    this.banner = data.banner;
    this.bot = data.bot;
    this.locale = data.locale as LocaleString;
    this.mfaEnabled = data.mfa_enabled;
    this.premiumType = data.premium_type;
    this.verified = data.verified;
    this.flags = data.flags;
    this.publicFlags = data.public_flags;
  }

  /**
   * the default user's avatar url
   * @returns
   */
  get defaultAvatarURL() {
    return (
      RouteBases.cdn +
      CDNRoutes.defaultUserAvatar(
        (Number(this.discriminator) % 5) as DefaultUserAvatarAssets
      )
    );
  }

  /**
   * the user's avatar url
   * @param options options for avatar url
   * @returns
   */
  avatarURL(options?: DisplayUserAvatarOptions) {
    if (!this.avatar) {
      return null;
    }

    return RouteBases.cdn +
      CDNRoutes.userAvatar(
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

  /**
   * the user's display avatar url
   * @param options options for display avatar url
   * @returns
   */
  displayAvatarURL(options?: DisplayUserAvatarOptions) {
    return this.avatarURL(options) ?? this.defaultAvatarURL;
  }

  /**
   * the user's username and discriminator
   */
  get tag() {
    return this.username + "#" + this.discriminator;
  }

  /**
   * The dm of user
   */
  get dm() {
    let dm = this._client.cache.channels.find(
      (ch: DMChannel | APIDMChannel) => {
        const id = ch instanceof DMChannel ? ch.userId : ch.recipients[0].id;
        return ch.type === ChannelType.DM && id === this.id;
      }
    ) as APIDMChannel | DMChannel;

    if (!(dm instanceof DMChannel)) {
      dm = new DMChannel({ ...dm, client: this._client });
    }

    return dm as DMChannel;
  }

  /**
   * Create a new DM channel for this user
   */
  async createDM() {
    const dm = await this._client.rest.createDM(this.id);

    return this._client.cache.channels.add(dm) as APIDMChannel | DMChannel;
  }

  /**
   * Delete this user dm if existing one
   */
  async deleteDM() {
    if (!this.dm) return;

    await this._client.rest.deleteChannel(this.dm.id);
    this._client.cache.channels.delete(this.dm.id);
  }
}
