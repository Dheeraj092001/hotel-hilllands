import { Link } from "react-router-dom";
import { Clock, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDuration } from "@/lib/format";
import type { Tour } from "@/domain/tour/tour.types";

interface TourCardProps {
  tour: Tour;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function TourCard({ tour, className, orientation = "vertical" }: TourCardProps) {
  const primaryImage = tour.media.find((m) => m.isPrimary) ?? tour.media[0];

  return (
    <Link
      to={`/tours/${tour.slug}`}
      className={cn(
        "group relative flex overflow-hidden rounded-brand bg-white ring-1 ring-stone/20 transition-shadow hover:ring-pine/30 hover:shadow-lg hover:shadow-pine/10",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className
      )}
      aria-label={`View ${tour.title} tour`}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden bg-stone/20",
          orientation === "horizontal" ? "w-56 shrink-0" : "aspect-[4/3]"
        )}
      >
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText ?? tour.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-glacier">
            <svg width="40" height="28" viewBox="0 0 40 28" fill="none" aria-hidden="true">
              <path d="M0 28L10 8L16 16L22 4L32 16L40 28H0Z" fill="#275B45" opacity="0.3" />
            </svg>
          </div>
        )}

        {tour.isFeatured && (
          <span className="absolute top-3 left-3">
            <Badge variant="gold">Featured</Badge>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {tour.travelStyle && (
            <Badge variant="glacier">{tour.travelStyle}</Badge>
          )}
          {tour.destination.name && (
            <span className="text-xs text-stone">{tour.destination.name}</span>
          )}
        </div>

        <h3 className="mb-3 font-serif text-lg text-ink line-clamp-2 group-hover:text-forest transition-colors">
          {tour.title}
        </h3>

        {tour.summary && (
          <p className="mb-4 text-sm text-stone leading-relaxed line-clamp-2">{tour.summary}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-stone/15 pt-4">
          {tour.durationDays && (
            <span className="flex items-center gap-1.5 text-xs text-stone">
              <Clock size={13} className="text-pine" />
              {formatDuration(tour.durationDays)}
            </span>
          )}
          {tour.maxGroup && (
            <span className="flex items-center gap-1.5 text-xs text-stone">
              <Users size={13} className="text-pine" />
              Max {tour.maxGroup} pax
            </span>
          )}
          {tour.basePriceInr && (
            <span className="ml-auto flex flex-col text-right">
              <span className="text-xs text-stone">From</span>
              <span className="text-sm font-semibold text-ink">
                {formatPrice(tour.basePriceInr)}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <span className="absolute bottom-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-pine/0 text-pine transition-all duration-200 group-hover:bg-pine/10">
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}