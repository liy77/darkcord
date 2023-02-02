import { GatewayThreadCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { ThreadChannel, GuildChannel } from "@resources/Channel";
import { Events } from "@utils/Constants";

export class ThreadCreate extends Event {
  run(data: GatewayThreadCreateDispatchData) {
    const guild = this.getGuild(data.guild_id);
    const channel = this.client.cache.channels.get(data.parent_id);

    const thread = new ThreadChannel(
      {
        ...data,
        client: this.client,
      },
      guild
    );

    if (channel instanceof GuildChannel) channel.threads._add(thread);

    this.client.cache.threads._add(thread);

    this.client.emit(Events.ThreadCreate, thread);
  }
}
