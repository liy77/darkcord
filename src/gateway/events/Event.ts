import { User } from "@resources/User";
import { Awaitable } from "@typings/index";
import { APIUser } from "discord-api-types/v10";
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

  getUser(id: string): Awaitable<User | APIUser> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return this.client.cache.users.get(id) || this.client.cache.users.fetch(id)
  }
}
