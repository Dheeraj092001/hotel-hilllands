import { Router } from "express";
import { TourBookingsController } from "./tour-bookings.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

// Admin only
router.get("/", authenticate, requireAdmin, TourBookingsController.list);
router.get("/stats", authenticate, requireAdmin, TourBookingsController.stats);
router.get("/:id", authenticate, requireAdmin, TourBookingsController.getById);
router.post("/", authenticate, requireAdmin, TourBookingsController.create);
router.patch("/:id/status", authenticate, requireAdmin, TourBookingsController.updateStatus);
router.patch("/:id/note", authenticate, requireAdmin, TourBookingsController.addNote);

export default router;