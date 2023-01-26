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
    let user = super.get(id);

    if (
      user &&
      !this.manager._partial(Partials.User) &&
      !(user instanceof User)
    ) {
      user = new User({ ...user, client: this.manager.client });
      this.add(user);
    }

    return user;
  }

  add(user: User | APIUser, replace = true) {
    return super._add(user, replace, user.id);
  }

  async fetch(id: string) {
    let user = await this.manager.client.rest.getUser(id);
    return this.add(user);
  }
}
