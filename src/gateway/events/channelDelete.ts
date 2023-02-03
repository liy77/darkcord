import { Guild } from "@resources/Guild";
import { GatewayChannelDeleteDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class ChannelDelete extends Event {
  run(data: GatewayChannelDeleteDispatchData) {
    const channel = structuredClone(this.client.cache.channels.get(data.id));

    let guild: Guild | undefined;

    if ("guild_id" in data) {
      guild = this.getGuild(data.guild_id!);
    }

    if (guild) {
      guild.channels.delete(data.id);
    }

    this.client.cache.channels.delete(data.id);

    this.client.emit(Events.ChannelDelete, channel);
  }
}
