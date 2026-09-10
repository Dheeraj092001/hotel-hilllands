import { Request, Response } from "express";
import { OffersService } from "./offers.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";

export class OffersController {
  static async getCouponsAdmin(_req: AuthenticatedRequest, res: Response) {
    try {
      const coupons = await OffersService.getCouponsAdmin();
      res.status(200).json({
        success: true,
        data: coupons,
        message: "Coupons retrieved successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve coupons",
      });
    }
  }

  static async createCoupon(req: AuthenticatedRequest, res: Response) {
    try {
      const coupon = await OffersService.createCoupon(req.body);
      res.status(201).json({
        success: true,
        data: coupon,
        message: "Coupon created successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Failed to create coupon",
      });
    }
  }

  static async deleteCoupon(req: AuthenticatedRequest, res: Response) {
    try {
      await OffersService.deleteCoupon(req.params.id);
      res.status(200).json({
        success: true,
        message: "Coupon deleted successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Failed to delete coupon",
      });
    }
  }

  static async toggleStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { isActive } = req.body;
      const coupon = await OffersService.toggleCouponStatus(req.params.id, isActive);
      res.status(200).json({
        success: true,
        data: coupon,
        message: "Coupon status updated",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update status",
      });
    }
  }
}
