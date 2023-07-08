import { redirect, type V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Lucia Auth" },
    { name: "description", content: "Implementing various auth usings lucia" },
  ];
};

export async function loader() {
  return redirect("/email_verification_2");
}
