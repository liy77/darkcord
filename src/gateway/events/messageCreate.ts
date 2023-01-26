import { GatewayMessageCreateDispatchData } from "discord-api-types/v10";
import { Message } from "@resources/Message";
import { Event } from "./Event";

export class MessageCreate extends Event {
  async run(data: GatewayMessageCreateDispatchData) {
    const guild = data.guild_id && this.getGuild(data.guild_id);

    const message = new Message(
      {
        ...data,
        client: this.client,
      },
      guild
    );

    await message._resolve();

    this.client.emit("messageCreate", message);
  }
}
