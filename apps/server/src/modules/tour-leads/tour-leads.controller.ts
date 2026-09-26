import { Request, Response, NextFunction } from "express";
import { TourLeadsService } from "./tour-leads.service";

export class TourLeadsController {
  /** POST /api/v1/tour-leads/enquiry — public, called from web-tour EnquiryForm */
  static async submitEnquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        phone,
        email,
        tourInterest,
        subject,
        destination,
        travelMonth,
        travelDate,
        groupSize,
        numberOfGuests,
        budget,
        budgetBand,
        message,
        source,
        tourId,
        utm,
      } = req.body;

      if (!name?.trim() || !phone?.trim()) {
        return res.status(400).json({ message: "Name and phone are required" });
      }

      const result = await TourLeadsService.createFromEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim(),
        tourInterest: tourInterest || subject,
        subject: subject || tourInterest,
        destination,
        travelMonth,
        travelDate,
        groupSize: groupSize ? Number(groupSize) : (numberOfGuests ? Number(numberOfGuests) : undefined),
        numberOfGuests: numberOfGuests ? Number(numberOfGuests) : (groupSize ? Number(groupSize) : undefined),
        budget: budget || budgetBand,
        budgetBand: budgetBand || budget,
        tourId,
        message: message?.trim(),
        source: source ?? "TOUR_WEBSITE",
        utm,
      });

      res.status(201).json({
        success: true,
        data: { confirmationId: result.lead.id },
        message: "Enquiry submitted! Our team will contact you within 24 hours.",
      });
    } catch (err) { next(err); }
  }

  /** GET /api/v1/tour-leads — admin list */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, search, page, limit } = req.query as Record<string, string>;
      const result = await TourLeadsService.list({
        status,
        search,
        page: Number(page ?? 1),
        limit: Number(limit ?? 20),
      });
      res.json(result);
    } catch (err) { next(err); }
  }

  /** PATCH /api/v1/tour-leads/:leadId/status */
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, note } = req.body;
      const lead = await TourLeadsService.updateStatus(req.params.leadId, status, note);
      res.json({ success: true, data: lead, message: "Lead updated" });
    } catch (err) { next(err); }
  }

  /** POST /api/v1/tour-leads/:leadId/convert */
  static async convertToBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await TourLeadsService.convertToBooking(req.params.leadId, req.body);
      res.status(201).json({ success: true, data: booking, message: "Lead converted to booking" });
    } catch (err) { next(err); }
  }
}