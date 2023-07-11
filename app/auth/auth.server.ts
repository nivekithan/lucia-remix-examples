import { hash } from "bcryptjs";
import { db } from "~/lib/db.server";
import { type AuthUser, anonymousSession, authUser } from "~/modals/user.modal";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { getCurrentTimeInSec } from "~/lib/utils";
import { ANON_SESSION_EXPIRE_TIME_SEC } from "./constant";

export async function createAnonymousSession({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token: string;
}) {
  const hashedPassword = await hashPassword(password);
  const expires = getCurrentTimeInSec() + ANON_SESSION_EXPIRE_TIME_SEC;

  const createdSession = db
    .insert(anonymousSession)
    .values({
      email,
      hashedPassword,
      id: randomUUID(),
      expiresInSec: expires,
      token,
    })
    .returning({ id: anonymousSession.id })
    .get();

  const sessionId = createdSession.id;

  return { sessionId };
}

async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 10);

  return hashedPassword;
}

export function getUser(email: string): AuthUser | undefined {
  const user = db
    .select()
    .from(authUser)
    .where(eq(authUser.email, email))
    .get();

  return user;
}

export function getAnonSession(sessionId: string) {
  const session = db
    .select()
    .from(anonymousSession)
    .where(eq(anonymousSession.id, sessionId))
    .get();

  return session;
}

export function deleteAnonSession(sessionId: string) {
  const session = db
    .delete(anonymousSession)
    .where(eq(anonymousSession.id, sessionId))
    .returning()
    .get();

  return session;
}
