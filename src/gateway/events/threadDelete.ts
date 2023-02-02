import { Events } from "@utils/Constants";
import { GatewayThreadDeleteDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class ThreadDelete extends Event {
  run(data: GatewayThreadDeleteDispatchData) {
    const thread = this.client.cache.threads.get(data.id);

    if (thread) {
      this.client.emit(Events.ThreadDelete, thread);
      this.client.cache.threads.delete(data.id);
    }
  }
}
