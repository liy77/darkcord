import { TextBasedChannel } from "@resources/Channel";
import { Events } from "@utils/Constants";
import { structuredClone } from "@utils/index";
import { GatewayMessageReactionRemoveEmojiDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class MessageReactionRemoveEmoji extends Event {
  run(data: GatewayMessageReactionRemoveEmojiDispatchData) {
    const emoji = data.emoji;

    const channel = this.client.channels.cache.get(data.channel_id);

    if (TextBasedChannel.isBased(channel!)) {
      const message = channel.messages.get(data.message_id);

      if (message) {
        const removed = structuredClone(message.reactions.get(emoji.id!));
        message.reactions.delete(emoji.id!);

        this.client.emit(Events.MessageReactionRemoveEmoji, message, removed);
      }
    }
  }
}
