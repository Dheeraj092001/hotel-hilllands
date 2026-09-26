export const APP_NAME = "Himalaya''s Tour & Travel";
export const APP_TAGLINE = "Where the Mountains Begin";
export const BRAND_EMAIL = "hello@himalayastourandtravel.com";
export const BRAND_PHONE = "+91 98160 XXXXX";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api/v1";

/** Tour status labels */
export const TOUR_STATUS = {
  ACTIVE: "Active",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
} as const;

/** Enquiry source options */
export const ENQUIRY_SOURCES = {
  WEBSITE:   "Website",
  WHATSAPP:  "WhatsApp",
  INSTAGRAM: "Instagram",
  REFERRAL:  "Referral",
  WALK_IN:   "Walk-in",
} as const;