import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import Input from "~/components/elements/Input";
import Textarea from "~/components/elements/Textarea";
import Alert from "~/components/Alert";
import { requireUserId } from "~/session.server";
import { getTaoWallet } from "~/utils/tao-wallet";

export async function action({ request }: ActionArgs) {
  await requireUserId(request);
  const formData = await request.formData();
  const amountInSats = formData.get("amountInSats");
  const bitcoinAddress = formData.get("bitcoinAddress");

  if (typeof amountInSats !== "string") {
    return json({
      errors: {
        backend: null,
        amountInSats: "Please enter value",
        bitcoinAddress: null,
      },
      sent: false,
      amountInSats,
    });
  }

  if (bitcoinAddress == "") {
    return json({
      errors: {
        backend: null,
        amountInSats: null,
        bitcoinAddress: "Please enter a bitcoin address",
      },
      sent: false,
      amountInSats,
    });
  }

  const tao = await getTaoWallet(request);

  try {
    const data = await tao.send({
      type: "on-chain",
      address: bitcoinAddress,
      amountSats: parseInt(amountInSats),
    });
    console.log("data", data);

    return json({
      errors: null,
      amountInSats,
      sent: true,
    });
  } catch (e: any) {
    return json({
      errors: {
        backend: e.message,
        amountInSats: null,
        bitcoinAddress: null,
      },
      amountInSats: null,
      sent: false,
    });
  }
}

export default function SendBitcoin() {
  const actionData = useActionData<typeof action>();
  const [close, setClose] = useState(true);

  return (
    <div>
      {actionData?.sent && close && (
        <Alert
          type="success"
          title={`You have sent ${actionData.amountInSats} sats`}
          close={() => setClose(false)}
        />
      )}
      {actionData?.errors?.backend && close && (
        <Alert
          type="fail"
          title={actionData?.errors.backend}
          close={() => setClose(false)}
        />
      )}
      <h1 className="text-lg font-medium leading-6 text-gray-900">
        Send Onchain Bitcoin
      </h1>
      <div className="mt-8">
        <Form method="post" className="space-y-6">
          <div className="w-64">
            <Input
              label="Amount in satoshis"
              type="number"
              name="amountInSats"
              error={actionData?.errors?.amountInSats}
              required
            />
          </div>
          <Textarea
            label="Bitcoin address"
            name="bitcoinAddress"
            error={actionData?.errors?.bitcoinAddress}
            required
            rows={2}
          />
          <div>
            <button
              type="submit"
              className="flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Send
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
