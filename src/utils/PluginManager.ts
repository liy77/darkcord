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

export interface ResourceObject {
  baseFile: string;
  exports: AnyResource;
}

export class PluginManager {
  resources: ResourceObject[];
  constructor(public client: Client) {
    this.resources = [
      { baseFile: "Channel", exports: AnyChannel },
      { baseFile: "Guild", exports: AnyGuild },
      { baseFile: "Interaction", exports: AnyInteraction },
      { baseFile: "Invite", exports: Invite },
      { baseFile: "Emoji", exports: EmojiOrReaction },
      { baseFile: "Webhook", exports: Webhook },
      { baseFile: "Integration", exports: Integration },
      { baseFile: "Member", exports: AnyMember },
      { baseFile: "Message", exports: Message },
      { baseFile: "BitField", exports: BitField },
      { baseFile: "Base", exports: Base },
      { baseFile: "AuditLog", exports: AuditLog },
      { baseFile: "Application", exports: Application },
    ];
  }

  addProperty<T>(key: string, value: T) {
    return (this.client[key] = value);
  }

  emit(event: string, ...args: any[]) {
    this.client.emit(event, ...args);
  }

  getResourcePack(resourceName: string): ResourceObject {
    return this.resources[resourceName];
  }

  getResourceInPack<T = any>(resourceName: string): T {
    const pack = this.resources.find((resource) =>
      Object.keys(resource.exports).includes(resourceName)
    );

    return pack && pack.exports[resourceName];
  }

  overrideResource<T>(resourceName: string, replacer: (x: T) => any) {
    const resource = this.resources.find((resource) =>
      Object.keys(resource.exports).includes(resourceName)
    );

    if (resource) {
      const modified = replacer(resource.exports[resourceName]);
      const toBeModified = require(`../resources/${resource.baseFile}`)[
        resourceName
      ];

      for (const prop of Object.getOwnPropertyNames(modified.prototype)) {
        Object.defineProperty(
          toBeModified.prototype,
          prop,
          Object.getOwnPropertyDescriptor(modified.prototype, prop)
        );
      }

      // Static methods
      for (const prop of Object.getOwnPropertyNames(modified).filter(
        (prop) => !["prototype"].includes(prop)
      )) {
        Object.defineProperty(
          toBeModified,
          prop,
          Object.getOwnPropertyDescriptor(modified, prop)
        );
      }
    }
  }

  overrideResources<T>(resources: string[], replacer: (x: T) => any) {
    for (const resource of resources) {
      this.overrideResource(resource, replacer)
    }
  }
}
