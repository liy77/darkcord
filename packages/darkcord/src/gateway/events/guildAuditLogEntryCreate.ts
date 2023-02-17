import { AuditLogEntry } from "@typings/index";
import { Events } from "@utils/Constants";
import { objectSnakeKeysToCamelKeys } from "@utils/index";
import { APIAuditLogEntry } from "discord-api-types/v10";
import { Event } from "./Event";

export class GuildAuditLogEntryCreate extends Event {
  run(data: APIAuditLogEntry) {
    const log: AuditLogEntry = {
      actionType: data.action_type,
      changes: data.changes?.map((c) => objectSnakeKeysToCamelKeys(c)),
      id: data.id,
      options: data.options && objectSnakeKeysToCamelKeys(data.options),
      reason: data.reason,
      userId: data.user_id,
      targetId: data.target_id,
    };

    this.client.emit(Events.GuildAuditLogEntryCreate, log);
  }
}
