// Core Environment
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Standard Imports
import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";

// Application-Specific Modules
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";
import { connectToDB } from "./config/mongoDB.config.js";
import { authMiddleware, corsMiddleware } from "./middleware/security.js";
import { rateLimitMiddleware } from "./middleware/rateLimiter.js";
import {
  notFoundHandler,
  globalErrorHandler,
  registerProcessSafetyNets,
} from "./middleware/errorHandler.js";

const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variable(s): ${missingEnvVars.join(", ")}. ` +
      `Check your .env file (see .env.example).`,
  );
  process.exit(1);
}

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const PORT = process.env.PORT || 8000;
app.set("port", PORT);

app.use(corsMiddleware);
app.use(rateLimitMiddleware());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));

// API Routes
app.use("/api/v1/users", userRoutes);

// 404 + Global error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);
registerProcessSafetyNets();

const startServer = async () => {
  try {
    await connectToDB();

    server.listen(PORT, () => {
      console.log(
        `[Orbit.io Engine Active] Infrastructure running perfectly on port: ${PORT}`,
      );
    });
  } catch (error) {
    console.error("Critical System Boot Failure:", error);
    process.exit(1);
  }
};

startServer();