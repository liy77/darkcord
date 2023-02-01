import { GatewayShard } from "gateway/Gateway";
import { Client } from "./Client";

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

    gatewayShard.on("connect", () => this.client.emit("shardConnect", id));
    gatewayShard.on("ready", () => this.client.emit("shardReady", id));
    gatewayShard.on("preReady", () => this.client.emit("shardPreReady", id));
    gatewayShard.on("reconnecting", () => this.client.emit("reconnecting"));
    gatewayShard.on("ping", (ping) => this.client.emit("shardPing", ping, id));
    gatewayShard.on("hello", () => this.client.emit("shardHello", id));
    gatewayShard.on("reconnectRequired", () =>
      this.client.emit("shardReconnectRequired", id)
    );
    gatewayShard.on("debug", (message) =>
      this.client.emit("shardDebug", message)
    );

    this.shards.set(id, gatewayShard);

    await gatewayShard.connect();
  }

  allReady() {
    return [...this.shards.values()].every((shard) => shard.ready && shard.pendingGuilds === 0);
  }

  /**
   * Emits "ready" event to client if all shards has ready
   */
  fireClientReady() {
    // Checking if all shards has ready
    if (this.allReady() && !this.client.isReady && this.client.user && this.client.application) {

      this.client.isReady = true;
      this.client.readyAt = Date.now();
      this.client.emit("ready");
    }
  }
}
