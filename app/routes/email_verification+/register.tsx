import { Form, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { InlineLink } from "~/components/ui/inlinLink";
import { useForm, conform } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, type ActionArgs, redirect } from "@remix-run/node";
import { getActionFromFormData } from "~/lib/forms";
import { boolToNum, invariantResponse } from "~/lib/utils";
import { Field } from "~/components/form";
import { z } from "zod";
import { auth } from "~/lib/db.server";
import { LuciaError } from "lucia-auth";

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

export async function action({ request }: ActionArgs) {
  const formdata = await request.formData();

  const action = getActionFromFormData(formdata);

  invariantResponse(action, `Action is required`);
  invariantResponse(action in ACTIONS, `Invalid actions`);

  const validAction = action as keyof typeof ACTIONS;

  if (validAction === "register") {
    const submission = await parse(formdata, {
      schema: (intent) => {
        /**
         * conform can ask us to validate the fields before the user has submitted.
         *
         * Validating whether the provided email is unique or not should be done only
         * after the user has submitted the form not while typing the form.
         *
         */
        if (intent === "submit") {
          return RegisterForEmailSchema.superRefine(async ({ email }, ctx) => {
            const user = await auth
              .getKey("email", email)
              .catch((err: LuciaError) => err);

            const isUserExists = !(user instanceof LuciaError);

            if (isUserExists) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "A user already exists with this email",
                path: ["email"],
              });
              return;
            }
          });
        }

        return RegisterForEmailSchema;
      },
      acceptMultipleErrors() {
        return true;
      },
      async: true,
    });

    const createUser = submission.intent === "submit" && submission.value;

    if (!createUser) {
      return json({ status: "error", formSubmission: submission } as const);
    }

    const email = createUser.email;
    const password = createUser.password;

    const createdUser = await auth.createUser({
      primaryKey: { providerId: "email", providerUserId: email, password },
      attributes: {
        verified: boolToNum(false),
        email: email,
      },
    });

    return json({
      status: "account_created",
      formSubmission: submission,
      email: createdUser.email,
    } as const);
  }

  return redirect(request.url);
}
export default function RegisterEmailVerification() {
  const actionData = useActionData<typeof action>();

  const accountCreated = actionData?.status === "account_created";
  const lastSubmission = actionData?.formSubmission;

  const [form, { email, password }] = useForm({
    constraint: getFieldsetConstraint(RegisterForEmailSchema),
    lastSubmission: lastSubmission,
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
          <input type="text" name="action" defaultValue="register" hidden />
          <Button type="submit" size="lg">
            Create new account
          </Button>
        </Form>
      </CardContent>
      <CardFooter>
        {accountCreated ? `Account with email ${actionData.email}` : null}
      </CardFooter>
    </Card>
  );
}
