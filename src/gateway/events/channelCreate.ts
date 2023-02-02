import { Channel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import { Events } from "@utils/Constants";
import { GatewayChannelCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class ChannelCreate extends Event {
  run(data: GatewayChannelCreateDispatchData) {
    const existing = this.client.cache.channels.has(data.id);

    let guild: Guild;

    if ("guild_id" in data) {
      guild = this.getGuild(data.guild_id);
    }

    if (!existing) {
        const channel = Channel.from({ ...data, client: this.client }, guild);
        
        this.client.emit(Events.ChannelCreate, channel)
    }
  }
}
