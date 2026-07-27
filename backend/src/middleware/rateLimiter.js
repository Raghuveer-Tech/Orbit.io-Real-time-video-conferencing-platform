// Generic factory so we can create limiters with different limits/windows
// for different routes (general API traffic vs. sensitive auth endpoints).
const createRateLimiter = ({ windowMs, max, message }) => {
  const store = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `${ip}`;

    if (!store.has(key)) {
      store.set(key, { count: 1, resetTime: Date.now() + windowMs });
      return next();
    }

    const record = store.get(key);
    if (Date.now() > record.resetTime) {
      store.set(key, { count: 1, resetTime: Date.now() + windowMs });
      return next();
    }

    record.count++;
    if (record.count > max) {
      return res.status(429).json({ message });
    }

    next();
  };
};

// General API rate limiter — 30 requests/min per IP
export const rateLimitMiddleware = () =>
  createRateLimiter({
    windowMs: 60000,
    max: 30,
    message: "Too many requests. Please try again later.",
  });

// Stricter limiter for login/register — 10 attempts per 15 min per IP,
// to slow down brute-force / credential-stuffing attempts.
export const authRateLimitMiddleware = () =>
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Please try again in 15 minutes.",
  });