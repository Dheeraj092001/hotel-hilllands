import { Router } from "express";
import { RoomsController } from "./rooms.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

// Public endpoints
router.get("/", RoomsController.getPublicRooms);
router.get("/types", RoomsController.getRoomTypes);
router.get("/:slug", RoomsController.getRoomBySlug);

// Admin endpoints
router.get("/admin/all", authenticate, requireAdmin, RoomsController.getAllRoomsAdmin);
router.post("/", authenticate, requireAdmin, RoomsController.createRoom);
router.put("/:id", authenticate, requireAdmin, RoomsController.updateRoom);
router.patch("/:id/status", authenticate, requireAdmin, RoomsController.updateStatus);
router.post("/blocks", authenticate, requireAdmin, RoomsController.createBlock);

export default router;
