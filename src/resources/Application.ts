import {
  APIApplication,
  APIApplicationInstallParams,
  ApplicationFlags,
} from "discord-api-types/v10";
import { DataWithClient } from "typings/index";
import { Team } from "./Team";
import { User } from "./User";

export class Application {
  /**
   * the name of the app
   */
  name: string;
  /**
   * the icon hash of the app
   */
  icon: string | null;
  /**
   * the description of the app
   */
  description: string;
  /**
   * an array of rpc origin urls, if rpc is enabled
   */
  rpcOrigins?: string[] | undefined;
  /**
   * when false only app owner can join the app's bot to guilds
   */
  botPublic: boolean;
  /**
   * when true the app's bot will only join upon completion of the full oauth2 code grant flow
   */
  botRequireCodeGrant: boolean;
  /**
   * the url of the app's terms of service
   */
  termsOfServiceUrl?: string | undefined;
  /**
   * the url of the app's privacy policy
   */
  privacyPolicyUrl?: string | undefined;
  /**
   * partial user object containing info on the owner of the application
   */
  owner?: User | null;
  /**
   * the hex encoded key for verification in interactions and the GameSDK's GetTicket
   */
  verifyKey: string;
  /**
   * if the application belongs to a team, this will be a list of the members of that team
   */
  team: Team | null;
  /**
   * if this application is a game sold on Discord, this field will be the guild to which it has been linked
   */
  guildId?: string | undefined;
  /**
   * if this application is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists
   */
  primarySkuId?: string | undefined;
  /**
   * if this application is a game sold on Discord, this field will be the URL slug that links to the store page
   */
  slug?: string | undefined;
  /**
   * the application's default rich presence invite cover image hash
   */
  coverImage?: string | undefined;
  /**
   * the application's public flags
   */
  flags: ApplicationFlags;
  /**
   * up to 5 tags describing the content and functionality of the application
   */
  tags?:
    | [
        string,
        (string | undefined)?,
        (string | undefined)?,
        (string | undefined)?,
        (string | undefined)?
      ]
    | undefined;
  /**
   * settings for the application's default in-app authorization link, if enabled
   */
  installParams?: APIApplicationInstallParams | undefined;
  /**
   * the application's default custom authorization link, if enabled
   */
  customInstallUrl?: string | undefined;
  /**
   * the application's role connection verification entry point, which when configured will render the app as a verification method in the guild role verification configuration
   */
  roleConnectionsVerificationUrl?: string | undefined;

  constructor(data: DataWithClient<APIApplication>) {
    this.name = data.name;
    this.icon = data.icon;
    this.description = data.description;
    this.rpcOrigins = data.rpc_origins;
    this.botPublic = data.bot_public;
    this.botRequireCodeGrant = data.bot_require_code_grant;
    this.termsOfServiceUrl = data.terms_of_service_url;
    this.privacyPolicyUrl = data.privacy_policy_url;
    this.owner = data.owner
      ? new User({ ...data.owner, client: data.client })
      : null;
    this.verifyKey = data.verify_key;
    this.team = data.team
      ? new Team({ ...data.team, client: data.client })
      : null;
    this.guildId = data.guild_id;
    this.primarySkuId = data.primary_sku_id;
    this.slug = data.slug;
    this.coverImage = data.cover_image;
    this.flags = data.flags;
    this.tags = data.tags;
    this.installParams = data.install_params;
    this.customInstallUrl = data.custom_install_url;
    this.roleConnectionsVerificationUrl =
      data.role_connections_verification_url;
  }
}

export default Application;
