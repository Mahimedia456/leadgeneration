import { Router } from "express";
import * as brandController from "../controllers/brand.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, brandController.listBrands);
router.get("/:brandId", requireAuth, brandController.getBrand);
router.get("/:brandId/workspaces", requireAuth, brandController.listBrandWorkspaces);

router.post("/", requireAuth, brandController.createBrand);
router.patch("/:brandId", requireAuth, brandController.updateBrand);
router.delete("/:brandId", requireAuth, brandController.deleteBrand);

export default router;