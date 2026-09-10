import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Trees, Shield, Sparkles, Heart, Award, ArrowRight } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Button } from "../components/ui/Button";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const TIMELINE: TimelineEvent[] = [
  {
    year: "1928",
    title: "Laying the Cornerstone",
    description: "Commissioned as an intimate summer residence on the serene Chotta Shimla ridge, crafted from native deodar timber and hand-cut stone.",
  },
  {
    year: "1954",
    title: "The Himalayan Custodians",
    description: "Acquired by a prominent Himachali family dedicated to preserving the forest canopy and hosting visiting artists and naturalists.",
  },
  {
    year: "2018",
    title: "The Master Restoration",
    description: "A three-year architectural revival restored original brasswork and chimneys while introducing heated oak flooring and bespoke private suites.",
  },
  {
    year: "Present",
    title: "A Timeless Mountain Sanctuary",
    description: "Celebrated for discreet butler service, alpine gastronomy at The Cedar Hearth, and profound pine forest tranquility.",
  },
];

export default function AboutPage() {
  useEffect(() => {
    document.title = "Our Story & Heritage Since 1928 — Hotel Newlands Shimla";
  }, []);

  return (
    <div className="pt-28 pb-24 bg-warm-ivory min-h-screen text-charcoal">
      {/* Banner */}
      <div className="bg-deep-forest text-warm-ivory py-20 mb-16">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-sand mb-3 block">
              Heritage Since 1928
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-normal text-warm-ivory mb-4">
              A Legacy of Mountain Hospitality
            </h1>
            <p className="text-base sm:text-lg text-warm-ivory/80 font-light leading-relaxed">
              For nearly a century, Hotel Newlands Shimla has stood as an intimate haven above the clouds,
              welcoming those who seek the profound stillness of the Himalayas.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Heritage Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/images/shimla.jpeg"
                alt="Hotel Newlands Historical Estate"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-himalayan-green font-semibold block">
              Architectural Stewardship
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal leading-tight">
              Where Every Grain of Deodar Pine Holds a Century of Whisperings
            </h2>
            <p className="text-sm sm:text-base text-muted-stone leading-relaxed font-light">
              Unlike the bustling commercial centers down in the valley, Newlands was deliberately built
              into the slope of the pine ridge to catch the first warmth of the morning sun. High timber
              gables, bay windows framing snow peaks, and wood-burning stone hearths honor the finest
              traditions of British-era colonial architecture.
            </p>
            <p className="text-sm sm:text-base text-muted-stone leading-relaxed font-light">
              During our comprehensive restoration, master craftsmen from the valleys of Kangra and
              Kullu spent thousands of hours rejuvenating every door frame, balustrade, and hand-carved
              ceiling truss, ensuring the estate endures for generations to come.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-black/10">
              <div>
                <span className="font-display text-3xl font-bold text-deep-forest block">2,205m</span>
                <span className="text-xs text-muted-stone">Elevation above sea level</span>
              </div>
              <div>
                <span className="font-display text-3xl font-bold text-deep-forest block">95+</span>
                <span className="text-xs text-muted-stone">Years of mountain legacy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars / Values */}
        <div className="mb-24">
          <SectionHeading
            eyebrow="Our Guiding Principles"
            title="The Values of the Sanctuary"
            description="Our commitment to the ecology of Himachal Pradesh, our guests, and the local community."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-sm border border-black/8 shadow-sm">
              <Trees className="w-8 h-8 text-himalayan-green mb-4" />
              <h3 className="font-display text-2xl text-charcoal mb-2">Ecological Harmony</h3>
              <p className="text-xs sm:text-sm text-muted-stone leading-relaxed font-light">
                We operate with minimal impact on our surrounding pine groves. Zero single-use plastics,
                spring water bottling on-site, and solar water pre-heating.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-black/8 shadow-sm">
              <Heart className="w-8 h-8 text-himalayan-green mb-4" />
              <h3 className="font-display text-2xl text-charcoal mb-2">Community Upliftment</h3>
              <p className="text-xs sm:text-sm text-muted-stone leading-relaxed font-light">
                Over 85% of our staff hail from local Himachali villages. We source all grains, dairy,
                and orchard fruits directly from small regional farmers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-black/8 shadow-sm">
              <Sparkles className="w-8 h-8 text-himalayan-green mb-4" />
              <h3 className="font-display text-2xl text-charcoal mb-2">Quiet Luxury</h3>
              <p className="text-xs sm:text-sm text-muted-stone leading-relaxed font-light">
                True hospitality is not loud; it is felt. Intuitive service, peaceful silences, crackling
                fires, and unhurried mornings make up our ethos.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24 bg-white p-8 sm:p-14 rounded-sm border border-black/8 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-himalayan-green font-semibold block mb-2">
              Chronicles
            </span>
            <h3 className="font-display text-3xl text-charcoal">Historical Milestones</h3>
          </div>

          <div className="space-y-8 divide-y divide-black/8 max-w-3xl mx-auto">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className={`pt-8 flex flex-col sm:flex-row gap-6 ${idx === 0 ? "pt-0" : ""}`}>
                <span className="font-display text-3xl font-bold text-deep-forest sm:w-28 shrink-0">
                  {item.year}
                </span>
                <div>
                  <h4 className="font-display text-xl font-medium text-charcoal mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-stone leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Stay */}
        <div className="text-center">
          <Link to="/rooms">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Reserve Your Experience at Newlands
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
