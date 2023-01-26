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
import { APIGatewayBotInfo, ApplicationFlags } from "discord-api-types/v10";
import EventEmitter from "node:events";

import { GatewayShard } from "../gateway/Gateway";
import { Rest } from "../rest/Rest";
import { WebServer } from "./WebServer";
import { WebSocket } from "./WebSocket";
import { PluginManager } from "@utils/PluginManager";

export declare interface BaseClient<E extends Record<string, any>> {
  on<T extends keyof E>(event: T, listener: (...args: E[T]) => any): this;
  on(event: string, listener: (...args: any[]) => any): this;
  once<T extends keyof E>(event: T, listener: (...args: E[T]) => any): this;
  once(event: string, listener: (...args: any[]) => any): this;
  emit<T extends keyof E>(event: T, ...args: E[T]): boolean;
  emit(event: string, ...args: any[]): boolean;
}

export class BaseClient<E> extends EventEmitter {
  rest: Rest;
  options: BaseClientOptions;

  constructor(options?: BaseClientOptions) {
    super();

    options.partials ??= [];

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
  user: User;
  constructor(public publicKey: string, options?: InteractionClientOptions) {
    super(options);

    if (!publicKey || typeof publicKey !== "string")
      throw MakeError({
        name: "InvalidPublicKey",
        message: "Invalid public key was provided.",
      });

    if (
      options.rest?.token &&
      (!options.rest?.token || typeof options.rest?.token !== "string")
    )
      throw MakeError({
        name: "InvalidToken",
        message: "Invalid token was provided.",
      });

    this.user = null;
    this.rest.token = options.rest?.token.replace(/^(Bot|Bearer)\s*/i, "");

    if (this.rest.token) {
      this.rest.requestHandler.setToken(this.rest.token);
    }

    this.webserver = new WebServer(this, options.webserver);
    this.cache = new CacheManager(this);

    this.webserver.on("listen", () => this.emit("connect"));
    this.webserver.on("interactionDataReceived", (body, res) => {
      this.emit(
        "interactionCreate",
        Interaction.from({ ...body, client: this }, res)
      );
    });
  }

  async connect() {
    await this.webserver.listen();
  }
}

export class Client extends BaseClient<ClientEvents> {
  token: string;
  declare options: Required<ClientOptions>;
  applicationId: string;
  applicationFlags: ApplicationFlags;
  cache: CacheManager;
  websocket: WebSocket;
  user!: User;
  pluginManager: PluginManager;
  constructor(token: string, options: ClientOptions) {
    super(options);

    if (!options) {
      throw new TypeError("Missing Options");
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

    if (!options.gateway.intents) {
      throw MakeError({
        name: "MissingIntents",
        message: "valid intents must be provided for the client",
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

    this.pluginManager = new PluginManager(this);
    if (options.plugins?.length) {
      for (const plugin of options.plugins) {
        plugin(this.pluginManager);
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
  }

  async connect() {
    const compress = this.options?.gateway?.compress;
    let gateway: APIGatewayBotInfo;

    try {
      gateway = await this.rest.getGateway();
    } catch {
      throw MakeError({
        name: "InvalidToken",
        message: "Invalid token was provided.",
      });
    }

    const totalShards = this.options.gateway.totalShards ?? gateway.shards;

    for (let id = 0; id < totalShards; id++) {
      const shard = new GatewayShard(this, {
        compress,
        shardId: id.toString(),
        encoding: this.options.gateway?.encoding,
      });

      await this.websocket.handleShard(shard);
    }
  }
}
