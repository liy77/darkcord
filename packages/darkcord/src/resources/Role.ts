import { DataWithClient, KeysToCamelCase } from "@typings/index";
import type {
  APIRole,
  APIRoleTags,
  RESTPatchAPIGuildRoleJSONBody,
} from "discord-api-types/v10";

import { roleMention } from "@utils/Constants";
import { Base } from "./Base";
import { Guild } from "./Guild";
import { Permissions } from "./Permission";

export class Role extends Base {
  /**
   * Role name
   */
  name: string;
  /**
   * Integer representation of hexadecimal color code
   */
  color: number;
  /**
   * If this role is pinned in the user listing
   */
  hoist: boolean;
  /**
   * Role icon hash
   */
  icon?: string | null;
  /**
   * Role unicode emoji
   */
  unicodeEmoji?: string | null;
  /**
   * Position of this role
   */
  position: number;
  /**
   * Permission bit set
   */
  permissions: Permissions;
  /**
   * Whether this role is managed by an integration
   */
  managed: boolean;
  /**
   * Whether this role is mentionable
   */
  mentionable: boolean;
  /**
   * The tags this role has
   */
  tags?: APIRoleTags;

  constructor(data: DataWithClient<APIRole>, public guild: Guild) {
    super(data);

    this._update(data);
  }

  _update(data: APIRole) {
    this.name = data.name;
    this.color = data.color;
    this.hoist = Boolean(data.hoist);
    this.icon = data.icon;
    this.position = data.position;
    this.mentionable = Boolean(data.mentionable);
    this.tags = data.tags;
    this.permissions = new Permissions(BigInt(data.permissions));
    this.managed = Boolean(data.managed);
    this.unicodeEmoji = data.unicode_emoji;
  }

  setPosition(newPosition: number, reason?: string) {
    return this.guild.setRolePosition(this.id, newPosition, reason);
  }

  edit(
    options: KeysToCamelCase<RESTPatchAPIGuildRoleJSONBody>,
    reason?: string,
  ) {
    return this.guild.editRole(this.id, options, reason);
  }

  toString() {
    return roleMention(this.id);
  }

  toJSON() {
    return Base.toJSON(this as Role, [
      "color",
      "createdAt",
      "guild",
      "hoist",
      "icon",
      "id",
      "managed",
      "mentionable",
      "name",
      "permissions",
      "position",
      "rawData",
      "tags",
      "unicodeEmoji",
    ]);
  }
}
