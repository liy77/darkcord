import { Guild } from "@resources/Guild";
import { GatewayGuildUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class GuildUpdate extends Event {
  run(data: GatewayGuildUpdateDispatchData) {
    const old = structuredClone(this.getGuild(data.id));

    if (old) {
      const updated = this.client.guilds.add(
        new Guild({ ...data, client: this.client }),
      );

      this.client.emit(Events.GuildUpdate, old, updated);
    }
  }
}
