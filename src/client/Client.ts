import { CacheManager } from "@cache/CacheManager";
import { Interaction } from "@resources/Interaction";
import { User } from "@resources/User";
import {
  BaseClientOptions,
  ClientEvents,
  ClientOptions,
  InteractionClientEvents,
  InteractionClientOptions,
} from "@typings/index";
import { bitsArrayToBits, MakeError } from "@utils/index";
import {
  ApplicationFlags,
  GatewayPresenceUpdateData,
} from "discord-api-types/v10";
import EventEmitter from "node:events";

import { Rest } from "../rest/Rest";
import { WebServer } from "./WebServer";
import { WebSocket } from "./WebSocket";
import { PluginManager } from "@utils/PluginManager";
import { ClientApplication } from "../resources/Application";

export declare interface BaseClient<E extends Record<string, any>> {
  on<T extends keyof E>(event: T, listener: (...args: E[T]) => any): this;
  on(event: keyof E, listener: (...args: any[]) => any): this;
  once<T extends keyof E>(event: T, listener: (...args: E[T]) => any): this;
  once(event: keyof E, listener: (...args: any[]) => any): this;
  emit<T extends keyof E>(event: T, ...args: E[T]): boolean;
  emit(event: keyof E, ...args: any[]): boolean;
}

export class BaseClient<E> extends EventEmitter {
  /** Client rest to make requests */
  rest: Rest;
  /**
   * Client options
   */
  options: BaseClientOptions;
  /**
   * Application of this client
   */
  application: ClientApplication | null;
  /**
   * Client has ready
   */
  isReady: boolean;
  /**
   * Time that the bot was ready
   */
  readyAt: number;

  constructor(options?: BaseClientOptions) {
    super();

    if (!options || typeof options !== "object") {
      options = {
        partials: [],
      };
    }

    options.partials ??= [];

    this.isReady = false;
    this.options = options;
    this.rest = new Rest();
  }

  /**
   * Decorator to listen event
   * @param event the event for target
   * @returns
   */
  listen(event: keyof E) {
    return (target: any) => {
      this.on(event, target);
    };
  }

  connect() {}
}

export class InteractionClient extends BaseClient<InteractionClientEvents> {
  webserver: WebServer;
  declare options: InteractionClientOptions;
  cache: CacheManager;
  user: User | null;
  constructor(public publicKey: string, options?: InteractionClientOptions) {
    super(options);

    if (!options || typeof options !== "object") {
      throw new TypeError("Invalid client options");
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!options.webserver || typeof options.webserver !== "object") {
      throw new TypeError("Invalid webserver options");
    }

    if (!publicKey || typeof publicKey !== "string")
      throw MakeError({
        name: "InvalidPublicKey",
        message: "Invalid public key was provided.",
      });

    if (
      options.rest?.token &&
      (!options.rest.token || typeof options.rest.token !== "string")
    ) {
      throw MakeError({
        name: "InvalidToken",
        message: "Invalid token was provided.",
      });
    }

    this.user = null;
    this.rest.token = options.rest?.token?.replace(/^(Bot|Bearer)\s*/i, "");

    if (this.rest.token) {
      this.rest.requestHandler.setToken(this.rest.token);
    }

    this.webserver = new WebServer(this, options.webserver);
    this.cache = new CacheManager(this);

    this.webserver.on("listen", async () => {
      this.readyAt = Date.now();
      this.isReady = true;

      this.emit("connect");
    });

    this.webserver.on("interactionDataReceived", (body, res) => {
      this.emit(
        "interactionCreate",
        Interaction.from({ ...body, client: this }, res)
      );
    });
  }

  async connect() {
    const rawApplication = await this.rest.getCurrentApplication();
    this.application = new ClientApplication({
      ...rawApplication,
      client: this,
    });

    await this.webserver.listen();
  }
}

export class Client extends BaseClient<ClientEvents> {
  /**
   * Client token
   */
  token: string;
  declare options: Required<ClientOptions>;
  /**
   * Client application id
   */
  applicationId: string;
  /**
   * Client application flags
   */
  applicationFlags: ApplicationFlags;
  /**
   * The client cache
   */
  cache: CacheManager;
  /**
   * Client websocket manager for shards
   */
  websocket: WebSocket;
  /**
   * Client user
   */
  user: User | null;
  /**
   * Plugin manager for library plugins
   */
  pluginManager: PluginManager;
  constructor(token: string, options: ClientOptions) {
    super(options);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!options || typeof options !== "object") {
      throw new TypeError("Invalid client options");
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!options.gateway || typeof options.gateway !== "object") {
      throw new TypeError("Invalid gateway options");
    }

    options.gateway.compress = Boolean(options.gateway.compress);

    if (!options.gateway.encoding) {
      let Erlpack: boolean;

      try {
        Erlpack = Boolean(require("erlpack"));
      } catch {
        Erlpack = false;
      }

      options.gateway.encoding = Erlpack ? "etf" : "json";
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!options.gateway.intents) {
      throw MakeError({
        name: "MissingIntents",
        message: "Valid intents must be provided for the client",
      });
    }

    if (Array.isArray(options.gateway.intents)) {
      options.gateway.intents = bitsArrayToBits(options.gateway.intents);
    }

    if (
      options.gateway.totalShards &&
      typeof options.gateway.totalShards !== "number"
    ) {
      options.gateway.totalShards = undefined;
    }

    options.gateway.disabledEvents ??= [];

    this.pluginManager = new PluginManager(this);
    if (options.plugins.length) {
      for (const plugin of options.plugins) {
        this.pluginManager.load(plugin);
      }
    }

    this.options = Object.assign<Required<ClientOptions>, any>(
      options as Required<ClientOptions>,
      super.options
    );

    if (!token || typeof token !== "string")
      throw MakeError({
        name: "InvalidToken",
        message: "Invalid token was provided.",
      });

    this.rest.token = this.token = token.replace(/^(Bot|Bearer)\s*/i, "");
    this.rest.requestHandler.setToken(this.token);

    this.cache = new CacheManager(this);
    this.websocket = new WebSocket(this);

    // This is set in ready
    this.user = null;
    this.application = null;
  }

  connect() {
    return this.websocket.connect();
  }

  disconnect() {
    return this.websocket.disconnect();
  }

  setStatus(data: GatewayPresenceUpdateData) {
    this.websocket.setStatus(data);
    return data;
  }

  setShardStatus(shardId: string | number, data: GatewayPresenceUpdateData) {
    this.websocket.setShardStatus(String(shardId), data);
    return {
      shardId,
      status: data,
    };
  }

  get shards() {
    return this.websocket.shards;
  }
}
