import { Member } from "@resources/Member";
import { Guild } from "@resources/Guild";
import { User } from "@resources/User";
import { Emoji, Reaction } from "@resources/Emoji";
import { Message } from "@resources/Message";
import { Application } from "@resources/Application";
import {
  Channel,
  ForumChannel,
  GuildChannel,
  TextBasedChannel,
  GuildTextChannel,
  StageChannel,
  VoiceChannel,
  BaseVoiceChannel,
  CategoryChannel,
  ThreadChannel,
  WelcomeChannel,
  DMChannel,
} from "@resources/Channel";
import { Role } from "@resources/Role";
import { AnyClient } from "@typings/index";

export type ForgedConstructor =
  | typeof Message
  | typeof Guild
  | typeof User
  | typeof Member
  | typeof Channel
  | typeof Emoji
  | typeof Reaction
  | typeof Application
  | typeof ForumChannel
  | typeof GuildChannel
  | typeof TextBasedChannel
  | typeof GuildTextChannel
  | typeof StageChannel
  | typeof VoiceChannel
  | typeof BaseVoiceChannel
  | typeof CategoryChannel
  | typeof ThreadChannel
  | typeof WelcomeChannel
  | typeof DMChannel
  | typeof CategoryChannel
  | typeof ForumChannel
  | typeof StageChannel
  | typeof Role;

type Implement<K extends string> = {
  [x in K]: string;
};

export type Forged<T, RequiredProp extends string = "id"> = Partial<
  Omit<T, RequiredProp>
> &
  Implement<RequiredProp>;

export type ForgifiedConstructorParams<
  T extends ForgedConstructor,
  RequiredProp extends string = "id",
> = {
  [K in keyof ConstructorParameters<T>]: ConstructorParameters<T>[K] extends Guild
    ? ConstructorParameters<T>[K]
    : Partial<Omit<ConstructorParameters<T>[K], RequiredProp>> &
        Implement<RequiredProp>;
};

export type ForgifiedParams<T extends ForgedConstructor> =
  ForgifiedConstructorParams<T>;

const CAN_BE_FORGED_LIST = [
  "Message",
  "Guild",
  "User",
  "Member",
  "Channel",
  "Emoji",
  "Reaction",
  "Application",
  "ForumChannel",
  "GuildChannel",
  "TextBasedChannel",
  "GuildTextChannel",
  "StageChannel",
  "VoiceChannel",
  "DMChannel",
  "BaseVoiceChannel",
  "CategoryChannel",
  "ThreadChannel",
  "WelcomeChannel",
  "CategoryChannel",
  "ForumChannel",
  "StageChannel",
  "Role",
];

export class ForgifiedAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForgifiedAPIError";
  }
}

export namespace ForgifiedAPI {
  export const Error = ForgifiedAPIError;
  export function CAN_BE_FORGED(x: ForgedConstructor) {
    return CAN_BE_FORGED_LIST.includes(x.name);
  }
  export const FORGIFIED = Symbol("ForgifiedAPI");
}

export class Forge<T extends ForgedConstructor> {
  constructor(public client: AnyClient, public base: T) {
    if (!ForgifiedAPI.CAN_BE_FORGED(base)) {
      throw new ForgifiedAPIError(
        `Cannot forge ${base.name}, incompatible class`,
      );
    }
  }

  // @ts-expect-error - params is valid array
  forge(...params: Omit<ForgifiedParams<T>, keyof Array>): InstanceType<T> {
    // @ts-expect-error - params is valid
    const data = new this.base(...params);

    Object.defineProperty(data, "_client", {
      value: this.client,
    });

    Object.defineProperty(data, "isForged", {
      value: true,
      writable: false,
    });

    Object.defineProperty(data, ForgifiedAPI.FORGIFIED, {
      value: `Forgified<${this.base.name}>`,
      writable: false,
    });

    if (data instanceof Channel || data instanceof GuildTextChannel) {
      this.client.channels.cache._add(data as Channel, false, data.id);
    } else if (data instanceof Guild) {
      this.client.guilds.cache._add(data as Guild, false, data.id);
    } else if (data instanceof User) {
      this.client.users.cache._add(data as User, false, data.id);
    } else if (data instanceof Member) {
      (params[1] instanceof Guild
        ? params[1]
        : this.client.guilds.cache.get(data.guild?.id)
      )?.members.add(data, false);
    } else if (data instanceof Message) {
      const channel = this.client.channels.cache.get(data.channelId);

      if (channel && channel.isText()) {
        channel.messages.add(data, false);
      }
    } else if (data instanceof Reaction) {
      let message = data.message;

      if (!message && data.channelId && data.messageId) {
        const channel = this.client.channels.cache.get(data.channelId);

        if (channel && channel.isText()) {
          message = channel.messages.cache.get(data.messageId) ?? null;
        }
      }

      if (message) {
        message.reactions._add(data, false, data.emoji.id ?? data.emoji.name!);
      }
    }

    return data as InstanceType<T>;
  }
}
