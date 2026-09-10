import { Router } from "express";
import { FoodController } from "./food.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

// Public menu
router.get("/menu", FoodController.getMenu);

// Guest food orders
router.post("/orders", authenticate, FoodController.createOrder);
router.get("/orders/my-orders", authenticate, FoodController.getMyOrders);

// Admin / Kitchen POS management
router.get("/admin/orders", authenticate, requireAdmin, FoodController.getAllOrdersAdmin);
router.patch("/admin/orders/:id/status", authenticate, requireAdmin, FoodController.updateStatus);
router.post("/admin/items", authenticate, requireAdmin, FoodController.createMenuItem);

export default router;
