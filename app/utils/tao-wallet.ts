import TaoWallet from "tao-wallet";
import GeoIp from "fast-geoip";
import { getUserLnmSecret } from "~/models/user.server";
import { requireUserId } from "~/session.server";

export const getTaoWallet = async (request: Request) => {
  const userId = await requireUserId(request);
  const lnmSecret = await getUserLnmSecret(userId);

  const tao = new TaoWallet({ lnmSecret, network: process.env.NETWORK });
  await tao.login();
  return tao;
};

const headerNames = Object.freeze([
  "fly-client-ip",
  "x-client-ip",
  "x-forwarded-for",
  "cf-connecting-ip",
  "fastly-client-ip",
  "true-client-ip",
  "x-real-ip",
  "x-cluster-client-ip",
  "x-forwarded",
  "forwarded-for",
  "forwarded",
] as const);


const getHeaders = (request: Request | Headers): Headers => {
  if (request instanceof Request) {
    return request.headers;
  }

  return request;
}

const parseForwardedHeader = (value: string | null): string | null => {
  if (!value) return null;
  for (let part of value.split(";")) {
    if (part.startsWith("for=")) return part.slice(4);
    continue;
  }
  return null;
}

export const getClientIPAddressCountry = async (
  request: Request
): Promise<string | null> => {
  let headers = getHeaders(request);

  let ipAddress = headerNames
    .flatMap((headerName) => {
      let value = headers.get(headerName);
      if (headerName === "forwarded") {
        return parseForwardedHeader(value);
      }
      if (!value?.includes(", ")) return value;
      return value.split(", ");
    })
    .find((ip) => {
      if (ip === null) return false;
      return ip;
    });

  console.log({ ipAddress })

  if (ipAddress && typeof ipAddress === 'string') {
    const geo = await GeoIp.lookup(ipAddress);
    console.log({ geo })

    return geo && geo.country
  }

  return null

}

export { default } from "tao-wallet";
