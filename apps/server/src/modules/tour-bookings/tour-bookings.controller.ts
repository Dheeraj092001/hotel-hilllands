import { Request, Response, NextFunction } from "express";
import { TourBookingsService } from "./tour-bookings.service";

export class TourBookingsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, tourId, page, limit } = req.query as Record<string, string>;
      const result = await TourBookingsService.list({ status, tourId, page: Number(page ?? 1), limit: Number(limit ?? 20) });
      res.json(result);
    } catch (err) { next(err); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await TourBookingsService.getById(req.params.id);
      res.json({ data: booking });
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await TourBookingsService.create(req.body);
      res.status(201).json({ data: booking, message: "Booking created" });
    } catch (err) { next(err); }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, note } = req.body as { status: string; note?: string };
      const changedBy = (req as any).user?.uid ?? "admin";
      const [booking] = await TourBookingsService.updateStatus(req.params.id, status, changedBy, note);
      res.json({ data: booking, message: "Status updated" });
    } catch (err) { next(err); }
  }

  static async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await TourBookingsService.addNote(req.params.id, req.body.note);
      res.json({ data: booking, message: "Note saved" });
    } catch (err) { next(err); }
  }

  static async stats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await TourBookingsService.getStats();
      res.json({ data: stats });
    } catch (err) { next(err); }
  }
}