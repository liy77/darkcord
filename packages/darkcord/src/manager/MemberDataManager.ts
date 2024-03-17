import { CacheManager } from "@cache/CacheManager";
import { Guild } from "@resources/Guild";
import { Member } from "@resources/Member";
import { BaseCacheOptions } from "@typings/index";
import { APIGuildMember } from "discord-api-types/v10";
import { DataManager } from "./DataManager";
import { Forge, Forged } from "@resources/forge/Forgified";

export class MemberDataManager extends DataManager<Member> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
    public guild: Guild,
  ) {
    super(options, (get, id) => {
      const g = get(id) as unknown as APIGuildMember | undefined;

      if (!g) return;

      return g instanceof Member ? g : new Member(g, this.guild);
    });
  }

  get(id: string) {
    return this.cache.get(id);
  }

  add(member: Member, replace = true) {
    return super.add(member, replace, member.id);
  }

  forge(data: Forged<APIGuildMember> | string, guild: Guild) {
    const forged = new Forge(this.manager.client, Member).forge(
      typeof data === "string" ? { id: data } : data,
      guild,
    );
    return this.add(forged, false);
  }

  async fetch(id: string): Promise<Member> {
    const member = await this.manager.client.rest.getGuildMember(
      this.guild.id,
      id,
    );

    return this.add(new Member(member, this.guild));
  }
}
