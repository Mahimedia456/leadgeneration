import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, userController.listUsers);
router.get("/:userId", requireAuth, userController.getUser);
router.post("/", requireAuth, userController.createUser);
router.patch("/:userId", requireAuth, userController.updateUser);
router.delete("/:userId", requireAuth, userController.deleteUser);

export default router;