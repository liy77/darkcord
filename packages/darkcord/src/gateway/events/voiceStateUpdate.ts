import { VoiceState } from "@resources/VoiceState";
import { GatewayVoiceStateUpdateDispatchData } from "discord-api-types/v10";
import { Member } from "@resources/Member";
import { StageChannel, VoiceChannel } from "@resources/Channel";
import { Event } from "./Event";
import { isEqual } from "@utils/index";
import { structuredClone } from "@utils/index";
import { Events } from "@utils/Constants";

export class VoiceStateUpdate extends Event {
  run(data: GatewayVoiceStateUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id!);

    if (!guild) return;

    const oldVoiceState = structuredClone(guild.voiceStates.get(data.user_id));

    const updated = new VoiceState(
      {
        ...data,
        client: this.client,
      },
      guild,
    );

    let member = guild.members.cache.get(data.user_id);

    if (!member && data.member?.user && data.member.joined_at) {
      member = guild.members.add(new Member(data.member, guild));
    }

    const disabledEvents = this.client.options.gateway.disabledEvents;

    if (oldVoiceState?.channelId !== data.channel_id) {
      const channel = this.client.channels.cache.get(data.channel_id!);
      const oldChannel = this.client.channels.cache.get(
        oldVoiceState?.channelId!,
      ) as VoiceChannel | StageChannel | null;

      if (
        data.channel_id &&
        (channel instanceof VoiceChannel || channel instanceof StageChannel)
      ) {
        guild.voiceStates.set(data.user_id, updated);

        if (
          oldVoiceState &&
          oldChannel &&
          !disabledEvents.includes("voiceChannelSwitch")
        ) {
          oldChannel.members.cache.delete(member!.id);
          const m = channel.members.add(member!);
          this.client.emit(Events.VoiceChannelSwitch, m, oldChannel, channel);
        } else if (!disabledEvents.includes("voiceChannelJoin")) {
          const m = channel.members.add(member!);
          this.client.emit(Events.VoiceChannelJoin, m, channel);
        }
      } else if (oldChannel && !disabledEvents.includes("voiceChannelLeave")) {
        oldChannel.members.cache.delete(member!.id);

        guild.voiceStates.delete(data.user_id);

        this.client.emit(Events.VoiceChannelLeave, member, oldChannel);
      }
    }

    if ((!oldVoiceState && updated) || !isEqual(oldVoiceState, updated)) {
      this.client.emit(Events.VoiceStateUpdate, member, updated);
    }
  }
}
