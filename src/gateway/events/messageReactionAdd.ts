import { TextBasedChannel } from "@resources/Channel";
import { Reaction } from "@resources/Emoji";
import { Partials } from "@utils/Constants";
import { isTextBasedChannel } from "@utils/index";
import { GatewayMessageReactionAddDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class MessageReactionAdd extends Event {
  run(data: GatewayMessageReactionAddDispatchData) {
    const raw = {
      count: 0,
      emoji: data.emoji,
      me: data.user_id === this.client.user.id,
    };

    const reaction = this.client.cache._partial(Partials.Reaction)
      ? raw
      : new Reaction({ ...raw, client: this.client });

    const channel = this.client.cache.channels.get(
      data.channel_id,
      this.getGuild(data.guild_id)
    );

    const user = this.client.cache.users.get(data.user_id);

    if (isTextBasedChannel(channel)) {
      if (reaction instanceof Reaction) reaction.users.add(user);

      const message = channel.messages.get(data.message_id);

      message.reactions._add(reaction, true, reaction.emoji.id);
    }

    this.client.emit("messageReactionAdd", reaction, user);
  }
}
