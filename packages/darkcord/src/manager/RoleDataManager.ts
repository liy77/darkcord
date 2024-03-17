import { CacheManager } from "@cache/CacheManager";
import { Guild } from "@resources/Guild";
import { Role } from "@resources/Role";
import { BaseCacheOptions } from "@typings/index";
import { APIGuild, APIRole } from "discord-api-types/v10";
import { DataCache, DataManager } from "./DataManager";
import { Forge } from "@resources/forge/Forgified";

export class ClientRoles {
  cache: DataCache<Role>;
  constructor(options?: number | BaseCacheOptions<Role>) {
    this.cache = new DataCache(options);
  }
}

export class RoleDataManager extends DataManager<Role> {
  constructor(
    options: number | BaseCacheOptions<Role>,
    public manager: CacheManager,
    public guild: Guild,
  ) {
    super(options, (get, id) => {
      const role = get(id);
      return role && this._resolve(role, true);
    });
  }

  /**
   * Returns the everyone role of the guild
   * @returns
   */
  get everyone() {
    return this.cache.get(this.guild.id);
  }

  /**
   * Compare the position of role with another guild role
   * @param roleId The role id
   * @param otherRoleId The other role id
   * @returns
   */
  comparePositions(roleId: string, otherRoleId: string) {
    const role = this.get(roleId);
    const otherRole = this.get(otherRoleId);

    if (!role || !otherRole) {
      throw new TypeError("Missing role(s) in cache");
    }

    const p1 = role.position;
    const p2 = otherRole.position;

    if (p1 === p2) {
      return parseInt(otherRoleId, 10) - parseInt(roleId, 10);
    }

    return role.position - otherRole.position;
  }

  premiumSubscriberRole() {
    return (
      this.cache.find((role) => Boolean(role?.tags?.premium_subscriber))?.[1] ??
      null
    );
  }

  get(id: string) {
    return this.cache.get(id);
  }

  add(role: APIRole | Role, replace = true) {
    if (!role || !role.id) {
      return null as unknown as Role;
    }

    return super.add(this._resolve(role), replace, role.id);
  }

  forge(id: string): Role;
  forge(data: APIRole): Role;
  forge(data: APIRole | string) {
    const forged = new Forge(this.manager.client, Role).forge(
      typeof data === "string" ? { id: data } : data,
    );

    return this.add(forged, false) as Role;
  }

  _resolve(role: APIRole | Role, addInCache = false) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      role &&
      !(role instanceof Role)
    ) {
      role = new Role({ ...role, client: this.manager.client }, this.guild);

      if (addInCache) this.add(role);
    }

    return role;
  }

  /**
   *
   * @param id role id
   * @param guild Guild object or Guild Id
   */
  async fetch(id: string, guild: APIGuild | Guild | string) {
    const existing = this.cache.get(id);

    if (existing) {
      return existing;
    }

    const rolesArr = await this.manager.client.rest.getRoles(
      typeof guild === "string" ? guild : guild.id,
    );

    const resolvedRolesArr = Promise.all(
      rolesArr.map(async (role) => {
        if (!(guild instanceof Guild)) {
          guild = this.manager.guilds.cache.get(
            typeof guild === "string" ? guild : guild.id,
          )!;
        }

        return this.add(
          new Role(
            {
              ...role,
              client: this.manager.client,
            },
            guild,
          ),
        );

        return this.add(role);
      }),
    );

    return (await resolvedRolesArr).find((role) => role?.id === id);
  }
}
