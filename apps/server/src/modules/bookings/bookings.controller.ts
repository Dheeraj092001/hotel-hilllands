import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { AvailabilityService } from "./availability.service";
import { PricingEngine } from "./pricing.service";
import { BookingsService } from "./bookings.service";
import { successResponse } from "../../utils/response";
import { AppError } from "../../utils/errors";

export class BookingsController {
  static async checkAvailability(req: AuthenticatedRequest, res: Response) {
    const { checkIn, checkOut, roomId, adults, children } = req.query;

    if (!checkIn || !checkOut) {
      throw new AppError("checkIn and checkOut dates are required", 400);
    }

    const checkInDate = new Date(String(checkIn));
    const checkOutDate = new Date(String(checkOut));

    if (roomId) {
      const result = await AvailabilityService.checkRoomAvailability(
        String(roomId),
        checkInDate,
        checkOutDate
      );
      return successResponse(res, result, "Room availability checked");
    }

    const availableRooms = await AvailabilityService.findAvailableRooms(
      checkInDate,
      checkOutDate,
      adults ? Number(adults) : 1,
      children ? Number(children) : 0
    );

    return successResponse(
      res,
      { count: availableRooms.length, rooms: availableRooms },
      "Available rooms retrieved successfully"
    );
  }

  static async calculatePrice(req: AuthenticatedRequest, res: Response) {
    const { roomId, checkIn, checkOut, adults, children, extraIds, couponCode } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      throw new AppError("roomId, checkIn, and checkOut are required", 400);
    }

    const breakdown = await PricingEngine.calculatePrice({
      roomId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults: Number(adults) || 2,
      children: Number(children) || 0,
      extraIds,
      couponCode,
    });

    return successResponse(res, breakdown, "Price calculated successfully");
  }

  static async createBooking(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError("Authentication required to create a reservation", 401);
    }

    const {
      roomId,
      checkIn,
      checkOut,
      adults,
      children,
      extraIds,
      couponCode,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
    } = req.body;

    const booking = await BookingsService.createBooking({
      userId: req.user.id,
      roomId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults: Number(adults) || 2,
      children: Number(children) || 0,
      extraIds,
      couponCode,
      guestName: guestName || req.user.name,
      guestEmail: guestEmail || req.user.email,
      guestPhone: guestPhone || (req.user as any)?.phone || "",
      specialRequests,
    });

    return successResponse(
      res,
      booking,
      "Reservation created successfully. Please complete payment.",
      201
    );
  }

  static async getBooking(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN" || req.user?.role === "SUPER_ADMIN";

    const booking = await BookingsService.getBookingById(id, userId, isAdmin);
    return successResponse(res, booking, "Booking details retrieved");
  }

  static async getMyBookings(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await BookingsService.getUserBookings(req.user.id, page, limit);
    return successResponse(res, result, "User bookings retrieved");
  }

  static async cancelBooking(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const { id } = req.params;
    const { reason } = req.body;

    const result = await BookingsService.cancelBooking(id, req.user.id, reason);
    return successResponse(res, result, "Reservation cancelled successfully");
  }

  static async getAllBookingsAdmin(req: AuthenticatedRequest, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const result = await BookingsService.getAllBookingsAdmin({
      page,
      limit,
      status,
      search,
    });
    return successResponse(res, result, "Admin bookings retrieved");
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      throw new AppError("Status is required", 400);
    }

    const updated = await BookingsService.updateBookingStatus(id, status, notes);
    return successResponse(res, updated, "Booking status updated successfully");
  }

  static async checkInGuest(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const updated = await BookingsService.checkInGuest(id);
    return successResponse(res, updated, "Guest checked in successfully");
  }

  static async checkOutGuest(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const updated = await BookingsService.checkOutGuest(id);
    return successResponse(res, updated, "Guest checked out successfully");
  }
}

