import { Request, Response, NextFunction } from "express";
import { ToursService } from "./tours.service";

export class ToursController {
  /** GET /api/v1/tours */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, travelStyle, destinationSlug, search, minDays, maxDays } = req.query as Record<string, string>;
      const result = await ToursService.list({
        page: page ? Number(page) : 1,
        limit: limit ? Math.min(Number(limit), 50) : 12,
        travelStyle,
        destinationSlug,
        search,
        minDays: minDays ? Number(minDays) : undefined,
        maxDays: maxDays ? Number(maxDays) : undefined,
      });
      res.json(result);
    } catch (err) { next(err); }
  }

  /** GET /api/v1/tours/featured */
  static async featured(req: Request, res: Response, next: NextFunction) {
    try {
      const tours = await ToursService.getFeatured(Number(req.query.limit ?? 6));
      res.json(tours);
    } catch (err) { next(err); }
  }

  /** GET /api/v1/tours/:slug */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const tour = await ToursService.getBySlug(req.params.slug);
      res.json({ data: tour });
    } catch (err) { next(err); }
  }

  /** POST /api/v1/tours */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tour = await ToursService.create(req.body);
      res.status(201).json({ data: tour, message: "Tour created" });
    } catch (err) { next(err); }
  }

  /** PUT /api/v1/tours/:id */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const tour = await ToursService.update(req.params.id, req.body);
      res.json({ data: tour, message: "Tour updated" });
    } catch (err) { next(err); }
  }

  /** DELETE /api/v1/tours/:id */
  static async softDelete(req: Request, res: Response, next: NextFunction) {
    try {
      await ToursService.softDelete(req.params.id);
      res.json({ message: "Tour deleted" });
    } catch (err) { next(err); }
  }

  /** PUT /api/v1/tours/:id/itinerary */
  static async upsertItinerary(req: Request, res: Response, next: NextFunction) {
    try {
      await ToursService.upsertItinerary(req.params.id, req.body.days);
      res.json({ message: "Itinerary saved" });
    } catch (err) { next(err); }
  }

  /** POST /api/v1/tours/:id/media */
  static async addMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const media = await ToursService.addMedia(req.params.id, req.body);
      res.status(201).json({ data: media, message: "Media added" });
    } catch (err) { next(err); }
  }

  /** DELETE /api/v1/tours/media/:mediaId */
  static async deleteMedia(req: Request, res: Response, next: NextFunction) {
    try {
      await ToursService.deleteMedia(req.params.mediaId);
      res.json({ message: "Media deleted" });
    } catch (err) { next(err); }
  }

  /** POST /api/v1/tours/:id/departures */
  static async addDeparture(req: Request, res: Response, next: NextFunction) {
    try {
      const dep = await ToursService.addDeparture(req.params.id, req.body);
      res.status(201).json({ data: dep, message: "Departure added" });
    } catch (err) { next(err); }
  }

  /** PATCH /api/v1/tours/departures/:depId */
  static async updateDeparture(req: Request, res: Response, next: NextFunction) {
    try {
      const dep = await ToursService.updateDeparture(req.params.depId, req.body);
      res.json({ data: dep, message: "Departure updated" });
    } catch (err) { next(err); }
  }
}