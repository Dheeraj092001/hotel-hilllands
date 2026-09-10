import { Router } from "express";
import { authLimiter } from "../../middleware/rateLimiter";
import { authenticate } from "../../middleware/authenticate";
import { AuthController } from "./auth.controller";

const router = Router();
const controller = new AuthController();

// Public routes
router.post("/register", authLimiter, (req, res, next) => controller.register(req, res, next));
router.post("/login", authLimiter, (req, res, next) => controller.login(req, res, next));
router.post("/google", authLimiter, (req, res, next) => controller.googleLogin(req, res, next));

// Protected routes
router.get("/me", authenticate, (req, res, next) => controller.me(req as any, res, next));
router.post("/logout", authenticate, (req, res, next) => controller.logout(req as any, res, next));

export default router;
