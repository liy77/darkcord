import { TextBasedChannel } from "@resources/Channel";
import { Events } from "@utils/Constants";
import { structuredClone } from "@utils/index";
import { GatewayMessageReactionRemoveAllDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class MessageReactionRemoveAll extends Event {
  run(data: GatewayMessageReactionRemoveAllDispatchData) {
    const channel = this.client.channels.cache.get(data.channel_id);

    if (TextBasedChannel.isBased(channel!)) {
      const message = channel.messages.get(data.message_id);

      if (message) {
        const removed = structuredClone(message.reactions);
        message.reactions.clear();
        this.client.emit(Events.MessageReactionRemoveAll, message, removed);
      }
    }
  }
}
