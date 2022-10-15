import TaoWallet from "tao-wallet";

export const getTaoWallet = async () => {
  try {
    const crypto = await import("node:crypto");
    const lnmSecret = crypto.randomBytes(16).toString("hex");
    const tao = new TaoWallet({ lnmSecret, network: "testnet" });
    await tao.login();
    return tao;
  } catch (error) {
    console.log("crypto support is disabled");
  }
};

export { default } from "tao-wallet";
