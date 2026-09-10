import { Router } from "express";
import { CmsController } from "./cms.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

// Public page content
router.get("/pages/:slug", CmsController.getPageBySlug);

// Admin CMS endpoints
router.get("/admin/pages", authenticate, requireAdmin, CmsController.getAllPagesAdmin);
router.put("/pages/:slug/sections/:key", authenticate, requireAdmin, CmsController.upsertSection);
router.put("/pages/:slug/seo", authenticate, requireAdmin, CmsController.upsertSeo);

export default router;
