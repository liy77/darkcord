import { CacheManager } from "@cache/CacheManager";
import { Guild } from "@resources/Guild";
import { Member } from "@resources/Member";
import { MissingIntentsError } from "@darkcord/utils";
import { GatewayIntentBits } from "discord-api-types/v10";
import { DataManager } from "./DataManager";

export interface GuildFetchOptions {
  fetchMembers?: boolean;
}

export class GuildDataManager extends DataManager<Guild> {
  constructor(public manager: CacheManager, limit?: number) {
    super(limit);
  }

  async fetch(id: string, options: GuildFetchOptions = {}) {
    const raw = await this.manager.client.rest.getGuild(id);
    const guild = new Guild({ ...raw, client: this.manager.client });

    if (options.fetchMembers && "websocket" in this.manager.client) {
      if (
        !(
          this.manager.client.options.gateway.intents &
          GatewayIntentBits.GuildMembers
        )
      ) {
        throw MissingIntentsError("GuildMembers");
      }

      const members = await this.manager.client.rest.getGuildMembers(guild.id);

      for (const raw of members) {
        guild.members.add(new Member(raw, guild), true);
      }
    }

    return guild;
  }
}
