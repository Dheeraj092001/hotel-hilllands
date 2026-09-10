import { Response } from "express";
import { HousekeepingService } from "./housekeeping.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";

export class HousekeepingController {
  static async getRoomsHousekeeping(_req: AuthenticatedRequest, res: Response) {
    try {
      const rooms = await HousekeepingService.getRoomsHousekeeping();
      res.status(200).json({
        success: true,
        data: rooms,
        message: "Housekeeping room statuses retrieved",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve housekeeping data",
      });
    }
  }

  static async updateRoomStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = req.body;
      const room = await HousekeepingService.updateRoomStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        data: room,
        message: "Room housekeeping status updated",
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Failed to update status",
      });
    }
  }

  static async getTasks(_req: AuthenticatedRequest, res: Response) {
    try {
      const tasks = await HousekeepingService.getTasks();
      res.status(200).json({
        success: true,
        data: tasks,
        message: "Housekeeping tasks retrieved",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve tasks",
      });
    }
  }

  static async createTask(req: AuthenticatedRequest, res: Response) {
    try {
      const task = await HousekeepingService.createTask({
        ...req.body,
        createdBy: req.user?.name || "ADMIN",
      });
      res.status(201).json({
        success: true,
        data: task,
        message: "Housekeeping task created",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create task",
      });
    }
  }

  static async updateTask(req: AuthenticatedRequest, res: Response) {
    try {
      const task = await HousekeepingService.updateTask(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: task,
        message: "Housekeeping task updated",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update task",
      });
    }
  }
}
