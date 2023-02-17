import {
  APIInteraction,
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";
import crypto from "node:crypto";
import {
  IncomingMessage as Request,
  ServerResponse as Response,
} from "node:http";

export async function verify(
  rawBody: string,
  publicKey: string,
  signature: string,
  timestamp: string,
) {
  const messageBuffer = Buffer.from(timestamp + rawBody);
  const signatureBuffer = Buffer.from(signature, "hex");
  const publicKeyBuffer = Buffer.from(publicKey, "hex");

  const algorithm = "Ed25519";
  const key = await crypto.webcrypto.subtle.importKey(
    "raw",
    publicKeyBuffer,
    algorithm,
    true,
    ["verify"],
  );

  return crypto.webcrypto.subtle.verify(
    algorithm,
    key,
    signatureBuffer,
    messageBuffer,
  );
}

export function verifyKeyMiddleware(publicKey: string) {
  return (req: Request, res: Response) => {
    const timestamp = req.headers["x-signature-timestamp"] as string;
    const signature = req.headers["x-signature-ed25519"] as string;

    const chunks: Buffer[] = [];

    return new Promise<APIInteraction>((resolve) => {
      req.on("data", (chunk) => {
        chunks.push(chunk);
      });

      req.on("end", async () => {
        const rawBody = Buffer.concat(chunks).toString("utf8");
        const body = JSON.parse(rawBody) as APIInteraction;

        if (!(await verify(rawBody, publicKey, signature, timestamp))) {
          throw new Error("Invalid signature");
        }

        if (body.type === InteractionType.Ping) {
          // Responding ping
          res.end(
            JSON.stringify({
              type: InteractionResponseType.Pong,
            }),
          );
        }

        resolve(body);
      });
    });
  };
}
