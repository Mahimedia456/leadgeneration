import { Router } from "express";
import * as invitationController from "../controllers/invitation.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/token/:token", invitationController.getInvitationByToken);
router.post("/signup", invitationController.signupWithInvitation);

router.get("/", requireAuth, requireAdmin, invitationController.listInvitations);
router.post("/", requireAuth, requireAdmin, invitationController.createInvitation);
router.patch("/:invitationId/revoke", requireAuth, requireAdmin, invitationController.revokeInvitation);

export default router;