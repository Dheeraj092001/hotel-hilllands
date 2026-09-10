import { prisma } from "../../lib/prisma";
import { AvailabilityService } from "./availability.service";
import { PricingEngine, PricingInput } from "./pricing.service";
import { generateConfirmationNumber, generateInvoiceNumber } from "../../utils/invoiceNumber";
import { BookingConflictError, NotFoundError, ForbiddenError, AppError } from "../../utils/errors";

export interface CreateBookingData extends PricingInput {
  userId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  source?: string;
}

export class BookingsService {
  /**
   * Create a new booking transactionally with guaranteed anti-double-booking check
   */
  static async createBooking(data: CreateBookingData) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    // Run within a Prisma transaction
    return await prisma.$transaction(async (tx) => {
      // 1. Re-verify availability inside the transaction
      const isConflicting = await tx.booking.findFirst({
        where: {
          roomId: data.roomId,
          status: {
            notIn: ["CANCELLED", "PAYMENT_FAILED", "REJECTED"],
          },
          checkIn: { lt: checkOut },
          checkOut: { gt: checkIn },
        },
      });

      if (isConflicting) {
        throw new BookingConflictError(
          "This suite has just been reserved by another guest. Please select alternative dates or suites."
        );
      }

      // 2. Check room block conflicts inside transaction
      const isBlocked = await tx.roomBlock.findFirst({
        where: {
          roomId: data.roomId,
          startDate: { lt: checkOut },
          endDate: { gt: checkIn },
        },
      });

      if (isBlocked) {
        throw new BookingConflictError(
          `This suite is reserved for scheduled maintenance: ${isBlocked.reason}`
        );
      }

      // 3. Compute verified server-side price
      const pricing = await PricingEngine.calculatePrice(data);

      // 4. Generate atomic confirmation number
      const confirmationNumber = generateConfirmationNumber();

      // 5. Create Booking
      const booking = await tx.booking.create({
        data: {
          confirmationNumber,
          userId: data.userId,
          roomId: data.roomId,
          checkIn,
          checkOut,
          adults: data.adults,
          children: data.children || 0,
          status: "PENDING",
          subtotal: pricing.roomSubtotal + pricing.extraGuestAmount,
          discount: pricing.discountAmount,
          tax: pricing.taxAmount,
          serviceCharge: pricing.serviceCharge,
          total: pricing.totalAmount,
          currency: pricing.currency,
          couponId: pricing.appliedCoupon?.id,
          source: data.source || "WEBSITE",
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.guestPhone,
          specialRequests: data.specialRequests,
        },
      });

      // 6. Create Booking Extras if requested
      if (data.extraIds && data.extraIds.length > 0) {
        const extraItems = await tx.extra.findMany({
          where: { id: { in: data.extraIds.map((e) => e.extraId) } },
        });

        for (const item of data.extraIds) {
          const found = extraItems.find((e) => e.id === item.extraId);
          if (found) {
            await tx.bookingExtra.create({
              data: {
                bookingId: booking.id,
                extraId: item.extraId,
                quantity: item.quantity,
                price: found.price,
              },
            });
          }
        }
      }

      // 7. Track Coupon Usage if applied
      if (pricing.appliedCoupon) {
        await tx.couponUsage.create({
          data: {
            couponId: pricing.appliedCoupon.id,
            userId: data.userId,
            bookingId: booking.id,
          },
        });
      }

      return booking;
    });
  }

  /**
   * Retrieve booking by ID with authorized ownership verification
   */
  static async getBookingById(id: string, userId?: string, isAdmin: boolean = false) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: {
          include: {
            images: true,
            type: true,
          },
        },
        extras: {
          include: { extra: true },
        },
        payments: true,
        invoice: true,
      },
    });

    if (!booking) {
      throw new NotFoundError("Booking reservation not found");
    }

    if (!isAdmin && userId && booking.userId !== userId) {
      throw new ForbiddenError("You do not have permission to view this reservation");
    }

    return booking;
  }

  /**
   * Retrieve list of bookings for the logged-in guest
   */
  static async getUserBookings(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: { userId },
        include: {
          room: {
            include: {
              images: { where: { isPrimary: true } },
              type: true,
            },
          },
          payments: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where: { userId } }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Cancel booking and compute refund based on 48h policy
   */
  static async cancelBooking(id: string, userId: string, reason?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundError("Booking reservation not found");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError("Not authorized to cancel this reservation");
    }

    if (booking.status === "CANCELLED") {
      throw new AppError("Reservation is already cancelled", 400);
    }

    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const hoursToArrival = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // 48h policy: >= 48 hours = 100% refund, < 48 hours = 50% refund
    let refundPercentage = 100;
    if (hoursToArrival < 48 && hoursToArrival > 0) {
      refundPercentage = 50;
    } else if (hoursToArrival <= 0) {
      refundPercentage = 0;
    }

    const refundAmount = (Number(booking.total) * refundPercentage) / 100;

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        internalNotes: `Cancelled by guest on ${now.toISOString()}. Reason: ${reason || "N/A"}. Refund calculated: ₹${refundAmount} (${refundPercentage}%)`,
      },
    });

    return {
      booking: updated,
      refundPercentage,
      refundAmount,
    };
  }
}
