import { Router } from "express";
import { ToursController } from "./tours.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

// ── Public ──────────────────────────────────────────────────
router.get("/", ToursController.list);
router.get("/featured", ToursController.featured);
router.get("/:slug", ToursController.getBySlug);

// ── Admin (authenticated) ───────────────────────────────────
router.post("/", authenticate, requireAdmin, ToursController.create);
router.put("/:id", authenticate, requireAdmin, ToursController.update);
router.delete("/:id", authenticate, requireAdmin, ToursController.softDelete);
router.put("/:id/itinerary", authenticate, requireAdmin, ToursController.upsertItinerary);
router.post("/:id/media", authenticate, requireAdmin, ToursController.addMedia);
router.delete("/media/:mediaId", authenticate, requireAdmin, ToursController.deleteMedia);
router.post("/:id/departures", authenticate, requireAdmin, ToursController.addDeparture);
router.patch("/departures/:depId", authenticate, requireAdmin, ToursController.updateDeparture);

export default router;