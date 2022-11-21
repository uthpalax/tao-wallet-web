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
      <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-y-0 md:divide-x">
        <Card
          name="Bitcoin"
          balance={balanceBtc}
          balance30DaysAgo={balance30DaysAgo.balanceBtc}
        />
        <Card
          name="USD"
          balance={balanceUsd}
          balance30DaysAgo={balance30DaysAgo.balanceUsd}
        />
        <Card
          name="Portfolio Value In USD"
          balance={parseFloat(usdEquivalent)}
          balance30DaysAgo={balance30DaysAgo.balanceUsd + parseFloat(balance30DaysAgo.usdEquivalent)}
        />
      </dl>
    </div>
  );
}
