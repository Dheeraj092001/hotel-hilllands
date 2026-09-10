import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

router.get("/dashboard", authenticate, requireAdmin, AnalyticsController.getDashboardOverview);
router.get("/financial-summary", authenticate, requireAdmin, AnalyticsController.getFinancialSummary);
router.get("/advanced", authenticate, requireAdmin, AnalyticsController.getAdvancedAnalytics);
router.get("/export/:type", authenticate, requireAdmin, AnalyticsController.exportCsv);

export default router;
