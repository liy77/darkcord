import { Events } from "@utils/Constants";
import { GatewayGuildRoleDeleteDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildRoleDelete extends Event {
  run(data: GatewayGuildRoleDeleteDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const deleted = guild.roles.get(data.role_id);

    this.client.emit(Events.GuildRoleDelete, deleted, guild);
  }
}
