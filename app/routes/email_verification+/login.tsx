import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import {
  type ActionArgs,
  json,
  redirect,
  type LoaderArgs,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
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
import { auth } from "~/lib/db.server";
import { getActionFromFormData } from "~/lib/forms";
import { invariantResponse, isValidAction } from "~/lib/utils";

export async function loader({ request }: LoaderArgs) {
  const headers = new Headers();
  const authRequest = auth.handleRequest(request, headers);

  const validation = await authRequest.validateUser();

  if (validation.user && validation.session) {
    return redirect("/email_verification", { headers });
  }

  return json(null, { headers });
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

export async function action({ request }: ActionArgs) {
  const headers = new Headers();
  const authRequest = auth.handleRequest(request, headers);

  const validation = await authRequest.validateUser();

  const isUserLoggedIn = validation.session && (await validation.user);

  if (isUserLoggedIn) {
    return redirect("/email_verification", { headers });
  }

  const formData = await request.formData();

  const action = getActionFromFormData(formData);

  invariantResponse(action, "Action is required", { headers });
  invariantResponse(isValidAction(action, ACTIONS), "Invalid action", {
    headers,
  });

  if (action === "login") {
    const submission = await parse(formData, {
      schema: (intent) => {
        if (intent === "submit") {
          return LoginWithEmailSchema.superRefine(
            async ({ email, password }, ctx) => {
              const user = await auth
                .useKey("email", email, password)
                .catch((err: Error) => err);

              if (user instanceof Error) {
                console.log(user);
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Invalid email or password",
                  path: ["password"],
                });
                return;
              }

              return;
            }
          );
        }

        return LoginWithEmailSchema;
      },
      acceptMultipleErrors() {
        return true;
      },
      async: true,
    });

    const loginUser = submission.intent === "submit" && submission.value;

    if (!loginUser) {
      const status = submission.value ? "ok" : "error";
      return json(
        {
          lastSubmission: submission,
          status,
        } as const,
        { headers, status: status === "ok" ? 200 : 400 }
      );
    }

    const email = loginUser.email;
    const password = loginUser.password;

    const key = await auth.useKey("email", email, password);
    const userId = key.userId;

    const userSession = await auth.createSession(userId);

    authRequest.setSession(userSession);

    return json(
      {
        status: "user_logged_in",
        lastSubmission: submission,
      } as const,
      { headers }
    );
  }

  return redirect(request.url, { headers });
}

export default function LoginEmailVerification() {
  const actionData = useActionData<typeof action>();

  const [form, { email, password }] = useForm({
    constraint: getFieldsetConstraint(LoginWithEmailSchema),
    lastSubmission: actionData?.lastSubmission,
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
