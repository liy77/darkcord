import { DataWithClient, GuildDataModel } from "@typings/index";
import {
  APIApplicationCommand,
  APIAuditLog,
  APIAuditLogEntry,
  APIAutoModerationRule,
  APIChannel,
  APIGuildIntegration,
  APIGuildScheduledEvent,
  APIWebhook,
} from "discord-api-types/v10";
import { User } from "./User";

export class AuditLog {
  applicationCommands: APIApplicationCommand[];
  webhooks: APIWebhook[];
  users: User[];
  auditLogEntries: APIAuditLogEntry[];
  autoModerationRules: APIAutoModerationRule[];
  integrations: APIGuildIntegration[];
  threads: APIChannel[];
  guildScheduledEvents: APIGuildScheduledEvent[];

  constructor(data: DataWithClient<GuildDataModel<APIAuditLog>>) {
    this.applicationCommands = data.application_commands;
    this.auditLogEntries = data.audit_log_entries;
    this.users = data.users.map(
      (raw) => new User({ client: data.client, ...raw }),
    );
    this.webhooks = data.webhooks;
    this.integrations = data.integrations;
    this.threads = data.threads;
    this.guildScheduledEvents = data.guild_scheduled_events;
  }
}
