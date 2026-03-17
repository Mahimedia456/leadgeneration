import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  getMetaOAuthUrl,
  exchangeMetaCode,
  getMetaConnections,
  syncMetaConnection,
  deleteMetaConnection,
  getMetaPages,
  getMetaPageDetail,
  getMetaInstagramAccounts,
  getMetaInstagramDetail,
  verifyMetaWebhook,
  receiveMetaWebhook,
} from "../controllers/meta.controller.js";

const router = Router();

router.get("/oauth-url", requireAuth, getMetaOAuthUrl);
router.post("/exchange-code", requireAuth, exchangeMetaCode);

router.get("/connections", requireAuth, getMetaConnections);
router.post("/connections/:connectionId/sync", requireAuth, syncMetaConnection);
router.delete("/connections/:connectionId", requireAuth, deleteMetaConnection);

router.get("/pages", requireAuth, getMetaPages);
router.get("/pages/:pageId", requireAuth, getMetaPageDetail);

router.get("/instagram-accounts", requireAuth, getMetaInstagramAccounts);
router.get("/instagram-accounts/:accountId", requireAuth, getMetaInstagramDetail);

router.get("/webhook", verifyMetaWebhook);
router.post("/webhook", receiveMetaWebhook);

export default router;