import { Router } from "express";
import { BookingsController } from "./bookings.controller";
import { authenticate, optionalAuth } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/authorize";
import { bookingLimiter } from "../../middleware/rateLimiter";

const router: Router = Router();

// Public availability check and pricing preview
router.get("/availability", BookingsController.checkAvailability);
router.post("/calculate-price", BookingsController.calculatePrice);

// Protected guest actions
router.post("/", authenticate, bookingLimiter, BookingsController.createBooking);
router.get("/my-bookings", authenticate, BookingsController.getMyBookings);
router.get("/:id", optionalAuth, BookingsController.getBooking);
router.post("/:id/cancel", authenticate, BookingsController.cancelBooking);

// Admin booking operations
router.get("/", authenticate, requireAdmin, BookingsController.getAllBookingsAdmin);
router.patch("/:id/status", authenticate, requireAdmin, BookingsController.updateStatus);
router.post("/:id/check-in", authenticate, requireAdmin, BookingsController.checkInGuest);
router.post("/:id/check-out", authenticate, requireAdmin, BookingsController.checkOutGuest);

export default router;
