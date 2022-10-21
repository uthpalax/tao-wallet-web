import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import Textarea from "~/components/elements/Textarea";
import Alert from "~/components/Alert";
import { requireUserId } from "~/session.server";
import { getTaoWallet } from "~/utils/tao-wallet";

export async function action({ request }: ActionArgs) {
  await requireUserId(request);
  const formData = await request.formData();
  const lightningInvoice = formData.get("lightningInvoice");

  if (lightningInvoice == "") {
    return json({
      errors: {
        backend: null,
        lightningInvoice: "Please enter a lightning invoice",
      },
      sent: false,
    });
  }

  const tao = await getTaoWallet(request);
  try {
    await tao.send({
      type: "bolt11",
      address: lightningInvoice,
    });

    return json({
      errors: null,
      sent: true,
    });
  } catch (e: any) {
    return json({
      errors: {
        backend: e.message,
        lightningInvoice: null,
      },
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
        <Alert type="success" title={`Sent`} close={() => setClose(false)} />
      )}
      {actionData?.errors?.backend && close && (
        <Alert
          type="fail"
          title={actionData?.errors.backend}
          close={() => setClose(false)}
        />
      )}
      <h1 className="text-lg font-medium leading-6 text-gray-900">
        Send Bitcoin over lightning
      </h1>
      <div className="mt-8">
        <Form method="post" className="space-y-6">
          <Textarea
            label="Lightning invoice"
            name="lightningInvoice"
            error={actionData?.errors?.lightningInvoice}
            required
            rows={5}
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
