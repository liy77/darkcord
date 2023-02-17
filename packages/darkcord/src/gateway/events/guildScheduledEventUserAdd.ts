import { Events } from "@utils/Constants";
import { GatewayGuildScheduledEventUserAddDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildScheduledEventUserAdd extends Event {
  async run(data: GatewayGuildScheduledEventUserAddDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;
    const event = guild.scheduledEvents.get(data.guild_scheduled_event_id);
    const user = await this.getUser(data.user_id);

    this.client.emit(Events.GuildScheduledEventUserAdd, event, user);
  }
}
