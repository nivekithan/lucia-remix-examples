import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { auth } from "~/lib/db.server";

export async function loader({ request }: LoaderArgs) {
  const headers = new Headers();

  const authRequest = auth.handleRequest(request, headers);

  const validation = await authRequest.validateUser();

  const isLoggedIn = validation.session && (await validation.user);

  if (isLoggedIn) {
    return json(null, { headers });
  }

  return redirect("/email_verification/register", { headers });
}

export default function EmailVerificationHomePage() {
  return <h1>Hello there authenticated user</h1>;
}
