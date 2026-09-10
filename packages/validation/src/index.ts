import { z } from "zod";

// ─── Common ───────────────────────────────────────────────────
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});

// ─── Auth ─────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

// ─── Booking ──────────────────────────────────────────────────
export const bookingSearchSchema = z.object({
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  adults: z.coerce.number().int().min(1).max(10).default(1),
  children: z.coerce.number().int().min(0).max(6).default(0),
  rooms: z.coerce.number().int().min(1).max(5).default(1),
});

export const createBookingSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  adults: z.coerce.number().int().min(1).max(10),
  children: z.coerce.number().int().min(0).max(6).default(0),
  couponCode: z.string().optional(),
  specialRequests: z.string().max(500).optional(),
  extras: z.array(z.string()).optional(),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(10),
});

// ─── Contact / Lead ───────────────────────────────────────────
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  travelDate: z.string().optional(),
  numberOfGuests: z.coerce.number().int().positive().optional(),
});

// ─── Review ───────────────────────────────────────────────────
export const createReviewSchema = z.object({
  bookingId: z.string().min(1),
  overallRating: z.number().int().min(1).max(5),
  cleanlinessRating: z.number().int().min(1).max(5),
  serviceRating: z.number().int().min(1).max(5),
  locationRating: z.number().int().min(1).max(5),
  foodRating: z.number().int().min(1).max(5),
  valueRating: z.number().int().min(1).max(5),
  comment: z.string().min(20, "Review must be at least 20 characters").max(1000),
});

// ─── Food Order ───────────────────────────────────────────────
export const createFoodOrderSchema = z.object({
  items: z.array(z.object({
    foodItemId: z.string(),
    quantity: z.number().int().min(1),
    specialInstructions: z.string().optional(),
  })).min(1, "Add at least one item"),
  deliveryType: z.enum(["ROOM", "PICKUP"]),
  roomNumber: z.string().optional(),
  bookingId: z.string().optional(),
});

// ─── Room (Admin) ─────────────────────────────────────────────
export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  name: z.string().min(2, "Name is required"),
  typeId: z.string().min(1, "Room type is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().max(200),
  maxAdults: z.coerce.number().int().min(1).max(10),
  maxChildren: z.coerce.number().int().min(0).max(6),
  bedType: z.enum(["SINGLE", "DOUBLE", "QUEEN", "KING", "TWIN", "BUNK"]),
  numberOfBeds: z.coerce.number().int().min(1),
  sizeInSqft: z.coerce.number().positive(),
  floor: z.coerce.number().int().min(0),
  viewType: z.string(),
  basePrice: z.coerce.number().positive("Price must be greater than 0"),
  weekendPrice: z.coerce.number().positive(),
  seasonalPrice: z.coerce.number().positive().optional(),
  discount: z.coerce.number().min(0).max(100).default(0),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

// ─── Coupon (Admin) ───────────────────────────────────────────
export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().positive(),
  minBookingAmount: z.coerce.number().positive().optional(),
  maxDiscountAmount: z.coerce.number().positive().optional(),
  startDate: z.string(),
  endDate: z.string(),
  usageLimit: z.coerce.number().int().positive().optional(),
  userLimit: z.coerce.number().int().positive().optional(),
  isActive: z.boolean().default(true),
});
