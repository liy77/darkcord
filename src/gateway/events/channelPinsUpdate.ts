import { TextBasedChannel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import {
  APIChannel,
  APITextBasedChannel,
  ChannelType,
  GatewayChannelPinsUpdateDispatchData,
} from "discord-api-types/v10";
import { Event } from "./Event";
import { isTextBasedChannel } from "@utils/index";

export class ChannelPinsUpdate extends Event {
  run(data: GatewayChannelPinsUpdateDispatchData) {
    let guild: Guild;

    if ("guild_id" in data) {
      guild = this.getGuild(data.guild_id);
    }

    const channel = this.client.cache.channels.get(data.channel_id);

    if (isTextBasedChannel(channel)) {
      channel.lastPinTimestamp = data.last_pin_timestamp;
    }

    if (guild) {
      guild.channels.add(channel as APIChannel);
    }

    this.client.cache.channels.add(channel as APIChannel);
    this.client.emit("channelPinsUpdate", channel);
  }
}
