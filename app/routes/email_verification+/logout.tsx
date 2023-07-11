import { type LoaderArgs, type ActionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";

export async function loader({ request }: LoaderArgs) {}

export async function action({ request }: ActionArgs) {}

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
