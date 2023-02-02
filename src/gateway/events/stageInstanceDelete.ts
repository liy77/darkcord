import { Events } from "@utils/Constants";
import { GatewayStageInstanceDeleteDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class StageInstanceDelete extends Event {
  run(data: GatewayStageInstanceDeleteDispatchData) {
    const guild = this.getGuild(data.guild_id);

    guild.stageInstances.delete(data.id);

    this.client.emit(Events.StageInstanceDelete, data);
  }
}
