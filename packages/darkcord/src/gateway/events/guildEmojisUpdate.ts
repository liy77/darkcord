import { Events } from "@utils/Constants";
import { GatewayGuildEmojisUpdateDispatchData } from "discord-api-types/v10";
import { DataCache } from "../../manager/DataManager";
import { Event } from "./Event";

export class GuildEmojisUpdate extends Event {
  run(data: GatewayGuildEmojisUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const deleted = new DataCache(guild.emojis.cache);
    const oldEmojis = new DataCache(guild.emojis.cache);
    for (const rawmoji of data.emojis) {
      const emoji = guild.emojis.cache.get(rawmoji.id!);

      if (emoji) {
        deleted.delete(emoji.id!);
        this.client.emit(
          Events.GuildEmojiUpdate,
          emoji,
          guild.emojis.add(rawmoji),
        );
      } else {
        this.client.emit(Events.GuildEmojiCreate, guild.emojis.add(rawmoji));
      }
    }

    for (const emoji of deleted.values()) {
      this.client.emit(Events.GuildEmojiDelete, emoji);
      guild.emojis.cache.delete(emoji.id!);
    }

    this.client.emit(
      Events.GuildEmojisUpdate,
      oldEmojis,
      guild.emojis.cache,
      guild,
    );
  }
}
