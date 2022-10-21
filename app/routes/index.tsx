import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useTransition } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getTaoWallet } from "~/utils/tao-wallet";
import Header from "~/components/Header";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);

  const tao = await getTaoWallet(request);
  const walletBalance = await tao.fetchBalances();

  return json({
    walletBalance,
  });
}

export default function Index() {
  const transition = useTransition();
  const data = useLoaderData<typeof loader>();

  if (transition.state === "loading") {
    return (
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        loading...
      </div>
    );
  }

  return (
    <div>
      <Header walletBalance={data?.walletBalance} />
    </div>
  );
}
