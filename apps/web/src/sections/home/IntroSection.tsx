import React from "react";
import { Link } from "react-router-dom";
import { Trees, Flame, Bell, ArrowRight } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Button } from "../../components/ui/Button";

export const IntroSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-warm-ivory text-charcoal overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="The Story of Newlands"
          title="An Heirloom of Himalayan Grandeur"
          description="Perched upon a sun-kissed ridge at 2,205 meters, Hotel Newlands Shimla has welcomed travelers seeking alpine tranquility since 1928."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mt-12">
          {/* Left: Collage Imagery with Vintage Borders */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 w-[85%] aspect-[4/5] rounded-sm overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80"
                alt="Hotel Newlands Colonial Suite Interior"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Overlapping secondary image */}
            <div className="absolute -bottom-8 -right-2 sm:right-4 z-20 w-[55%] aspect-square rounded-sm overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
                alt="Misty Deodar Forest around Newlands Shimla"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Heritage Seal */}
            <div className="absolute top-6 -left-6 z-20 bg-deep-forest text-warm-ivory p-4 rounded-full shadow-xl border border-sand/40 hidden sm:flex flex-col items-center justify-center w-24 h-24 text-center">
              <span className="text-[10px] tracking-widest text-sand uppercase font-bold">ESTD</span>
              <span className="font-display text-xl font-bold leading-none">1928</span>
              <span className="text-[8px] tracking-wider text-warm-ivory/70 uppercase">SIMLA</span>
            </div>
          </div>

          {/* Right: Narrative & Highlights */}
          <div className="lg:col-span-6 flex flex-col justify-center lg:pl-6">
            <h3 className="font-display text-2xl sm:text-3xl text-charcoal font-normal leading-snug mb-6">
              Restored with reverent precision, where antique brass, carved deodar pine,
              and roaring stone hearths kindle mountain memories.
            </h3>

            <p className="text-base text-muted-stone leading-relaxed mb-8">
              Away from the bustle of the town square yet only minutes from the iconic
              Mall, Newlands offers an intimate sanctuary. Wake to the dawn chorus of
              whistling thrushes, sip single-estate Kangra teas overlooking snow-clad
              peaks, and surrender to the timeless rhythms of Himachal Pradesh.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-black/10 mb-8">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-deep-forest/5 flex items-center justify-center text-deep-forest">
                  <Trees className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-sm text-charcoal">Pine Seclusion</h4>
                <p className="text-xs text-muted-stone">
                  Private woodland walking trails and serene mountain solitude.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-deep-forest/5 flex items-center justify-center text-deep-forest">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-sm text-charcoal">Fireplace Suites</h4>
                <p className="text-xs text-muted-stone">
                  Hand-tended crackling log fires and heated oak floors.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-deep-forest/5 flex items-center justify-center text-deep-forest">
                  <Bell className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-sm text-charcoal">Bespoke Butler</h4>
                <p className="text-xs text-muted-stone">
                  Attentive, discreet service tailored to your every preference.
                </p>
              </div>
            </div>

            <div>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Read Our Full Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
