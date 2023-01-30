import {
  AnyClient,
  DataWithClient,
  InteractionFlags,
  MessagePostData,
} from "@typings/index";
import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIApplicationCommandInteractionDataBasicOption,
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandOptionChoice,
  APIChatInputApplicationCommandInteractionData,
  APIInteraction,
  APIInteractionDataResolved,
  APIInteractionDataResolvedGuildMember,
  APIMessageApplicationCommandInteractionData,
  APIMessageComponentInteraction,
  APIModalSubmitInteraction,
  APIUser,
  APIUserApplicationCommandInteractionData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";

import { Base } from "./Base";
import { Guild } from "./Guild";
import { Role } from "./Role";
import { User } from "./User";
import { WebServerInteractionResponse } from "@client/WebServer";
import { Message } from "./Message";
import { Member } from "./Member";
import { Resolvable } from "@utils/Resolvable";
import { GuildChannel } from "./Channel";
import { MakeError } from "@utils/index";

export class Interaction extends Base {
  /**
   * id of the application this interaction is for
   */
  applicationId: string;
  /**
   * type of interaction
   */
  type: InteractionType;
  /**
   * continuation token for responding to the interaction
   */
  token: string;
  /**
   * read-only property, always 1
   */
  version: number;

  constructor(data: DataWithClient<APIInteraction>) {
    super(data, data.client);

    this.applicationId = data.application_id;
    this.type = data.type;
    this.token = data.token;
    this.version = data.version;
  }

  static from(
    data: DataWithClient<APIInteraction>,
    res?: WebServerInteractionResponse
  ) {
    switch (data.type) {
      case InteractionType.ApplicationCommand: {
        return new CommandInteraction(data, res);
      }
      case InteractionType.MessageComponent: {
        return new ComponentInteraction(data, res);
      }
      case InteractionType.ApplicationCommandAutocomplete: {
        return new AutocompleteInteraction(data, res);
      }
      case InteractionType.ModalSubmit: {
        return new ModalSubmitInteraction(data, res);
      }
      default: {
        return new Interaction(data);
      }
    }
  }

  isCommand(): this is CommandInteraction {
    return this instanceof CommandInteraction
  }

  isComponent(): this is ComponentInteraction {
    return this instanceof ComponentInteraction
  }

  isAutoComplete(): this is AutocompleteInteraction {
    return this instanceof AutocompleteInteraction;
  }

  isModalSubmit(): this is ModalSubmitInteraction {
    return this instanceof ModalSubmitInteraction;
  }
}

export class ReplyableInteraction extends Interaction {
  // For http response
  _http: WebServerInteractionResponse;
  /**
   * This interaction is received for webserver
   */
  isHTTP: boolean;
  /**
   * The interaction is acknowledged
   */
  acknowledged: boolean;
  constructor(
    data: DataWithClient<APIInteraction>,
    httpResponse?: WebServerInteractionResponse
  ) {
    super(data);
    this._http = httpResponse;
    this.isHTTP = Boolean(httpResponse);
    this.acknowledged = false;
  }

  async defer(flags?: InteractionFlags) {
    if (this.acknowledged) {
      throw MakeError({
        name: "InteractionAlreadyAcknowledged",
        message: "You have already acknowledged this interaction.",
      });
    }

    if (this.isHTTP) {
      await this._http.respond(
        {
          flags: flags || 0,
        },
        InteractionResponseType.DeferredChannelMessageWithSource
      );

      this.acknowledged = true;
    } else {
      await this._client.rest.respondInteraction(
        this.id,
        this.token,
        {
          flags: flags || 0,
        },
        InteractionResponseType.DeferredChannelMessageWithSource
      );

      this.acknowledged = true;
    }
  }

  deleteReply(messageId: string) {
    if (!this.acknowledged) {
      throw MakeError({
        name: "InteractionNoAcknowledged",
        message: "Acknowledge the interaction first",
      });
    }

    return this._client.rest.deleteWebhookMessage(
      this.applicationId,
      this.token,
      messageId
    );
  }

  deleteOriginalReply() {
    return this.deleteReply("@original");
  }

