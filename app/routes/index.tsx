import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useTransition } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getTaoWallet } from "~/utils/tao-wallet";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Card from "~/components/Card";
import BitcoinLogo from "~/components/BitcoinLogo";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);

  const tao = await getTaoWallet(request);
  const walletBalance = await tao.fetchBalances();
  const onChainDepositAddress = await tao.fetchDepositAddress({
    type: "on-chain",
  });

  return json({
    walletBalance,
    onChainDepositAddress,
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
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome to Tao wallet
      </h1>
      <div className="mt-8">
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            icon={
              <BitcoinLogo
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            }
            title="Bitcoin"
            balance={data.walletBalance.btcEquivalent}
          />
          <Card
            icon={
              <CurrencyDollarIcon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            }
            title="USD"
            balance={data.walletBalance.usdEquivalent}
          />
        </div>
      </div>
      <div className="mt-8">
        <p>Onchain bitcoin deposit address </p>
        <p className="rounded-md bg-gray-100 p-2">
          {data.onChainDepositAddress}{" "}
        </p>
      </div>
    </div>
  );
}
