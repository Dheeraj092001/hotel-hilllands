import { Request, Response } from "express";
import { ReviewsService } from "./reviews.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { createReviewSchema } from "@hotel/validation";

export class ReviewsController {
  static async createReview(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      const parsed = createReviewSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const review = await ReviewsService.createReview(req.user.id, parsed.data);
      res.status(201).json({
        success: true,
        data: review,
        message: "Review submitted successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to submit review",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }

  static async getMyReviews(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      const reviews = await ReviewsService.getMyReviews(req.user.id);
      res.status(200).json({
        success: true,
        data: reviews,
        message: "Reviews retrieved successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve reviews",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }

  static async getPublicReviews(req: Request, res: Response): Promise<void> {
    try {
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const reviews = await ReviewsService.getPublicReviews(limit);
      res.status(200).json({
        success: true,
        data: reviews,
        message: "Public reviews retrieved successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve public reviews",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }
}
