import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";
import * as invitationController from "../controllers/invitation.controller.js";
import * as workspaceController from "../controllers/workspace.controller.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

router.use(requireAuth, requireAdmin);

/* ---------------- Roles & Permissions ---------------- */

router.get("/roles-permissions", adminController.getRolesPermissions);
router.patch("/roles-permissions/:role", adminController.updateRolePermissions);

/* ---------------- Invitations ---------------- */

router.post("/invitations", invitationController.createInvitation);
router.get("/invitations", invitationController.listInvitations);
router.patch(
  "/invitations/:invitationId/revoke",
  invitationController.revokeInvitation
);

/* ---------------- Workspaces ---------------- */

router.post("/workspaces", workspaceController.createWorkspace);
router.post(
  "/workspaces/:workspaceId/members",
  workspaceController.addWorkspaceMember
);

export default router;