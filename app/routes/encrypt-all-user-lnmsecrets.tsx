import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { encryptAllSecrets } from "~/models/user.server";

export async function loader() {
  await encryptAllSecrets();
  return json({ data: "okay" });
}

export default function EncryptLnmSecrets() {
  const data = useLoaderData<typeof loader>();

  return <div>{JSON.stringify(data)}</div>;
}
