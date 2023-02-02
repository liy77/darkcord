import { GatewayGuildEmojisUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class GuildEmojisUpdate extends Event {
  run(data: GatewayGuildEmojisUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const oldEmojis = structuredClone(guild.emojis);
    for (const emoji of data.emojis) {
      guild.emojis.add(emoji);
    }

    this.client.emit(Events.GuildEmojisUpdate, oldEmojis, guild.emojis, guild);
  }
}
