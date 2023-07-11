import { z } from "zod";

const envSchema = z.object({
  COOKIE_SECRETS: z
    .string({
      required_error: "COOKIE_SECRETS environment variable is not set",
    })
    .nonempty(
      "COOKIE_SECRETS environment variable value is empty string. Set proper value"
    ),
});

export const env = envSchema.parse(process.env);
