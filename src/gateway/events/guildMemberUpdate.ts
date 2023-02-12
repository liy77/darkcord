import { Member } from "@resources/Member";
import {
  APIGuildMember,
  GatewayGuildMemberUpdateDispatchData,
} from "discord-api-types/v10";
import { Event } from "./Event";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class GuildMemberUpdate extends Event {
  run(data: GatewayGuildMemberUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const oldMember = structuredClone(guild.members.get(data.user.id));
    const updatedData = oldMember
      ? (Object.assign(oldMember.rawData, data) as APIGuildMember)
      : ({ ...data, deaf: null, mute: null } as unknown as APIGuildMember);

    const updated = guild.members.add(
      new Member(
        {
          ...updatedData,
        },
        guild,
      ),
    );

    this.client.emit(Events.GuildMemberUpdate, oldMember, updated);
  }
}
