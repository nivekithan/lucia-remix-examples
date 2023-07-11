import { type LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  return null;
}

export default function EmailVerificationHomePage() {
  return <h1>Hello there authenticated user</h1>;
}
