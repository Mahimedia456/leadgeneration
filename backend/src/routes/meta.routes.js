import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import * as metaController from "../controllers/meta.controller.js";

const router = Router();

router.get("/oauth/url", requireAuth, metaController.getMetaOAuthUrl);
router.get("/oauth/callback", metaController.handleMetaOAuthCallback);
router.post("/complete", requireAuth, metaController.completeMetaConnection);

router.get("/connections", requireAuth, metaController.getConnections);
router.post(
  "/connections/:connectionId/sync",
  requireAuth,
  metaController.syncMetaConnection
);
router.delete(
  "/connections/:connectionId",
  requireAuth,
  metaController.removeConnection
);

router.get("/pages", requireAuth, metaController.getPages);
router.get("/pages/:pageId", requireAuth, metaController.getPageDetail);

router.get("/instagram", requireAuth, metaController.getInstagramAccounts);
router.get(
  "/instagram/:accountId",
  requireAuth,
  metaController.getInstagramAccountDetail
);

router.get("/leads", requireAuth, metaController.getLeads);

router.get("/webhooks", metaController.verifyMetaWebhook);
router.post("/webhooks", metaController.receiveMetaWebhook);

export default router;