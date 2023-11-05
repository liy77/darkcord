import { Cache } from "@cache/Cache";
import { AnyClient, JSONFY } from "@typings/index";
import { MakeError } from "@utils/index";

export namespace Snowflake {
  export const InvalidSnowflakeError = (id: string) =>
    MakeError({
      name: "InvalidSnowflake",
      message: `${id} is not a snowflake`,
    });

  export function valid(id: string) {
    return Number.isInteger(Number(id));
  }

  export function getEpoch(id: string) {
    verify(id);
    return Math.floor(Number(id) / 4194304);
  }

  export function getCreatedAt(id: string) {
    verify(id);
    return getEpoch(id) + Epoch;
  }

  export function getCreatedTimestamp(id: string) {
    verify(id);
    return (Number(id) >> 22) + Epoch;
  }

  export function getWorkerId(id: string) {
    verify(id);
    return (Number(id) & 0x3e0000) >> 17;
  }

  export function getProcessId(id: string) {
    verify(id);
    return (Number(id) & 0x1f000) >> 12;
  }

  export function getIncrement(id: string) {
    verify(id);
    return Number(id) & 0xfff;
  }

  /**
   * Checks if the snowflake is valid and if not, it throw's an error
   */
  export function verify(id: string) {
    if (!valid(id)) throw InvalidSnowflakeError(id);
    return true;
  }

  export function deconstruct(id: string) {
    return {
      timestamp: getCreatedTimestamp(id),
      createdAt: getCreatedAt(id),
      workerId: getWorkerId(id),
      processId: getProcessId(id),
      increment: getIncrement(id),
    };
  }

  export const Epoch = 1420070400000;
}

export class Base {
  /**
   * The client that instantiated this
   * @name Base#_client
   * @type {AnyClient}
   * @readonly
   */
  _client: AnyClient;
  /**
   * Object id
   */
  id: string;
  rawData: Record<string, any> & { id?: string };
  constructor(
    data: Record<string, any> & { id?: string },
    client?: AnyClient,
    id?: string,
  ) {
    this._client = client!;
    this.rawData = data;
    this.id = data.id ?? id!;
  }

  get createdAt() {
    return Snowflake.getCreatedAt(this.id);
  }

  toJSON() {
    Base.toJSON(this as Base, ["createdAt", "id", "rawData"]);
  }

  static toJSON<T extends Base, U extends keyof T = keyof T>(
    source: T,
    props: U[],
  ) {
    const json = {} as Record<U, T[keyof T]>;

    for (const prop of props) {
      if ((prop as string).startsWith("_")) {
        continue;
      }

      let value: any = source[prop];

      if (typeof value === "object" && value?.toJSON) {
        value = value.toJSON();
      } else if (typeof value === "bigint") {
        value = value.toString();
      } else if (value instanceof Map || value instanceof Cache) {
        value = [...value.values()];
      } else if (typeof value === "function" || !value) {
        continue;
      }
      json[prop] = value;
    }

    return json as unknown as JSONFY<{
      [K in U as U extends never ? never : K]: T[K];
    }>;
  }
}
