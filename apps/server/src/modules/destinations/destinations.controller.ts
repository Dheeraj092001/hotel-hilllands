import { Request, Response, NextFunction } from "express";
import { DestinationsService } from "./destinations.service";
import { AppError } from "../../utils/errors";

export class DestinationsController {
  /** GET /api/v1/destinations — public list */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await DestinationsService.list(true);
      res.json({ data: destinations, meta: { total: destinations.length } });
    } catch (err) { next(err); }
  }

  /** GET /api/v1/destinations/admin — admin list (all) */
  static async listAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await DestinationsService.list(false);
      res.json({ data: destinations, meta: { total: destinations.length } });
    } catch (err) { next(err); }
  }

  /** GET /api/v1/destinations/:slug */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const dest = await DestinationsService.getBySlug(req.params.slug);
      res.json({ data: dest });
    } catch (err) { next(err); }
  }

  /** POST /api/v1/destinations */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dest = await DestinationsService.create(req.body);
      res.status(201).json({ data: dest, message: "Destination created" });
    } catch (err) { next(err); }
  }

  /** PUT /api/v1/destinations/:id */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dest = await DestinationsService.update(req.params.id, req.body);
      res.json({ data: dest, message: "Destination updated" });
    } catch (err) { next(err); }
  }

  /** DELETE /api/v1/destinations/:id */
  static async softDelete(req: Request, res: Response, next: NextFunction) {
    try {
      await DestinationsService.softDelete(req.params.id);
      res.json({ message: "Destination deleted" });
    } catch (err) { next(err); }
  }
}