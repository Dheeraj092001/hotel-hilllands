import { Router } from "express";
import { OffersController } from "./offers.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

router.get("/coupons", authenticate, requireAdmin, OffersController.getCouponsAdmin);
router.post("/coupons", authenticate, requireAdmin, OffersController.createCoupon);
router.delete("/coupons/:id", authenticate, requireAdmin, OffersController.deleteCoupon);
router.patch("/coupons/:id/status", authenticate, requireAdmin, OffersController.toggleStatus);

export default router;
