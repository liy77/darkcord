/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Events, ShardEvents } from "@utils/Constants";
import { DiscordAPIError, InvalidTokenError, MakeError } from "@darkcord/utils";
import {
  GatewayPresenceUpdateData,
  GatewaySendPayload,
} from "discord-api-types/v10";
import { GatewayShard } from "@darkcord/ws";
import { Client } from "./Client";
import { EventSource } from "../gateway/EventSource";

export class WebSocket {
  shards: Map<string, GatewayShard>;
  constructor(public client: Client) {
    this.shards = new Map();
  }

  get ping() {
    let ping = 0;
    for (const shard of this.shards.values()) {
      ping += shard.ping;
    }
    return ping / this.shards.size;
  }

  async handleShard(gatewayShard: GatewayShard) {
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
    const gateway = await this.client.rest
      .getGateway()
      .catch((err: DiscordAPIError) => {
        throw err.status === 401 ? InvalidTokenError : err;
      });

    this.client.emit(Events.Debug, "Starting Shards...");

    let totalShards = this.client.options.gateway.totalShards;

    if (!totalShards) {
      totalShards = gateway.shards;

      this.client.emit(
        Events.Debug,
        `Using recommend shards count provided by Discord: ${gateway.shards}`,
      );
    }

    const compress = this.client.options.gateway.compress;

    for (let id = 0; id < totalShards; id++) {
      const shard = new GatewayShard(this.client as any, new EventSource(), {
        compress,
        shardId: id.toString(),
        encoding: this.client.options.gateway.encoding,
      });

      // Handling shard
      await this.handleShard(shard);
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
