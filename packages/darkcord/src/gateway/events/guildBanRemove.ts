import { User } from "@resources/User";
import { Events } from "@utils/Constants";
import { GatewayGuildBanRemoveDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildBanRemove extends Event {
  run(data: GatewayGuildBanRemoveDispatchData) {
    const guild = this.getGuild(data.guild_id);
    const user =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this.client.cache.users.get(data.user.id) ??
      new User({ ...data.user, client: this.client });

    this.client.emit(Events.GuildBanRemove, guild, user);
  }
}
