import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { InlineLink } from "~/components/ui/inlinLink";
import { useForm, conform } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Field } from "~/components/form";
import { z } from "zod";

export async function loader({ request }: LoaderArgs) {}

const RegisterForEmailSchema = z.object({
  email: z
    .string()
    .nonempty(`Email is required`)
    .email("Provide valid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password length should be minimum of 8 characters"),
});

const ACTIONS = {
  register: "register",
} as const;

export async function action({ request }: ActionArgs) {}

export default function RegisterEmailVerification() {
  // const actionData = useActionData<typeof action>();

  // const lastSubmission = actionData?.formSubmission;

  const [form, { email, password }] = useForm({
    constraint: getFieldsetConstraint(RegisterForEmailSchema),
    lastSubmission: undefined,
    onValidate({ formData }) {
      return parse(formData, { schema: RegisterForEmailSchema });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create new account</CardTitle>
        <CardDescription>
          Already have an account ? Login to that account at{" "}
          <InlineLink to="/email_verification/login">Login Page</InlineLink>
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
            defaultValue={ACTIONS.register}
            hidden
          />
          <Button type="submit" size="lg">
            Create new account
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
