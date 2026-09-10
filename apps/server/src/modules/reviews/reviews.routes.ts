import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { authenticate } from "../../middleware/authenticate";

const router: Router = Router();

router.get("/public", ReviewsController.getPublicReviews);
router.post("/", authenticate, ReviewsController.createReview);
router.get("/my-reviews", authenticate, ReviewsController.getMyReviews);

export default router;
