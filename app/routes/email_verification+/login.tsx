import { json, type LoaderArgs } from "@remix-run/node";
import { Form, type V2_MetaFunction } from "@remix-run/react";
import { useId } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { InlineLink } from "~/components/ui/inlinLink";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function meta(): ReturnType<V2_MetaFunction> {
  return [{ title: "Email Verification | Lucia Auth" }];
}

export async function loader({ request }: LoaderArgs) {
  const userId = null;

  return json({ userId });
}

export default function LoginEmailVerification() {
  const emailInputId = useId();
  const passwordInputId = useId();

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Don't have an account ? Create new one at{" "}
          <InlineLink to="/email_verification/register">
            Register Page
          </InlineLink>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor={emailInputId}>Email</Label>
            <Input type="text" id={emailInputId} />
          </div>
          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor={passwordInputId}>Password</Label>
            <Input type="password" id={passwordInputId} />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
