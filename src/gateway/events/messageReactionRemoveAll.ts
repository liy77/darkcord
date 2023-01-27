import { TextBasedChannel } from "@resources/Channel";
import { GatewayMessageReactionRemoveAllDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";

export class MessageReactionRemoveAll extends Event {
  run(data: GatewayMessageReactionRemoveAllDispatchData) {
    const channel = this.client.cache.channels.get(
      data.channel_id,
      this.getGuild(data.guild_id)
    );

    if (channel instanceof TextBasedChannel) {
      const message = channel.messages.get(data.message_id);

      if (message) {
        const removed = structuredClone(message.reactions);
        message.reactions.clear();
        this.client.emit("messageReactionRemoveAll", message, removed);
      }
    }
  }
}
