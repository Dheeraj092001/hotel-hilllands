import React from "react";
import { Link } from "react-router-dom";
import { Phone, Calendar, Sparkles } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";

export const FinalCTASection: React.FC = () => {
  return (
    <section className="relative py-28 lg:py-36 bg-deep-forest text-warm-ivory overflow-hidden">
      {/* Background Mountain Photo Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/shimla.jpeg"
          alt="Hotel Newlands Shimla Retreat"
          className="w-full h-full object-cover object-center opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-forest via-deep-forest/80 to-deep-forest/90" />
      </div>

      {/* Mountain Silhouettes Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D9C7A3_1px,transparent_1px)] [background-size:32px_32px]" />

      <Container className="relative z-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand/20 text-sand text-xs font-semibold tracking-widest uppercase mb-6 border border-sand/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your Himalayan Escape Awaits</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-warm-ivory max-w-4xl leading-[1.12] mb-6">
          Escape to the Quiet Majesty of <br />
          <span className="italic text-sand">Hotel Newlands Shimla</span>
        </h2>

        <p className="font-body text-base sm:text-lg text-warm-ivory/80 max-w-2xl font-light leading-relaxed mb-10">
          Reserve directly with us to secure guaranteed best rates, flexible cancellation,
          priority suite upgrades, and complimentary mountain breakfast.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/rooms">
            <Button
              variant="gold"
              size="lg"
              className="text-deep-forest font-semibold px-9 py-4 shadow-2xl"
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Reserve Your Stay
            </Button>
          </Link>
          <a href="tel:+910000000000">
            <Button
              variant="outline"
              size="lg"
              className="border-warm-ivory/40 text-warm-ivory hover:bg-warm-ivory hover:text-deep-forest px-8 py-4"
              leftIcon={<Phone className="w-4 h-4" />}
            >
              Contact Concierge
            </Button>
          </a>
        </div>
      </Container>
    </section>
  );
};
