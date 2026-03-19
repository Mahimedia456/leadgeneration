import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  listCampaigns,
  getCampaignDetail,
  listAdSets,
  deleteCampaign,
} from "../controllers/campaign.controller.js";

const router = Router();

router.get("/", requireAuth, listCampaigns);
router.get("/ad-sets", requireAuth, listAdSets);
router.get("/:id", requireAuth, getCampaignDetail);
router.delete("/:id", requireAuth, deleteCampaign);

export default router;