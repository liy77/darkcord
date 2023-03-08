import { CacheManager } from "@cache/CacheManager";
import { Guild } from "@resources/Guild";
import { Role } from "@resources/Role";
import { BaseCacheOptions, DataWithClient } from "@typings/index";
import { Partials } from "@utils/Constants";
import { APIGuild, APIRole } from "discord-api-types/v10";
import { DataCache, DataManager } from "./DataManager";

export class ClientRoles {
  cache: DataCache<Role | APIRole>;
  constructor(options?: number | BaseCacheOptions<APIRole | Role>) {
    this.cache = new DataCache(options);
  }
}

export class RoleDataManager extends DataManager<Role | APIRole> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
    public guild: Guild,
  ) {
    super(options, (get, id) => {
      const role = get(id);
      return role && this._resolve(role, true);
    });
  }

  get(id: string) {
    return this.cache.get(id);
  }

  add(role: APIRole | Role, replace = true) {
    return super.add(this._resolve(role), replace, role.id);
  }

  forge(id: string) {
    return this.add(
      new Role(
        { client: this.manager.client, id } as DataWithClient<APIRole>,
        this.guild,
      ),
      false,
    );
  }

  _resolve(role: APIRole | Role, addInCache = false) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      role &&
      !this.manager._partial(Partials.Role) &&
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
        if (!this.manager._partial(Partials.Role)) {
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
        }

        return this.add(role);
      }),
    );

    return (await resolvedRolesArr).find((role) => role.id === id);
  }
}