  async reply(data: MessagePostData) {
    if (this.acknowledged) {
      throw MakeError({
        name: "InteractionAlreadyAcknowledged",
        message: "You have already acknowledged this interaction.",
      });
    }

    if (this.isHTTP) {
      await this._http.respond(
        data,
        InteractionResponseType.ChannelMessageWithSource
      );
    } else {
      await this._client.rest.respondInteraction(
        this.id,
        this.token,
        data,
        InteractionResponseType.ChannelMessageWithSource
      );
    }

    this.acknowledged = true;
  }

  async editReply(messageId: string, data: MessagePostData) {
    await this._client.rest.editWebhookMessage(
      this.applicationId,
      this.token,
      messageId,
      data
    );
  }

  editOriginalReply(data: MessagePostData) {
    return this.editReply("@original", data);
  }

  createFollowUP(data: MessagePostData) {
    if (!this.acknowledged) {
      throw MakeError({
        name: "InteractionNoAcknowledged",
        message: "Acknowledge the interaction first",
      });
    }

    return this._client.rest.executeWebhook(this.applicationId, this.token, data);
  }

  async getOriginalReply() {
    if (!this.acknowledged) {
      throw MakeError({
        name: "InteractionNoAcknowledged",
        message: "Acknowledge the interaction first",
      });
    }

    const rawMessage = await this._client.rest.getWebhookMessage(
      this.applicationId,
      this.token,
      "@original"
    );
    const channel = this._client.cache.channels.get(rawMessage.channel_id);
    const guildId =
      channel instanceof GuildChannel
        ? channel.guildId
        : "guild_id" in channel
        ? channel.guild_id
        : undefined;

    const message = new Message(
      { ...rawMessage, client: this._client },
      guildId ? Resolvable.resolveGuild(guildId, this._client) : undefined
    );

    return Resolvable.resolveMessage(message, this._client);
  }
}

export class ComponentInteraction extends ReplyableInteraction {
  constructor(
    data: DataWithClient<APIMessageComponentInteraction>,
    httpResponse?: WebServerInteractionResponse
  ) {
    super(data, httpResponse);
  }

  async deferUpdate() {
    if (this.acknowledged) {
      throw MakeError({
        name: "InteractionAlreadyAcknowledged",
        message: "You have already acknowledged this interaction.",
      });
    }

    if (this.isHTTP) {
      await this._http.respond(
        {},
        InteractionResponseType.DeferredMessageUpdate
      );
    } else {
      await this._client.rest.respondInteraction(
        this.id,
        this.token,
        {},
        InteractionResponseType.DeferredMessageUpdate
      );
    }
  }

  async editParent(data: MessagePostData) {
    if (this.acknowledged) {
      return this.editOriginalReply(data);
    }

    if (this.isHTTP) {
      await this._http.respond(data, InteractionResponseType.UpdateMessage);
    } else {
      await this._client.rest.respondInteraction(
        this.id,
        this.token,
        data,
        InteractionResponseType.UpdateMessage
      );
    }
  }
}

export class ModalSubmitInteraction extends ReplyableInteraction {
  constructor(
    data: DataWithClient<APIModalSubmitInteraction>,
    httpResponse?: WebServerInteractionResponse
  ) {
    super(data, httpResponse);
  }

  async deferUpdate() {
    if (this.acknowledged) {
      throw MakeError({
        name: "InteractionAlreadyAcknowledged",
        message: "You have already acknowledged this interaction.",
      });
    }

    if (this.isHTTP) {
      await this._http.respond(
        {},
        InteractionResponseType.DeferredMessageUpdate
      );
    } else {
      await this._client.rest.respondInteraction(
        this.id,
        this.token,
        {},
        InteractionResponseType.DeferredMessageUpdate
      );
    }
  }

  async editParent(data: MessagePostData) {
    if (this.acknowledged) {
      return this.editOriginalReply(data);
    }

    if (this.isHTTP) {
      await this._http.respond(data, InteractionResponseType.UpdateMessage);
    } else {
      await this._client.rest.respondInteraction(
        this.id,
        this.token,
        data,
        InteractionResponseType.UpdateMessage
      );
    }
  }
}

