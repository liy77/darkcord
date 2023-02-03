import { Guild } from "@resources/Guild";
import { Member } from "@resources/Member";
import { BaseCacheOptions } from "@typings/index";
import { APIGuildMember } from "discord-api-types/v10";

import { Cache } from "./Cache";
import { CacheManager } from "./CacheManager";

export class MemberCache extends Cache<Member> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
    public guild: Guild
  ) {
    super(options, manager.adapter);
  }

  get(id: string) {
    const g = super.get(id) as unknown as APIGuildMember | undefined;

    if (!g) return;

    return new Member(g, this.guild);
  }

  add(member: Member, replace = true) {
    return super._add(member, replace, member.id);
  }

  async fetch(id: string) {
    const member = await this.manager.client.rest.getGuildMember(
      this.guild.id,
      id
    );

    return this.add(new Member(member, this.guild));
  }
}
