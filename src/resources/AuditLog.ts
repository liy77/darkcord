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
import { GuildDataModel } from "../typings";
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

  constructor(data: GuildDataModel<APIAuditLog>) {}
}
