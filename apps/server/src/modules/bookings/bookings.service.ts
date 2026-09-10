import { prisma } from "../../lib/prisma";
import { AvailabilityService } from "./availability.service";
import { PricingEngine, PricingInput } from "./pricing.service";
import { generateConfirmationNumber, generateInvoiceNumber } from "../../utils/invoiceNumber";
import { BookingConflictError, NotFoundError, ForbiddenError, AppError } from "../../utils/errors";
import { emailService } from "../../lib/email.service";

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
    const createdBooking = await prisma.$transaction(async (tx) => {
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
        include: { room: true },
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

      // 8. Create In-App Guest Notification
      await tx.notification.create({
        data: {
          userId: data.userId,
          title: "Reservation Confirmed",
          message: `Your reservation #${confirmationNumber} for ${booking.room.name} has been confirmed.`,
          type: "BOOKING_CONFIRMED",
          link: `/dashboard/bookings/${booking.id}`,
        },
      });

      return booking;
    });

    // Send async confirmation email
    const nights = Math.max(
      1,
      Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))
    );

    emailService.sendBookingConfirmation({
      to: data.guestEmail,
      guestName: data.guestName,
      confirmationNumber: createdBooking.confirmationNumber,
      roomName: createdBooking.room.name,
      roomNumber: createdBooking.room.roomNumber,
      checkIn: new Date(checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      checkOut: new Date(checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      nights,
      total: Number(createdBooking.total),
      tax: Number(createdBooking.tax),
    }).catch((err) => console.error("Email delivery log:", err));

    return createdBooking;
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

    // Create In-App Notification
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: "Reservation Cancelled",
        message: `Your reservation #${booking.confirmationNumber} has been cancelled. Refund of ₹${refundAmount} (${refundPercentage}%) has been queued.`,
        type: "BOOKING_CANCELLED",
        link: `/dashboard/bookings/${booking.id}`,
      },
    }).catch((err) => console.error("Notification creation error:", err));

    return {
      booking: updated,
      refundPercentage,
      refundAmount,
    };
  }

  /**
   * Admin: List all bookings with search, status filter, and pagination
   */
  static async getAllBookingsAdmin(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status && params.status !== "ALL") {
      where.status = params.status;
    }
    if (params.search) {
      where.OR = [
        { confirmationNumber: { contains: params.search } },
        { guestName: { contains: params.search } },
        { guestEmail: { contains: params.search } },
        { guestPhone: { contains: params.search } },
        { user: { name: { contains: params.search } } },
        { room: { name: { contains: params.search } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          room: { select: { name: true, roomNumber: true, type: { select: { name: true } } } },
          user: { select: { name: true, email: true, phone: true } },
          payments: { select: { id: true, amount: true, status: true, transactionId: true } },
          invoice: { select: { id: true, invoiceNumber: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin: Update booking status with controlled transitions
   */
  static async updateBookingStatus(id: string, status: string, notes?: string) {
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Booking reservation not found");
    }

    const updateData: any = { status };
    if (status === "CHECKED_IN" && !existing.checkedInAt) {
      updateData.checkedInAt = new Date();
    }
    if (status === "CHECKED_OUT" && !existing.checkedOutAt) {
      updateData.checkedOutAt = new Date();
    }
    if (notes) {
      updateData.internalNotes = notes;
    }

    return prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        room: { select: { name: true, roomNumber: true } },
        user: { select: { name: true, email: true } },
      },
    });
  }

  /**
   * Admin: Check in guest workflow
   */
  static async checkInGuest(id: string) {
    return this.updateBookingStatus(id, "CHECKED_IN");
  }

  /**
   * Admin: Check out guest workflow
   */
  static async checkOutGuest(id: string) {
    return this.updateBookingStatus(id, "CHECKED_OUT");
  }
}

