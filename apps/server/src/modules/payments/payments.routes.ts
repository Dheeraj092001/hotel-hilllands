import { Router } from "express";
import { PaymentsController } from "./payments.controller";
import { authenticate } from "../../middleware/authenticate";
import { paymentLimiter } from "../../middleware/rateLimiter";

const router: Router = Router();

router.post("/create-order", authenticate, paymentLimiter, PaymentsController.createOrder);
router.post("/verify", authenticate, paymentLimiter, PaymentsController.verifyPayment);

export default router;
