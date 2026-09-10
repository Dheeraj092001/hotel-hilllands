import { Response } from "express";
import { InvoicesService } from "./invoices.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";

export class InvoicesController {
  static async getMyInvoices(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

      const result = await InvoicesService.getMyInvoices(req.user.id, page, limit);
      res.status(200).json({
        success: true,
        data: result.invoices,
        meta: result.meta,
        message: "Invoices retrieved successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve invoices",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }

  static async getInvoice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      const invoiceId = req.params.id;
      const isAdmin = req.user.role === "SUPER_ADMIN" || req.user.role === "HOTEL_MANAGER";

      const invoice = await InvoicesService.getInvoiceById(req.user.id, invoiceId, isAdmin);
      res.status(200).json({
        success: true,
        data: invoice,
        message: "Invoice retrieved successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve invoice",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }
}
