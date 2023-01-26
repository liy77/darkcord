import { VoiceState } from "@resources/VoiceState";
import { GatewayVoiceStateUpdateDispatchData } from "discord-api-types/v10";
import { Member } from "@resources/Member";
import { StageChannel, VoiceChannel } from "@resources/Channel";
import { Event } from "./Event";
import { isEqual } from "../../utils/index";

export class VoiceStateUpdate extends Event {
  run(data: GatewayVoiceStateUpdateDispatchData) {
    const guild = this.getGuild(data.guild_id);

    if (!guild) return;

    const oldVoiceState =
      structuredClone(guild.voiceStates.get(data.user_id)) ??
      new VoiceState(
        {
          user_id: data.user_id,
          client: this.client,
          channel_id: null,
          deaf: null,
          mute: null,
          self_deaf: null,
          self_video: null,
          session_id: null,
          request_to_speak_timestamp: null,
          suppress: null,
          self_mute: null,
        },
        guild
      );

    const updated = new VoiceState(
      {
        ...data,
        client: this.client,
      },
      guild
    );

    guild.voiceStates.set(data.user_id, updated);

    let member = guild.members.get(data.user_id);

    if (!member && data.member?.user && data.member?.joined_at) {
      member = guild.members.add(
        new Member(data.member, guild)
      );
    }

    if (oldVoiceState.channelId !== data.channel_id) {
      const channel = this.client.cache.channels.get(data.channel_id);
      const oldChannel = this.client.cache.channels.get(
        oldVoiceState.channelId
      ) as VoiceChannel | StageChannel;

      if (
        data.channel_id &&
        (channel instanceof VoiceChannel || channel instanceof StageChannel)
      ) {
        if (oldVoiceState) {
          oldChannel.members.delete(member.id);
          const m = channel.members.add(member);
          this.client.emit("voiceChannelSwitch", m, channel, oldChannel);
        } else {
          const m = channel.members.add(member);
          this.client.emit("voiceChannelJoin", m, channel);
        }
      } else if (oldChannel) {
        oldChannel.members.delete(member.id);

        this.client.emit("voiceChannelLeave", member, oldChannel);
      }
    }

    if (!isEqual(oldVoiceState, updated)) {
      this.client.emit("voiceStateUpdate", member, updated);
    }
  }
}
