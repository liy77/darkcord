import { ThreadMember } from "@resources/Member";
import { GatewayThreadMembersUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { GuildChannel } from "../../resources/Channel";

export class ThreadMembersUpdate extends Event {
  run(data: GatewayThreadMembersUpdateDispatchData) {
    const thread = this.client.cache.threads.get(data.id);

    const addedMembers = data.added_members.map(
      (member) => new ThreadMember({ ...member, client: this.client }, thread)
    );

    for (const member of addedMembers) {
      thread.members._add(member);
    }

    for (const id of data.removed_member_ids) {
      thread.members.delete(id);
    }

    const channel = this.client.cache.channels.get(
      thread.channel.id
    ) as GuildChannel;

    if (channel) channel.threads._add(thread);
    this.client.cache.threads._add(thread);

    this.client.emit(
      "threadMembersUpdate",
      addedMembers,
      data.removed_member_ids
    );
  }
}
