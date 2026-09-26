import { DestinationCard } from "@/components/travel/DestinationCard";
import { useDestinations } from "@/hooks/useDestinations";
import { useReveal } from "@/hooks/useReveal";

export default function DestinationsPage() {
  const { data, isLoading } = useDestinations();
  const revealRef = useReveal<HTMLDivElement>({ stagger: 0.06 });
  const destinations = data?.data ?? [];

  return (
    <div className="pt-24">
      <section className="section-pad bg-ink">
        <div className="mx-auto max-w-wide px-6 lg:px-12">
          <p className="eyebrow text-alpine-sun mb-3">The Himalayas await</p>
          <h1 className="text-display-lg font-serif text-cloud mb-4">Destinations</h1>
          <p className="text-lead text-cloud/60 max-w-2xl">From the cold deserts of Spiti to the lush valleys of Kullu, discover every corner of the Himalayas with an expert at your side.</p>
        </div>
      </section>

      <section className="section-pad">
        <div ref={revealRef} className="mx-auto max-w-wide px-6 lg:px-12">
          {isLoading ? (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {[1,2,3,4,5,6,7,8].map((i) => <div key={i} className="rounded-brand aspect-[3/4] bg-stone/10 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" data-gsap-reveal>
              {destinations.map((dest) => <DestinationCard key={dest.id} destination={dest} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}