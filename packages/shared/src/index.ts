// ============================================================
// HOTEL NEWLANDS SHIMLA — Shared Constants
// ============================================================

export const BRAND = {
  name: "Hotel Newlands Shimla",
  shortName: "HNS",
  tagline: "Where the mountains become your view.",
  invoicePrefix: "NLS",
  currency: "INR",
  currencySymbol: "₹",
  phone: "+91 00000 00000",
  email: "info@hotelnewlandsshimla.com",
  address: "Shimla, Himachal Pradesh, India",
} as const;

export const COLORS = {
  deepForest: "#183C32",
  himalayanGreen: "#315C4A",
  warmIvory: "#F7F3EA",
  sand: "#D9C7A3",
  charcoal: "#1C1C1A",
  mutedStone: "#78756E",
  white: "#FFFFFF",
} as const;

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
  EXPIRED: "EXPIRED",
} as const;

export const PAYMENT_STATUS = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  AUTHORIZED: "AUTHORIZED",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
  CANCELLED: "CANCELLED",
} as const;

export const ROOM_STATUS = {
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  RESERVED: "RESERVED",
  BLOCKED: "BLOCKED",
  MAINTENANCE: "MAINTENANCE",
  CLEANING: "CLEANING",
} as const;

export const FOOD_ORDER_STATUS = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY: "READY",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  HOTEL_ADMIN: "HOTEL_ADMIN",
  MANAGER: "MANAGER",
  RECEPTION: "RECEPTION",
  RESTAURANT_MANAGER: "RESTAURANT_MANAGER",
  ACCOUNTANT: "ACCOUNTANT",
  CONTENT_MANAGER: "CONTENT_MANAGER",
  HOUSEKEEPING: "HOUSEKEEPING",
  GUEST: "GUEST",
} as const;

export const PERMISSIONS = {
  ROOMS_READ: "rooms.read",
  ROOMS_CREATE: "rooms.create",
  ROOMS_UPDATE: "rooms.update",
  ROOMS_DELETE: "rooms.delete",
  BOOKINGS_READ: "bookings.read",
  BOOKINGS_CREATE: "bookings.create",
  BOOKINGS_UPDATE: "bookings.update",
  BOOKINGS_CANCEL: "bookings.cancel",
  PAYMENTS_READ: "payments.read",
  PAYMENTS_REFUND: "payments.refund",
  INVOICES_READ: "invoices.read",
  INVOICES_CREATE: "invoices.create",
  FOOD_READ: "food.read",
  FOOD_MANAGE: "food.manage",
  FOOD_ORDERS_READ: "food.orders.read",
  FOOD_ORDERS_UPDATE: "food.orders.update",
  USERS_READ: "users.read",
  USERS_MANAGE: "users.manage",
  CMS_READ: "cms.read",
  CMS_WRITE: "cms.write",
  MEDIA_MANAGE: "media.manage",
  REVIEWS_MODERATE: "reviews.moderate",
  LEADS_READ: "leads.read",
  LEADS_MANAGE: "leads.manage",
  ANALYTICS_READ: "analytics.read",
  AUDIT_READ: "audit.read",
  STAFF_MANAGE: "staff.manage",
  SETTINGS_MANAGE: "settings.manage",
  HOUSEKEEPING_READ: "housekeeping.read",
  HOUSEKEEPING_MANAGE: "housekeeping.manage",
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  HOTEL_ADMIN: Object.values(PERMISSIONS),
  MANAGER: [
    PERMISSIONS.ROOMS_READ, PERMISSIONS.ROOMS_UPDATE,
    PERMISSIONS.BOOKINGS_READ, PERMISSIONS.BOOKINGS_UPDATE, PERMISSIONS.BOOKINGS_CANCEL,
    PERMISSIONS.PAYMENTS_READ, PERMISSIONS.INVOICES_READ,
    PERMISSIONS.USERS_READ, PERMISSIONS.FOOD_READ, PERMISSIONS.FOOD_ORDERS_READ,
    PERMISSIONS.ANALYTICS_READ, PERMISSIONS.REVIEWS_MODERATE, PERMISSIONS.LEADS_MANAGE,
  ],
  RECEPTION: [
    PERMISSIONS.BOOKINGS_READ, PERMISSIONS.BOOKINGS_CREATE, PERMISSIONS.BOOKINGS_UPDATE,
    PERMISSIONS.USERS_READ, PERMISSIONS.ROOMS_READ, PERMISSIONS.INVOICES_READ,
    PERMISSIONS.LEADS_READ,
  ],
  RESTAURANT_MANAGER: [
    PERMISSIONS.FOOD_READ, PERMISSIONS.FOOD_MANAGE,
    PERMISSIONS.FOOD_ORDERS_READ, PERMISSIONS.FOOD_ORDERS_UPDATE,
  ],
  ACCOUNTANT: [
    PERMISSIONS.PAYMENTS_READ, PERMISSIONS.PAYMENTS_REFUND,
    PERMISSIONS.INVOICES_READ, PERMISSIONS.INVOICES_CREATE,
    PERMISSIONS.ANALYTICS_READ,
  ],
  CONTENT_MANAGER: [
    PERMISSIONS.CMS_READ, PERMISSIONS.CMS_WRITE,
    PERMISSIONS.MEDIA_MANAGE, PERMISSIONS.REVIEWS_MODERATE,
  ],
  HOUSEKEEPING: [
    PERMISSIONS.HOUSEKEEPING_READ, PERMISSIONS.HOUSEKEEPING_MANAGE,
    PERMISSIONS.ROOMS_READ,
  ],
};

export const API_VERSION = "v1";
export const API_BASE = `/api/${API_VERSION}`;

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

export const GST_RATES = {
  // These are defaults - actual rates come from DB TaxRule table
  ROOM_BELOW_2500: 0,
  ROOM_2500_7500: 12,
  ROOM_ABOVE_7500: 18,
  FOOD: 5,
} as const;
