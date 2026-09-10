import { Response } from "express";
import { UsersService } from "./users.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { updateProfileSchema } from "@hotel/validation";

export class UsersController {
  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      const profile = await UsersService.getProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: profile,
        message: "Profile retrieved successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve profile",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }

  static async updateMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const updated = await UsersService.updateProfile(req.user.id, req.body);
      res.status(200).json({
        success: true,
        data: updated,
        message: "Profile updated successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update profile",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }
}
