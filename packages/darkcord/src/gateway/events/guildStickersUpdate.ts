import { GatewayGuildStickersUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";
import { DataCache } from "../../manager/DataManager";

export class GuildStickersUpdate extends Event {
  run(data: GatewayGuildStickersUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const deleted = new DataCache(guild.stickers.cache);
    const oldStickers = new DataCache(guild.stickers.cache);
    for (const rawsticker of data.stickers) {
      const sticker = guild.stickers.cache.get(rawsticker.id!);

      if (sticker) {
        deleted.delete(sticker.id!);
        this.client.emit(
          Events.GuildStickerUpdate,
          sticker,
          guild.stickers.add(rawsticker),
        );
      } else {
        this.client.emit(
          Events.GuildStickerCreate,
          guild.stickers.add(rawsticker),
        );
      }
    }

    for (const sticker of deleted.values()) {
      this.client.emit(Events.GuildStickerDelete, sticker);
      guild.stickers.cache.delete(sticker.id!);
    }

    this.client.emit(
      Events.GuildStickersUpdate,
      oldStickers,
      guild.stickers.cache,
      guild,
    );
  }
}
