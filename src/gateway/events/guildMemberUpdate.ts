import { Member } from "@resources/Member";
import {
  APIGuildMember,
  GatewayGuildMemberUpdateDispatchData,
} from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";

export class GuildMemberUpdate extends Event {
  run(data: GatewayGuildMemberUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const oldMember = structuredClone(guild.members.get(data.user.id));
    console.log(oldMember)
    const updatedData = oldMember
      ? (Object.assign(oldMember.partial, data) as APIGuildMember)
      : { ...data, deaf: null, mute: null };

    const updated = guild.members.add(
      new Member(
        {
          ...updatedData,
        },
        guild
      )
    );

    this.client.emit("guildMemberUpdate", oldMember, updated);
  }
}
