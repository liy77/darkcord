import { Channel } from "@resources/Channel";
import { Guild } from "@resources/Guild";
import { Events, GatewayStatus } from "@utils/Constants";
import { GatewayGuildCreateDispatchData } from "discord-api-types/v10";
import { Event } from "./Event";
import { Member } from "@resources/Member";
import { Role } from "@resources/Role";

export class GuildCreate extends Event {
  async run(data: GatewayGuildCreateDispatchData) {
    const guild = new Guild({
      ...data,
      shard_id: this.shardId,
      client: this.client,
    });

    for (const role of data.roles) {
      const resolved = new Role({ ...role, client: this.client }, guild);
      guild.roles.add(resolved);
      this.client.roles.cache._add(resolved);
    }

    for (const channel of data.channels) {
      const resolved = Channel.from({ ...channel, client: this.client }, guild);

      guild.channels.add(resolved);
      this.client.channels.add(resolved);
    }

    for (const member of data.members) {
      const resolved = new Member(member, guild);
      guild.members.add(resolved, true);
    }

    if (!this.gatewayShard.ready) {
      this.gatewayShard.requestGuildMembers({
        guildId: data.id,
        nonce: Date.now().toString() + Math.random().toString(36),
        query: "",
        limit: 0,
        userIds: undefined,
      });
    }

    // Add guild to global cache
    this.client.guilds.add(guild);

    if (this.client.websocket.allReady()) {
      this.client.emit(Events.GuildCreate, guild);
    } else if (this.gatewayShard.status === GatewayStatus.WaitingGuilds) {
      this.gatewayShard.pendingGuilds--;
      this.gatewayShard.pendingGuildsMap.delete(guild.id);

      if (this.gatewayShard.pendingGuilds === 0) {
        this.gatewayShard.ready = true;
        this.gatewayShard.status = GatewayStatus.Ready;
        this.client.websocket.fireClientReady();
      }
    }
  }
}
