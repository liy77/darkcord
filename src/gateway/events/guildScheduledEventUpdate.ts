import { GatewayGuildScheduledEventUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { ScheduledEvent } from "@resources/Guild";

export class GuildScheduledEventUpdate extends Event {
  run(data: GatewayGuildScheduledEventUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;
    const event = new ScheduledEvent(data, guild);

    const old = structuredClone(guild.scheduledEvents.get(event.id));
    guild.scheduledEvents.set(event.id, event);

    this.client.emit("guildScheduledEventUpdate", old, event);
  }
}
