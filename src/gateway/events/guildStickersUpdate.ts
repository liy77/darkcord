import { GatewayGuildStickersUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class GuildStickersUpdate extends Event {
  run(data: GatewayGuildStickersUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const oldStickers = structuredClone(guild.stickers.cache);
    for (const sticker of data.stickers) {
      guild.stickers.add(sticker);
    }

    this.client.emit(
      Events.GuildStickersUpdate,
      oldStickers,
      guild.stickers.cache,
      guild,
    );
  }
}
