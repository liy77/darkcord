import { GatewayShard } from "gateway/Gateway";
import { Client } from "./Client";

export class WebSocket {
  shards: Map<string, GatewayShard>;
  constructor(public client: Client) {
    this.shards = new Map()
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

    this.shards.set(id, gatewayShard);

    await gatewayShard.connect();
  }

  allReady() {
    return [...this.shards.values()].every((shard) => shard.ready);
  }
}
