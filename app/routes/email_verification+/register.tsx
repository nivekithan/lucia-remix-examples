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
import { json, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Field } from "~/components/form";
import { z } from "zod";
import { getUser } from "~/auth/auth";
import { BAD_REQUEST } from "~/lib/statusCode";

export async function loader({ request }: LoaderArgs) {
  return null;
}

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

export function generateZodSchema(intent: string) {
  const actionSchema = z.literal(ACTIONS.register);

  if (intent === "submit") {
    return z
      .intersection(z.object({ action: actionSchema }), RegisterForEmailSchema)
      .superRefine(({ email }, ctx) => {
        const user = getUser(email);

        if (user) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "There is an user with that email",
            path: ["email"],
          });
          return;
        }

        return;
      });
  } else {
    return z.intersection(
      z.object({
        action: z
          .union([actionSchema, z.literal("DEFAULT")])
          .default("DEFAULT"),
      }),
      RegisterForEmailSchema
    );
  }
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const lastSubmission = await parse(formData, {
    schema: generateZodSchema,
    acceptMultipleErrors() {
      return true;
    },
    async: true,
  });

  if (
    lastSubmission.intent !== "submit" ||
    !lastSubmission.value ||
    lastSubmission.value.action === "DEFAULT"
  ) {
    return json({ lastSubmission } as const, { status: BAD_REQUEST });
  }
}

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
