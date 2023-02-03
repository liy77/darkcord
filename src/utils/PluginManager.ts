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
import { ClientEvents } from "@typings/index";
import { MakeError } from "@utils/index";
import { join as JOIN } from "node:path";

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

export interface PluginObject {
  name: string;
  version: string;
  load(): void;
  onStart(): void;
}

export type PluginFn = (manager: PluginManager) => PluginObject;

export class PluginManager {
  resources: ResourceObject[];
  plugins: Map<string, PluginObject>;

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

    this.plugins = new Map();
  }

  addProperty<T>(key: string, value: T) {
    return (this.client[key] = value);
  }

  emit(event: string, ...args: any[]) {
    this.client.emit(event as keyof ClientEvents, ...args);
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

  /**
   * Extends a resource
   * @param resourceName resource to be extended
   * @param replacer replacer to extend resource
   */
  extends<T>(resourceName: string, replacer: (x: T) => any) {
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
          Object.getOwnPropertyDescriptor(
            modified.prototype,
            prop
          ) as PropertyDescriptor
        );
      }

      // Static methods
      for (const prop of Object.getOwnPropertyNames(modified).filter(
        (prop) => !["prototype"].includes(prop)
      )) {
        Object.defineProperty(
          toBeModified,
          prop,
          Object.getOwnPropertyDescriptor(modified, prop) as PropertyDescriptor
        );
      }
    }
  }

  /**
   * 
   * @param resources resources names to be extended's
   * @param replacer replacer to extends resources
   */
  extendsMultiple<T>(resources: string[], replacer: (x: T) => any) {
    for (const resource of resources) {
      this.extends(resource, replacer);
    }
  }

  /**
   * 
   * @param path Path of file to be override
   * @param replacer replacer function to replace file
   */
  override<T>(path: string, replacer: (x: T) => any) {
    path = JOIN("../", path);

    const fullPath = require.resolve(path);
    const modified = replacer(require(fullPath));
    const original = require(fullPath);

    for (const prop of Object.getOwnPropertyNames(modified)) {
      original[prop] = modified[prop]
    }
  }

  load(pluginFn: PluginFn) {
    const plugin = pluginFn(this);

    if (!plugin.name) {
      throw MakeError({
        name: "MissingPluginName",
        message: "The plugin needs to have a name",
      });
    }

    let err: Error | undefined;
    try {
      plugin.load();
      plugin.onStart();
    } catch (e) {
      err = e instanceof Error ? e : new Error(e);
    }

    if (err) {
      const PluginError = new Error(
        `Failed to load Plugin \x1b[37m${plugin.name}\x1b[0m: ${err.message}`
      );

      PluginError.name = "PluginError";
      PluginError.stack = err.stack;
      PluginError.cause = err.cause;

      throw PluginError;
    }

    this.plugins.set(plugin.name, plugin);
  }
}
