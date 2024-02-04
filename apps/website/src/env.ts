import { z } from "zod";

const EnvSchema = z.object({
	MODE: z.enum(["development", "production", "test"]),
});

export const env = EnvSchema.parse(import.meta.env);
