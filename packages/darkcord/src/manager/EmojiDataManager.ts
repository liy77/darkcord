import { CacheManager } from "@cache/CacheManager";
import { Emoji } from "@resources/Emoji";
import { Guild } from "@resources/Guild";
import { BaseCacheOptions } from "@typings/index";
import { Partials } from "@utils/Constants";
import { APIEmoji, APIGuild } from "discord-api-types/v10";
import { DataManager } from "./DataManager";

export class EmojiDataManager extends DataManager<Emoji | APIEmoji> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
  ) {
    super(options, (get, id) => {
      const emoji = get(id);
      return emoji && this.#resolve(emoji);
    });
  }

  get(id: string) {
    return this.cache.get(id);
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
    return super.add(this.#resolve(emoji), replace, emoji.id || emoji.name!);
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

export class GuildEmojiDataManager extends EmojiDataManager {
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
