import { prisma } from "../../lib/prisma";
import { BookingConflictError, NotFoundError } from "../../utils/errors";

export interface AvailabilityResult {
  isAvailable: boolean;
  roomId: string;
  reason?: string;
  conflictingBookingId?: string;
}

export class AvailabilityService {
  /**
   * Check if a specific room is available for given dates
   */
  static async checkRoomAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    excludeBookingId?: string
  ): Promise<AvailabilityResult> {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    if (room.status === "MAINTENANCE" || room.status === "BLOCKED") {
      return {
        isAvailable: false,
        roomId,
        reason: `Room is currently marked as ${room.status.toLowerCase()}`,
      };
    }

    // 1. Check administrative Room Blocks (e.g. maintenance, VIP hold)
    const activeBlock = await prisma.roomBlock.findFirst({
      where: {
        roomId,
        startDate: { lt: checkOut },
        endDate: { gt: checkIn },
      },
    });

    if (activeBlock) {
      return {
        isAvailable: false,
        roomId,
        reason: `Room is blocked: ${activeBlock.reason}`,
      };
    }

    // 2. Check overlapping bookings (excluding cancelled or failed bookings)
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: {
          notIn: ["CANCELLED", "PAYMENT_FAILED", "REJECTED"],
        },
        checkIn: { lt: checkOut },
        checkOut: { gt: checkIn },
      },
    });

    if (conflictingBooking) {
      return {
        isAvailable: false,
        roomId,
        reason: "Room is already reserved for the selected dates",
        conflictingBookingId: conflictingBooking.id,
      };
    }

    return {
      isAvailable: true,
      roomId,
    };
  }

  /**
   * Find all rooms available for date range and capacity requirements
   */
  static async findAvailableRooms(
    checkIn: Date,
    checkOut: Date,
    adults: number = 1,
    children: number = 0
  ) {
    // Fetch all published rooms capable of hosting the party
    const candidateRooms = await prisma.room.findMany({
      where: {
        isPublished: true,
        status: "AVAILABLE",
        maxAdults: { gte: adults },
      },
      include: {
        type: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        amenities: {
          include: { amenity: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    const availableRooms = [];

    for (const room of candidateRooms) {
      const { isAvailable } = await this.checkRoomAvailability(
        room.id,
        checkIn,
        checkOut
      );
      if (isAvailable) {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  }
}
