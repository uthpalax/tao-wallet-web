import TaoWallet from "tao-wallet";
import { getUserLnmSecret } from "~/models/user.server";
import { requireUserId } from "~/session.server";

export const getTaoWallet = async (request: Request) => {
  const userId = await requireUserId(request);
  const lnmSecret = await getUserLnmSecret(userId);

  const tao = new TaoWallet({ lnmSecret, network: process.env.NETWORK });
  await tao.login();
  return tao;
};

export { default } from "tao-wallet";
