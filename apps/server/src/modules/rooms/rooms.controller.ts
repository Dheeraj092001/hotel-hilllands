import { Request, Response } from "express";
import { RoomsService } from "./rooms.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";

export class RoomsController {
  static async getPublicRooms(req: Request, res: Response) {
    try {
      const { typeId, maxAdults, bedType, search } = req.query;
      const rooms = await RoomsService.getPublicRooms({
        typeId: typeId as string,
        maxAdults: maxAdults ? Number(maxAdults) : undefined,
        bedType: bedType as string,
        search: search as string,
      });

      res.status(200).json({
        success: true,
        data: rooms,
        message: "Rooms retrieved successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve rooms",
      });
    }
  }

  static async getRoomBySlug(req: Request, res: Response) {
    try {
      const room = await RoomsService.getRoomBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        data: room,
        message: "Room details retrieved",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Room not found",
      });
    }
  }

  static async getAllRoomsAdmin(_req: AuthenticatedRequest, res: Response) {
    try {
      const rooms = await RoomsService.getAllRoomsAdmin();
      res.status(200).json({
        success: true,
        data: rooms,
        message: "Admin rooms retrieved",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve rooms",
      });
    }
  }

  static async createRoom(req: AuthenticatedRequest, res: Response) {
    try {
      const room = await RoomsService.createRoom(req.body);
      res.status(201).json({
        success: true,
        data: room,
        message: "Room created successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Failed to create room",
      });
    }
  }

  static async updateRoom(req: AuthenticatedRequest, res: Response) {
    try {
      const room = await RoomsService.updateRoom(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: room,
        message: "Room updated successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Failed to update room",
      });
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = req.body;
      const room = await RoomsService.updateStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        data: room,
        message: "Room status updated successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Failed to update room status",
      });
    }
  }

  static async createBlock(req: AuthenticatedRequest, res: Response) {
    try {
      const block = await RoomsService.createBlock(req.body);
      res.status(201).json({
        success: true,
        data: block,
        message: "Room blocked successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Failed to create room block",
      });
    }
  }

  static async getRoomTypes(_req: Request, res: Response) {
    try {
      const types = await RoomsService.getRoomTypes();
      res.status(200).json({
        success: true,
        data: types,
        message: "Room types retrieved",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve room types",
      });
    }
  }
}
