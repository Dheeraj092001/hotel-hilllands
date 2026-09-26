import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Destination } from "@/domain/destination/destination.types";

interface DestinationCardProps {
  destination: Destination;
  className?: string;
}

export function DestinationCard({ destination, className }: DestinationCardProps) {
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-brand aspect-[3/4] block",
        className
      )}
      aria-label={`Explore ${destination.name}`}
    >
      {/* Background image */}
      {destination.heroImage ? (
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-pine to-forest" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 overlay-gradient" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {destination.region && (
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={11} className="text-alpine-sun" />
            <span className="text-xs text-cloud/70 font-medium">{destination.region}</span>
          </div>
        )}
        <h3 className="font-serif text-2xl text-cloud transition-transform duration-300 group-hover:-translate-y-1">
          {destination.name}
        </h3>
        {destination.toursCount !== undefined && (
          <p className="mt-1 text-xs text-cloud/60">
            {destination.toursCount} tour{destination.toursCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </Link>
  );
}