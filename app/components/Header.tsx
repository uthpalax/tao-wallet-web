import Card from "./Card";

type HeaderProps = {
  walletBalance: {
    balanceBtc: number;
    balanceUsd: number;
    btcEquivalent: string;
    usdEquivalent: string;
  };
};

export default function Header({
  walletBalance: { balanceBtc, balanceUsd, usdEquivalent },
}: HeaderProps) {
  const balance30DaysAgo = {
    balanceBtc: 0,
    balanceUsd: 0,
    btcEquivalent: "0.0",
    usdEquivalent: "0.0",
  };
  return (
    <div>
      {/*<h3 className="text-lg font-medium leading-6 text-gray-900">
        Last 30 days
      </h3> */}
      <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-y-0 md:divide-x">
        <Card
          name="Bitcoin"
          balance={balanceBtc}
          balance30DaysAgo={balance30DaysAgo.balanceBtc}
        />
        <Card
          name="Usd"
          balance={balanceUsd}
          balance30DaysAgo={balance30DaysAgo.balanceUsd}
        />
        <Card
          name="Portfolio In Usd"
          balance={balanceUsd + parseFloat(usdEquivalent)}
          balance30DaysAgo={balance30DaysAgo.balanceUsd + parseFloat(balance30DaysAgo.usdEquivalent)}
        />
      </dl>
    </div>
  );
}
