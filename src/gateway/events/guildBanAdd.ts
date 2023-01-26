import { User } from "@resources/User";
import { GatewayGuildBanAddDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildBanAdd extends Event {
  run(data: GatewayGuildBanAddDispatchData) {
    const guild = this.getGuild(data.guild_id);
    const user =
      this.client.cache.users.get(data.user.id) ??
      new User({ ...data.user, client: this.client });

    this.client.emit("guildBanAdd", guild, user);
  }
}
