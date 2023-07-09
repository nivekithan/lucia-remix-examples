import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import lucia from "lucia-auth";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { web } from "lucia-auth/middleware";

const sqlite = Database("./database.db");

export const db: BetterSQLite3Database = drizzle(sqlite);

export const auth = lucia({
  adapter: betterSqlite3(sqlite as any),
  env: "DEV",
  async transformDatabaseUser(userData) {
    return {
      userId: userData.id,
      verified: Boolean(userData.verified),
      email: userData.email,
    };
  },
  middleware: web(),
});
