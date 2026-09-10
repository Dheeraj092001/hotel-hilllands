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

  static async getFinancialSummary(_req: Request, res: Response): Promise<void> {
    try {
      const summary = await AnalyticsService.getFinancialSummary();
      res.status(200).json({
        success: true,
        data: summary,
        message: "Financial summary retrieved successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve financial summary",
        code: "INTERNAL_ERROR",
      });
    }
  }

  static async getAdvancedAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const range = (req.query.range as string) || "30D";
      const analytics = await AnalyticsService.getAdvancedAnalytics(range);
      res.status(200).json({
        success: true,
        data: analytics,
        message: "Advanced metrics retrieved successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve advanced metrics",
        code: "INTERNAL_ERROR",
      });
    }
  }

  static async exportCsv(req: Request, res: Response): Promise<void> {
    try {
      const type = req.params.type as any;
      const csv = await AnalyticsService.exportCsv(type);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=hotel-newlands-${type}-${new Date().toISOString().split("T")[0]}.csv`);
      res.status(200).send(csv);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to export CSV",
        code: "EXPORT_ERROR",
      });
    }
  }
}
