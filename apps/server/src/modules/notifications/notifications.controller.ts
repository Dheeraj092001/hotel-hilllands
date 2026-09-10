import { Response } from "express";
import { NotificationsService } from "./notifications.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";

export class NotificationsController {
  static async getMyNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      const result = await NotificationsService.getMyNotifications(req.user.id);
      res.status(200).json({
        success: true,
        data: result.notifications,
        meta: { unreadCount: result.unreadCount },
        message: "Notifications retrieved successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve notifications",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      const notification = await NotificationsService.markAsRead(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        data: notification,
        message: "Notification marked as read",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update notification",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      await NotificationsService.markAllAsRead(req.user.id);
      res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to mark all as read",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }
}
