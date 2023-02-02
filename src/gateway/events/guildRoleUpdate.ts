import { GatewayGuildRoleUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class GuildRoleUpdate extends Event {
    run(data: GatewayGuildRoleUpdateDispatchData) {
        const guild = this.getGuild(data.guild_id)

        if (!guild) return

        const old = structuredClone(guild.roles.get(data.role.id))
        const updated = guild.roles.add(data.role)

        this.client.emit(Events.GuildRoleUpdate, old, updated, guild)
    }
}