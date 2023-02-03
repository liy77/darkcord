import { Channel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import { GatewayChannelUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class ChannelUpdate extends Event {
  run(data: GatewayChannelUpdateDispatchData) {
    const old = structuredClone(this.client.cache.channels.get(data.id));

    let guild: Guild | undefined;

    if ("guild_id" in data) {
      guild = this.getGuild(data.guild_id!);
    }

    const updated = Channel.from({ ...data, client: this.client }, guild);

    if (guild) {
      guild.channels.add(updated);
    }

    this.client.cache.channels.add(updated);

    this.client.emit(Events.ChannelUpdate, old, updated);
  }
}
