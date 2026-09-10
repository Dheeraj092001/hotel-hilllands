import { Request, Response } from "express";
import { AnalyticsService } from "./analytics.service";

export class AnalyticsController {
  static async getDashboardOverview(_req: Request, res: Response): Promise<void> {
    try {
      const overview = await AnalyticsService.getDashboardOverview();
      res.status(200).json({
        success: true,
        data: overview,
        message: "Dashboard analytics retrieved successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve analytics",
        code: "INTERNAL_ERROR",
      });
    }
  }
}
