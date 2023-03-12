import { DataWithClient } from "@typings/index";
import {
  APIApplication,
  APIApplicationInstallParams,
  ApplicationFlags,
  RESTPatchAPIApplicationCommandJSONBody,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPutAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import { Base } from "./Base";
import { Team } from "./Team";
import { User } from "./User";

export class Application extends Base {
  /**
   * The name of the app
   */
  name: string;
  /**
   * The icon hash of the app
   */
  icon: string | null;
  /**
   * The description of the app
   */
  description: string;
  /**
   * An array of rpc origin urls, if rpc is enabled
   */
  rpcOrigins?: string[] | undefined;
  /**
   * When false only app owner can join the app's bot to guilds
   */
  botPublic: boolean;
  /**
   * When true the app's bot will only join upon completion of the full oauth2 code grant flow
   */
  botRequireCodeGrant: boolean;
  /**
   * The url of the app's terms of service
   */
  termsOfServiceUrl?: string | undefined;
  /**
   * The url of the app's privacy policy
   */
  privacyPolicyUrl?: string | undefined;
  /**
   * Partial user object containing info on the owner of the application
   */
  owner?: User | null;
  /**
   * The hex encoded key for verification in interactions and the GameSDK's GetTicket
   */
  verifyKey: string;
  /**
   * If the application belongs to a team, this will be a list of the members of that team
   */
  team: Team | null;
  /**
   * If this application is a game sold on Discord, this field will be the guild to which it has been linked
   */
  guildId?: string | undefined;
  /**
   * If this application is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists
   */
  primarySkuId?: string | undefined;
  /**
   * If this application is a game sold on Discord, this field will be the URL slug that links to the store page
   */
  slug?: string | undefined;
  /**
   * The application's default rich presence invite cover image hash
   */
  coverImage?: string | undefined;
  /**
   * The application's public flags
   */
  flags: ApplicationFlags;
  /**
   * Up to 5 tags describing the content and functionality of the application
   */
  tags?:
    | [
        string,
        (string | undefined)?,
        (string | undefined)?,
        (string | undefined)?,
        (string | undefined)?,
      ]
    | undefined;
  /**
   * Settings for the application's default in-app authorization link, if enabled
   */
  installParams?: APIApplicationInstallParams | undefined;
  /**
   * The application's default custom authorization link, if enabled
   */
  customInstallUrl?: string | undefined;
  /**
   * The application's role connection verification entry point, which when configured will render the app as a verification method in the guild role verification configuration
   */
  roleConnectionsVerificationUrl?: string | undefined;

  constructor(data: DataWithClient<APIApplication>) {
    super(data, data.client);

    this.name = data.name;
    this.icon = data.icon;
    this.description = data.description;
    this.rpcOrigins = data.rpc_origins;
    this.botPublic = data.bot_public;
    this.botRequireCodeGrant = data.bot_require_code_grant;
    this.termsOfServiceUrl = data.terms_of_service_url;
    this.privacyPolicyUrl = data.privacy_policy_url;
    this.owner = data.owner ? this._client.users.add(data.owner) : null;
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

export class ClientApplication extends Application {
  createCommand(options: RESTPostAPIApplicationCommandsJSONBody) {
    return this._client.rest.createApplicationCommand(this.id, options);
  }

  createGuildCommand(
    guildId: string,
    options: RESTPostAPIApplicationCommandsJSONBody,
  ) {
    return this._client.rest.createGuildApplicationCommand(
      this.id,
      guildId,
      options,
    );
  }

  deleteCommand(commandId: string) {
    return this._client.rest.deleteApplicationCommand(this.id, commandId);
  }

  deleteGuildCommand(guildId: string, commandId: string) {
    return this._client.rest.deleteGuildApplicationCommand(
      this.id,
      guildId,
      commandId,
    );
  }

  editCommand(
    commandId: string,
    options: RESTPatchAPIApplicationCommandJSONBody,
  ) {
    return this._client.rest.editApplicationCommand(
      this.id,
      commandId,
      options,
    );
  }

  editGuildCommand(
    guildId: string,
    commandId: string,
    options: RESTPatchAPIApplicationCommandJSONBody,
  ) {
    return this._client.rest.editGuildApplicationCommand(
      this.id,
      guildId,
      commandId,
      options,
    );
  }

  bulkOverwriteCommands(commands: RESTPutAPIApplicationCommandsJSONBody) {
    return this._client.rest.bulkOverwriteApplicationCommands(
      this.id,
      commands,
    );
  }

  bulkOverwriteGuildCommands(
    guildId: string,
    commands: RESTPutAPIApplicationCommandsJSONBody,
  ) {
    return this._client.rest.bulkOverwriteGuildApplicationCommands(
      this.id,
      guildId,
      commands,
    );
  }
}
