import { Router } from "express";
import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimit";
const router = Router();
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
export default router;
