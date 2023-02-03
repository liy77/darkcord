import { TextBasedChannel, ThreadChannel } from "@resources/Channel";
import { GatewayMessageDeleteBulkDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { isTextBasedChannel, structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class MessageDeleteBulk extends Event {
  run(data: GatewayMessageDeleteBulkDispatchData) {
    const channel = this.client.cache.channels.get(data.channel_id);

    if (isTextBasedChannel(channel!)) {
      const messages = new Map();

      for (const id of data.ids) {
        if (!channel.messages.has(id)) continue;
        if (channel instanceof ThreadChannel) channel.messageCount--;

        const message = structuredClone(channel.messages.get(id));

        channel.messages.delete(id);
        messages.set(message!.id, message);
      }

      this.client.emit(Events.MessageDeleteBulk, messages);
    }
  }
}
