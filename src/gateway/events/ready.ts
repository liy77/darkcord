import { GatewayStatus } from "@utils/Constants";
import { GatewayReadyDispatchData } from "discord-api-types/v10";
import { User } from "../../resources/User";
import { Event } from "./Event";

export class Ready extends Event {
  async run(data: GatewayReadyDispatchData) {
    this.gatewayShard.pendingGuilds = data.guilds.length;
    this.gatewayShard.pendingGuildsMap = new Map();

    this.client.user = new User({
      ...data.user,
      client: this.client,
    });

    for (const unavailableGuild of data.guilds) {
      this.gatewayShard.pendingGuildsMap.set(
        unavailableGuild.id,
        unavailableGuild
      );
    }

    this.gatewayShard.uptime = new Date();
    this.gatewayShard.sessionId = data.session_id;
    this.gatewayShard.status = GatewayStatus.WaitingGuilds;
    this.gatewayShard.resumeURL = data.resume_gateway_url;

    if (!this.client.applicationId) {
      this.gatewayShard.client.applicationId = data.application.id;
    }

    if (!this.client.applicationFlags) {
      this.gatewayShard.client.applicationFlags = data.application.flags;
    }

    this.client.cache.users._add(
      new User({ ...data.user, client: this.gatewayShard.client })
    );

    for (const guild of data.guilds) {
      this.gatewayShard.pendingGuildsMap.set(guild.id, guild);
    }

    this.gatewayShard.emit("ready");
  }
}
