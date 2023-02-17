import { GatewayMessageDeleteDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";
import { TextBasedChannel } from "@resources/Channel";

export class MessageDelete extends Event {
  run(data: GatewayMessageDeleteDispatchData) {
    const channel = this.client.channels.cache.get(data.channel_id);

    if (TextBasedChannel.isBased(channel!)) {
      if (!channel?.messages.cache.has(data.id)) return;
      if (channel.isThread()) channel.messageCount--;

      const message = structuredClone(channel.messages.get(data.id));
      this.client.emit(Events.MessageDelete, message);
      channel.messages.cache.delete(data.id);
    }
  }
}
