import { Cache } from "@cache/Cache";
import { GuildChannel } from "@resources/Channel";
import {
  APIThreadChannel,
  GatewayThreadListSyncDispatchData,
} from "discord-api-types/v10";
import { Event } from "./Event";
import { ThreadChannel } from "../../resources/Channel";
import { ThreadMember } from "@resources/Member";
import { Events } from "@utils/Constants";

export class ThreadListSync extends Event {
  run(data: GatewayThreadListSyncDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    if (data.channel_ids) {
      for (const id of data.channel_ids) {
        const channel = this.client.cache.channels.get(id);

        if (channel instanceof GuildChannel) {
          channel.threads.forEach((thread) => {
            if (!thread.archived) {
              channel.threads.delete(thread.id);
            }
          });
        }
      }
    } else {
      for (const channel of guild.channels
        .filter((channel) => channel instanceof GuildChannel)
        .values() as IterableIterator<GuildChannel>) {
        channel.threads.forEach((thread) => {
          if (!thread.archived) {
            channel.threads.delete(thread.id);
          }
        });
      }
    }

    const threads = data.threads.reduce((cache, raw: APIThreadChannel) => {
      const thread = new ThreadChannel({ ...raw, client: this.client }, guild);

      cache.set(thread.id, thread);
      return this.client.cache.threads.set(thread.id, thread);
    }, new Cache<ThreadChannel>());

    for (const raw of data.members) {
      const thread = this.client.cache.threads.get(raw.id!);

      if (thread) {
        const member = new ThreadMember(
          { ...raw, client: this.client },
          thread,
        );

        thread.members._add(member);

        const channel = guild.channels.get(thread.channel!.id);

        if (channel instanceof GuildChannel) {
          channel.threads._add(thread);
        }
      }
    }

    this.client.emit(Events.ThreadListSync, threads, guild);
  }
}
