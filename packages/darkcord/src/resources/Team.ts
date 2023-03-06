import { DataWithClient } from "@typings/index";
import {
  APITeam,
  APITeamMember,
  APIUser,
  TeamMemberMembershipState,
} from "discord-api-types/v10";

import { User } from "./User";

export class TeamMember {
  /**
   * The user's membership state on the team
   */
  membershipState: TeamMemberMembershipState;
  /**
   * Will always be ["*"]
   */
  permissions: ["*"];
  /**
   * The id of the parent team of which they are a member
   */
  teamId: string;
  /**
   * The user of team
   */
  user: User | APIUser;

  constructor(data: DataWithClient<APITeamMember>) {
    this.permissions = ["*"];
    this.teamId = data.team_id;
    this.user = data.client.users.add(data.user, false);
    this.membershipState = data.membership_state;
  }
}

export class Team {
  /**
   * A hash of the image of the team's icon
   */
  icon: string | null;
  id: string;
  /**
   * The members of the team
   */
  members: TeamMember[];
  /**
   * The name of the team
   */
  name: string;
  /**
   * The user id of the current team owner
   */
  ownerUserId: string;

  constructor(data: DataWithClient<APITeam>) {
    this.icon = data.icon;
    this.id = data.id;
    this.members = data.members.map(
      (member) => new TeamMember({ ...member, client: data.client }),
    );
    this.name = data.name;
    this.ownerUserId = data.owner_user_id;
  }
}
