import { useQuery } from "@tanstack/react-query";
import { destinationsService } from "@/services/api/destinations";

export const destinationKeys = {
  all:    ["destinations"] as const,
  lists:  () => [...destinationKeys.all, "list"] as const,
  detail: (slug: string) => [...destinationKeys.all, "detail", slug] as const,
};

export function useDestinations() {
  return useQuery({
    queryKey: destinationKeys.lists(),
    queryFn: destinationsService.list,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDestination(slug: string) {
  return useQuery({
    queryKey: destinationKeys.detail(slug),
    queryFn: () => destinationsService.getBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}