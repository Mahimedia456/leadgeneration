import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.get("/me/workspaces", requireAuth, authController.meWorkspaces);

export default router;