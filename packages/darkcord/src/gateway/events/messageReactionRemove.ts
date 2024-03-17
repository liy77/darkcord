import { TextBasedChannel } from "@resources/Channel";
import { Reaction } from "@resources/Emoji";
import { Events } from "@utils/Constants";
import { GatewayMessageReactionRemoveDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class MessageReactionRemove extends Event {
  async run(
    data: GatewayMessageReactionRemoveDispatchData & { burst: boolean },
  ) {
    const raw = {
      count: 0,
      emoji: data.emoji,
      me: data.user_id === this.client.user?.id,
      count_details: {
        burst: 0,
        normal: 0,
      },
    };

    const reaction = new Reaction({ ...raw, client: this.client });

    const channel = this.client.channels.cache.get(data.channel_id);

    const user = this.client.cache.users.get(data.user_id);

    if (TextBasedChannel.isBased(channel!)) {
      if (reaction instanceof Reaction) reaction.users.add(user!);

      const message =
        (channel as TextBasedChannel).messages.get(data.message_id) ||
        (await (channel as TextBasedChannel).messages.fetch(data.message_id));

      const existingReactions = message.reactions.get(
        reaction.emoji.id ?? reaction.emoji.name!,
      );

      if (existingReactions) {
        reaction.count = existingReactions.count - 1;

        let countDetails = existingReactions.countDetails;
        countDetails[data.burst ? "burst" : "normal"]--;

        reaction.countDetails = countDetails;
      }

      if (reaction.count <= 0) {
        message.reactions.delete(reaction.emoji.id ?? reaction.emoji.name!);
      }

      if (data.burst) {
        this.client.emit(
          Events.MessageSuperReactionRemove,
          reaction,
          user,
          message,
        );
      } else {
        this.client.emit(Events.MessageReactionRemove, reaction, user, message);
      }
    }
  }
}
