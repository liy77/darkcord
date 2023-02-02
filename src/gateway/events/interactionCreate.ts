import { GatewayInteractionCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { Interaction } from "@resources/Interaction";
import { Events } from "@utils/Constants";

export class InteractionCreate extends Event {
  async run(data: GatewayInteractionCreateDispatchData) {
    const interaction = Interaction.from({
      ...data,
      client: this.client,
    });

    this.client.emit(Events.InteractionCreate, interaction);
  }
}
