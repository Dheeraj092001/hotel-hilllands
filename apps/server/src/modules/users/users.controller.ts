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

  static async getAllGuests(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string;

      const result = await UsersService.getAllGuestsAdmin({ page, limit, search });
      res.status(200).json({
        success: true,
        data: result.users,
        meta: result.meta,
        message: "Guests retrieved successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve guests",
      });
    }
  }

  static async getGuestDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await UsersService.getGuestDetailsAdmin(req.params.id);
      res.status(200).json({
        success: true,
        data: user,
        message: "Guest details retrieved successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve guest details",
      });
    }
  }
}

