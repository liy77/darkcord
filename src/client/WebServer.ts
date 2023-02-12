import {
  MessagePostData,
  RawWebServerResponse,
  WebServerEvents,
  WebServerOptions,
} from "@typings/index";
import {
  APICommandAutocompleteInteractionResponseCallbackData,
  APIInteraction,
  APIInteractionResponseCallbackData,
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";
import { Buffer } from "node:buffer";
import EventEmitter from "node:events";
import http from "node:http";

import { MakeError } from "../utils/index";
import { InteractionClient } from "./Client";

const decoder = new TextDecoder();

let NACL: typeof import("tweetnacl") | undefined;

try {
  NACL = require("tweetnacl");
} catch {}

export const LOCAL_HOST = "127.0.0.1";

export declare interface WebServer {
  on<T extends keyof WebServerEvents>(
    event: T,
    listener: (...args: WebServerEvents[T]) => any,
  ): this;
  once<T extends keyof WebServerEvents>(
    event: T,
    listener: (...args: WebServerEvents[T]) => any,
  ): this;
  emit<T extends keyof WebServerEvents>(
    event: T,
    ...args: WebServerEvents[T]
  ): boolean;
}

export class WebServer extends EventEmitter {
  _port: number;
  _hostname: string;
  _publicKey: string;
  constructor(public client: InteractionClient, options: WebServerOptions) {
    super();
    this._publicKey = client.publicKey;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this._port = options.port ?? 3000;
    this._hostname = options.hostname ?? LOCAL_HOST;
  }

  listen() {
    if (!NACL) {
      throw MakeError({
        name: "MissingLibrary",
        message:
          "tweetnacl is not installed, please install using: npm install tweetnacl",
      });
    }

    const server = http.createServer(this.#serveHttp.bind(this));

    return new Promise<void>((resolve, reject) => {
      try {
        server.listen(this._port, this._hostname, () => {
          this.emit("listen", this);
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  #verifyKey(body: string, signature: string, timestamp: string) {
    try {
      return NACL!.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, "hex"),
        Buffer.from(this._publicKey, "hex"),
      );
    } catch {
      return false;
    }
  }

  #serveHttp(
    request: http.IncomingMessage,
    response: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    },
  ) {
    this.emit("data", request, response);

    const timestamp = request.headers["x-signature-timestamp"] as string;
    const signature = request.headers["x-signature-ed25519"] as string;

    const chunks: any[] = [];
    request.on("data", (chunk) => {
      chunks.push(chunk);
    });

    request.on("end", () => {
      const rawBody = Buffer.concat(chunks);
      const stringBody = decoder.decode(rawBody);
      const body = JSON.parse(stringBody);

      if (!this.#verifyKey(stringBody, signature, timestamp)) {
        throw MakeError({
          name: "InvalidVerifyKey",
          message: "invalid verify key received",
        });
      }

      if (body.type === InteractionType.Ping) {
        response.end(
          JSON.stringify({
            type: InteractionResponseType.Pong,
          }),
        );

        this.emit("interactionPingReceived");
      } else {
        this.emit(
          "interactionDataReceived",
          body,
          new WebServerInteractionResponse(body, response, this),
        );
      }
    });
  }
}

export class WebServerInteractionResponse {
  private _res: RawWebServerResponse;
  constructor(
    public body: APIInteraction,
    rawResponse: RawWebServerResponse,
    public webserver: WebServer,
  ) {
    this._res = rawResponse;
    this._res.setHeader("Content-Type", "application/json");
  }

  async respond(
    data:
      | MessagePostData
      | APIInteractionResponseCallbackData
      | APICommandAutocompleteInteractionResponseCallbackData,
    type: InteractionResponseType,
  ) {
    if ("files" in data && data.files?.length) {
      await this.webserver.client.rest.respondInteraction(
        this.body.id,
        this.body.token,
        data,
        type,
      );
      return;
    }

    this._res.end(
      JSON.stringify({
        type,
        data,
      }),
    );
  }
}
