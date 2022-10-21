import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import Alert from "~/components/Alert";
import Input from "~/components/elements/Input";
import Textarea from "~/components/elements/Textarea";
import { requireUserId } from "~/session.server";
import { getTaoWallet } from "~/utils/tao-wallet";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export async function action({ request }: ActionArgs) {
  await requireUserId(request);
  const formData = await request.formData();
  const amountInSats = formData.get("amountInSats");

  if (typeof amountInSats !== "string" || parseInt(amountInSats) < 100) {
    return json({
      errors: {
        amountInSats: "Amount must be larger than 1000 sats",
        backend: null,
      },
      depositInvoice: null,
    });
  }
  const tao = await getTaoWallet(request);

  try {
    const depositInvoice = await tao.fetchDepositAddress({
      type: "bolt11",
      amountSats: parseInt(amountInSats),
    });

    return json({
      errors: null,
      depositInvoice,
    });
  } catch (e: any) {
    return json({
      errors: {
        backend: e.message,
        amountInSats: null,
      },
      depositInvoice: null,
    });
  }
}

export default function NewInvoice() {
  const [close, setClose] = useState(true);
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
    copyTextToClipboard(actionData?.depositInvoice)
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
        Generate Lightning Invoice
      </h1>
      {actionData?.errors?.backend && close && (
        <Alert
          type="fail"
          title={actionData?.errors.backend}
          close={() => setClose(false)}
        />
      )}
      <div className="mt-8">
        <Form method="post" className="w-64 space-y-6">
          <Input
            label="Amount in satoshis"
            type="number"
            name="amountInSats"
            error={actionData?.errors?.amountInSats}
            required
          />
          <div>
            <button
              type="submit"
              className="flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Generate
            </button>
          </div>
        </Form>
        {actionData?.depositInvoice && (
          <div className="mt-6">
            <Textarea
              label="Lightning invoice"
              defaultValue={actionData.depositInvoice}
              className="mt-8 w-full rounded-md border border-gray-200 p-3 md:h-48 lg:h-32"
              name="lightningInvoice"
              rows={9}
              readOnly
            ></Textarea>
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
