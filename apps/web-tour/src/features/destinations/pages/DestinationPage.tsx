import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDestination } from "@/hooks/useDestinations";
import { useTours } from "@/hooks/useTours";
import { TourCard } from "@/components/travel/TourCard";

export default function DestinationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: dest, isLoading } = useDestination(slug ?? "");
  const { data: toursData } = useTours({ destinationSlug: slug, limit: 12 });
  const tours = toursData?.data ?? [];

  if (isLoading) {
    return <div className="pt-32 section-pad"><div className="mx-auto max-w-editorial px-6 animate-pulse space-y-6"><div className="aspect-video bg-stone/15 rounded-brand" /></div></div>;
  }

  if (!dest) return null;

  return (
    <article className="pt-24">
      {/* Hero */}
      <div className="relative h-[45vh] bg-ink overflow-hidden">
        {dest.heroImage && <img src={dest.heroImage} alt={dest.name} className="absolute inset-0 h-full w-full object-cover opacity-70" />}
        <div className="absolute inset-0 overlay-gradient" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <Link to="/destinations" className="flex items-center gap-2 text-cloud/70 hover:text-cloud text-sm mb-3 transition-colors"><ArrowLeft size={14} /> Destinations</Link>
          {dest.region && <p className="text-xs text-cloud/60 mb-1">{dest.region}</p>}
          <h1 className="text-display-lg font-serif text-cloud">{dest.name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-wide px-6 lg:px-12 py-16">
        {dest.description && <p className="text-lead text-ink/80 max-w-2xl mb-16">{dest.description}</p>}
        {tours.length > 0 && (
          <>
            <h2 className="text-2xl font-serif text-ink mb-8">Tours in {dest.name}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
            </div>
          </>
        )}
      </div>
    </article>
  );
}