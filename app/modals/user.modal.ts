import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("auth_user", {
  id: text("id").primaryKey(),
  verified: integer("verified", { mode: "boolean" }),
  email: text("email").notNull(),
});

export const session = sqliteTable("auth_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  activeExpires: integer("active_expires").notNull(),
  idleExpires: integer("idle_expires").notNull(),
});

export const key = sqliteTable("auth_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
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
});
