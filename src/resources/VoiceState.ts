import { DataWithClient, KeysToCamelCase } from "@typings/index";
import {
  GatewayVoiceState,
  RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
} from "discord-api-types/v10";
import { Base } from "./Base";
import { Guild } from "./Guild";
import { Member } from "./Member";

export class VoiceState extends Base {
  /**
   * The guild of voice state is for
   */
  guild: Guild;
  /**
   * The user id this voice state is for
   */
  userId: string;
  /**
   * The channel id this user is connected to
   */
  channelId: string | null;
  /**
   * Whether this user is deafened by the server
   */
  deaf: boolean;
  /**
   * The guild member this voice state is for
   */
  member: Member | null;
  /**
   * Whether this user is muted by the server
   */
  mute: boolean;
  /**
   * The time at which the user requested to speak
   */
  requestToSpeakTimestamp: number | null;
  /**
   * Whether this user is locally deafened
   */
  selfDeaf: boolean;
  /**
   * Whether this user is locally muted
   */
  selfMute: boolean;
  /**
   * Whether this user is streaming using "Go Live"
   */
  selfStream: boolean;
  /**
   * Whether this user's camera is enabled
   */
  selfVideo: boolean;
  /**
   * The session id for this voice state
   */
  sessionId: string;
  /**
   * The guild id this voice state is for
   */
  guildId: string;
  /**
   * Whether this user is muted by the current user
   */
  suppress: boolean;
  constructor(data: DataWithClient<GatewayVoiceState>, guild: Guild) {
    super(data, data.client, data.user_id);

    this.guild = guild;
    this.userId = data.user_id;
    this.channelId = data.channel_id;
    this.deaf = data.deaf;
    this.member = data.member ? guild.members.get(data.user_id) ?? null : null;
    this.mute = data.mute;
    this.requestToSpeakTimestamp = data.request_to_speak_timestamp
      ? Date.parse(data.request_to_speak_timestamp)
      : null;

    this.selfDeaf = data.self_deaf;
    this.selfMute = data.self_mute;
    this.selfStream = Boolean(data.self_stream);
    this.selfVideo = data.self_video;
    this.sessionId = data.session_id;
    this.guildId = data.guild_id as string;
    this.suppress = data.suppress;
  }

  disconnect(reason?: string) {
    return this.moveMemberTo(null, reason);
  }

  moveMemberTo(channelId: string | null, reason?: string) {
    return this.member?.edit({ channelId }, reason);
  }

  edit(
    options: KeysToCamelCase<RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody>
  ) {
    return this._client.rest.modifyGuildVoiceState(
      this.guildId,
      this.userId === this._client.user?.id ? "@me" : this.userId,
      options
    );
  }
}
