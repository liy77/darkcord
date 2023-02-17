import { Guild } from "@resources/Guild";
import { Role } from "@resources/Role";
import { BaseCacheOptions } from "@typings/index";
import { Partials } from "@utils/Constants";
import { MakeError } from "@utils/index";
import { APIGuild, APIRole } from "discord-api-types/v10";

import { Cache } from "./Cache";
import { CacheManager } from "./CacheManager";

export class RoleCache extends Cache<Role | APIRole> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
  ) {
    super(options, manager.adapter);
  }

  get(id: string, guild?: Guild) {
    const role = super.get(id);
    return role && this._resolve(role, guild, true);
  }

  add(role: APIRole | Role, replace = true) {
    return super._add(role, replace, role.id);
  }

  _resolve(
    role: (APIRole & { guildId?: string }) | Role,
    guild?: Guild,
    addInCache = false,
  ) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      role &&
      !this.manager._partial(Partials.Role) &&
      !(role instanceof Role)
    ) {
      if (!role.guildId && !guild)
        throw MakeError({
          name: "MissingProperty",
          message: "guild not provided",
        });

      if (!guild) {
        guild = this.manager.client.cache.guilds.get(role.guildId!);
      }

      role = new Role({ ...role, client: this.manager.client }, guild!);

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
    const existing = this.get(id);

    if (existing) {
      return existing;
    }

    const rolesArr = await this.manager.client.rest.getRoles(
      typeof guild === "string" ? guild : guild.id,
    );

    const resolvedRolesArr = Promise.all(
      rolesArr.map(async (role) => {
        if (!this.manager._partial(Partials.Role)) {
          if (!(guild instanceof Guild)) {
            guild = this.manager.guilds.get(
              typeof guild === "string" ? guild : guild.id,
            ) as Guild;
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
        }

        return this.add(role);
      }),
    );

    return (await resolvedRolesArr).find((role) => role.id === id);
  }
}

export class GuildRoleCache extends RoleCache {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
    public guild: Guild,
  ) {
    super(options, manager);
  }

  get(id: string) {
    return super.get(id, this.guild);
  }

  add(role: APIRole | Role, replace = true) {
    return super.add(super._resolve(role, this.guild), replace);
  }

  fetch(id: string) {
    return super.fetch(id, this.guild);
  }
}
