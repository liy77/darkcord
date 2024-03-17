import { CacheManager } from "@cache/CacheManager";
import { User } from "@resources/User";
import { BaseCacheOptions } from "@typings/index";
import { APIUser } from "discord-api-types/v10";
import { DataManager } from "./DataManager";
import { Forge } from "@resources/forge/Forgified";

export class UserDataManager extends DataManager<User> {
  constructor(
    options: number | BaseCacheOptions<User>,
    public manager: CacheManager,
  ) {
    super(options);
  }

  get(id: string) {
    const user = this.cache.get(id);
    return user && this.#resolve(user, true);
  }

  forge(id: string): User;
  forge(data: APIUser): User;
  forge(data: APIUser | string): User {
    const forged = new Forge(this.manager.client, User).forge(
      typeof data === "string" ? { id: data } : data,
    );

    return this.add(forged, false)! as User;
  }

  add(user: User | APIUser, replace = true) {
    if (!user || !user.id) {
      return null as unknown as User;
    }

    return super.add(this.#resolve(user), replace, user.id);
  }

  #resolve(user: User | APIUser, addInCache = false) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      user &&
      !(user instanceof User)
    ) {
      user = new User({ ...user, client: this.manager.client });

      if (addInCache) this.add(user);
    }

    return user;
  }

  async fetch(id: string) {
    let user = await this.manager.client.rest.getUser(id);
    return this.add(user);
  }
}
