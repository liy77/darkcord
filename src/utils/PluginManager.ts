import { Client } from "@client/Client";
import * as AnyChannel from "@resources/Channel";
import * as AnyGuild from "@resources/Guild";
import * as AnyInteraction from "@resources/Interaction";
import * as Invite from "@resources/Invite";
import * as EmojiOrReaction from "@resources/Emoji";
import * as Webhook from "@resources/Webhook";
import * as Integration from "@resources/Integration";
import * as AnyMember from "@resources/Member";
import * as Message from "@resources/Message";
import * as BitField from "@resources/BitField";
import * as Base from "@resources/Base";
import * as AuditLog from "@resources/AuditLog";
import * as Application from "@resources/Application";

export type AnyResource =
  | typeof AnyChannel
  | typeof AnyGuild
  | typeof AnyInteraction
  | typeof Invite
  | typeof EmojiOrReaction
  | typeof Webhook
  | typeof Integration
  | typeof AnyMember
  | typeof Message
  | typeof BitField
  | typeof Base
  | typeof AuditLog
  | typeof Application;

export class PluginManager {
  resources: AnyResource[];
  constructor(public client: Client) {
    this.resources = [
      AnyChannel,
      AnyGuild,
      AnyInteraction,
      Invite,
      EmojiOrReaction,
      Webhook,
      Integration,
      AnyMember,
      Message,
      BitField,
      Base,
      AuditLog,
      Application,
    ];
  }

  addProperty<T>(key: string, value: T) {
    return (this.client[key] = value);
  }

  emit(event: string, ...args: any[]) {
    this.client.emit(event, ...args);
  }

  overrideResource<T>(resourceName: string, replacer: (x: T) => any) {
    const resource = this.resources.find((resource) =>
      Object.keys(resource).includes(resourceName)
    );

    if (resource) {
      resource[resourceName] = replacer(resource[resourceName]);
    }
  }
}
