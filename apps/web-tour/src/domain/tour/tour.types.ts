export interface Tour {
  id: string;
  slug: string;
  title: string;
  travelStyle: string | null;
  durationDays: number | null;
  minGroup: number | null;
  maxGroup: number | null;
  basePriceInr: number | null;
  summary: string | null;
  highlights: string[] | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  mapData: GeoPoint | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  destination: DestinationRef;
  itineraryDays: ItineraryDay[];
  departures: Departure[];
  pricingRules: PricingRule[];
  media: TourMedia[];
  faqs: TourFaq[];
  createdAt: string;
  updatedAt: string;
}

export interface DestinationRef {
  id: string;
  name: string;
  slug: string;
  region: string | null;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  location: string | null;
  accommodation: string | null;
  meals: string | null;
  activities: string[] | null;
}

export interface Departure {
  id: string;
  startDate: string;
  endDate: string;
  priceOverride: number | null;
  seatsTotal: number | null;
  seatsBooked: number;
  seatsAvailable: number;
  status: "OPEN" | "FULL" | "CANCELLED" | "COMPLETED";
}

export interface PricingRule {
  id: string;
  name: string;
  ruleType: "FIXED" | "PERCENTAGE" | "PER_PERSON";
  value: number;
  conditions: Record<string, unknown> | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

export interface TourMedia {
  id: string;
  url: string;
  publicId: string;
  altText: string | null;
  caption: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface TourFaq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface GeoPoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface TourFilters {
  destinationSlug?: string;
  travelStyle?: string;
  minDays?: number;
  maxDays?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export interface TourListResponse {
  data: Tour[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type TourAvailability = Departure;