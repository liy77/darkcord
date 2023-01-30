import { AnyClient } from "@typings/index";

export class Snowflake {
  static getEpoch(id: string) {
    return Math.floor(Number(id) / 4194304);
  }

  static getCreatedAt(id: string) {
    return this.getEpoch(id) + Snowflake.Epoch;
  }

  static Epoch = 1420070400000;
}

export class Base {
  _client: AnyClient;
  /**
   * object id
   */
  id: string;
  partial: Record<string, any> & { id?: string };
  constructor(
    data: Record<string, any> & { id?: string },
    client?: AnyClient,
    id?: string
  ) {
    this._client = client;
    this.partial = data;
    this.id = data.id ?? id;
  }

  get createdAt() {
    return Snowflake.getCreatedAt(this.id);
  }
}
