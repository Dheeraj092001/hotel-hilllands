"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCouponSchema = exports.createRoomSchema = exports.createFoodOrderSchema = exports.createReviewSchema = exports.contactFormSchema = exports.createBookingSchema = exports.bookingSearchSchema = exports.updateProfileSchema = exports.registerSchema = exports.paginationSchema = void 0;
const zod_1 = require("zod");
// ─── Common ───────────────────────────────────────────────────
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
    search: zod_1.z.string().optional(),
});
// ─── Auth ─────────────────────────────────────────────────────
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(100),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().optional(),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    phone: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    postalCode: zod_1.z.string().optional(),
});
// ─── Booking ──────────────────────────────────────────────────
exports.bookingSearchSchema = zod_1.z.object({
    checkIn: zod_1.z.string().min(1, "Check-in date is required"),
    checkOut: zod_1.z.string().min(1, "Check-out date is required"),
    adults: zod_1.z.coerce.number().int().min(1).max(10).default(1),
    children: zod_1.z.coerce.number().int().min(0).max(6).default(0),
    rooms: zod_1.z.coerce.number().int().min(1).max(5).default(1),
});
exports.createBookingSchema = zod_1.z.object({
    roomId: zod_1.z.string().min(1, "Room is required"),
    checkIn: zod_1.z.string().min(1, "Check-in date is required"),
    checkOut: zod_1.z.string().min(1, "Check-out date is required"),
    adults: zod_1.z.coerce.number().int().min(1).max(10),
    children: zod_1.z.coerce.number().int().min(0).max(6).default(0),
    couponCode: zod_1.z.string().optional(),
    specialRequests: zod_1.z.string().max(500).optional(),
    extras: zod_1.z.array(zod_1.z.string()).optional(),
    guestName: zod_1.z.string().min(2),
    guestEmail: zod_1.z.string().email(),
    guestPhone: zod_1.z.string().min(10),
});
// ─── Contact / Lead ───────────────────────────────────────────
exports.contactFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required"),
    email: zod_1.z.string().email("Invalid email"),
    phone: zod_1.z.string().optional(),
    subject: zod_1.z.string().min(3, "Subject is required"),
    message: zod_1.z.string().min(10, "Message must be at least 10 characters"),
    travelDate: zod_1.z.string().optional(),
    numberOfGuests: zod_1.z.coerce.number().int().positive().optional(),
});
// ─── Review ───────────────────────────────────────────────────
exports.createReviewSchema = zod_1.z.object({
    bookingId: zod_1.z.string().min(1),
    overallRating: zod_1.z.number().int().min(1).max(5),
    cleanlinessRating: zod_1.z.number().int().min(1).max(5),
    serviceRating: zod_1.z.number().int().min(1).max(5),
    locationRating: zod_1.z.number().int().min(1).max(5),
    foodRating: zod_1.z.number().int().min(1).max(5),
    valueRating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().min(20, "Review must be at least 20 characters").max(1000),
});
// ─── Food Order ───────────────────────────────────────────────
exports.createFoodOrderSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        foodItemId: zod_1.z.string(),
        quantity: zod_1.z.number().int().min(1),
        specialInstructions: zod_1.z.string().optional(),
    })).min(1, "Add at least one item"),
    deliveryType: zod_1.z.enum(["ROOM", "PICKUP"]),
    roomNumber: zod_1.z.string().optional(),
    bookingId: zod_1.z.string().optional(),
});
// ─── Room (Admin) ─────────────────────────────────────────────
exports.createRoomSchema = zod_1.z.object({
    roomNumber: zod_1.z.string().min(1, "Room number is required"),
    name: zod_1.z.string().min(2, "Name is required"),
    typeId: zod_1.z.string().min(1, "Room type is required"),
    description: zod_1.z.string().min(20, "Description must be at least 20 characters"),
    shortDescription: zod_1.z.string().max(200),
    maxAdults: zod_1.z.coerce.number().int().min(1).max(10),
    maxChildren: zod_1.z.coerce.number().int().min(0).max(6),
    bedType: zod_1.z.enum(["SINGLE", "DOUBLE", "QUEEN", "KING", "TWIN", "BUNK"]),
    numberOfBeds: zod_1.z.coerce.number().int().min(1),
    sizeInSqft: zod_1.z.coerce.number().positive(),
    floor: zod_1.z.coerce.number().int().min(0),
    viewType: zod_1.z.string(),
    basePrice: zod_1.z.coerce.number().positive("Price must be greater than 0"),
    weekendPrice: zod_1.z.coerce.number().positive(),
    seasonalPrice: zod_1.z.coerce.number().positive().optional(),
    discount: zod_1.z.coerce.number().min(0).max(100).default(0),
    isFeatured: zod_1.z.boolean().default(false),
    isPublished: zod_1.z.boolean().default(false),
});
// ─── Coupon (Admin) ───────────────────────────────────────────
exports.createCouponSchema = zod_1.z.object({
    code: zod_1.z.string().min(3).max(20).toUpperCase(),
    discountType: zod_1.z.enum(["PERCENTAGE", "FIXED"]),
    value: zod_1.z.coerce.number().positive(),
    minBookingAmount: zod_1.z.coerce.number().positive().optional(),
    maxDiscountAmount: zod_1.z.coerce.number().positive().optional(),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    usageLimit: zod_1.z.coerce.number().int().positive().optional(),
    userLimit: zod_1.z.coerce.number().int().positive().optional(),
    isActive: zod_1.z.boolean().default(true),
});
//# sourceMappingURL=index.js.map