import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";
import { Prisma } from "@prisma/client";

export interface TourFilters {
  destinationId?: string;
  destinationSlug?: string;
  travelStyle?: string;
  minDays?: number;
  maxDays?: number;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

const TOUR_INCLUDE_PUBLIC = {
  destination: { select: { id: true, name: true, slug: true, region: true } },
  media: { orderBy: { sortOrder: "asc" as const } },
  departures: { where: { status: "OPEN" }, orderBy: { startDate: "asc" as const }, take: 5 },
} as const;

const TOUR_INCLUDE_DETAIL = {
  destination: { select: { id: true, name: true, slug: true, region: true } },
  media: { orderBy: { sortOrder: "asc" as const } },
  departures: { where: { status: "OPEN" }, orderBy: { startDate: "asc" as const } },
  itineraryDays: { orderBy: { dayNumber: "asc" as const } },
  faqs: { orderBy: { sortOrder: "asc" as const } },
  pricingRules: { where: { isActive: true } },
} as const;

export class ToursService {
  static async list(filters: TourFilters = {}) {
    const { page = 1, limit = 12, search, travelStyle, featured, minDays, maxDays, destinationId, destinationSlug } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.TourWhereInput = {
      isPublished: true,
      deletedAt: null,
      ...(travelStyle && { travelStyle }),
      ...(featured && { isFeatured: true }),
      ...(minDays && { durationDays: { gte: minDays } }),
      ...(maxDays && { durationDays: { ...(minDays ? { gte: minDays } : {}), lte: maxDays } }),
      ...(destinationId && { destinationId }),
      ...(destinationSlug && { destination: { slug: destinationSlug } }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { summary: { contains: search } },
        ],
      }),
    };

    const [tours, total] = await prisma.$transaction([
      prisma.tour.findMany({ where, include: TOUR_INCLUDE_PUBLIC, skip, take: limit, orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }] }),
      prisma.tour.count({ where }),
    ]);

    return { data: tours, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  static async getFeatured(limit = 6) {
    return prisma.tour.findMany({
      where: { isPublished: true, isFeatured: true, deletedAt: null },
      include: TOUR_INCLUDE_PUBLIC,
      orderBy: { sortOrder: "asc" },
      take: limit,
    });
  }

  static async getBySlug(slug: string) {
    const tour = await prisma.tour.findFirst({
      where: { slug, deletedAt: null },
      include: TOUR_INCLUDE_DETAIL,
    });
    if (!tour) throw new NotFoundError("Tour not found");
    return tour;
  }

  static async create(data: {
    destinationId: string; slug: string; title: string; travelStyle?: string;
    durationDays?: number; minGroup?: number; maxGroup?: number; basePriceInr?: number;
    summary?: string; highlights?: string[]; inclusions?: string[]; exclusions?: string[];
    isPublished?: boolean; isFeatured?: boolean; sortOrder?: number;
  }) {
    return prisma.tour.create({ data: { ...data, basePriceInr: data.basePriceInr ? new Prisma.Decimal(data.basePriceInr) : undefined }, include: TOUR_INCLUDE_PUBLIC });
  }

  static async update(id: string, data: Partial<Parameters<typeof ToursService.create>[0]>) {
    const existing = await prisma.tour.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundError("Tour not found");
    return prisma.tour.update({ where: { id }, data: { ...data, basePriceInr: data.basePriceInr ? new Prisma.Decimal(data.basePriceInr) : undefined }, include: TOUR_INCLUDE_PUBLIC });
  }

  static async softDelete(id: string) {
    return prisma.tour.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Itinerary management ─────────────────────────────────
  static async upsertItinerary(tourId: string, days: { dayNumber: number; title: string; description: string; location?: string; accommodation?: string; meals?: string; activities?: Prisma.InputJsonValue }[]) {
    await prisma.itineraryDay.deleteMany({ where: { tourId } });
    return prisma.itineraryDay.createMany({ data: days.map((d) => ({ ...d, tourId })) });
  }

  // ─── Media management ─────────────────────────────────────
  static async addMedia(tourId: string, media: { url: string; publicId: string; altText?: string; isPrimary?: boolean }) {
    if (media.isPrimary) {
      await prisma.tourMedia.updateMany({ where: { tourId }, data: { isPrimary: false } });
    }
    return prisma.tourMedia.create({ data: { ...media, tourId } });
  }

  static async deleteMedia(mediaId: string) {
    return prisma.tourMedia.delete({ where: { id: mediaId } });
  }

  // ─── Departure management ─────────────────────────────────
  static async addDeparture(tourId: string, data: { startDate: Date; endDate: Date; priceOverride?: number; seatsTotal?: number; notes?: string }) {
    return prisma.departure.create({ data: { ...data, tourId, priceOverride: data.priceOverride ? new Prisma.Decimal(data.priceOverride) : undefined } });
  }

  static async updateDeparture(id: string, data: Partial<{ status: string; seatsBooked: number; notes: string; priceOverride: number }>) {
    return prisma.departure.update({ where: { id }, data: { ...data, priceOverride: data.priceOverride ? new Prisma.Decimal(data.priceOverride) : undefined } });
  }
}