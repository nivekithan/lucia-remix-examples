import { type LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {}

export default function EmailVerificationHomePage() {
  return <h1>Hello there authenticated user</h1>;
}
