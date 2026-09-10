import { Request, Response } from "express";
import { FoodService } from "./food.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";

export class FoodController {
  static async getMenu(_req: Request, res: Response): Promise<void> {
    try {
      const menu = await FoodService.getMenu();
      res.status(200).json({
        success: true,
        data: menu,
        message: "Food menu retrieved successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve menu",
      });
    }
  }

  static async createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      const order = await FoodService.createOrder(req.user.id, req.body);
      res.status(201).json({
        success: true,
        data: order,
        message: "Food order placed successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Failed to place order",
      });
    }
  }

  static async getMyOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
        return;
      }

      const orders = await FoodService.getMyOrders(req.user.id);
      res.status(200).json({
        success: true,
        data: orders,
        message: "My food orders retrieved",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve orders",
      });
    }
  }

  static async getAllOrdersAdmin(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const orders = await FoodService.getAllOrdersAdmin();
      res.status(200).json({
        success: true,
        data: orders,
        message: "Admin food orders retrieved",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve orders",
      });
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const order = await FoodService.updateOrderStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        data: order,
        message: "Food order status updated",
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Failed to update order status",
      });
    }
  }

  static async createMenuItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const item = await FoodService.createMenuItem(req.body);
      res.status(201).json({
        success: true,
        data: item,
        message: "Menu item created",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create menu item",
      });
    }
  }
}
