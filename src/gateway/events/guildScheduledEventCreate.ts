import { GatewayGuildScheduledEventCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { ScheduledEvent } from "@resources/Guild";

export class GuildScheduledEventCreate extends Event {
  run(data: GatewayGuildScheduledEventCreateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;
    const event = new ScheduledEvent(data, guild);

    guild.scheduledEvents.set(event.id, event);

    this.client.emit("guildScheduledEventCreate", event);
  }
}
