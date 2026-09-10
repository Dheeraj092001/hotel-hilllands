import React from "react";
import { Link } from "react-router-dom";
import { Compass, Sparkles } from "lucide-react";
import { BookingWidget } from "./BookingWidget";
import { Button } from "../../components/ui/Button";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 lg:pb-24 overflow-hidden bg-deep-forest text-warm-ivory">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/shimla.jpeg"
          alt="Himalayan Mountain Landscape surrounding Hotel Newlands Shimla"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
        />
        {/* Rich Multi-stop Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-forest via-deep-forest/65 to-black/40" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center my-auto">
        {/* Heritage Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand/20 backdrop-blur-md border border-sand/40 text-sand text-xs font-semibold tracking-[0.25em] uppercase mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Estd. 1928 • Altitude 2,205m • Shimla</span>
        </div>

        {/* Display Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-warm-ivory tracking-tight max-w-5xl leading-[1.08] mb-6">
          Where Heritage Whispers <br />
          <span className="italic font-normal text-sand">to the Himalayas</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-base sm:text-lg lg:text-xl text-warm-ivory/85 max-w-2xl font-light leading-relaxed mb-10">
          A secluded sanctuary of century-old deodar cedars, panoramic snow-peaked
          vistas, and timeless colonial hospitality in the Himachal hills.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
          <Link to="/rooms">
            <Button
              variant="gold"
              size="lg"
              className="text-deep-forest font-semibold px-8 py-4 shadow-xl"
            >
              Explore Suites & Rooms
            </Button>
          </Link>
          <Link to="/experiences">
            <Button
              variant="outline"
              size="lg"
              className="border-warm-ivory/40 text-warm-ivory hover:bg-warm-ivory hover:text-deep-forest px-8 py-4"
              leftIcon={<Compass className="w-4 h-4" />}
            >
              Discover Experiences
            </Button>
          </Link>
        </div>
      </div>

      {/* Floating Booking Widget */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto">
        <BookingWidget isFloating={true} />
      </div>
    </section>
  );
};
