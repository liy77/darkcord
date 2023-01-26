import { GatewayGuildScheduledEventDeleteDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildScheduledEventDelete extends Event {
  run(data: GatewayGuildScheduledEventDeleteDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;
    const deleted = structuredClone(guild.scheduledEvents.get(data.id));
    guild.scheduledEvents.delete(data.id);

    this.client.emit("guildScheduledEventDelete", deleted);
  }
}
