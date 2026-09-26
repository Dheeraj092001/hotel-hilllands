import { apiClient } from "./client";
import type {
  Destination,
  DestinationListResponse,
} from "@/domain/destination/destination.types";

export const destinationsService = {
  list: async (): Promise<DestinationListResponse> => {
    const { data } = await apiClient.get("/destinations");
    return data;
  },

  getBySlug: async (slug: string): Promise<Destination> => {
    const { data } = await apiClient.get(`/destinations/${slug}`);
    return data.data;
  },
};