import { GatewayMessageCreateDispatchData } from "discord-api-types/v10";
import { Message } from "@resources/Message";
import { Event } from "./Event";
import { Resolvable } from "@utils/Resolvable";
import { Events } from "@utils/Constants";
import { Guild } from "@resources/Guild";

export class MessageCreate extends Event {
  async run(data: GatewayMessageCreateDispatchData) {
    let guild: Guild | undefined;

    if (data.guild_id) {
      guild = this.getGuild(data.guild_id);
    }

    const message = new Message(
      {
        ...data,
        client: this.client,
      },
      guild,
    );

    this.client.emit(
      Events.MessageCreate,
      Resolvable.resolveMessage(message, this.client),
    );
  }
}
