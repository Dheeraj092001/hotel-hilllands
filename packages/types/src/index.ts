// ============================================================
// HOTEL NEWLANDS SHIMLA — Shared TypeScript Types
// ============================================================

// ─── API Response ────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

// ─── User ─────────────────────────────────────────────────────
export type UserRole =
  | "SUPER_ADMIN"
  | "HOTEL_ADMIN"
  | "MANAGER"
  | "RECEPTION"
  | "RESTAURANT_MANAGER"
  | "ACCOUNTANT"
  | "CONTENT_MANAGER"
  | "HOUSEKEEPING"
  | "GUEST";

export interface User {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Room ─────────────────────────────────────────────────────
export type RoomStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "BLOCKED"
  | "MAINTENANCE"
  | "CLEANING";

export type HousekeepingStatus =
  | "CLEAN"
  | "DIRTY"
  | "CLEANING"
  | "INSPECTION"
  | "MAINTENANCE"
  | "OUT_OF_ORDER";

export type BedType =
  | "SINGLE"
  | "DOUBLE"
  | "QUEEN"
  | "KING"
  | "TWIN"
  | "BUNK";

export interface Room {
  id: string;
  roomNumber: string;
  name: string;
  slug: string;
  typeId: string;
  type?: RoomType;
  description: string;
  shortDescription: string;
  maxAdults: number;
  maxChildren: number;
  bedType: BedType;
  numberOfBeds: number;
  sizeInSqft: number;
  floor: number;
  viewType: string;
  basePrice: number;
  weekendPrice: number;
  seasonalPrice?: number;
  discount: number;
  amenities: Amenity[];
  images: RoomImage[];
  status: RoomStatus;
  housekeepingStatus: HousekeepingStatus;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomType {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface RoomImage {
  id: string;
  roomId: string;
  url: string;
  altText?: string;
  caption?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  category?: string;
}

// ─── Booking ──────────────────────────────────────────────────
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW"
  | "EXPIRED";

export interface Booking {
  id: string;
  confirmationNumber: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "email" | "phone">;
  roomId: string;
  room?: Pick<Room, "id" | "roomNumber" | "name">;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  status: BookingStatus;
  subtotal: number;
  discount: number;
  tax: number;
  serviceCharge: number;
  total: number;
  currency: string;
  couponId?: string;
  source: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ──────────────────────────────────────────────────
export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "AUTHORIZED"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "CANCELLED";

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  transactionId: string;
  provider: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  refundId?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Food ─────────────────────────────────────────────────────
export type FoodOrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface FoodCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FoodItem {
  id: string;
  categoryId: string;
  category?: FoodCategory;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount: number;
  image?: string;
  isVeg: boolean;
  spiceLevel?: "MILD" | "MEDIUM" | "HOT" | "EXTRA_HOT";
  allergens?: string[];
  preparationTimeMinutes?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

// ─── Offer / Coupon ───────────────────────────────────────────
export type DiscountType = "PERCENTAGE" | "FIXED";

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  value: number;
  minBookingAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  userLimit?: number;
  usageCount: number;
  isActive: boolean;
}

// ─── Review ───────────────────────────────────────────────────
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";

export interface Review {
  id: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "profileImage">;
  bookingId: string;
  overallRating: number;
  cleanlinessRating: number;
  serviceRating: number;
  locationRating: number;
  foodRating: number;
  valueRating: number;
  comment: string;
  status: ReviewStatus;
  isFeatured: boolean;
  adminReply?: string;
  createdAt: string;
}

// ─── Lead ─────────────────────────────────────────────────────
export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "SPAM";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  travelDate?: string;
  numberOfGuests?: number;
  status: LeadStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Invoice ──────────────────────────────────────────────────
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
  category?: "ACCOMMODATION" | "FOOD_BEVERAGE" | "EXTRAS" | "ADDITIONAL" | string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  userId: string;
  subtotal: number;
  discount: number;
  tax: number;
  serviceCharge: number;
  extras: number;
  food: number;
  total: number;
  currency: string;
  status: "PAID" | "UNPAID" | "PARTIALLY_PAID" | "CANCELLED";
  pdfUrl?: string;
  issuedAt: string;
  dueDate?: string;
  items?: InvoiceItem[];
  booking?: any;
}

export interface CustomInvoiceItemPayload {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  category: "ACCOMMODATION" | "FOOD_BEVERAGE" | "EXTRAS" | "ADDITIONAL" | string;
}

export interface GenerateCheckoutInvoicePayload {
  bookingId: string;
  paymentMethod?: "CASH" | "CREDIT_CARD" | "UPI" | "ROOM_BILL" | string;
  settleBalance?: boolean;
  notes?: string;
  additionalItems?: CustomInvoiceItemPayload[];
}

export interface CheckoutInvoicePreview {
  booking: {
    id: string;
    confirmationNumber: string;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    adults: number;
    children: number;
    status: string;
    room: {
      id: string;
      name: string;
      roomNumber: string;
      basePrice: number;
      typeName?: string;
    };
  };
  roomCharges: {
    nights: number;
    nightlyRate: number;
    subtotal: number;
    taxRate: number;
    tax: number;
    total: number;
  };
  foodOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    subtotal: number;
    tax: number;
    total: number;
    items: Array<{
      id: string;
      dishName: string;
      quantity: number;
      unitPrice: number;
      total: number;
      isVeg?: boolean;
    }>;
  }>;
  extras: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    taxRate: number;
  }>;
  payments: Array<{
    id: string;
    transactionId: string;
    provider: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  summary: {
    roomSubtotal: number;
    foodSubtotal: number;
    extrasSubtotal: number;
    grossSubtotal: number;
    discount: number;
    roomTax: number;
    foodTax: number;
    extrasTax: number;
    totalTax: number;
    serviceCharge: number;
    grandTotal: number;
    totalPaid: number;
    balanceDue: number;
  };
}

// ─── Notification ─────────────────────────────────────────────
export type NotificationType =
  | "BOOKING_CREATED"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "REFUND_PROCESSED"
  | "CHECK_IN_REMINDER"
  | "CHECK_OUT_REMINDER"
  | "FOOD_ORDER_STATUS"
  | "INVOICE_GENERATED"
  | "REVIEW_REQUEST"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ─── Pagination ───────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}
