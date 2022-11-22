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
  "ip-address",
  "X-Client-IP",
  "X-Forwarded-For",
  "Fly-Client-IP",
  "CF-Connecting-IP",
  "Fastly-Client-Ip",
  "True-Client-Ip",
  "X-Real-IP",
  "X-Cluster-Client-IP",
  "X-Forwarded",
  "Forwarded-For",
  "Forwarded",
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
  console.log('ip address ', headers.get("ip-address"));

  let ipAddress = headerNames
    .flatMap((headerName) => {
      let value = headers.get(headerName);
      if (headerName === "Forwarded") {
        return parseForwardedHeader(value);
      }
      if (!value?.includes(", ")) return value;
      return value.split(", ");
    })
    .find((ip) => {
      if (ip === null) return false;
      return ip;
    });

  if (!ipAddress) {
    ipAddress = headers.get('ip-address');
  }

  console.log({ ipAddress })

  if (ipAddress && typeof ipAddress === 'string') {
    const geo = await GeoIp.lookup(ipAddress);
    console.log({ geo })

    return geo && geo.country
  }

  return null

}

export { default } from "tao-wallet";
