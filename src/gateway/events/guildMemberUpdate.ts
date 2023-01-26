import { Member } from "@resources/Member";
import {
  APIGuildMember,
  GatewayGuildMemberUpdateDispatchData,
} from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildMemberUpdate extends Event {
  run(data: GatewayGuildMemberUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const oldMember = structuredClone(guild.members.get(data.user.id));
    const updated = guild.members.add(
      new Member(
        {
          ...(Object.assign(oldMember.partial, data) as APIGuildMember),
        },
        guild
      )
    );

    this.client.emit("guildMemberUpdate", oldMember, updated);
  }
}