export class CommandInteractionOptions {
  #options: APIApplicationCommandInteractionDataBasicOption[];
  subCommand?: string;
  subCommandGroup?: string;
  #resolved: APIInteractionDataResolved;
  constructor(
    options: APIApplicationCommandInteractionDataOption[],
    resolved: APIInteractionDataResolved,
    public _client: AnyClient,
    public guild?: Guild
  ) {
    this.#resolved = resolved;

    if (options[0]?.type === ApplicationCommandOptionType.SubcommandGroup) {
      this.subCommand = options[0].name;
      options = options[0].options ?? [];
    }

    if (options[0]?.type === ApplicationCommandOptionType.Subcommand) {
      this.subCommandGroup = options[0].name;
      this.#options = options[0].options ?? [];
    }

    if (!this.#options) {
      this.#options =
        options as APIApplicationCommandInteractionDataBasicOption[];
    }
  }

  get(name: string) {
    const option = this.#options.find((o) => o.name === name);

    switch (option.type) {
      case ApplicationCommandOptionType.Attachment: {
        return {
          value: this.#resolved.attachments?.[option.value],
          name: option.name,
          type: option.type,
        };
      }
      case ApplicationCommandOptionType.User: {
        const user = this.#resolved.users?.[option.value];

        return {
          value: user ? new User({ ...user, client: this._client }) : null,
          name: option.name,
          type: option.type,
        };
      }
      case ApplicationCommandOptionType.Channel: {
        return {
          value: this.#resolved.channels?.[option.value],
          name: option.name,
          type: option.type,
        };
      }
      case ApplicationCommandOptionType.Role: {
        const role = this.#resolved.roles?.[option.value];
        return {
          value: role
            ? new Role({ ...role, client: this._client }, this.guild)
            : null,
          name: option.name,
          type: option.type,
        };
      }
      case ApplicationCommandOptionType.Mentionable: {
        const user = this.#resolved.users?.[option.value];
        const role = this.#resolved.roles?.[option.value];
        const member = this.#resolved.members?.[option.value];

        return {
          value: user
            ? new User({ ...user, client: this._client })
            : role ?? member ?? null,
          name: option.name,
          type: option.type,
        };
      }
      default: {
        return option;
      }
    }
  }

  string(name: string) {
    const r = this.get(name);
    return r.type === ApplicationCommandOptionType.String ? r.value : null;
  }

  number(name: string) {
    const r = this.get(name);
    return r.type === ApplicationCommandOptionType.Number ? r.value : null;
  }

  integer(name: string) {
    const r = this.get(name);
    return r.type === ApplicationCommandOptionType.Integer ? r.value : null;
  }

  boolean(name: string) {
    const r = this.get(name);
    return r.type === ApplicationCommandOptionType.Boolean ? r.value : null;
  }

  attachment(name: string) {
    const r = this.get(name);
    return r.type === ApplicationCommandOptionType.Attachment ? r.value : null;
  }

  user(name: string) {
    const r = this.get(name);
    return r.type === ApplicationCommandOptionType.User ? r.value : null;
  }

  mentionable(name: string) {
    const r = this.get(name);
    return r.type === ApplicationCommandOptionType.Mentionable ? r.value : null;
  }

  toArray() {
    return this.#options;
  }
}

export class ChatInputApplicationCommandInteractionData extends Base {
  /**
   * The type of the invoked command
   */
  type: ApplicationCommandType.ChatInput;
  /**
   * The name of the invoked command
   */
  name: string;

  /**
   * The guild ID of the invoked command
   */
  guildId?: string;

  options: CommandInteractionOptions | null;
  constructor(
    data: DataWithClient<APIChatInputApplicationCommandInteractionData>,
    guild?: Guild
  ) {
    super(data, guild?._client);

    this.options = data.options
      ? new CommandInteractionOptions(
          data.options,
          data.resolved,
          data.client,
          guild
        )
      : null;
  }
}

export class MessageApplicationCommandInteractionData extends Base {
  constructor(
    data: DataWithClient<APIMessageApplicationCommandInteractionData>,
    guild?: Guild
  ) {
    super(data, guild?._client);
  }
}

