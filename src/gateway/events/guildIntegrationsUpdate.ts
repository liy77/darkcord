import { Events } from "@utils/Constants";
import { GatewayGuildIntegrationsUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildIntegrationsUpdate extends Event {
  run(data: GatewayGuildIntegrationsUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    this.client.emit(Events.GuildIntegrationsUpdate, guild);
  }
}
