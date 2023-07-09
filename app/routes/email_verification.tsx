import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "~/components/ui/header";
import { auth } from "~/lib/db.server";
import { LogoutButton } from "./email_verification+/logout";

export function meta(): ReturnType<V2_MetaFunction> {
  return [{ title: "Email Verification | Lucia Auth" }];
}

export async function loader({ request }: LoaderArgs) {
  const headers = new Headers();
  const authRequest = auth.handleRequest(request, headers);

  const validation = await authRequest.validateUser();
  const isLoggedIn = validation.session && (await validation.user);

  const isLogoutPage =
    new URL(request.url).pathname === "/email_verification/logout";

  return json(
    { showLogoutButton: Boolean(isLoggedIn) && !isLogoutPage },
    { headers }
  );
}

export default function EmailVerificationOutlet() {
  const { showLogoutButton } = useLoaderData<typeof loader>();

  return (
    <main className="container grid place-items-center py-10">
      <div className="flex items-center gap-x-4">
        <Header className="text-center py-10" size="3xl">
          Email Verification
        </Header>
        {showLogoutButton ? <LogoutButton /> : null}
      </div>
      <Outlet />
    </main>
  );
}
