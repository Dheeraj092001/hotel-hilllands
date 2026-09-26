import { Router } from "express";
import { DestinationsController } from "./destinations.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

// Public
router.get("/", DestinationsController.list);
router.get("/:slug", DestinationsController.getBySlug);

// Admin
router.get("/admin/all", authenticate, requireAdmin, DestinationsController.listAdmin);
router.post("/", authenticate, requireAdmin, DestinationsController.create);
router.put("/:id", authenticate, requireAdmin, DestinationsController.update);
router.delete("/:id", authenticate, requireAdmin, DestinationsController.softDelete);

export default router;