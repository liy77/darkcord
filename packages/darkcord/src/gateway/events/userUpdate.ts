import { GatewayUserUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class UserUpdate extends Event {
  run(data: GatewayUserUpdateDispatchData) {
    const old = structuredClone(
      data.id === this.client.user?.id
        ? this.client.user
        : this.client.cache.users.get(data.id),
    );

    const updated = this.client.cache.users.add(data);

    this.client.emit(Events.UserUpdate, old, updated);
  }
}
