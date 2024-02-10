/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { GatewayStatus, ShardEvents } from "@utils/Constants";
import { GatewayReadyDispatchData } from "discord-api-types/v10";
import { ClientUser } from "@resources/User";
import { Event } from "./Event";
import { ClientApplication } from "@resources/Application";

export class Ready extends Event {
  async run(data: GatewayReadyDispatchData) {
    this.gatewayShard.pendingGuilds += data.guilds.length;

    this.client.user = new ClientUser({
      ...data.user,
      client: this.client,
    });

    for (const unavailableGuild of data.guilds) {
      this.gatewayShard.pendingGuildsMap.set(
        unavailableGuild.id,
        unavailableGuild,
      );
    }

    this.gatewayShard.uptime = Date.now();
    this.gatewayShard.sessionId = data.session_id;
    this.gatewayShard.status = GatewayStatus.WaitingGuilds;
    this.gatewayShard.resumeURL = `${data.resume_gateway_url}?v=10&encoding=${this.gatewayShard.options.encoding}`;

    if (this.gatewayShard.options.compress) {
      this.gatewayShard.resumeURL += "&compress=lib-stream";
    }

    // Ready heartbeat
    this.gatewayShard.heartbeatAck = true;
    this.gatewayShard.sendHeartbeat();

    if (!this.client.applicationId) {
      this.gatewayShard.client.applicationId = data.application.id;
    }

    if (!this.client.applicationFlags) {
      this.client.applicationFlags = data.application.flags;
    }

    if (!this.client.application) {
      const rawApplication = await this.client.rest.getCurrentApplication();
      this.client.application = new ClientApplication({
        ...rawApplication,
        client: this.client,
      });
    }

    this.client.cache.users.add(this.client.user);

    for (const guild of data.guilds) {
      this.gatewayShard.pendingGuildsMap.set(guild.id, guild);
    }

    this.gatewayShard.emit(ShardEvents.Ready);
    this.client.websocket.fireClientReady();
  }
}
