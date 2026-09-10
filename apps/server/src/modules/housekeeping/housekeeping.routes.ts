import { Router } from "express";
import { HousekeepingController } from "./housekeeping.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

router.get("/rooms", authenticate, requireAdmin, HousekeepingController.getRoomsHousekeeping);
router.patch("/rooms/:id/status", authenticate, requireAdmin, HousekeepingController.updateRoomStatus);
router.get("/tasks", authenticate, requireAdmin, HousekeepingController.getTasks);
router.post("/tasks", authenticate, requireAdmin, HousekeepingController.createTask);
router.patch("/tasks/:id", authenticate, requireAdmin, HousekeepingController.updateTask);

export default router;
