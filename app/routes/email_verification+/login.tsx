import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { z } from "zod";
import { Field } from "~/components/form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { InlineLink } from "~/components/ui/inlinLink";

export async function loader({ request }: LoaderArgs) {
  return null;
}

const LoginWithEmailSchema = z.object({
  email: z.string().nonempty("Email is required").email("Provide valid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password length should be minimum of 8 characters"),
});

const ACTIONS = {
  login: "login",
} as const;

export async function action({ request }: ActionArgs) {}

export default function LoginEmailVerification() {
  const [form, { email, password }] = useForm({
    constraint: getFieldsetConstraint(LoginWithEmailSchema),
    lastSubmission: undefined,
    onValidate({ formData }) {
      return parse(formData, { schema: LoginWithEmailSchema });
    },
  });

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
        <Form className="flex flex-col" {...form.props} method="POST">
          <Field
            className="flex flex-col gap-y-1.5"
            labelProps={{ children: "Email" }}
            inputProps={{ type: "email", ...conform.input(email) }}
            error={email.errors}
          />
          <Field
            className="flex flex-col gap-y-1.5"
            labelProps={{ children: "Password" }}
            inputProps={{ type: "password", ...conform.input(password) }}
            error={password.errors}
          />
          <input
            type="text"
            name="action"
            defaultValue={ACTIONS.login}
            hidden
          />
          <Button type="submit" size="lg">
            Login
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
