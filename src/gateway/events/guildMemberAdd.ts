import { Member } from "@resources/Member";
import { Events } from "@utils/Constants";
import { GatewayGuildMemberAddDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildMemberAdd extends Event {
  run(data: GatewayGuildMemberAddDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const member = new Member(data, guild);
    guild.members.add(member);

    this.client.emit(Events.GuildMemberAdd, member, guild);
  }
}
