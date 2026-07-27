import { Router } from "express";
import {
  addToHistory,
  getUserHistory,
  login,
  register,
  logout,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/security.js";
import { authRateLimitMiddleware } from "../middleware/rateLimiter.js";

const router = Router();
const authLimiter = authRateLimitMiddleware();

router.route("/login").post(authLimiter, login);
router.route("/register").post(authLimiter, register);
router.route("/logout").post(authMiddleware, logout);
router.route("/add_to_activity").post(authMiddleware, addToHistory);
router.route("/get_all_activity").get(authMiddleware, getUserHistory);

export default router;