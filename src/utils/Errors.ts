import { MakeError } from "./index";

export const MissingIntentsError = (...intents: string[]) => MakeError({
    name: "MissingIntents",
    message: `Intents ${intents.join(", ")} is missing in Client`
})