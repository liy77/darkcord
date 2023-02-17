import { User } from "@resources/User";
import { Awaitable } from "@typings/index";
import { APIUser } from "discord-api-types/v10";
import { GatewayShard } from "@darkcord/ws";
import type { Client } from "@client/Client";

export abstract class Event {
  constructor(public gatewayShard: GatewayShard) {}

  abstract run(data: any): any;

  get client() {
    return this.gatewayShard.client as unknown as Client;
  }

  get shardId() {
    return this.gatewayShard.shardId;
  }

  getGuild(id: string) {
    return this.client.guilds.cache.get(id);
  }

  getUser(id: string): Awaitable<User | APIUser> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return this.client.users.cache.get(id) || this.client.users.fetch(id);
  }
}
