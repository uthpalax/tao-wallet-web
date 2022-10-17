import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation, useTransition } from "@remix-run/react";
import { useState } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {
  Bars3Icon,
  HomeIcon,
  BanknotesIcon,
  PaperAirplaneIcon,
  ArrowsRightLeftIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

import type { HeroIcon } from "~/types";
import MobileMenu from "~/components/MobileMenu";
import SideBarDesktop from "~/components/SideBarDesktop";

import { getUser } from "./session.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Tao Wallet Web",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

const navigation: { name: string; href: string; icon: HeroIcon }[] = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Receive", href: "/invoices/new", icon: BanknotesIcon },
  {
    name: "Send Lightning Bitcoin",
    href: "/invoices/lightning-send",
    icon: BoltIcon,
  },
  {
    name: "Send Onchain Bitcoin",
    href: "/invoices/bitcoin-send",
    icon: PaperAirplaneIcon,
  },
  { name: "Swap", href: "/swap", icon: ArrowsRightLeftIcon },
];

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const transition = useTransition();

  function currentRoute(path: string) {
    return path === location.pathname;
  }

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {user ? (
          <div>
            <MobileMenu
              currentRoute={currentRoute}
              navigation={navigation}
              setSidebarOpen={setSidebarOpen}
              sidebarOpen={sidebarOpen}
              user={user}
            />
            <SideBarDesktop
              currentRoute={currentRoute}
              navigation={navigation}
              user={user}
            />
            <div className="flex flex-1 flex-col md:pl-64">
              <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
                <button
                  type="button"
                  className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <main className="flex-1">
                <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                  {transition.state === "loading" ? "loading..." : <Outlet />}
                </div>
              </main>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
