import { Events } from "@utils/Constants";
import { GatewayVoiceServerUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class VoiceServerUpdate extends Event {
  run(data: GatewayVoiceServerUpdateDispatchData) {
    const host = data.endpoint;
    const guild = this.getGuild(data.guild_id);
    const token = data.token;

    this.client.emit(Events.VoiceServerUpdate, {
      host,
      guild,
      token,
    });
  }
}
