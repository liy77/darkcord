import { DataWithClient, KeysToCamelCase } from "@typings/index";
import { APIRole, APIRoleTags, RESTPatchAPIGuildRoleJSONBody } from "discord-api-types/v10";

import { Base } from "./Base";
import { Guild } from "./Guild";
import { Permissions } from "./Permission";
import { roleMention } from "@utils/Constants";

export class Role extends Base {
  /**
   * role name
   */
  name: string;
  /**
   * integer representation of hexadecimal color code
   */
  color: number;
  /**
   * if this role is pinned in the user listing
   */
  hoist: boolean;
  /**
   * role icon hash
   */
  icon?: string;
  /**
   * role unicode emoji
   */
  unicodeEmoji?: string;
  /**
   * position of this role
   */
  position: number;
  /**
   * permission bit set
   */
  permissions: Permissions;
  /**
   * whether this role is managed by an integration
   */
  managed: boolean;
  /**
   * whether this role is mentionable
   */
  mentionable: boolean;
  /**
   * the tags this role has
   */
  tags?: APIRoleTags;

  constructor(data: DataWithClient<APIRole>, public guild: Guild) {
    super(data);

    this.permissions = new Permissions(BigInt(data.permissions));
  }

  setPosition(newPosition: number, reason?: string) {
    return this.guild.setRolePosition(this.id, newPosition, reason);
  }

  edit(
    options: KeysToCamelCase<RESTPatchAPIGuildRoleJSONBody>,
    reason?: string
  ) {
    return this.guild.editRole(this.id, options, reason);
  }

  toString() {
    return roleMention(this.id)
  }
}
