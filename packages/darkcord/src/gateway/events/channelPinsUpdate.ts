import { TextBasedChannel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import { Events } from "@utils/Constants";
import { GatewayChannelPinsUpdateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class ChannelPinsUpdate extends Event {
  run(data: GatewayChannelPinsUpdateDispatchData) {
    let guild: Guild | undefined;

    if ("guild_id" in data) {
      guild = this.getGuild(data.guild_id!);
    }

    const channel = this.client.channels.cache.get(data.channel_id);

    if (TextBasedChannel.isBased(channel!)) {
      const oldLastPinTimestamp = channel.lastPinTimestamp;

      if (data.last_pin_timestamp) {
        channel.lastPinTimestamp = Date.parse(data.last_pin_timestamp);
      }

      if (guild) {
        guild.channels.add(channel!);
      }

      this.client.channels.add(channel!);

      const disabledEvents = this.client.options.gateway.disabledEvents;

      if (
        channel.lastPinTimestamp &&
        oldLastPinTimestamp! < channel.lastPinTimestamp &&
        !disabledEvents.includes("channelPinsAdd")
      ) {
        this.client.emit(
          Events.ChannelPinsAdd,
          oldLastPinTimestamp,
          channel.lastPinTimestamp,
          channel,
        );
      } else if (
        channel.lastPinTimestamp &&
        oldLastPinTimestamp! > channel.lastPinTimestamp &&
        !disabledEvents.includes("channelPinsRemove")
      ) {
        this.client.emit(
          Events.ChannelPinsRemove,
          oldLastPinTimestamp,
          channel.lastPinTimestamp,
          channel,
        );
      } else {
        this.client.emit(Events.ChannelPinsUpdate, channel);
      }
    }
  }
}
