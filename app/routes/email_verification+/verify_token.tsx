import {
  redirect,
  type LoaderArgs,
  json,
  type ActionArgs,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { verifyToken } from "~/auth/auth.server";
import { AuthRequest } from "~/auth/request.server";
import { Button } from "~/components/ui/button";
import { BAD_REQUEST } from "~/lib/statusCode";

export async function loader({ request }: LoaderArgs) {
  const headers = new Headers();
  const authRequest = new AuthRequest(request, headers);

  const session = await authRequest.validateSession();
  if (!session) {
    return redirect("/email_verification", { headers });
  }

  if (session.type !== "anon") {
    return redirect("/email_verification", { headers });
  }

  const token = new URL(request.url).searchParams.get("token");

  return json({ token }, { headers });
}

export async function action({ request }: ActionArgs) {
  const headers = new Headers();
  const authRequest = new AuthRequest(request, headers);

  const session = await authRequest.validateSession();

  if (!session) {
    return redirect("/email_verification", { headers });
  }

  if (session.type !== "anon") {
    return redirect("/email_verification", { headers });
  }

  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return json({ status: false, error: "Provide token param" } as const, {
      status: BAD_REQUEST,
      headers,
    });
  }

  const tokenSession = await verifyToken(token, session.email);

  if (!tokenSession) {
    return json({ status: false, error: "Invalid Token" } as const, {
      status: BAD_REQUEST,
      headers,
    });
  }

  
}

export default function VerifyTokenPage() {
  const { token } = useLoaderData<typeof loader>();

  return token ? (
    <Form method="POST">
      <Button type="submit">Click here to verify</Button>;
    </Form>
  ) : (
    <p>You have not passed verification token</p>
  );
}
