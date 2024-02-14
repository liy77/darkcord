import { TextBasedChannel } from "@resources/Channel";
import { Message, APIMessage } from "@resources/Message";
import { GatewayMessageUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Resolvable } from "@utils/Resolvable";
import { Events } from "@utils/Constants";
import { Guild } from "@resources/Guild";

export class MessageUpdate extends Event {
  async run(data: GatewayMessageUpdateDispatchData) {
    const channel = this.client.channels.cache.get(
      data.channel_id,
    ) as TextBasedChannel;

    const old = structuredClone(channel.messages.get(data.id));

    let guild: Guild | undefined;

    if (data.guild_id) {
      guild = this.getGuild(data.guild_id);
    }

    const updated = new Message(
      {
        ...(data as APIMessage),
        client: this.client,
      },
      guild,
    );

    this.client.emit(
      Events.MessageUpdate,
      old,
      Resolvable.resolveMessage(updated, this.client),
    );
  }
}
