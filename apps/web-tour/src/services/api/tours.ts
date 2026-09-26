import { apiClient } from "./client";
import { MOCK_TOURS } from "./mockData";
import type {
  Tour,
  TourListResponse,
  TourFilters,
  TourAvailability,
} from "@/domain/tour/tour.types";

export const toursService = {
  /** List published tours with optional filters */
  list: async (filters?: TourFilters): Promise<TourListResponse> => {
    try {
      const { data } = await apiClient.get("/tours", { params: filters });
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }

    let filtered = [...MOCK_TOURS];
    if (filters?.destinationSlug) {
      filtered = filtered.filter(
        (t) => t.destination?.slug === filters.destinationSlug
      );
    }
    if (filters?.travelStyle) {
      filtered = filtered.filter(
        (t) => t.travelStyle?.toLowerCase() === filters.travelStyle?.toLowerCase()
      );
    }

    return {
      data: filtered,
      meta: {
        total: filtered.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      },
    };
  },

  /** Get single tour by slug */
  getBySlug: async (slug: string): Promise<Tour> => {
    try {
      const { data } = await apiClient.get(`/tours/${slug}`);
      if (data?.data) return data.data;
    } catch {
      // Fallback
    }

    const found = MOCK_TOURS.find((t) => t.slug === slug);
    if (found) return found;
    return MOCK_TOURS[0];
  },

  /** Get departure availability for a tour */
  getAvailability: async (slug: string): Promise<TourAvailability[]> => {
    try {
      const { data } = await apiClient.get(`/tours/${slug}/availability`);
      if (data?.data) return data.data;
    } catch {
      // Fallback
    }

    const tour = MOCK_TOURS.find((t) => t.slug === slug) || MOCK_TOURS[0];
    return (tour.departures || []) as unknown as TourAvailability[];
  },

  /** Get featured tours for homepage */
  getFeatured: async (): Promise<Tour[]> => {
    try {
      const { data } = await apiClient.get("/tours", {
        params: { isFeatured: true, limit: 6 },
      });
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
    } catch {
      // Fallback
    }

    return MOCK_TOURS.filter((t) => t.isFeatured);
  },
};