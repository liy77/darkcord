import { TextBasedChannel } from "@resources/Channel";
import { APISuperReaction, Reaction } from "@resources/Emoji";
import { Events, Partials } from "@utils/Constants";
import { GatewayMessageReactionAddDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class MessageReactionAdd extends Event {
  async run(data: GatewayMessageReactionAddDispatchData & { burst: boolean }) {
    const raw = {
      count: 0,
      emoji: data.emoji,
      me: data.user_id === this.client.user!.id,
      count_details: {
        burst: 0,
        normal: 0,
      },
    };

    if (data.burst) {
      raw.count_details.burst++;
    } else {
      raw.count_details.normal++;
    }

    raw.count++;

    const reaction = this.client.cache._partial(Partials.Reaction)
      ? raw
      : new Reaction({ ...raw, client: this.client });

    const channel = this.client.channels.cache.get(data.channel_id);

    const user = await this.getUser(data.user_id);

    if (TextBasedChannel.isBased(channel!)) {
      if (reaction instanceof Reaction) reaction.users.add(user);

      const message =
        channel.messages.get(data.message_id) ||
        (await channel.messages.fetch(data.message_id));

      const existingReactions = message.reactions.get(
        reaction.emoji.id ?? reaction.emoji.name!,
      );

      if (existingReactions) {
        reaction.count += existingReactions.count;

        if (
          existingReactions instanceof Reaction &&
          reaction instanceof Reaction
        ) {
          reaction.countDetails.burst += existingReactions.countDetails.burst;
          reaction.countDetails.normal += existingReactions.countDetails.normal;
        } else if (
          existingReactions instanceof Reaction &&
          !(reaction instanceof Reaction)
        ) {
          reaction.count_details.burst += existingReactions.countDetails.burst;
          reaction.count_details.normal +=
            existingReactions.countDetails.normal;
        } else if (
          !(existingReactions instanceof Reaction) &&
          reaction instanceof Reaction
        ) {
          reaction.countDetails.burst += existingReactions.count_details.burst;
          reaction.countDetails.normal +=
            existingReactions.count_details.normal;
        }

        message.reactions._add(
          reaction,
          true,
          reaction.emoji.id ?? reaction.emoji.name!,
        );
      } else {
        message.reactions._add(
          reaction,
          true,
          reaction.emoji.id ?? reaction.emoji.name!,
        );
      }

      if (data.burst) {
        this.client.emit(
          Events.MessageSuperReactionAdd,
          reaction,
          user,
          message,
        );
      } else {
        this.client.emit(Events.MessageReactionAdd, reaction, user, message);
      }
    }
  }
}
