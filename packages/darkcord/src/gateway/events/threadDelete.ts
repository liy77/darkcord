import { Events } from "@utils/Constants";
import {
  APIThreadChannel,
  ChannelType,
  GatewayThreadDeleteDispatchData,
} from "discord-api-types/v10";
import { ThreadChannel } from "@resources/Channel";
import { Event } from "./Event";

export class ThreadDelete extends Event {
  run(data: GatewayThreadDeleteDispatchData) {
    let thread = this.client.cache.threads.get(data.id);

    if (
      data.type === ChannelType.PublicThread ||
      data.type === ChannelType.PrivateThread
    ) {
      const guild = this.getGuild(data.guild_id!);

      if (guild) {
        thread = new ThreadChannel(
          {
            client: this.client,
            ...(data as APIThreadChannel),
          },
          guild,
        );
      }
    }

    if (thread) {
      this.client.emit(Events.ThreadDelete, thread);
      this.client.cache.threads.delete(data.id);
    }
  }
}
