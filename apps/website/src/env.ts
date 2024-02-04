import { z } from "zod";

const EnvSchema = z.object({});

export const env = EnvSchema.parse(process.env);
