import { GatewayGuildScheduledEventUserRemoveDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildScheduledEventUserRemove extends Event {
  run(data: GatewayGuildScheduledEventUserRemoveDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;
    const event = guild.scheduledEvents.get(data.guild_scheduled_event_id);
    const user = this.client.cache.users.get(data.user_id);

    this.client.emit("guildScheduledEventUserRemove", event, user);
  }
}
