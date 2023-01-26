import { TextBasedChannel } from "@resources/Channel";
import { Reaction } from "@resources/Emoji";
import { Partials } from "@utils/Constants";
import { GatewayMessageReactionRemoveDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class MessageReactionRemove extends Event {
  run(data: GatewayMessageReactionRemoveDispatchData) {
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

    if (channel instanceof TextBasedChannel && reaction instanceof Reaction) {
      reaction.users.add(user);
    }

    this.client.emit("messageReactionRemove", reaction, user);
  }
}
