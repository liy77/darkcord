import { Rest } from "@darkcord/rest";
// @ts-ignore
import { MessagePostData } from "darkcord";
import {
  APICommandAutocompleteInteractionResponseCallbackData,
  APIInteraction,
  APIInteractionResponseCallbackData,
  APIModalInteractionResponseCallbackData,
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";
import EventEmitter from "node:events";
import { IncomingMessage, ServerResponse, createServer } from "node:http";
import { verifyKeyMiddleware } from "../middleware/index";

export const LocalHost = "127.0.0.1";

export type RawWebServerResponse = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};

export interface WebServerEvents {
  data: [
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    },
  ];
  listen: [webserver: WebServer];
  interactionDataReceived: [
    body: APIInteraction,
    response: InteractionResponse,
  ];
  interactionPingReceived: [];
}

export interface WebServerOptions {
  hostname?: string;
  port: number;
  route?: string;
  token?: string;
  publicKey: string;
}

export class InteractionResponse {
  constructor(
    public interaction: APIInteraction,
    public res: RawWebServerResponse,
    public webserver: WebServer,
  ) {}

  async send(
    data:
      | MessagePostData
      | APIInteractionResponseCallbackData
      | APICommandAutocompleteInteractionResponseCallbackData
      | APIModalInteractionResponseCallbackData,
    type: InteractionResponseType,
  ) {
    if ("files" in data && data.files?.length) {
      await this.webserver.rest.respondInteraction(
        this.interaction.id,
        this.interaction.token,
        data,
        type,
      );
      return;
    }

    this.res.end(
      JSON.stringify({
        data,
        type,
      }),
    );
  }
}

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
  rest: Rest;
  port: number;
  hostname: string;
  publicKey: string;
  route: string;
  constructor(options: WebServerOptions) {
    super();

    if (typeof options !== "object") {
      throw new TypeError("Invalid webserver options");
    }

    if (typeof options.publicKey !== "string") {
      throw new TypeError("Invalid public key");
    }

    this.rest = new Rest();

    if (options.token) {
      this.rest.setToken(options.token);
    }

    this.port = options.port;
    this.hostname = options.hostname ?? LocalHost;
    this.publicKey = options.publicKey;
    this.route = options.route ?? "/";
  }

  listen() {
    const server = createServer(async (req, res) => {
      if (req.url !== this.route || req.method !== "POST") return;

      this.emit("data", req, res);

      // Verify key and return parsed interaction
      const interaction = await verifyKeyMiddleware(this.publicKey)(req, res);

      if (interaction.type === InteractionType.Ping) {
        this.emit("interactionPingReceived");
      } else {
        this.emit(
          "interactionDataReceived",
          interaction,
          new InteractionResponse(interaction, res, this),
        );
      }
    });

    return new Promise<void>((resolve, reject) => {
      try {
        server.listen(this.port, this.hostname, () => {
          this.emit("listen", this);
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
