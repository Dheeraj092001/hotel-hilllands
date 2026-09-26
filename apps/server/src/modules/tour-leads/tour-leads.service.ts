import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";

export class TourLeadsService {
  /**
   * Called from public enquiry form on web-tour site.
   * Creates a shared Lead (existing model) + a TourLead extension
   * so it surfaces in both hotel CRM and Tour Bookings CRM.
   */
  static async createFromEnquiry(data: {
    name: string;
    phone: string;
    email?: string;
    tourInterest?: string;
    subject?: string;
    destination?: string;
    travelMonth?: string;
    travelDate?: string | Date;
    groupSize?: number;
    numberOfGuests?: number;
    budget?: string;
    budgetBand?: string;
    tourId?: string;
    message?: string;
    source?: string;
    utm?: { source?: string; medium?: string; campaign?: string };
  }) {
    const { utm = {}, source = "TOUR_WEBSITE", ...rest } = data;

    return prisma.$transaction(async (tx) => {
      // 1. Create the shared CRM Lead
      const lead = await tx.lead.create({
        data: {
          name: rest.name,
          phone: rest.phone ?? undefined,
          email: rest.email ?? `enquiry-${Date.now()}@noreply.fayul`,
          subject: rest.tourInterest ?? rest.subject ?? "Tour Enquiry",
          message: rest.message ?? "(No message provided)",
          travelDate: rest.travelDate ? new Date(rest.travelDate) : undefined,
          numberOfGuests: rest.groupSize ?? rest.numberOfGuests ?? undefined,
          status: "NEW",
        },
      });

      // 2. Create the TourLead extension for tour-specific data
      const tourLead = await tx.tourLead.create({
        data: {
          leadId: lead.id,
          tourId: rest.tourId,
          destination: rest.destination,
          travelStyle: rest.tourInterest ?? rest.subject,
          travelMonth: rest.travelMonth ?? (rest.travelDate ? String(rest.travelDate).slice(0, 7) : undefined),
          groupSize: rest.groupSize ?? rest.numberOfGuests,
          budgetBand: rest.budget ?? rest.budgetBand,
          source,
          utmSource: utm.source,
          utmMedium: utm.medium,
          utmCampaign: utm.campaign,
        },
      });

      return { lead, tourLead };
    });
  }

  static async list(filters: { status?: string; search?: string; page?: number; limit?: number } = {}) {
    const { status, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== "ALL") {
      where.lead = { status };
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { destination: { contains: q } },
        { travelStyle: { contains: q } },
        { lead: { name: { contains: q } } },
        { lead: { phone: { contains: q } } },
        { lead: { email: { contains: q } } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.tourLead.findMany({
        where,
        include: {
          lead: {
            include: {
              notes: { orderBy: { createdAt: "desc" as const } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.tourLead.count({ where }),
    ]);

    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  static async updateStatus(leadId: string, status: string, note?: string) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundError("Lead not found");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.lead.update({ where: { id: leadId }, data: { status } });

      if (note && note.trim()) {
        await tx.leadNote.create({
          data: { leadId, note: note.trim(), createdBy: "ADMIN_CRM" },
        });
      }

      return updated;
    });
  }

  static async convertToBooking(leadId: string, bookingData: {
    tourId: string;
    departureId?: string;
    totalAmount: number;
    guestName: string;
    guestPhone: string;
    guestEmail?: string;
    adults?: number;
    children?: number;
    specialRequests?: string;
  }) {
    const tourLead = await prisma.tourLead.findUnique({ where: { leadId } });
    if (!tourLead) throw new NotFoundError("Tour lead not found");

    return prisma.$transaction(async (tx) => {
      const booking = await tx.tourBooking.create({
        data: {
          tourId: bookingData.tourId,
          departureId: bookingData.departureId || undefined,
          confirmationNumber: `TB${Date.now().toString(36).toUpperCase()}`,
          totalAmount: bookingData.totalAmount,
          guestName: bookingData.guestName,
          guestPhone: bookingData.guestPhone,
          guestEmail: bookingData.guestEmail,
          adults: bookingData.adults ?? 1,
          children: bookingData.children ?? 0,
          specialRequests: bookingData.specialRequests,
          leadId,
          source: "CRM_CONVERT",
          status: "CONFIRMED",
        },
      });

      await tx.lead.update({ where: { id: leadId }, data: { status: "CONVERTED" } });

      await tx.leadNote.create({
        data: {
          leadId,
          note: `Converted to Tour Booking #${booking.confirmationNumber}`,
          createdBy: "SYSTEM",
        },
      });

      return booking;
    });
  }
}