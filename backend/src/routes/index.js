import { Router } from "express";
import authRoutes from "./auth.routes.js";
import workspaceRoutes from "./workspace.routes.js";
import invitationRoutes from "./invitation.routes.js";
import adminRoutes from "./admin.routes.js";
import brandRoutes from "./brand.routes.js";
import userRoutes from "./user.routes.js";
import metaRoutes from "./meta.routes.js";
import campaignRoutes from "./campaign.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/brands", brandRoutes);
router.use("/invitations", invitationRoutes);
router.use("/admin", adminRoutes);
router.use("/meta", metaRoutes);
router.use("/campaigns", campaignRoutes);

export default router;