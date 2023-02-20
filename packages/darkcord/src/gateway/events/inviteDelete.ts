import { Events } from "@utils/Constants";
import { GatewayInviteDeleteDispatchData } from "discord-api-types/v10";
import { Invite } from "@resources/Invite";

import { Event } from "./Event";

export class InviteDelete extends Event {
  run(data: GatewayInviteDeleteDispatchData) {
    const guild = this.getGuild(data.guild_id!);

    if (!guild) return;

    const deleted =
      guild.invites.get(data.code) ||
      new Invite({
        client: this.client,
        channel: guild.channels.cache.get(data.channel_id),
        code: data.code,
        guild: guild.rawData,
      });

    this.client.emit(Events.InviteDelete, deleted);
  }
}
