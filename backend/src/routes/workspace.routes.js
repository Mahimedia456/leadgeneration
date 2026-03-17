import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";
import * as workspaceController from "../controllers/workspace.controller.js";

const router = Router();

router.get("/mine", requireAuth, workspaceController.getMyWorkspaces);
router.get("/", requireAuth, requireAdmin, workspaceController.getAllWorkspaces);
router.get("/:workspaceId", requireAuth, workspaceController.getWorkspaceById);
router.get("/:workspaceId/members", requireAuth, workspaceController.getWorkspaceMembers);

router.post("/", requireAuth, requireAdmin, workspaceController.createWorkspace);
router.patch("/:workspaceId", requireAuth, requireAdmin, workspaceController.updateWorkspace);
router.delete("/:workspaceId", requireAuth, requireAdmin, workspaceController.deleteWorkspace);

router.post(
  "/:workspaceId/members",
  requireAuth,
  requireAdmin,
  workspaceController.addWorkspaceMember
);

export default router;