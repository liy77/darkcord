import { GatewayGuildDeleteDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildDelete extends Event {
  run(data: GatewayGuildDeleteDispatchData) {
    const deleted = structuredClone(this.getGuild(data.id));

    this.client.cache.guilds.delete(data.id);

    this.client.emit("guildDelete", deleted);
  }
}
