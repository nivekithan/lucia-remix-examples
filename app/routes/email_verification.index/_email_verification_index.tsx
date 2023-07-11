import { redirect, type LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AuthRequest } from "~/auth/request.server";

export async function loader({ request }: LoaderArgs) {
  const headers = new Headers();

  const authRequest = new AuthRequest(request, headers);

  const session = await authRequest.validateSession();

  if (!session) {
    return redirect("/email_verification/register", { headers });
  }

  const isAnonSession = session.type === "anon";

  return json({ isAnonSession }, { headers });
}

export default function EmailVerificationHomePage() {
  const { isAnonSession } = useLoaderData<typeof loader>();

  return (
    <p>
      {isAnonSession
        ? "Verify your email to continue"
        : "Hello there authenticated user"}
    </p>
  );
}
