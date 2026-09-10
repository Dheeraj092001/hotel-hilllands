import React from "react";
import { Quote, CheckCircle2 } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Rating } from "../../components/ui/Rating";

interface Testimonial {
  quote: string;
  author: string;
  location: string;
  suite: string;
  stayDate: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Waking up to the sunrise over the snow peaks from the Governor's Suite was an otherworldly moment. The crackling fireplace and genuine hospitality made our winter retreat unforgettable.",
    author: "Vikram & Radhika Malhotra",
    location: "New Delhi",
    suite: "The Governor's Heritage Suite",
    stayDate: "February 2026",
    rating: 5,
  },
  {
    quote:
      "Newlands is the ultimate antidote to urban rush. Reading by the antique library bay window with endless pots of single-estate Kangra tea—pure mountain bliss. We will return every season.",
    author: "Eleanor & James Vance",
    location: "London, UK",
    suite: "Cedar Ridge Deluxe Room",
    stayDate: "January 2026",
    rating: 5,
  },
  {
    quote:
      "The Cedar Hearth dining was spectacular. The river trout and the forest morel risotto were Michelin caliber in the middle of the Himalayas. Truly world-class.",
    author: "Dr. Siddharth & Anita Rao",
    location: "Bangalore",
    suite: "Pine Mist Valley Suite",
    stayDate: "December 2025",
    rating: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-white text-charcoal overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="Guest Testimonials"
          title="Memories Etched in the Hills"
          description="Reflections and heartfelt words from guests who found rest and quiet wonder within our colonial sanctuary."
        />

        {/* Global Rating Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-16 p-4 rounded-sm bg-warm-ivory/80 border border-black/8 max-w-xl mx-auto text-center">
          <div className="flex items-center gap-2">
            <Rating value={4.9} size="md" />
            <span className="font-display text-xl font-bold text-deep-forest">4.9 / 5.0</span>
          </div>
          <span className="text-black/20 hidden sm:inline">•</span>
          <span className="text-xs text-muted-stone">
            Exceptional rating across 380+ verified guest reviews
          </span>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-warm-ivory/40 border border-black/8 rounded-sm p-8 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-sand/60 mb-4" />

              <p className="text-sm text-charcoal/85 leading-relaxed italic mb-8 font-light">
                "{item.quote}"
              </p>

              <div className="pt-4 border-t border-black/8">
                <div className="flex items-center justify-between mb-2">
                  <Rating value={item.rating} size="sm" />
                  <span className="text-[11px] text-muted-stone">{item.stayDate}</span>
                </div>

                <h4 className="font-display text-lg text-charcoal font-medium leading-tight">
                  {item.author}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-muted-stone mt-0.5">
                  <span>{item.location}</span>
                  <span>•</span>
                  <span className="text-himalayan-green font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Stay
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
