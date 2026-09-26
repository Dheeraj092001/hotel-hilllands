import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";
import { Prisma } from "@prisma/client";

function generateConfirmation() {
  return `TB${Date.now().toString(36).toUpperCase()}`;
}

export class TourBookingsService {
  static async list(filters: { status?: string; tourId?: string; page?: number; limit?: number } = {}) {
    const { status, tourId, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.TourBookingWhereInput = {
      ...(status && { status }),
      ...(tourId && { tourId }),
    };

    const [bookings, total] = await prisma.$transaction([
      prisma.tourBooking.findMany({
        where,
        include: { tour: { select: { title: true, slug: true } }, departure: { select: { startDate: true, endDate: true } }, travelers: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.tourBooking.count({ where }),
    ]);

    return { data: bookings, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  static async getById(id: string) {
    const booking = await prisma.tourBooking.findUnique({
      where: { id },
      include: { tour: true, departure: true, travelers: true, statusHistory: { orderBy: { createdAt: "desc" } } },
    });
    if (!booking) throw new NotFoundError("Booking not found");
    return booking;
  }

  static async create(data: {
    tourId: string; departureId?: string; totalAmount: number;
    guestName: string; guestPhone: string; guestEmail?: string;
    adults?: number; children?: number; specialRequests?: string;
    source?: string; leadId?: string;
    travelers?: { name: string; idType?: string; idNumber?: string; age?: number; phone?: string }[];
  }) {
    const confirmationNumber = generateConfirmation();
    const { travelers = [], ...rest } = data;

    return prisma.tourBooking.create({
      data: {
        ...rest,
        confirmationNumber,
        totalAmount: new Prisma.Decimal(data.totalAmount),
        travelers: { create: travelers },
      },
      include: { tour: { select: { title: true } }, travelers: true },
    });
  }

  static async updateStatus(id: string, toStatus: string, changedBy: string, note?: string) {
    const booking = await prisma.tourBooking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundError("Booking not found");

    return prisma.$transaction([
      prisma.tourBooking.update({ where: { id }, data: { status: toStatus } }),
      prisma.tourBookingStatusHistory.create({
        data: { bookingId: id, fromStatus: booking.status, toStatus, changedBy, note },
      }),
    ]);
  }

  static async addNote(id: string, note: string) {
    return prisma.tourBooking.update({ where: { id }, data: { internalNotes: note } });
  }

  static async getStats() {
    const [total, pending, confirmed, cancelled] = await prisma.$transaction([
      prisma.tourBooking.count(),
      prisma.tourBooking.count({ where: { status: "PENDING" } }),
      prisma.tourBooking.count({ where: { status: "CONFIRMED" } }),
      prisma.tourBooking.count({ where: { status: "CANCELLED" } }),
    ]);
    return { total, pending, confirmed, cancelled };
  }
}