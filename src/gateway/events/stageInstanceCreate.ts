import { Events } from "@utils/Constants";
import { GatewayStageInstanceCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class StageInstanceCreate extends Event {
  run(data: GatewayStageInstanceCreateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    guild.stageInstances.set(data.id, data);

    this.client.emit(Events.StageInstanceCreate, data);
  }
}
