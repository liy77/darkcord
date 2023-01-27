import { Guild } from "@resources/Guild";
import { GatewayGuildUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";

export class GuildUpdate extends Event {
  run(data: GatewayGuildUpdateDispatchData) {
    const old = structuredClone(this.getGuild(data.id));

    if (old) {
      const updated = this.client.cache.guilds._add(
        new Guild({ ...data, client: this.client })
      );

      this.client.emit("guildUpdate", old, updated);
    }
  }
}
