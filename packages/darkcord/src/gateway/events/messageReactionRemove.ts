import { TextBasedChannel } from "@resources/Channel";
import { Reaction } from "@resources/Emoji";
import { Events, Partials } from "@utils/Constants";
import { GatewayMessageReactionRemoveDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class MessageReactionRemove extends Event {
  async run(data: GatewayMessageReactionRemoveDispatchData) {
    const raw = {
      count: 0,
      emoji: data.emoji,
      me: data.user_id === this.client.user?.id,
    };

    const reaction = this.client.cache._partial(Partials.Reaction)
      ? raw
      : new Reaction({ ...raw, client: this.client });

    const channel = this.client.channels.cache.get(data.channel_id);

    const user = this.client.cache.users.get(data.user_id);

    if (TextBasedChannel.isBased(channel!) && reaction instanceof Reaction) {
      reaction.users.add(user!);
      const message =
        (channel as TextBasedChannel).messages.get(data.message_id) ||
        (await (channel as TextBasedChannel).messages.fetch(data.message_id));

      message.reactions.delete(reaction.emoji.id!);
      this.client.emit(Events.MessageReactionRemove, reaction, user, message);
    }
  }
}
