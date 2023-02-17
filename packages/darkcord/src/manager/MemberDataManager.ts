import { CacheManager } from "@cache/CacheManager";
import { Guild } from "@resources/Guild";
import { Member } from "@resources/Member";
import { BaseCacheOptions } from "@typings/index";
import { APIGuildMember } from "discord-api-types/v10";
import { DataManager } from "./DataManager";

export class MemberDataManager extends DataManager<Member> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
    public guild: Guild,
  ) {
    super(options, (get, id) => {
      const g = get(id) as unknown as APIGuildMember | undefined;

      if (!g) return;

      return new Member(g, this.guild);
    });
  }

  add(member: Member, replace = true) {
    return super.add(member, replace, member.id);
  }

  async fetch(id: string) {
    const member = await this.manager.client.rest.getGuildMember(
      this.guild.id,
      id,
    );

    return this.add(new Member(member, this.guild));
  }
}
