import { Router } from "express";
import { TourLeadsController } from "./tour-leads.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

// Public — enquiry form submission (rate-limited by generalLimiter already)
router.post("/enquiry", TourLeadsController.submitEnquiry);

// Admin — CRM management
router.get("/",                          authenticate, requireAdmin, TourLeadsController.list);
router.patch("/:leadId/status",          authenticate, requireAdmin, TourLeadsController.updateStatus);
router.post("/:leadId/convert",          authenticate, requireAdmin, TourLeadsController.convertToBooking);

export default router;