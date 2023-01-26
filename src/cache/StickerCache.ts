import { Guild } from "@resources/Guild";
import { Sticker } from "@resources/Sticker";
import { BaseCacheOptions } from "@typings/index";
import { Partials } from "@utils/Constants";
import { APIGuild, APISticker } from "discord-api-types/v10";

import { Cache } from "./Cache";
import { CacheManager } from "./CacheManager";

export class StickerCache extends Cache<Sticker | APISticker> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager
  ) {
    super(options, manager.adapter);
  }

  get(id: string) {
    let sticker = super.get(id);

    if (
      !this.manager._partial(Partials.Sticker) &&
      !(sticker instanceof Sticker)
    ) {
      sticker = new Sticker({
        ...sticker,
        client: this.manager.client,
      });
    }

    return sticker;
  }

  add(sticker: Sticker | APISticker, replace = true) {
    return super._add(
      sticker instanceof Sticker ? sticker.partial : sticker,
      replace,
      sticker.id
    );
  }

  /**
   *
   * @param id sticker id
   * @param guild Guild object or Guild Id
   */
  async fetch(id: string, guild: APIGuild | Guild | string) {
    const sticker = await this.manager.client.rest.getGuildSticker(
      typeof guild === "string" ? guild : guild.id,
      id
    );

    return this.add(sticker);
  }
}

export class GuildStickerCache extends StickerCache {
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
