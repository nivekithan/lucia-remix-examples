import { type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "~/components/ui/header";
import { LogoutButton } from "./email_verification+/logout";

export function meta(): ReturnType<V2_MetaFunction> {
  return [{ title: "Email Verification | Lucia Auth" }];
}

export async function loader({ request }: LoaderArgs) {
  return null;
}

export default function EmailVerificationOutlet() {
  const showLogoutButton = false;

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
