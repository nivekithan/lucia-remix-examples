import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const userId = null;

  return json({ userId });
}

export default function EmailVerificationHomePage() {
  const { userId } = useLoaderData<typeof loader>();

  const isLoggedIn = Boolean(userId);

  return <h1>Is Logged In : {JSON.stringify(isLoggedIn)}</h1>;
}
