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
    public manager: CacheManager,
  ) {
    super(options, manager.adapter);
  }

  get(id: string) {
    const emoji = super.get(id);
    return emoji && this.#resolve(emoji);
  }

  #resolve(emoji: APIEmoji | Emoji, addInCache = false) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      emoji &&
      !this.manager._partial(Partials.Emoji) &&
      !(emoji instanceof Emoji)
    ) {
      emoji = new Emoji(emoji);
      if (addInCache) this.add(emoji);
    }

    return emoji;
  }

  add(emoji: Emoji | APIEmoji, replace = true) {
    return super._add(
      this.#resolve(emoji),
      replace,
      (emoji.id || emoji.name) as string,
    );
  }

  /**
   *
   * @param id emoji id
   * @param guild Guild object or Guild Id
   */
  async fetch(id: string, guild: APIGuild | Guild | string) {
    const emoji = await this.manager.client.rest.getEmoji(
      typeof guild === "string" ? guild : guild.id,
      id,
    );

    return this.add(emoji);
  }
}

export class GuildEmojiCache extends EmojiCache {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
    public guild: Guild,
  ) {
    super(options, manager);
  }

  fetch(id: string) {
    return super.fetch(id, this.guild);
  }
}
