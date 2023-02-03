import { AnyClient } from "@typings/index";

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
}
