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
    errors: Record<string, unknown>
  ) {
    super();

    this.name = "DiscordAPIError";
    if (Array.isArray(errors)) {
      errors.push({ code, method, router });

      this.message = JSON.stringify(errors, null, 4);
    } else {
      errors.code = code;
      errors.method = method;
      errors.router = router;

      if ("message" in errors) {
        this.message = errors.message as string;
      }
    }
  }
}

export class RequestError extends Error {
  constructor(
    public router: string,
    public method: string,
    public message: string,
    public name: string,
    public code: number
  ) {
    super();
    this.name = "RequestError";
  }
}
