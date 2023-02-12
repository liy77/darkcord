import { GatewayMessageReactionRemoveEmojiDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { isTextBasedChannel, structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class MessageReactionRemoveEmoji extends Event {
  run(data: GatewayMessageReactionRemoveEmojiDispatchData) {
    const emoji = data.emoji;

    const channel = this.client.cache.channels.get(
      data.channel_id,
      this.getGuild(data.guild_id!),
    );

    if (isTextBasedChannel(channel!)) {
      const message = channel.messages.get(data.message_id);

      if (message) {
        const removed = structuredClone(message.reactions.get(emoji.id!));
        message.reactions.delete(emoji.id!);

        this.client.emit(Events.MessageReactionRemoveEmoji, message, removed);
      }
    }
  }
}
