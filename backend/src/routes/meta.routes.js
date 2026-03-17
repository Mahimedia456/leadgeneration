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

/* OAuth */
router.get("/oauth-url", requireAuth, getMetaOAuthUrl);
router.post("/exchange-code", requireAuth, exchangeMetaCode);

/* Connections */
router.get("/connections", requireAuth, getMetaConnections);
router.post("/connections/:connectionId/sync", requireAuth, syncMetaConnection);
router.delete("/connections/:connectionId", requireAuth, deleteMetaConnection);

/* Facebook Pages */
router.get("/pages", requireAuth, getMetaPages);
router.get("/pages/:pageId", requireAuth, getMetaPageDetail);

/* Instagram */
router.get("/instagram-accounts", requireAuth, getMetaInstagramAccounts);
router.get("/instagram-accounts/:accountId", requireAuth, getMetaInstagramDetail);

/* Webhook */
router.get("/webhook", verifyMetaWebhook);
router.post("/webhook", receiveMetaWebhook);

export default router;