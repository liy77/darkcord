import { camelCase } from "@utils/index";
import { ClientEvents } from "@typings/index";

import { ChannelCreate } from "./events/channelCreate";
import { ChannelDelete } from "./events/channelDelete";
import { ChannelPinsUpdate } from "./events/channelPinsUpdate";
import { ChannelUpdate } from "./events/channelUpdate";
import { Event } from "./events/Event";
import { GuildAuditLogEntryCreate } from "./events/guildAuditLogEntryCreate";
import { GuildBanAdd } from "./events/guildBanAdd";
import { GuildBanRemove } from "./events/guildBanRemove";
import { GuildCreate } from "./events/guildCreate";
import { GuildDelete } from "./events/guildDelete";
import { GuildEmojisUpdate } from "./events/guildEmojisUpdate";
import { GuildIntegrationsUpdate } from "./events/guildIntegrationsUpdate";
import { GuildMemberAdd } from "./events/guildMemberAdd";
import { GuildMemberRemove } from "./events/guildMemberRemove";
import { GuildMembersChunk } from "./events/guildMembersChunk";
import { GuildMemberUpdate } from "./events/guildMemberUpdate";
import { GuildRoleCreate } from "./events/guildRoleCreate";
import { GuildRoleDelete } from "./events/guildRoleDelete";
import { GuildRoleUpdate } from "./events/guildRoleUpdate";
import { GuildScheduledEventCreate } from "./events/guildScheduledEventCreate";
import { GuildScheduledEventDelete } from "./events/guildScheduledEventDelete";
import { GuildScheduledEventUpdate } from "./events/guildScheduledEventUpdate";
import { GuildScheduledEventUserAdd } from "./events/guildScheduledEventUserAdd";
import { GuildScheduledEventUserRemove } from "./events/guildScheduledEventUserRemove";
import { GuildStickersUpdate } from "./events/guildStickersUpdate";
import { GuildUpdate } from "./events/guildUpdate";
import { IntegrationCreate } from "./events/integrationCreate";
import { InteractionCreate } from "./events/interactionCreate";
import { InviteCreate } from "./events/inviteCreate";
import { InviteDelete } from "./events/inviteDelete";
import { MessageCreate } from "./events/messageCreate";
import { MessageDelete } from "./events/messageDelete";
import { MessageDeleteBulk } from "./events/messageDeleteBulk";
import { MessageReactionAdd } from "./events/messageReactionAdd";
import { MessageReactionRemove } from "./events/messageReactionRemove";
import { MessageReactionRemoveAll } from "./events/messageReactionRemoveAll";
import { MessageReactionRemoveEmoji } from "./events/messageReactionRemoveEmoji";
import { MessageUpdate } from "./events/messageUpdate";
import { Ready } from "./events/ready";
import { StageInstanceCreate } from "./events/stageInstanceCreate";
import { StageInstanceDelete } from "./events/stageInstanceDelete";
import { StageInstanceUpdate } from "./events/stageInstanceUpdate";
import { ThreadCreate } from "./events/threadCreate";
import { ThreadDelete } from "./events/threadDelete";
import { ThreadListSync } from "./events/threadListSync";
import { ThreadMembersUpdate } from "./events/threadMembersUpdate";
import { ThreadMemberUpdate } from "./events/threadMemberUpdate";
import { TypingStart } from "./events/typingStart";
import { UserUpdate } from "./events/userUpdate";
import { VoiceServerUpdate } from "./events/voiceServerUpdate";
import { VoiceStateUpdate } from "./events/voiceStateUpdate";
import { GatewayShard } from "./Gateway";

export class EventSource {
  events: Map<string, Event>;
  constructor(public gatewayShard: GatewayShard) {
    this.events = new Map();

    // Gateway
    this.add(Ready);

    // Interaction
    this.add(InteractionCreate);

    // Guild
    this.add(GuildCreate);
    this.add(GuildMembersChunk);
    this.add(GuildUpdate);
    this.add(GuildDelete);
    this.add(GuildAuditLogEntryCreate);
    this.add(GuildBanAdd);
    this.add(GuildBanRemove);
    this.add(GuildEmojisUpdate);
    this.add(GuildStickersUpdate);
    this.add(GuildMemberAdd);
    this.add(GuildMemberRemove);
    this.add(GuildMemberUpdate);
    this.add(GuildIntegrationsUpdate);
    this.add(GuildRoleCreate);
    this.add(GuildRoleUpdate);
    this.add(GuildRoleDelete);
    this.add(GuildScheduledEventCreate);
    this.add(GuildScheduledEventDelete);
    this.add(GuildScheduledEventUpdate);
    this.add(GuildScheduledEventUserAdd);
    this.add(GuildScheduledEventUserRemove);

    // Message
    this.add(MessageCreate);
    this.add(MessageUpdate);
    this.add(MessageDelete);
    this.add(MessageDeleteBulk);
    this.add(MessageReactionRemove);
    this.add(MessageReactionRemoveAll);
    this.add(MessageReactionRemoveEmoji);
    this.add(MessageReactionAdd);
    this.add(TypingStart);

    // Stage
    this.add(StageInstanceCreate);
    this.add(StageInstanceDelete);
    this.add(StageInstanceUpdate);

    // Thread
    this.add(ThreadMemberUpdate);
    this.add(ThreadCreate);
    this.add(ThreadMembersUpdate);
    this.add(ThreadDelete);
    this.add(ThreadListSync);

    // Channel
    this.add(ChannelCreate);
    this.add(ChannelDelete);
    this.add(ChannelUpdate);
    this.add(ChannelPinsUpdate);

    // User
    this.add(UserUpdate);

    // Voice
    this.add(VoiceStateUpdate);
    this.add(VoiceServerUpdate);

    // Integration
    this.add(IntegrationCreate);

    // Invite
    this.add(InviteCreate);
    this.add(InviteDelete);
  }

  add(event: new (gatewayShard: GatewayShard) => Event) {
    const name = camelCase(event.name) as keyof ClientEvents;

    if (
      this.gatewayShard.client.options.gateway.disabledEvents?.includes(name)
    )
      return;

    this.events.set(name, new event(this.gatewayShard));
  }

  get(name: string) {
    const event = this.events.get(name);
    return event?.run.bind(event);
  }
}
