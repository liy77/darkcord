import { Events } from "@utils/Constants";
import { GatewayGuildBanAddDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildBanAdd extends Event {
  async run(data: GatewayGuildBanAddDispatchData) {
    const guild = this.getGuild(data.guild_id);
    const user = await this.getUser(data.user.id);

    this.client.emit(Events.GuildBanAdd, guild, user);
  }
}
