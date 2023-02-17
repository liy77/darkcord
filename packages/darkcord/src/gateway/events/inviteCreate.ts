import { Invite } from "@resources/Invite";
import { GatewayInviteCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { Events } from "@utils/Constants";
import { InviteGuild } from "../../resources/Guild";

export class InviteCreate extends Event {
  run(data: GatewayInviteCreateDispatchData) {
    const guild = this.getGuild(data.guild_id!)

    const channel = this.client.channels.cache.get(data.channel_id);

    const invite = new Invite({
      guild: guild?.rawData,
      channel: channel!.rawData,
      client: this.client,
      ...data
    });

    if (guild) {
      guild.invites.set(invite.code, invite);
    }
    
    this.client.emit(Events.InviteCreate, invite);
  }
}
