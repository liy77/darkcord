import { TextBasedChannel } from "@resources/Channel";
import { Message } from "@resources/Message";
import {
  APIMessage,
  GatewayMessageUpdateDispatchData,
} from "discord-api-types/v10";
import { Event } from "./Event";

export class MessageUpdate extends Event {
  run(data: GatewayMessageUpdateDispatchData) {
    const channel = this.client.cache.channels.get(
      data.channel_id
    ) as TextBasedChannel;

    const old = structuredClone(channel.messages.get(data.id));
    const updated = new Message(
      {
        ...(data as APIMessage),
        client: this.client,
      },
      data.guild_id && this.getGuild(data.guild_id)
    );

    channel.messages.add(updated);

    this.client.emit("messageUpdate", old, updated);
  }
}
