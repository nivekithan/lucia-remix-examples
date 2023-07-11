import { redirect, type LoaderArgs, json } from "@remix-run/node";
import { AuthRequest } from "~/auth/request.server";

export async function loader({ request }: LoaderArgs) {
  const headers = new Headers();

  const authRequest = new AuthRequest(request, headers);

  const session = await authRequest.validateSession();

  if (!session) {
    return redirect("/email_verification/register", { headers });
  }

  return json(null, { headers });
}

export default function EmailVerificationHomePage() {
  return <h1>Hello there authenticated user</h1>;
}
