import { deleteAnonSession, getAnonSession } from "./auth.server";
import { DEFAULT_COOKIE_NAME } from "./constant";
import { parse, serialize } from "cookie";
import { signCookieValue, unsignCookieValue } from "./cookies.server";
import { env } from "~/lib/env.server";
import { getCurrentTimeInSec } from "~/lib/utils";

export class AuthRequest {
  #request: Request;
  #headers: Headers;
  #cookieName: string;
  #cookieSecret: string;

  constructor(
    request: Request,
    headers: Headers,
    {
      cookieName = DEFAULT_COOKIE_NAME,
      cookieSecret = env.COOKIE_SECRETS,
    }: { cookieName?: string; cookieSecret?: string } = {}
  ) {
    this.#request = request;
    this.#headers = headers;
    this.#cookieName = cookieName;
    this.#cookieSecret = cookieSecret;
  }

  async setSession(sessionId: string | null) {
    if (!sessionId) {
      const removeCookie = serialize(this.#cookieName, "", {
        expires: new Date(0),
      });
      this.#headers.append("set-cookie", removeCookie);
      return;
    }

    const signedSessionId = await signCookieValue(
      sessionId,
      this.#cookieSecret
    );

    const setCookie = serialize(this.#cookieName, signedSessionId, {
      httpOnly: true,
      path: "/",
      secure: true,
    });

    this.#headers.append("set-cookie", setCookie);
  }

  async validateSession() {
    const cookies = parse(this.#request.headers.get("cookie") || "");
    const signedSessionId: string | undefined = cookies[this.#cookieName];

    if (!signedSessionId) {
      return;
    }

    const sessionId = await unsignCookieValue(
      signedSessionId,
      this.#cookieSecret
    );

    if (sessionId === null) {
      // User or someone has tampered with cookie
      const cookie = serialize(this.#cookieName, "", {
        httpOnly: true,
        path: "/",
        secure: true,
        expires: new Date(0),
      });
      this.#headers.append("set-cookie", cookie);
      return;
    }

    const session = getAnonSession(sessionId);

    if (!session) {
      const cookie = serialize(this.#cookieName, "", {
        httpOnly: true,
        path: "/",
        secure: true,
        expires: new Date(0),
      });
      this.#headers.append("set-cookie", cookie);
      return;
    }

    if (session.expiresInSec <= getCurrentTimeInSec()) {
      // Session has expired
      deleteAnonSession(sessionId);
      return;
    }

    return session;
  }
}
