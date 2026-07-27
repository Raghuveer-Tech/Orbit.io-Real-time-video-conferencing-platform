export const rateLimitMiddleware = () => {
    const store = new Map();

    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const key = `${ip}`;

        if (!store.has(key)) {
            store.set(key, { count: 1, resetTime: Date.now() + 60000 });
            return next();
        }

        const record = store.get(key);
        if (Date.now() > record.resetTime) {
            store.set(key, { count: 1, resetTime: Date.now() + 60000 });
            return next();
        }

        record.count++;
        if (record.count > 30) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }

        next();
    };
};
