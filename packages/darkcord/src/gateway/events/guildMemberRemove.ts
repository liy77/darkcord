import { Events } from "@utils/Constants";
import { GatewayGuildMemberRemoveDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildMemberRemove extends Event {
  run(data: GatewayGuildMemberRemoveDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const user = this.client.cache.users.add(data.user);
    guild.members.cache.delete(user.id);

    this.client.emit(Events.GuildMemberRemove, user, guild);
  }
}
