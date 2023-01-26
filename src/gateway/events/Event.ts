import { GatewayShard } from "gateway/Gateway";

export abstract class Event {
  constructor(public gatewayShard: GatewayShard) {}

  abstract run(data: any): any;

  get client() {
    return this.gatewayShard.client;
  }

  get shardId() {
    return this.gatewayShard.shardId;
  }

  getGuild(id: string) {
    return this.client.cache.guilds.get(id);
  }
}
