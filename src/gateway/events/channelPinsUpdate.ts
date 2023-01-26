import { TextBasedChannel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import {
  APIChannel,
  APITextBasedChannel,
  ChannelType,
  GatewayChannelPinsUpdateDispatchData,
} from "discord-api-types/v10";
import { Event } from "./Event";

export class ChannelPinsUpdate extends Event {
  run(data: GatewayChannelPinsUpdateDispatchData) {
    let guild: Guild;

    if ("guild_id" in data) {
      guild = this.getGuild(data.guild_id);
    }

    const channel = this.client.cache.channels.get(data.channel_id) as
      | TextBasedChannel
      | APITextBasedChannel<ChannelType>;

    if (channel instanceof TextBasedChannel) {
      channel.lastPinTimestamp = data.last_pin_timestamp;
    } else {
      channel.last_pin_timestamp = data.last_pin_timestamp;
    }

    if (guild) {
      guild.channels.add(channel as APIChannel);
    }

    this.client.cache.channels.add(channel as APIChannel);
    this.client.emit("channelPinsUpdate", channel);
  }
}
