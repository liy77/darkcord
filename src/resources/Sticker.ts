import {
  APISticker,
  StickerFormatType,
  StickerType,
} from "discord-api-types/v10";
import { DataWithClient } from "@typings/index";
import { Base } from "./Base";
import { User } from "./User";

export class Sticker extends Base {
  /**
   * for standard stickers, id of the pack the sticker is from
   */
  packId?: string | undefined;
  /**
   * name of the sticker
   */
  name: string;
  /**
   * description of the sticker
   */
  description: string | null;
  /**
   * autocomplete/suggestion tags for the sticker (max 200 characters)
   */
  tags: string;
  /**
   * type of sticker
   */
  type: StickerType;
  /**
   * type of sticker format
   */
  formatType: StickerFormatType;
  /**
   * whether this guild sticker can be used, may be false due to loss of Server Boosts
   */
  available?: boolean | undefined;
  /**
   * id of the guild that owns this sticker
   */
  guildId?: string | undefined;
  /**
   * the user that uploaded the guild sticker
   */
  user?: User | null;
  /**
   * the standard sticker's sort order within its pack
   */
  sortValue?: number | undefined;

  constructor(data: DataWithClient<APISticker>) {
    super(data);
    this.name = data.name;
    this.packId = data.pack_id;
    this.description = data.description;
    this.tags = data.tags;
    this.type = data.type;
    this.formatType = data.format_type;
    this.available = data.available;
    this.guildId = data.guild_id;
    this.user = data.user
      ? new User({ ...data.user, client: data.client })
      : null;
    this.sortValue = data.sort_value;
  }

  toJSON() {
    return Base.toJSON(this as Sticker, [
      "available",
      "createdAt",
      "description",
      "formatType",
      "guildId",
      "id",
      "name",
      "packId",
      "rawData",
      "sortValue",
      "tags",
      "type",
      "user",
    ]);
  }
}
