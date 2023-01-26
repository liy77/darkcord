import {
  APIOverwrite,
  OverwriteType,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import { DataWithClient } from "typings/index";
import { Base } from "./Base";
import { BitField } from "./BitField";
import { GuildChannel } from "./Channel";

export class Permissions extends BitField<bigint, typeof PermissionFlagsBits> {
  constructor(public allow: bigint, public deny: bigint = 0n) {
    super(BigInt(allow), PermissionFlagsBits);
    this.allow = BigInt(allow);
    this.deny = BigInt(deny);
  }

  static Flags = PermissionFlagsBits;
  static Default = BigInt(104324673);
  static All = Object.values(PermissionFlagsBits).reduce(
    (all, p) => all | p,
    0n
  );
}

export class PermissionOverwrite extends Base {
  readonly permissions: Readonly<Permissions>;
  type: OverwriteType;
  constructor(
    data: DataWithClient<APIOverwrite>,
    public channel: GuildChannel
  ) {
    super(data, data.client);

    this.permissions = Object.freeze(
      new Permissions(BigInt(data.allow), BigInt(data.deny))
    );

    this.type = data.type;
  }
}
