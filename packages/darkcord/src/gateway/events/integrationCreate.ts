import { GatewayIntegrationCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { Integration } from "@resources/Integration";
import { Events } from "@utils/Constants";

export class IntegrationCreate extends Event {
  run(data: GatewayIntegrationCreateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const integration = new Integration(data, guild);

    this.client.emit(Events.IntegrationCreate, integration);
  }
}
