import { Cache } from "@cache/Cache";
import { DataWithClient, GuildDataModel } from "@typings/index";
import {
  APIApplicationCommand,
  APIAuditLog,
  APIAuditLogEntry,
  APIAutoModerationRule,
  APIGuildScheduledEvent,
  APIUser,
} from "discord-api-types/v10";
import { ThreadChannel } from "./Channel";
import { Integration } from "./Integration";
import { User } from "./User";
import { Webhook } from "./Webhook";

export class AuditLog {
  applicationCommands: APIApplicationCommand[];
  webhooks: Map<string, Webhook>;
  users: Cache<User | APIUser>;
  auditLogEntries: APIAuditLogEntry[];
  autoModerationRules: APIAutoModerationRule[];
  integrations: Map<string, Integration>;
  threads: Cache<ThreadChannel>;
  guildScheduledEvents: APIGuildScheduledEvent[];

  constructor(data: DataWithClient<GuildDataModel<APIAuditLog>>) {
    this.applicationCommands = data.application_commands;
    this.auditLogEntries = data.audit_log_entries;
    this.guildScheduledEvents = data.guild_scheduled_events;

    // Users
    const usersIdMap = data.users.map((u) => u.id);

    this.users = data.client.users.cache.filter((u) =>
      usersIdMap.includes(u.id),
    );

    // Webhooks
    this.webhooks = new Map();

    if ("webhooks" in data && data.webhooks) {
      for (const webhook of data.webhooks) {
        this.webhooks.set(
          webhook.id,
          new Webhook({ ...webhook, client: data.client }),
        );
      }
    }

    // Threads
    const threadsIdMap = data.threads.map((thread) => thread.id);

    this.threads = data.guild.channels.cache.filter((c) =>
      threadsIdMap.includes(c.id),
    ) as Cache<ThreadChannel>;

    // Integrations
    this.integrations = new Map();

    if ("integrations" in data && data.integrations) {
      for (const rawIntegration of data.integrations) {
        this.integrations.set(
          rawIntegration.id,
          new Integration(rawIntegration, data.guild),
        );
      }
    }
  }
}
