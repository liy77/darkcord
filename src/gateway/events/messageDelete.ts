import { TextBasedChannel, ThreadChannel } from "@resources/Channel";
import { GatewayMessageDeleteDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";

export class MessageDelete extends Event {
  run(data: GatewayMessageDeleteDispatchData) {
    const channel = this.client.cache.channels.get(data.channel_id);

    if (channel instanceof TextBasedChannel) {
      if (!channel.messages.has(data.id)) return;
      if (channel instanceof ThreadChannel) channel.messageCount--;

      const message = structuredClone(channel.messages.get(data.id));

      channel.messages.delete(data.id);

      this.client.emit("messageDelete", message);
    }
  }
}
