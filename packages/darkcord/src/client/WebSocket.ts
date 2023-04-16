/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Events, ShardEvents } from "@utils/Constants";
import { DiscordAPIError, InvalidTokenError, MakeError } from "@darkcord/utils";
import {
  APIGatewayBotInfo,
  GatewayPresenceUpdateData,
  GatewaySendPayload,
} from "discord-api-types/v10";
import { GatewayShard, GatewayStatus } from "@darkcord/ws";
import { Client } from "./Client";
import { EventSource } from "../gateway/EventSource";
import { Cache } from "@cache/Cache";

export class WebSocket {
  shards: Cache<GatewayShard>;
  #queue: GatewayShard[];
  #buckets: Record<number, number>;
  totalShards: number;
  maxConcurrency: number;
  #connectTimeout: NodeJS.Timeout | null;
  constructor(public client: Client) {
    this.shards = new Cache();
    this.#queue = [];
    this.#buckets = {};
    this.#connectTimeout = null;
  }

  get ping() {
    let ping = 0;
    for (const shard of this.shards.values()) {
      ping += shard.ping;
    }
    return ping / this.shards.size;
  }

  async handleShards() {
    if (this.#queue.length === 0) {
      return;
    }

    const maxConcurrency =
      this.maxConcurrency || this.client.options.gateway.concurrency;

    for (const shard of this.#queue) {
      const ratelimitKey = Number(shard.shardId) % maxConcurrency ?? 0;
      const lastConnect = this.#buckets[ratelimitKey] ?? 0;

      if (!shard.sessionId && Date.now() - lastConnect < 5_000) {
        continue;
      }

      if (
        this.shards.some((s) => {
          const _ratelimitKey = Number(shard.shardId) % maxConcurrency ?? 0;
          return (
            s.status === GatewayStatus.Connecting &&
            _ratelimitKey === ratelimitKey
          );
        })
      ) {
        continue;
      }

      // Handling shard
      await this.handleShard(shard);
      this.#buckets[ratelimitKey] = Date.now();
    }
  }

  async handleShard(gatewayShard: GatewayShard) {
    const _existing = this.#queue.findIndex(
      (s) => s.shardId === gatewayShard.shardId,
    );

    if (_existing !== -1) {
      this.#queue.splice(_existing, 1);
    }

    const id = gatewayShard.shardId;

    this.client.emit(Events.Debug, `Starting connecting Shard ${id}`);

    gatewayShard.on(ShardEvents.Connect, () =>
      this.client.emit(Events.ShardConnect, id),
    );
    gatewayShard.on(ShardEvents.Ready, () =>
      this.client.emit(Events.ShardReady, id),
    );
    gatewayShard.on(ShardEvents.PreReady, () =>
      this.client.emit(Events.ShardPreReady, id),
    );
    gatewayShard.on(ShardEvents.Reconnecting, () =>
      this.client.emit(Events.Reconnecting),
    );
    gatewayShard.on(ShardEvents.Ping, (ping) =>
      this.client.emit(Events.ShardPing, ping, id),
    );
    gatewayShard.on(ShardEvents.Hello, () =>
      this.client.emit(Events.ShardHello, id),
    );
    gatewayShard.on(ShardEvents.ReconnectRequired, () =>
      this.client.emit(Events.ShardReconnectRequired, id),
    );
    gatewayShard.on(ShardEvents.Debug, (message) =>
      this.client.emit(Events.ShardDebug, message),
    );

    this.shards.set(id, gatewayShard);

    await gatewayShard.connect();
  }

  async connect() {
    this.client.emit(Events.Debug, "Starting Shards...");

    let totalShards = this.client.options.gateway.totalShards;
    let maxConcurrency = this.client.options.gateway.concurrency;

    let gateway: APIGatewayBotInfo | undefined;

    if (!totalShards || !maxConcurrency) {
      // Fetch gateway
      gateway = await this.client.rest
        .getGateway()
        .catch((err: DiscordAPIError) => {
          throw err.status === 401 ? InvalidTokenError : err;
        });
    }

    if (!totalShards) {
      totalShards = gateway!.shards;

      this.client.emit(
        Events.Debug,
        `Using recommend shards count provided by Discord: ${gateway!.shards}`,
      );
    }

    if (!maxConcurrency) {
      maxConcurrency = gateway!.session_start_limit.max_concurrency;

      this.client.emit(
        Events.Debug,
        `Using max concurrency provided by Discord: ${
          gateway!.session_start_limit.max_concurrency
        }`,
      );
    }

    this.totalShards ??= totalShards;
    this.maxConcurrency ??= maxConcurrency;

    const compress = this.client.options.gateway.compress;

    for (let id = 0; id < totalShards; id++) {
      const shard = new GatewayShard(
        this.client as any,
        new EventSource() as any,
        {
          compress,
          shardId: id.toString(),
          encoding: this.client.options.gateway.encoding,
        },
      );

      if (gateway) {
        shard.fetchedGateway = gateway;
      }

      this.#queue.push(shard);
    }

    await this.handleShards();

    if (this.#queue.length !== 0 && !this.#connectTimeout) {
      this.#connectTimeout = setTimeout(async () => {
        this.#connectTimeout = null;
        await this.connect();
      }, 500).unref();
    }
  }

  disconnect() {
    this.client.emit(Events.Warn, "Disconnecting all Shards");
    for (const shard of this.shards.values()) {
      shard.close(1_000, "Client Disconnect");
    }
  }

  broadcast(payload: GatewaySendPayload) {
    for (const shard of this.shards.values()) {
      shard.send(payload);
    }
  }

  setStatus(data: GatewayPresenceUpdateData) {
    for (const shard of this.shards.keys()) {
      this.setShardStatus(shard, data);
    }
  }

  setShardStatus(shardId: string, data: GatewayPresenceUpdateData) {
    const shard = this.shards.get(shardId);

    if (!shard) {
      throw MakeError({
        name: "InvalidShardId",
        message: `The shard with id ${shardId} does not exist`,
      });
    }

    shard.sendPresence(data);
  }

  allReady() {
    return [...this.shards.values()].every(
      (shard) => shard.ready && shard.pendingGuilds === 0,
    );
  }

  /**
   * Emits "ready" event to client if all shards has ready
   */
  fireClientReady() {
    // Checking if all shards has ready
    if (
      this.allReady() &&
      !this.client.isReady &&
      this.client.user &&
      this.client.application
    ) {
      this.client.isReady = true;
      this.client.readyAt = Date.now();
      this.client.emit("ready");
    }
  }
}
