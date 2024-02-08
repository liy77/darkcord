import { CacheManager } from "@cache/CacheManager";
import { Guild } from "@resources/Guild";
import { Sticker } from "@resources/Sticker";
import { BaseCacheOptions } from "@typings/index";
import { Partials } from "@utils/Constants";
import { APIGuild, APISticker } from "discord-api-types/v10";

import { DataManager } from "./DataManager";

export class StickerDataManager extends DataManager<Sticker | APISticker> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
  ) {
    super(options, (get, id) => {
      const sticker = get(id);
      return sticker && this.#resolve(sticker, true);
    });
  }

  get(id: string) {
    return this.cache.get(id);
  }

  add(sticker: Sticker | APISticker, replace = true) {
    return super.add(this.#resolve(sticker), replace, sticker.id);
  }

  #resolve(sticker: Sticker | APISticker, addInCache = false) {
    if (
      !this.manager._partial(Partials.Sticker) &&
      !(sticker instanceof Sticker)
    ) {
      sticker = new Sticker({
        ...sticker,
        client: this.manager.client,
      });

      if (addInCache) this.add(sticker);
    }

    return sticker;
  }

  /**
   *
   * @param id sticker id
   * @param guild Guild object or Guild Id
   */
  async _fetch(
    id: string,
    guild: APIGuild | Guild | string,
    addInCache = true,
  ): Promise<APISticker> {
    const sticker = await this.manager.client.rest.getGuildSticker(
      typeof guild === "string" ? guild : guild.id,
      id,
    );

    if (addInCache) {
      return this.add(sticker);
    }

    return sticker;
  }
}

export class GuildStickerDataManager extends StickerDataManager {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
    public guild: Guild,
  ) {
    super(options, manager);
  }

  fetch(id: string, addInCache = true) {
    return super._fetch(id, this.guild, addInCache);
  }
}
