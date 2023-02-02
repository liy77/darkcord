import { GatewayStageInstanceUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class StageInstanceUpdate extends Event {
  run(data: GatewayStageInstanceUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    const old = structuredClone(guild.stageInstances.get(data.id));

    guild.stageInstances.set(data.id, data);

    this.client.emit(Events.StageInstanceUpdate, old, data);
  }
}
