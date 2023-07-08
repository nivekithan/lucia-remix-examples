import type { V2_MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Header } from "~/components/ui/header";

export function meta(): ReturnType<V2_MetaFunction> {
  return [{ title: "Email Verification | Lucia Auth" }];
}

export default function EmailVerificationOutlet() {
  return (
    <main className="container grid place-items-center py-10">
      <div>
        <Header className="text-center py-10" size="3xl">
          Email Verification
        </Header>
        <Outlet />
      </div>
    </main>
  );
}
