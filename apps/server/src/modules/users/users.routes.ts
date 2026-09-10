import { Router } from "express";
import { UsersController } from "./users.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

router.get("/me", authenticate, UsersController.getMe);
router.put("/me", authenticate, UsersController.updateMe);

// Admin Guest CRM
router.get("/", authenticate, requireAdmin, UsersController.getAllGuests);
router.get("/:id", authenticate, requireAdmin, UsersController.getGuestDetails);

export default router;
