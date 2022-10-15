import type { ReactNode } from "react";

interface propType {
  icon: ReactNode,
  title: string, 
  balance: string
}

export default function Card({ icon, title, balance }: propType) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-gray-500">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">
                  {balance}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
