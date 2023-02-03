import { Invite } from "@resources/Invite";
import { GatewayInviteCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { Events } from "@utils/Constants";

export class InviteCreate extends Event {
  run(data: GatewayInviteCreateDispatchData) {
    const guild = this.getGuild(data.guild_id!);

    if (!guild) return;
    const channel = this.client.cache.channels.get(data.channel_id);

    const invite = new Invite({
      ...data,
      channel: channel!.rawData,
      client: this.client,
    });

    guild.invites.set(invite.code, invite);
    this.client.emit(Events.InviteCreate, invite);
  }
}
