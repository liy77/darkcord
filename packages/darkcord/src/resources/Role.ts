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
    if ("name" in data) this.name = data.name;
    if ("color" in data) this.color = data.color;
    if ("hoist" in data) this.hoist = Boolean(data.hoist);
    else this.hoist ??= false;
    if ("icon" in data) this.icon = data.icon;
    if ("position" in data) this.position = data.position;
    if ("mentionable" in data) this.mentionable = Boolean(data.mentionable);
    else this.mentionable ??= false;
    if ("tags" in data) this.tags = data.tags;
    if ("permissions" in data)
      this.permissions = new Permissions(BigInt(data.permissions));
    if ("managed" in data) this.managed = Boolean(data.managed);
    else this.managed ??= false;
    if ("unicode_emoji" in data) this.unicodeEmoji = data.unicode_emoji;

    this.rawData = Object.assign({}, data, this.rawData);

    return this;
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

  /**
   * Update information of this role
   *
   * Util if this is forged
   * @returns
   */
  async fetchInformation() {
    const data = await this._client.rest.getRoles(this.id);
    return this._update((data.find((r) => r.id === this.id) as APIRole) ?? {});
  }

  get forged() {
    return Boolean(this.id && !this.color && !this.name);
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
