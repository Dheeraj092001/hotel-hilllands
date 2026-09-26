import { useParams, Link } from "react-router-dom";
import { Clock, Users, Calendar, ArrowLeft } from "lucide-react";
import { useTourDetail } from "@/hooks/useTours";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDuration } from "@/lib/format";
import { useReveal } from "@/hooks/useReveal";

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: tour, isLoading, error } = useTourDetail(slug ?? "");
  const revealRef = useReveal<HTMLDivElement>();

  if (isLoading) {
    return (
      <div className="pt-32 section-pad">
        <div className="mx-auto max-w-editorial px-6 lg:px-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-stone/20 rounded" />
            <div className="h-12 w-3/4 bg-stone/20 rounded" />
            <div className="aspect-video bg-stone/15 rounded-brand" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="pt-32 section-pad text-center">
        <h1 className="text-display-md font-serif text-ink mb-4">Tour not found</h1>
        <Link to="/tours"><Button>Browse all tours</Button></Link>
      </div>
    );
  }

  const primaryImage = tour.media.find((m) => m.isPrimary) ?? tour.media[0];

  return (
    <article className="pt-24">
      {/* Hero image */}
      <div className="relative h-[50vh] lg:h-[65vh] bg-ink overflow-hidden">
        {primaryImage && (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText ?? tour.title}
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 overlay-gradient" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <Link to="/tours" className="flex items-center gap-2 text-cloud/70 hover:text-cloud text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> All tours
          </Link>
          {tour.travelStyle && <Badge variant="gold" className="mb-3">{tour.travelStyle}</Badge>}
          <h1 className="text-display-lg font-serif text-cloud">{tour.title}</h1>
        </div>
      </div>

      {/* Content grid */}
      <div ref={revealRef} className="mx-auto max-w-wide px-6 lg:px-12 py-16 lg:grid lg:grid-cols-3 lg:gap-16">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-12" data-gsap-reveal>
          {/* Quick info */}
          <div className="flex flex-wrap gap-6 p-6 bg-glacier rounded-brand">
            {tour.durationDays && (
              <div className="flex items-center gap-2 text-sm text-ink">
                <Clock size={16} className="text-pine" />
                {formatDuration(tour.durationDays)}
              </div>
            )}
            {tour.maxGroup && (
              <div className="flex items-center gap-2 text-sm text-ink">
                <Users size={16} className="text-pine" />
                Max {tour.maxGroup} pax
              </div>
            )}
            {tour.departures.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-ink">
                <Calendar size={16} className="text-pine" />
                {tour.departures.length} departure{tour.departures.length !== 1 ? "s" : ""} available
              </div>
            )}
            {tour.basePriceInr && (
              <div className="ml-auto text-right">
                <p className="text-xs text-stone">From</p>
                <p className="text-xl font-semibold text-ink">{formatPrice(tour.basePriceInr)}</p>
              </div>
            )}
          </div>

          {/* Summary */}
          {tour.summary && (
            <div>
              <h2 className="text-xl font-serif text-ink mb-4">Overview</h2>
              <p className="text-ink/80 leading-relaxed">{tour.summary}</p>
            </div>
          )}

          {/* Highlights */}
          {tour.highlights && tour.highlights.length > 0 && (
            <div>
              <h2 className="text-xl font-serif text-ink mb-4">Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink/80">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-alpine-sun shrink-0" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Itinerary */}
          {tour.itineraryDays.length > 0 && (
            <div>
              <h2 className="text-xl font-serif text-ink mb-6">Day-by-day itinerary</h2>
              <div className="space-y-4">
                {tour.itineraryDays.map((day) => (
                  <details key={day.id} className="group border border-stone/20 rounded-brand overflow-hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-medium text-ink hover:bg-glacier/50 transition-colors">
                      <span className="flex items-center gap-3">
                        <Badge variant="glacier">Day {day.dayNumber}</Badge>
                        {day.title}
                      </span>
                      <span className="text-stone group-open:rotate-180 transition-transform text-xs">▼</span>
                    </summary>
                    <div className="px-5 pb-5 text-sm text-ink/80 leading-relaxed border-t border-stone/15">
                      <p className="mt-4">{day.description}</p>
                      {day.location && <p className="mt-2 text-xs text-stone">📍 {day.location}</p>}
                      {day.meals && <p className="mt-1 text-xs text-stone">🍽️ {day.meals}</p>}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions / Exclusions */}
          {(tour.inclusions?.length || tour.exclusions?.length) && (
            <div className="grid sm:grid-cols-2 gap-8">
              {tour.inclusions && tour.inclusions.length > 0 && (
                <div>
                  <h2 className="text-xl font-serif text-ink mb-4">Included</h2>
                  <ul className="space-y-2">
                    {tour.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink/80">
                        <span className="text-green-600 mt-0.5" aria-hidden="true">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.exclusions && tour.exclusions.length > 0 && (
                <div>
                  <h2 className="text-xl font-serif text-ink mb-4">Not included</h2>
                  <ul className="space-y-2">
                    {tour.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-stone">
                        <span className="text-red-400 mt-0.5" aria-hidden="true">✗</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* FAQs */}
          {tour.faqs.length > 0 && (
            <div>
              <h2 className="text-xl font-serif text-ink mb-6">FAQs</h2>
              <div className="space-y-3">
                {tour.faqs.map((faq) => (
                  <details key={faq.id} className="border border-stone/20 rounded-brand overflow-hidden">
                    <summary className="p-4 cursor-pointer list-none font-medium text-sm text-ink hover:bg-glacier/50 transition-colors">{faq.question}</summary>
                    <p className="px-4 pb-4 text-sm text-ink/80 leading-relaxed border-t border-stone/15 pt-3">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — enquiry form */}
        <aside className="mt-16 lg:mt-0" data-gsap-reveal>
          <div className="sticky top-28">
            <div className="rounded-brand border border-stone/20 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-serif text-ink mb-6">Enquire about this tour</h2>
              <EnquiryForm tourId={tour.id} />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}