import { type Config } from "drizzle-kit";

export default {
  schema: "./app/modals/*",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./database.db",
  },
} satisfies Config;
