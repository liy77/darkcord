import { CacheManager } from "@cache/CacheManager";
import { User } from "@resources/User";
import { BaseCacheOptions, DataWithClient } from "@typings/index";
import { Partials } from "@utils/Constants";
import { APIUser } from "discord-api-types/v10";
import { DataManager } from "./DataManager";

export class UserDataManager extends DataManager<APIUser | User> {
  constructor(
    options: number | BaseCacheOptions<APIUser | User>,
    public manager: CacheManager,
  ) {
    super(options);
  }

  get(id: string) {
    const user = this.cache.get(id);
    return user && this.#resolve(user, true);
  }

  forge(id: string) {
    return this.add(
      new User({
        client: this.manager.client,
        id,
      } as unknown as DataWithClient<APIUser>),
      false,
    );
  }

  add(user: User | APIUser, replace = true) {
    if (!user || !user.id) {
      return null;
    }

    return super.add(this.#resolve(user), replace, user.id);
  }

  #resolve(user: User | APIUser, addInCache = false) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      user &&
      !this.manager._partial(Partials.User) &&
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
