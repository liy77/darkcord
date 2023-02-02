import { TextBasedChannel, ThreadChannel } from "@resources/Channel";
import { GatewayMessageDeleteDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { isTextBasedChannel, structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class MessageDelete extends Event {
  run(data: GatewayMessageDeleteDispatchData) {
    const channel = this.client.cache.channels.get(data.channel_id);

    if (isTextBasedChannel(channel)) {
      if (!channel.messages.has(data.id)) return;
      if (channel instanceof ThreadChannel) channel.messageCount--;

      const message = structuredClone(channel.messages.get(data.id));
      this.client.emit(Events.MessageDelete, message);
      channel.messages.delete(data.id);
    }
  }
}
