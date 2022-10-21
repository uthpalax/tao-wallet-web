import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import { requireUserId } from "~/session.server";
import { getTaoWallet } from "~/utils/tao-wallet";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export async function action({ request }: ActionArgs) {
  await requireUserId(request);
  const tao = await getTaoWallet(request);
  const bitcoinAddress = await tao.fetchDepositAddress({
    type: "on-chain",
  });

  return json({
    bitcoinAddress,
  });
}

export default function NewInvoice() {
  const actionData = useActionData<typeof action>();
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(actionData?.bitcoinAddress)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1 className="text-lg font-medium leading-6 text-gray-900">
        Generate Bitcoin Address
      </h1>
      <div className="mt-8">
        <Form method="post" className="w-64 space-y-6">
          <div>
            <button
              type="submit"
              className="flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Generate
            </button>
          </div>
        </Form>
        {actionData?.bitcoinAddress && (
          <div>
            <textarea
              defaultValue={actionData.bitcoinAddress}
              className="mt-8 w-full rounded-md border border-gray-200 p-3"
              rows="3"
              readOnly
            ></textarea>
            <button
              type="button"
              onClick={handleCopyClick}
              className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isCopied ? "Copied" : "Copy"}
              <DocumentDuplicateIcon className="ml-3 -mr-1 h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
