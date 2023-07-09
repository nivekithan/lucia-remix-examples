import {
  redirect,
  type LoaderArgs,
  json,
  type ActionArgs,
} from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/lib/db.server";

export async function loader({ request }: LoaderArgs) {
  const headers = new Headers();
  const authRequest = auth.handleRequest(request, headers);

  const validation = await authRequest.validateUser();
  const isLoggedIn = validation.session && (await validation.user);

  if (!isLoggedIn) {
    return redirect("/email_verification", { headers });
  }

  return json(null, { headers });
}

export async function action({ request }: ActionArgs) {
  const headers = new Headers();
  const authRequest = auth.handleRequest(request, headers);

  const validation = await authRequest.validateUser();
  const isLoggedIn = validation.session && (await validation.user);

  if (!isLoggedIn) {
    return redirect("/email_verification", { headers });
  }

  await auth.invalidateSession(validation.session.sessionId);
  authRequest.setSession(null);

  return json(null, { headers });
}

export default function LogoutPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Do you want to Logout ?</CardTitle>
      </CardHeader>
      <CardFooter className="flex gap-x-4">
        <Form method="POST">
          <Button type="submit">Yes. Log me out</Button>
        </Form>
        <Button variant="secondary" asChild>
          <Link to="/email_verification">No. Take me to home page</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
const ROUTE_PATH = "/email_verification/logout";

export function LogoutButton() {
  return (
    <Form method="POST" action={ROUTE_PATH}>
      <Button type="submit">Logout</Button>
    </Form>
  );
}
