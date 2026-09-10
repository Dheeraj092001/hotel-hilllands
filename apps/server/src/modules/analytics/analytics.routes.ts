import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

router.get("/dashboard", authenticate, requireAdmin, AnalyticsController.getDashboardOverview);

export default router;
