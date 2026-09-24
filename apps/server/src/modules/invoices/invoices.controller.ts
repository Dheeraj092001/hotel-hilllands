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

  static async getAllInvoicesAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));

      const result = await InvoicesService.getAllInvoicesAdmin(page, limit);
      res.status(200).json({
        success: true,
        data: result.invoices,
        meta: result.meta,
        message: "Admin invoices retrieved successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve invoices",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }

  static async lookupGuestByEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const email = req.query.email as string;
      if (!email) {
        res.status(400).json({ success: false, message: "Email query parameter is required" });
        return;
      }

      const data = await InvoicesService.lookupGuestByEmail(email);
      res.status(200).json({
        success: true,
        data,
        message: "Guest and booking data retrieved successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to lookup guest",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }

  static async getCheckoutPreview(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const bookingId = req.params.bookingId;
      if (!bookingId) {
        res.status(400).json({ success: false, message: "bookingId parameter is required" });
        return;
      }

      const preview = await InvoicesService.getCheckoutPreview(bookingId);
      res.status(200).json({
        success: true,
        data: preview,
        message: "Checkout invoice preview calculated successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to calculate checkout preview",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }

  static async generateCheckoutInvoice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { bookingId, paymentMethod, settleBalance, notes, additionalItems } = req.body;
      if (!bookingId) {
        res.status(400).json({ success: false, message: "bookingId is required in body" });
        return;
      }

      const invoice = await InvoicesService.generateCheckoutInvoice({
        bookingId,
        paymentMethod,
        settleBalance,
        notes,
        additionalItems,
      });

      res.status(201).json({
        success: true,
        data: invoice,
        message: "Official checkout invoice generated and saved successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to generate checkout invoice",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }

  static async sendInvoiceEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const invoiceId = req.params.id;
      const result = await InvoicesService.sendInvoiceEmail(invoiceId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to send invoice email",
        code: error.code || "INTERNAL_ERROR",
      });
    }
  }
}
