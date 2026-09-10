import { Request, Response } from "express";
import { CmsService } from "./cms.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";

export class CmsController {
  static async getPageBySlug(req: Request, res: Response): Promise<void> {
    try {
      const page = await CmsService.getPageBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        data: page,
        message: "Page CMS content retrieved",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve CMS content",
      });
    }
  }

  static async getAllPagesAdmin(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const pages = await CmsService.getAllPagesAdmin();
      res.status(200).json({
        success: true,
        data: pages,
        message: "All CMS pages retrieved",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve CMS pages",
      });
    }
  }

  static async upsertSection(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { slug, key } = req.params;
      const section = await CmsService.upsertPageSection(slug, key, {
        ...req.body,
        updatedBy: req.user?.name || "ADMIN",
      });
      res.status(200).json({
        success: true,
        data: section,
        message: "Page section saved successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to save section",
      });
    }
  }

  static async upsertSeo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const seo = await CmsService.upsertSeo(slug, req.body);
      res.status(200).json({
        success: true,
        data: seo,
        message: "SEO metadata saved successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to save SEO metadata",
      });
    }
  }
}
