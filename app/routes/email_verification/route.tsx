import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData, type V2_MetaFunction } from "@remix-run/react";

export function meta(): ReturnType<V2_MetaFunction> {
  return [{ title: "Email Verification | Lucia Auth" }];
}

export async function loader({ request }: LoaderArgs) {
  const userId = null;

  return json({ userId });
}

export default function EmailVerificationHomePage() {
  const { userId } = useLoaderData<typeof loader>();

  const isLoggedIn = Boolean(userId);

  return <h1>Is Logged In : {JSON.stringify(isLoggedIn)}</h1>;
}
