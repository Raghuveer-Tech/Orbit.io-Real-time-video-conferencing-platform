import { verifyJwt } from "../utils/jwt.js";

// Array URLs only
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://orbit-io-real-time-video-conferenci.vercel.app", //host appliction
];

// Custom CORS Middleware function
export const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;

  // origin allowed list
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
};

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = verifyJwt(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
