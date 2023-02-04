import { AnyClient, JSONFY } from "@typings/index";
import { Cache } from "@cache/Cache";

export namespace Snowflake {
  export function getEpoch(id: string) {
    return Math.floor(Number(id) / 4194304);
  }

  export function getCreatedAt(id: string) {
    return this.getEpoch(id) + Snowflake.Epoch;
  }

  export const Epoch = 1420070400000;
}

export class Base {
  _client: AnyClient;
  /**
   * object id
   */
  id: string;
  rawData: Record<string, any> & { id?: string };
  constructor(
    data: Record<string, any> & { id?: string },
    client?: AnyClient,
    id?: string
  ) {
    this._client = client as AnyClient;
    this.rawData = data;
    this.id = (data.id ?? id) as string;
  }

  get createdAt() {
    return Snowflake.getCreatedAt(this.id);
  }

  toJSON() {
    Base.toJSON(this as Base, ["createdAt", "id", "rawData"])
  }

  static toJSON<T extends Base, U extends keyof T = keyof T>(source: T, props: U[]) {
    const json = {} as Record<U, T[keyof T]>;

    for (const prop of props) {
      if ((prop as string).startsWith("_")) {
        continue;
      }

      let value: any = source[prop];

      if (value.toJSON) {
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
