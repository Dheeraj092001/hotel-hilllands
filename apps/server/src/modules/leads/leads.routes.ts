import { Router } from "express";
import { TourLeadsController } from "../tour-leads/tour-leads.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router = Router();

// Public enquiry endpoint for leads
router.post("/", TourLeadsController.submitEnquiry);

// Admin listing
router.get("/", authenticate, requireAdmin, TourLeadsController.list);

export default router;
