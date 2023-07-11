import { hash } from "bcryptjs";
import { db } from "~/lib/db.server";
import { type AuthUser, anonymousSession, authUser } from "~/modals/user.modal";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

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
  const expires = Math.floor(
    new Date(new Date().getTime() + 1000 * 60 * 60).getTime() / 1000
  );

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
