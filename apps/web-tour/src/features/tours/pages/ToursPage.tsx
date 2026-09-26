import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { TourCard } from "@/components/travel/TourCard";
import { Button } from "@/components/ui/Button";
import { useTours } from "@/hooks/useTours";
import type { TourFilters } from "@/domain/tour/tour.types";

const STYLES = ["Trekking", "Cultural", "Wildlife", "Family", "Adventure", "Luxury"];
const DURATIONS = [
  { label: "1–3 days",  min: 1,  max: 3  },
  { label: "4–7 days",  min: 4,  max: 7  },
  { label: "8–14 days", min: 8,  max: 14 },
  { label: "15+ days",  min: 15, max: 999 },
];

export default function ToursPage() {
  const [filters, setFilters] = useState<TourFilters>({ limit: 12, page: 1 });
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching } = useTours(filters);

  const tours = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  const applyStyle = (style: string) =>
    setFilters((f) => ({ ...f, travelStyle: f.travelStyle === style ? undefined : style, page: 1 }));

  const applyDuration = (min: number, max: number) =>
    setFilters((f) => ({ ...f, minDays: f.minDays === min ? undefined : min, maxDays: f.maxDays === max ? undefined : max, page: 1 }));

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
  };

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-pad pb-0 bg-cloud border-b border-stone/15">
        <div className="mx-auto max-w-wide px-6 lg:px-12">
          <p className="eyebrow mb-3">Explore our collection</p>
          <h1 className="text-display-lg font-serif text-ink mb-6">All tours</h1>

          {/* Search */}
          <form onSubmit={applySearch} className="flex gap-3 mb-8" role="search">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search tours..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tours"
                className="w-full rounded-brand border border-stone/30 bg-white pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-stone/60 focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
              />
            </div>
            <Button type="submit" variant="primary" size="md">Search</Button>
          </form>

          {/* Filters row */}
          <div className="flex flex-wrap gap-2 pb-6">
            <span className="flex items-center gap-1.5 text-xs text-stone font-medium mr-2">
              <SlidersHorizontal size={13} />Style:
            </span>
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => applyStyle(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${filters.travelStyle === s ? "bg-pine text-cloud" : "border border-stone/25 text-stone hover:border-pine hover:text-pine"}`}
                aria-pressed={filters.travelStyle === s}
              >
                {s}
              </button>
            ))}
            <span className="flex items-center gap-1.5 text-xs text-stone font-medium mx-2">Duration:</span>
            {DURATIONS.map(({ label, min, max }) => (
              <button
                key={label}
                onClick={() => applyDuration(min, max)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${filters.minDays === min ? "bg-pine text-cloud" : "border border-stone/25 text-stone hover:border-pine hover:text-pine"}`}
                aria-pressed={filters.minDays === min}
              >
                {label}
              </button>
            ))}
            {(filters.travelStyle || filters.minDays || filters.search) && (
              <button
                onClick={() => { setFilters({ limit: 12, page: 1 }); setSearch(""); }}
                className="ml-auto text-xs text-stone underline hover:text-pine"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-pad">
        <div className="mx-auto max-w-wide px-6 lg:px-12">
          <p className="text-sm text-stone mb-8">
            {isFetching ? "Loading..." : `${total} tour${total !== 1 ? "s" : ""} found`}
          </p>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3,4,5,6].map((i) => <div key={i} className="rounded-brand aspect-[4/5] bg-stone/10 animate-pulse" />)}
            </div>
          ) : tours.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-display-md font-serif text-stone/30 mb-4">No tours found</p>
              <p className="text-sm text-stone mb-8">Try adjusting your filters or search terms.</p>
              <Button onClick={() => setFilters({ limit: 12, page: 1 })}>Clear filters</Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
            </div>
          )}

          {/* Pagination */}
          {data && data.meta.totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-stone">
                {filters.page} / {data.meta.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={filters.page === data.meta.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}