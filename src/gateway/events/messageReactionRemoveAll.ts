import { GatewayMessageReactionRemoveAllDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { isTextBasedChannel, structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class MessageReactionRemoveAll extends Event {
  run(data: GatewayMessageReactionRemoveAllDispatchData) {
    const channel = this.client.cache.channels.get(
      data.channel_id,
      this.getGuild(data.guild_id!)
    );

    if (isTextBasedChannel(channel!)) {
      const message = channel.messages.get(data.message_id);

      if (message) {
        const removed = structuredClone(message.reactions);
        message.reactions.clear();
        this.client.emit(Events.MessageReactionRemoveAll, message, removed);
      }
    }
  }
}
