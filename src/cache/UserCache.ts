import { User } from "@resources/User";
import { BaseCacheOptions } from "@typings/index";
import { Partials } from "@utils/Constants";
import { APIUser } from "discord-api-types/v10";
import { Cache } from "./Cache";
import { CacheManager } from "./CacheManager";

export class UserCache extends Cache<APIUser | User> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager
  ) {
    super(options, manager.adapter);
  }

  get(id: string) {
    const user = super.get(id);
    return user && this.#resolve(user, true);
  }

  add(user: User | APIUser, replace = true) {
    return super._add(this.#resolve(user), replace, user.id);
  }

  #resolve(user: User | APIUser, addInCache = false) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      user &&
      !this.manager._partial(Partials.User) &&
      !(user instanceof User)
    ) {
      user = new User({ ...user, client: this.manager.client });

      if (addInCache) this.add(user)
    }

    return user
  }

  async fetch(id: string) {
    let user = await this.manager.client.rest.getUser(id);
    return this.add(user);
  }
}
