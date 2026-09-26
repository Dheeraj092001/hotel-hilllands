import { useQuery } from "@tanstack/react-query";
import { toursService } from "@/services/api/tours";
import type { TourFilters } from "@/domain/tour/tour.types";

export const tourKeys = {
  all:        ["tours"] as const,
  lists:      () => [...tourKeys.all, "list"] as const,
  list:       (f: TourFilters) => [...tourKeys.lists(), f] as const,
  featured:   () => [...tourKeys.all, "featured"] as const,
  detail:     (slug: string) => [...tourKeys.all, "detail", slug] as const,
  availability:(slug: string) => [...tourKeys.all, "availability", slug] as const,
};

export function useTours(filters?: TourFilters) {
  return useQuery({
    queryKey: tourKeys.list(filters ?? {}),
    queryFn: () => toursService.list(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedTours() {
  return useQuery({
    queryKey: tourKeys.featured(),
    queryFn: toursService.getFeatured,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTourDetail(slug: string) {
  return useQuery({
    queryKey: tourKeys.detail(slug),
    queryFn: () => toursService.getBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTourAvailability(slug: string) {
  return useQuery({
    queryKey: tourKeys.availability(slug),
    queryFn: () => toursService.getAvailability(slug),
    enabled: Boolean(slug),
    staleTime: 2 * 60 * 1000,
  });
}