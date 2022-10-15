import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getTaoWallet } from "~/utils/tao-wallet";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const amountSats = formData.get("amountSats");
  if (typeof amountSats !== "string") {
    return json({
      errors: {
        amountSats:
          "Amount sats needs to be a whole number and larger than 1000",
      },
      depositInvoice: null,
    });
  }
  const tao = await getTaoWallet();

  const depositInvoice = await tao.fetchDepositAddress({
    type: "bolt11",
    amountSats: parseInt(amountSats),
  });

  return json({
    errors: null,
    depositInvoice,
  });
}

export default function NewInvoice() {
  const actionData = useActionData<typeof action>();

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Generate Lightning Invoice
        </h1>
      </div>
      <div className="mt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Form method="post" className="mt-4 sm:flex sm:max-w-md lg:mt-0">
            <label htmlFor="amount-in-sats" className="sr-only">
              Amount in satoshis
            </label>
            <input
              type="number"
              name="amountSats"
              id="amount-in-sats"
              required
              className="w-full min-w-0 appearance-none rounded-md border border-transparent bg-gray-100 py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:border-white focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 sm:max-w-xs"
              placeholder="Enter amount in satoshis"
            />
            <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-base font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Generate
              </button>
            </div>
            {actionData?.errors?.amountSats && (
              <div className="mt-2 text-red-700" id="title-error">
                {actionData.errors.amountSats}
              </div>
            )}
          </Form>
          {actionData?.depositInvoice && (
            <div className="mt-8 break-all rounded-md bg-gray-100 p-2">
              {actionData.depositInvoice}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
