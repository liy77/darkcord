import { TextBasedChannel } from "@resources/Channel";
import { GatewayMessageReactionRemoveEmojiDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";

export class MessageReactionRemoveEmoji extends Event {
  run(data: GatewayMessageReactionRemoveEmojiDispatchData) {
    const emoji = data.emoji;

    const channel = this.client.cache.channels.get(
      data.channel_id,
      this.getGuild(data.guild_id)
    );

    if (channel instanceof TextBasedChannel) {
      const message = channel.messages.get(data.message_id);

      if (message) {
        const removed = structuredClone(message.reactions.get(emoji.id));
        message.reactions.delete(emoji.id);

        this.client.emit("messageReactionRemoveEmoji", message, removed);
      }
    }
  }
}
