import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { classNames } from "~/utils/index";

interface CardPropType {
  name: string;
  balance: number;
  balance30DaysAgo: number;
}

export default function Card({
  name,
  balance,
  balance30DaysAgo,
}: CardPropType) {
  return (
    <div className="px-4 py-5 md:p-4">
      <dt className="text-base font-normal text-gray-900">{name}</dt>
      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
        <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
          {balance}
          {balance30DaysAgo != 0 && (
            <span className="ml-2 text-sm font-medium text-gray-500">
              from {balance30DaysAgo}
            </span>
          )}
        </div>

        {balance30DaysAgo != 0 && (
          <div
            className={classNames(
              balance > balance30DaysAgo
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800",
              "inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0"
            )}
          >
            {balance > balance30DaysAgo ? (
              <ArrowUpIcon
                className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                aria-hidden="true"
              />
            ) : (
              <ArrowDownIcon
                className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                aria-hidden="true"
              />
            )}
            <span className="sr-only">
              {balance > balance30DaysAgo ? "Increased" : "Decreased"} by
            </span>
            {(((balance - balance30DaysAgo) * 100) / balance30DaysAgo).toFixed(
              2
            )}
            %
          </div>
        )}
      </dd>
    </div>
  );
}
