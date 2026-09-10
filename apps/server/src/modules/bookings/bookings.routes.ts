import { Router } from "express";
import { BookingsController } from "./bookings.controller";
import { authenticate, optionalAuth } from "../../middleware/authenticate";
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

export default router;
