// 404 Handler — undefined route/API hit ,  error
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
};

// Global Error Handler
export const globalErrorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err);

  const isProduction = process.env.NODE_ENV === "production";

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server",
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export const registerProcessSafetyNets = () => {
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Promise Rejection:", reason);
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
  });
};
