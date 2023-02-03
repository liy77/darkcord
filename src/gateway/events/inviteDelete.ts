import { Events } from "@utils/Constants";
import { GatewayInviteDeleteDispatchData } from "discord-api-types/v10";

import { Event } from "./Event";

export class InviteDelete extends Event {
  run(data: GatewayInviteDeleteDispatchData) {
    const guild = this.getGuild(data.guild_id!);

    if (!guild) return;
      
    const deleted = guild.invites.get(data.code);
    this.client.emit(Events.InviteDelete, deleted);
  }
}
