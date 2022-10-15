import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getTaoWallet } from "~/utils/tao-wallet";
import {
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import Card from '~/components/Card';
import BitcoinLogo from '~/components/BitcoinLogo';

export async function loader() {
  const tao = await getTaoWallet();
  const walletBalance = await tao.fetchBalances();
  const onChainDepositAddress = await tao.fetchDepositAddress({ type: 'on-chain' });

  return json({
    walletBalance,
    onChainDepositAddress
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome to Tao wallet
        </h1>
      </div>
      <div className="mt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card 
              icon={<BitcoinLogo className="h-6 w-6 text-gray-400" aria-hidden="true" />} 
              title="Bitcoin" 
              balance={data.walletBalance.btcEquivalent} 
            /> 
            <Card 
              icon={<CurrencyDollarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />} 
              title="USD" 
              balance={data.walletBalance.usdEquivalent} 
            /> 
          </div>
        </div>
      </div>
      <div className="mt-8 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p>Onchain bitcoin deposit address - <span className="p-2 bg-gray-100 rounded-md">{data.onChainDepositAddress}</span> </p>
      </div>
    </main>
  );
}
