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

  // Ads Manager / Marketing API
  getMetaAdAccounts,
  getMetaAdAccountCampaigns,
  getMetaAdAccountAdSets,
  syncMetaAdAccountCampaigns,

  // Meta Leads
  syncMetaLeads,
  getMetaLeads,
  getMetaLeadDetail,
  exportMetaLeads,
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

/* Ads Manager / Marketing API */
router.get("/ad-accounts", requireAuth, getMetaAdAccounts);
router.get("/ad-accounts/:adAccountId/campaigns", requireAuth, getMetaAdAccountCampaigns);
router.get("/ad-accounts/:adAccountId/adsets", requireAuth, getMetaAdAccountAdSets);
router.post("/ad-accounts/:adAccountId/sync-campaigns", requireAuth, syncMetaAdAccountCampaigns);

/* Meta Leads */
router.post("/leads/sync/:connectionId", requireAuth, syncMetaLeads);
router.get("/leads", requireAuth, getMetaLeads);
router.get("/leads/export", requireAuth, exportMetaLeads);
router.get("/leads/:leadId", requireAuth, getMetaLeadDetail);

/* Webhook */
router.get("/webhook", verifyMetaWebhook);
router.post("/webhook", receiveMetaWebhook);

export default router;