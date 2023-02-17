import { Events } from "@utils/Constants";
import { GatewayGuildRoleCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildRoleCreate extends Event {
  run(data: GatewayGuildRoleCreateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const role = guild.roles.add(data.role);

    this.client.emit(Events.GuildRoleCreate, role, guild);
  }
}
