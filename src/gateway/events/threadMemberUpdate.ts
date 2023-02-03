import { ThreadMember } from "@resources/Member";
import { Events } from "@utils/Constants";
import { GatewayThreadMemberUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class ThreadMemberUpdate extends Event {
  run(data: GatewayThreadMemberUpdateDispatchData) {
    const thread = this.client.cache.threads.get(data.id!);

    if (thread) {
      const channel = thread.channel;

      const member = new ThreadMember(
        {
          ...data,
          client: this.client,
        },
        thread
      );

      thread.member = member;

      this.client.cache.threads._add(thread);
      channel?.threads._add(thread);

      this.client.emit(Events.ThreadMemberUpdate, member);
    }
  }
}
