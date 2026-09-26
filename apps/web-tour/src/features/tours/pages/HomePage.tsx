import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Star } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TourCard } from "@/components/travel/TourCard";
import { DestinationCard } from "@/components/travel/DestinationCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Button } from "@/components/ui/Button";
import { useFeaturedTours } from "@/hooks/useTours";
import { useDestinations } from "@/hooks/useDestinations";
import { useReveal } from "@/hooks/useReveal";
import { scrollTo } from "@/hooks/useLenis";

gsap.registerPlugin(ScrollTrigger);

const TRUST_STATS = [
  { value: "2,400+", label: "Travellers served" },
  { value: "14yr",   label: "Of expertise" },
  { value: "30+",    label: "Destinations" },
  { value: "4.9",    label: "Average rating" },
];

const TRAVEL_STYLES = [
  { label: "Trekking",  icon: "🥾" },
  { label: "Cultural",  icon: "🏛️" },
  { label: "Wildlife",  icon: "🐘" },
  { label: "Family",    icon: "👨‍👩‍👧" },
  { label: "Adventure", icon: "🧗" },
  { label: "Luxury",    icon: "✨" },
];

const TESTIMONIALS = [
  { name: "Priya S.", location: "Mumbai",    rating: 5, text: "Absolutely magical Spiti Valley experience. The team arranged everything seamlessly — permits, homestays, and a guide who knew every mountain story." },
  { name: "James T.", location: "London",    rating: 5, text: "The best travel company I have ever used. The Kinnaur apple orchards trek was breathtaking. Will book again without hesitation." },
  { name: "Ananya M.", location: "Bangalore", rating: 5, text: "Our family trip to Manali was perfectly tailored. The kids loved it, the parents loved it. Five stars is not enough." },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const toursRevealRef = useReveal<HTMLDivElement>({ stagger: 0.1 });
  const destRevealRef  = useReveal<HTMLDivElement>({ stagger: 0.08 });
  const testiRevealRef = useReveal<HTMLDivElement>({ stagger: 0.08 });
  const whyRevealRef   = useReveal<HTMLDivElement>({ stagger: 0.06 });

  const { data: featuredToursData, isLoading: toursLoading } = useFeaturedTours();
  const { data: destinationsData, isLoading: destLoading }   = useDestinations();

  const featuredTours = featuredToursData ?? [];
  const destinations  = destinationsData?.data?.slice(0, 6) ?? [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(".hero-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.2 })
        .fromTo(".hero-headline", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.3")
        .fromTo(".hero-sub",      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .fromTo(".hero-ctas",     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");

      gsap.to(".hero-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, heroRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Section 1: Hero */}
      <section
        ref={heroRef}
        className="relative flex min-h-dvh items-end bg-ink pb-20 pt-32 lg:items-center lg:py-0"
        aria-labelledby="hero-heading"
      >
        <div className="hero-bg absolute inset-0 noise-overlay">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-pine to-forest opacity-90" />
          <svg className="absolute bottom-0 left-0 right-0 w-full text-ink opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 320L120 200L240 260L360 120L480 200L600 80L720 180L840 60L960 160L1080 40L1200 140L1320 80L1440 180V320H0Z" fill="currentColor" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-editorial px-6 lg:px-12 text-center lg:text-left">
          <p className="hero-eyebrow eyebrow text-alpine-sun mb-6 opacity-0">Where the Mountains Begin</p>
          <h1 id="hero-heading" className="hero-headline text-display-xl font-serif text-cloud mb-6 opacity-0">
            Authentic<br />
            <em className="not-italic text-alpine-sun">Himalayan</em><br />
            Expeditions
          </h1>
          <p className="hero-sub text-lead text-cloud/70 max-w-2xl mx-auto lg:mx-0 mb-10 opacity-0">
            Expert-guided treks, cultural journeys, and high-altitude adventures crafted for the curious traveller. Based in Shimla since 2010.
          </p>
          <div className="hero-ctas flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-20 lg:mb-0 opacity-0">
            <Link to="/tours">
              <Button size="xl" variant="gold">Explore Tours</Button>
            </Link>
            <Button size="xl" variant="ghost" className="text-cloud border border-cloud/30 hover:bg-cloud/10 hover:border-cloud" onClick={() => scrollTo("#enquire")}>
              Plan Custom Trip
            </Button>
          </div>

          <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
            {TRUST_STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-serif text-2xl text-cloud">{value}</p>
                <p className="text-xs text-cloud/50 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className="absolute bottom-8 right-8 lg:right-12 flex flex-col items-center gap-2 text-cloud/40 hover:text-cloud/70 transition-colors"
          onClick={() => scrollTo("#tours")}
          aria-label="Scroll to tours"
        >
          <span className="text-xs font-mono rotate-90">scroll</span>
          <ArrowDown size={14} className="animate-bounce" />
        </button>
      </section>

      {/* Section 2: Travel styles */}
      <section className="section-pad bg-cloud border-y border-stone/15">
        <div className="mx-auto max-w-editorial px-6 lg:px-12 text-center">
          <p className="eyebrow mb-3">What moves you?</p>
          <h2 className="text-display-md font-serif text-ink mb-10">Travel your way</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {TRAVEL_STYLES.map(({ label, icon }) => (
              <Link key={label} to={`/tours?travelStyle=${encodeURIComponent(label)}`} className="flex items-center gap-2 rounded-full border border-stone/25 bg-white px-5 py-2.5 text-sm font-medium text-ink hover:border-pine hover:bg-glacier transition-all">
                <span aria-hidden="true">{icon}</span>{label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Featured tours */}
      <section id="tours" className="section-pad">
        <div className="mx-auto max-w-wide px-6 lg:px-12">
          <div ref={toursRevealRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div data-gsap-reveal>
              <p className="eyebrow mb-2">Handpicked for you</p>
              <h2 className="text-display-md font-serif text-ink">Featured tours</h2>
            </div>
            <Link to="/tours" data-gsap-reveal><Button variant="secondary">View all tours</Button></Link>
          </div>
          {toursLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map((i) => <div key={i} className="rounded-brand aspect-[4/5] bg-stone/10 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTours.slice(0,6).map((tour) => <TourCard key={tour.id} tour={tour} />)}
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Destinations */}
      <section className="section-pad bg-ink">
        <div className="mx-auto max-w-wide px-6 lg:px-12">
          <div ref={destRevealRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div data-gsap-reveal>
              <p className="eyebrow text-alpine-sun mb-2">Explore the Himalayas</p>
              <h2 className="text-display-md font-serif text-cloud">Choose your destination</h2>
            </div>
            <Link to="/destinations" data-gsap-reveal>
              <Button variant="secondary" className="border-cloud/20 text-cloud hover:border-cloud/50 hover:bg-cloud/10 hover:text-cloud">All destinations</Button>
            </Link>
          </div>
          {destLoading ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              {[1,2,3,4,5,6].map((i) => <div key={i} className="rounded-brand aspect-[3/4] bg-pine/30 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              {destinations.map((dest) => <DestinationCard key={dest.id} destination={dest} />)}
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Why us */}
      <section className="section-pad bg-glacier">
        <div ref={whyRevealRef} className="mx-auto max-w-editorial px-6 lg:px-12 text-center">
          <p className="eyebrow mb-3" data-gsap-reveal>Why travel with us</p>
          <h2 className="text-display-md font-serif text-ink mb-16" data-gsap-reveal>Crafted with care, guided with expertise</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {[
              { icon: "🗺️", title: "Expert local guides", desc: "Born in the hills, our guides know every trail, story, and shortcut." },
              { icon: "🛡️", title: "Safety first", desc: "Comprehensive travel insurance, emergency protocols, and certified first aiders on every trek." },
              { icon: "♻️", title: "Responsible travel", desc: "Eco-conscious operations, local community partnerships, zero single-use plastic." },
              { icon: "✍️", title: "Fully customisable", desc: "Every itinerary tailored to your dates, budget, fitness level, and interests." },
            ].map(({ icon, title, desc }) => (
              <div key={title} data-gsap-reveal>
                <span className="text-3xl mb-4 block" aria-hidden="true">{icon}</span>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-sm text-stone leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Testimonials */}
      <section className="section-pad">
        <div ref={testiRevealRef} className="mx-auto max-w-wide px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3" data-gsap-reveal>Real travellers, real stories</p>
            <h2 className="text-display-md font-serif text-ink" data-gsap-reveal>Loved by thousands</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} data-gsap-reveal className="glass-card rounded-brand p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="fill-alpine-sun text-alpine-sun" aria-hidden="true" />)}
                </div>
                <p className="text-sm text-ink/80 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <footer className="flex items-center gap-3 border-t border-stone/15 pt-4">
                  <div className="h-8 w-8 rounded-full bg-pine flex items-center justify-center text-cloud text-xs font-bold" aria-hidden="true">{t.name[0]}</div>
                  <div>
                    <cite className="not-italic text-sm font-semibold text-ink">{t.name}</cite>
                    <p className="text-xs text-stone">{t.location}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Enquiry CTA */}
      <section id="enquire" className="section-pad bg-pine">
        <div className="mx-auto max-w-editorial px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="eyebrow text-alpine-sun mb-3">Start planning</p>
            <h2 className="text-display-md font-serif text-cloud mb-4">Your perfect Himalayan trip<br />is one conversation away.</h2>
            <p className="text-lead text-cloud/60 max-w-xl mx-auto">Tell us your dream and our experts will craft a personalised itinerary within 24 hours.</p>
          </div>
          <div className="bg-cloud/10 backdrop-blur-sm rounded-brand p-8 lg:p-12">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}