import crypto from "crypto";

const DEFAULT_SECRET = process.env.JWT_SECRET;

const base64UrlEncode = (value) => Buffer.from(value).toString("base64url");
const base64UrlDecode = (value) =>
  Buffer.from(value, "base64url").toString("utf8");

const getExpiryTimestamp = (expiresIn) => {
  const now = Math.floor(Date.now() / 1000);

  if (typeof expiresIn === "number") {
    return now + expiresIn;
  }

  const match = /^(\d+)([smhd])$/.exec(expiresIn || "24h");
  if (!match) {
    return now + 24 * 60 * 60;
  }

  const value = Number(match[1]);
  const unit = match[2];

  if (unit === "s") return now + value;
  if (unit === "m") return now + value * 60;
  if (unit === "h") return now + value * 60 * 60;
  return now + value * 24 * 60 * 60;
};

export const signJwt = (
  payload,
  expiresIn = "24h",
  secret = DEFAULT_SECRET,
) => {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: getExpiryTimestamp(expiresIn),
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(body));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64url");

  return `${signingInput}.${signature}`;
};

export const verifyJwt = (token, secret = DEFAULT_SECRET) => {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid or expired token");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid or expired token");
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64url");

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    throw new Error("Invalid or expired token");
  }

  try {
    if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
      throw new Error("Invalid or expired token");
    }
  } catch {
    throw new Error("Invalid or expired token");
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error("Invalid or expired token");
    }
    return payload;
  } catch {
    throw new Error("Invalid or expired token");
  }
};
