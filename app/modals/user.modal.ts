import { type InferModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const authUser = sqliteTable("auth_user", {
  id: text("id").notNull(),
  email: text("email"),
});

export type AuthUser = InferModel<typeof authUser, "select">;

export const session = sqliteTable("auth_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => authUser.id),
  activeExpires: integer("active_expires").notNull(),
  idleExpires: integer("idle_expires").notNull(),
});

export const key = sqliteTable("auth_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => authUser.id),
  primaryKey: integer("primary_key", { mode: "boolean" }).notNull(),
  hashedPassword: text("hashed_password"),
  expires: integer("expires"),
});

export const anonymousSession = sqliteTable("auth_anonymous_session", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  expiresInSec: integer("expires_in_sec").notNull(),
  token: text("token").notNull(),
  type: text("type").notNull().default("anon"),
});

export type AuthAnonSession = InferModel<typeof anonymousSession, "select">;
