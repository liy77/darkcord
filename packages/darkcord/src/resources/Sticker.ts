import { DataWithClient } from "@typings/index";
import {
  APISticker,
  StickerFormatType,
  StickerType,
} from "discord-api-types/v10";
import { Base } from "./Base";
import { User } from "./User";

export class Sticker extends Base {
  /**
   * For standard stickers, id of the pack the sticker is from
   */
  packId?: string | undefined;
  /**
   * Name of the sticker
   */
  name: string;
  /**
   * Description of the sticker
   */
  description: string | null;
  /**
   * Autocomplete/suggestion tags for the sticker (max 200 characters)
   */
  tags: string;
  /**
   * Type of sticker
   */
  type: StickerType;
  /**
   * Type of sticker format
   */
  formatType: StickerFormatType;
  /**
   * Whether this guild sticker can be used, may be false due to loss of Server Boosts
   */
  available?: boolean | undefined;
  /**
   * Id of the guild that owns this sticker
   */
  guildId?: string | undefined;
  /**
   * The user that uploaded the guild sticker
   */
  user?: User | null;
  /**
   * The standard sticker's sort order within its pack
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
