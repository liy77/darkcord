import { Channel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import { GatewayStatus } from "@utils/Constants";
import { GatewayGuildCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildCreate extends Event {
  async run(data: GatewayGuildCreateDispatchData) {
    const guild = new Guild({
      ...data,
      shard_id: this.shardId,
      client: this.client,
    });

    for (const channel of data.channels) {
      const resolved = Channel.from({ ...channel, client: this.client }, guild);

      guild.channels.add(resolved);
      this.client.cache.channels.add(resolved);
    }

    // Add guild to global cache
    this.client.cache.guilds._add(guild)

    if (this.client.websocket.allReady()) {
      this.client.emit("guildCreate", guild);
    } else if (this.gatewayShard.status === GatewayStatus.WaitingGuilds) {
      this.gatewayShard.pendingGuilds--;
      this.gatewayShard.pendingGuildsMap.delete(guild.id);

      if (this.gatewayShard.pendingGuilds === 0) {
        this.fireClientReady();
      }
    }
  }

  fireClientReady() {
    this.client.emit("ready");
  }
}
