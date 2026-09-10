import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";

const router: Router = Router();

router.get("/public", ReviewsController.getPublicReviews);
router.post("/", authenticate, ReviewsController.createReview);
router.get("/my-reviews", authenticate, ReviewsController.getMyReviews);

// Admin review moderation
router.get("/admin/all", authenticate, requireAdmin, ReviewsController.getAllReviewsAdmin);
router.patch("/:id/status", authenticate, requireAdmin, ReviewsController.updateStatus);
router.post("/:id/reply", authenticate, requireAdmin, ReviewsController.reply);

export default router;
