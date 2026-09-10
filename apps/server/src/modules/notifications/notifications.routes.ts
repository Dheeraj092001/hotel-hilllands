import { Router } from "express";
import { NotificationsController } from "./notifications.controller";
import { authenticate } from "../../middleware/authenticate";

const router: Router = Router();

router.get("/my-notifications", authenticate, NotificationsController.getMyNotifications);
router.patch("/mark-all-read", authenticate, NotificationsController.markAllAsRead);
router.patch("/:id/read", authenticate, NotificationsController.markAsRead);

export default router;
