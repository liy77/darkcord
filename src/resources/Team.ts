import { DataWithClient } from "@typings/index";
import { APITeam, APITeamMember, TeamMemberMembershipState } from "discord-api-types/v10";

import { User } from "./User";

export class TeamMember {
  membershipState: TeamMemberMembershipState;
  permissions: ["*"];
  teamId: string;
  user: User;

  constructor(data: DataWithClient<APITeamMember>) {
    this.permissions = ["*"];
    this.teamId = data.team_id;
    this.user = new User({ ...data.user, client: data.client });
    this.membershipState = data.membership_state;
  }
}

export class Team {
  /**
   * a hash of the image of the team's icon
   */
  icon: string | null;
  id: string;
  /**
   * the members of the team
   */
  members: TeamMember[];
  /**
   * the name of the team
   */
  name: string;
  /**
   * the user id of the current team owner
   */
  ownerUserId: string;

  constructor(data: DataWithClient<APITeam>) {
    this.icon = data.icon;
    this.id = data.id;
    this.members = data.members.map(
      (member) => new TeamMember({ ...member, client: data.client })
    );
    this.name = data.name;
    this.ownerUserId = data.owner_user_id;
  }
}
