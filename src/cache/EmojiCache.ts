import { Emoji } from "@resources/Emoji";
import { Guild } from "@resources/Guild";
import { BaseCacheOptions } from "@typings/index";
import { Partials } from "@utils/Constants";
import { APIEmoji, APIGuild } from "discord-api-types/v10";

import { Cache } from "./Cache";
import { CacheManager } from "./CacheManager";

export class EmojiCache extends Cache<Emoji | APIEmoji> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager
  ) {
    super(options, manager.adapter);
  }

  get(id: string) {
    let emoji = super.get(id);

    if (
      emoji &&
      !this.manager._partial(Partials.Emoji) &&
      !(emoji instanceof Emoji)
    ) {
      emoji = new Emoji(emoji);
      this.add(emoji);
    }

    return emoji;
  }

  add(emoji: Emoji | APIEmoji, replace = true) {
    return super._add(emoji, replace, emoji.id);
  }

  /**
   *
   * @param id emoji id
   * @param guild Guild object or Guild Id
   */
  async fetch(id: string, guild: APIGuild | Guild | string) {
    const emoji = await this.manager.client.rest.getEmoji(
      typeof guild === "string" ? guild : guild.id,
      id
    );

    return this.add(emoji);
  }
}

export class GuildEmojiCache extends EmojiCache {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
    public guild: Guild
  ) {
    super(options, manager);
  }

  fetch(id: string) {
    return super.fetch(id, this.guild);
  }
}
