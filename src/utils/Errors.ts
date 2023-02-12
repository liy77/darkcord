import { MakeError } from "./index";

export const MissingIntentsError = (...intents: string[]) =>
  MakeError({
    name: "MissingIntents",
    message: `Intents ${intents.join(", ")} is missing in Client`,
  });

export const InvalidTokenError = MakeError({
  name: "InvalidToken",
  message: "Invalid token was provided",
});

export class DiscordAPIError extends Error {
  constructor(
    public router: string,
    public method: string,
    public code: number,
    public status: number,
    errors: Record<string, unknown>,
  ) {
    super();

    errors.code = code;
    errors.method = method;
    errors.router = router;

    const messageStack: string[] = [];
    if ("message" in errors) {
      messageStack.push(errors.message as string);
    }

    if ("errors" in errors) {
      messageStack.push(JSON.stringify(errors.errors));
    }

    if (messageStack.length > 0) {
      this.message = messageStack.join("\n");
    } else {
      this.message = "Unknown Error";
    }
  }
}

export class RequestError extends Error {
  constructor(
    public router: string,
    public method: string,
    public message: string,
    public name: string,
    public code: number,
  ) {
    super();
  }
}
