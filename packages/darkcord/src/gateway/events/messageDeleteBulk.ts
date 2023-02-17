import { TextBasedChannel, ThreadChannel } from "@resources/Channel";
import { Events } from "@utils/Constants";
import { structuredClone } from "@utils/index";
import { GatewayMessageDeleteBulkDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class MessageDeleteBulk extends Event {
  run(data: GatewayMessageDeleteBulkDispatchData) {
    const channel = this.client.channels.cache.get(data.channel_id);

    if (TextBasedChannel.isBased(channel!)) {
      const messages = new Map();

      for (const id of data.ids) {
        if (!channel.messages.cache.has(id)) continue;
        if (channel instanceof ThreadChannel) channel.messageCount--;

        const message = structuredClone(channel.messages.get(id));

        channel.messages.cache.delete(id);
        messages.set(message!.id, message);
      }

      this.client.emit(Events.MessageDeleteBulk, messages);
    }
  }
}