export class UserApplicationCommandInteractionData extends Base {
  /**
   * User target
   */
  target: User | APIUser;
  /**
   * The name of the invoked command
   */
  name: string;
  /**
   * 	id of the user targeted
   */
  targetId: string;
  /**
   * Guild member target
   */
  targetMember: APIInteractionDataResolvedGuildMember | Member;
  constructor(
    data: DataWithClient<APIUserApplicationCommandInteractionData>,
    guild?: Guild
  ) {
    super(data, guild?._client);

    this.target =
      this._client.cache.users.get(data.target_id) ??
      data.resolved.users[data.target_id];
    this.targetId = data.target_id;
    this.name = data.name;
    this.targetMember =
      guild?.members.get(data.target_id) ??
      data.resolved.members?.[data.target_id];
  }
}

export class CommandInteraction extends ReplyableInteraction {
  /**
   * the guild id it was sent from
   */
  guildId?: string;
  /**
   * the guild's preferred locale, if invoked in a guild
   */
  guildLocale?: string;
  /**
   * the channel it was sent from
   */
  channelId: string;
  /**
   * the guild object it was sent from
   */
  guild?: Guild | null;
  /**
   * The command data payload
   */
  data:
    | ChatInputApplicationCommandInteractionData
    | UserApplicationCommandInteractionData
    | MessageApplicationCommandInteractionData;
  /**
   * Member of the invoked command
   */
  member: Member;
  /**
   * User of the invoked command
   */
  user: User | APIUser;
  /**
   * The name of the invoked command
   */
  commandName: string;
  constructor(
    data: DataWithClient<APIApplicationCommandInteraction>,
    httpResponse?: WebServerInteractionResponse
  ) {
    super(data, httpResponse);
    this.guildId = data.guild_id;
    this.guildLocale = data.guild_locale;
    this.channelId = data.channel_id;
    this.guild = data.client.cache.guilds.get(data.guild_id);
    this.member = null;
    this.user = null;
    this.commandName = data.data.name

    if ("member" in data && this.guild) {
      const member = new Member(data.member, this.guild);
      this.member = this.guild.members.add(member);
      this.user = this.member.user;
    } else {
      this.user = this._client.cache.users.add(data.user);
    }

    if (data.data.type === ApplicationCommandType.ChatInput) {
      this.data = new ChatInputApplicationCommandInteractionData(
        {
          ...data.data,
          client: this._client,
        },
        this.guild
      );
    } else if (data.data.type === ApplicationCommandType.Message) {
      this.data = new MessageApplicationCommandInteractionData(
        {
          ...data.data,
          client: this._client,
        },
        this.guild
      );
    } else if (data.data.type === ApplicationCommandType.User) {
      this.data = new UserApplicationCommandInteractionData(
        {
          ...data.data,
          client: this._client,
        },
        this.guild
      );
    }
  }
}

export class AutocompleteInteraction extends Interaction {
  // For http response
  _http: WebServerInteractionResponse;
  /**
   * This interaction is received for webserver
   */
  isHTTP: boolean;
  /**
   * The interaction is acknowledged
   */
  acknowledged: boolean;
  constructor(
    data: DataWithClient<APIApplicationCommandAutocompleteInteraction>,
    httpResponse?: WebServerInteractionResponse
  ) {
    super(data);

    this._http = httpResponse;
    this.isHTTP = Boolean(httpResponse);
    this.acknowledged = false;
  }
  async result(choices: APIApplicationCommandOptionChoice[]) {
    if (this.acknowledged) {
      throw MakeError({
        name: "InteractionAlreadyAcknowledged",
        message: "You have already acknowledged this interaction.",
      });
    }

    if (this.isHTTP) {
      await this._http.respond(
        { choices },
        InteractionResponseType.ApplicationCommandAutocompleteResult
      );
    } else {
      await this._client.rest.respondInteraction(
        this.id,
        this.token,
        { choices },
        InteractionResponseType.ApplicationCommandAutocompleteResult
      );
    }

    this.acknowledged = true;
  }
}
