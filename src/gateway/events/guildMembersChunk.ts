import { Guild } from "@resources/Guild";
import { Member } from "@resources/Member";
import { Events, Partials } from "@utils/Constants";
import {
  APIGuildMember,
  GatewayGuildMembersChunkDispatchData,
} from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildMembersChunk extends Event {
  run(data: GatewayGuildMembersChunkDispatchData) {
    let guild = this.getGuild(data.guild_id);

    if (!guild) return;

    let members: (APIGuildMember | Member)[] | null | undefined =
      data.members as APIGuildMember[] | null | undefined;

    if (members) {
      members = members.map(
        (member) => new Member(member as APIGuildMember, guild as Guild),
      );

      for (const member of members) {
        guild.members.add(member as Member);
      }
    }

    if (data.presences) {
      for (const presence of data.presences) {
        guild.presences.push(presence);
      }
    }

    this.client.emit(Events.GuildMembersChunk, {
      chunkCount: data.chunk_count,
      chunkIndex: data.chunk_index,
      notFound: data.not_found,
      nonce: data.nonce,
      guildId: data.guild_id,
      guild,
      members,
    });

    if (data.chunk_index >= data.chunk_count - 1) {
      this.client.emit(Events.GuildMembersChunked, guild, data.chunk_count);
    }
  }
}
