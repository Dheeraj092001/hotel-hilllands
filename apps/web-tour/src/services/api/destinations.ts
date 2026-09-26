import { apiClient } from "./client";
import { MOCK_DESTINATIONS } from "./mockData";
import type {
  Destination,
  DestinationListResponse,
} from "@/domain/destination/destination.types";

export const destinationsService = {
  list: async (): Promise<DestinationListResponse> => {
    try {
      const { data } = await apiClient.get("/destinations");
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }

    return {
      data: MOCK_DESTINATIONS,
      meta: {
        total: MOCK_DESTINATIONS.length,
      },
    };
  },

  getBySlug: async (slug: string): Promise<Destination> => {
    try {
      const { data } = await apiClient.get(`/destinations/${slug}`);
      if (data?.data) return data.data;
    } catch {
      // Fallback
    }

    const found = MOCK_DESTINATIONS.find((d) => d.slug === slug);
    if (found) return found;
    return MOCK_DESTINATIONS[0];
  },
};