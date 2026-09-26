import { apiClient } from "./client";
import type {
  Tour,
  TourListResponse,
  TourFilters,
  TourAvailability,
} from "@/domain/tour/tour.types";

export const toursService = {
  /** List published tours with optional filters */
  list: async (filters?: TourFilters): Promise<TourListResponse> => {
    const { data } = await apiClient.get("/tours", { params: filters });
    return data;
  },

  /** Get single tour by slug */
  getBySlug: async (slug: string): Promise<Tour> => {
    const { data } = await apiClient.get(`/tours/${slug}`);
    return data.data;
  },

  /** Get departure availability for a tour */
  getAvailability: async (slug: string): Promise<TourAvailability[]> => {
    const { data } = await apiClient.get(`/tours/${slug}/availability`);
    return data.data;
  },

  /** Get featured tours for homepage */
  getFeatured: async (): Promise<Tour[]> => {
    const { data } = await apiClient.get("/tours", {
      params: { isFeatured: true, limit: 6 },
    });
    return data.data;
  },
};