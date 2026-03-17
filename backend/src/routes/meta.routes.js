import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  exchangeMetaCode,
  verifyMetaWebhook,
  receiveMetaWebhook,
} from "../controllers/meta.controller.js";

const router = Router();

router.post("/exchange-code", requireAuth, exchangeMetaCode);

router.get("/webhook", verifyMetaWebhook);
router.post("/webhook", receiveMetaWebhook);

export default router;