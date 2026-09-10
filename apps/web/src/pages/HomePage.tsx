import React, { useEffect } from "react";
import { HeroSection } from "../sections/home/HeroSection";
import { IntroSection } from "../sections/home/IntroSection";
import { FeaturedRoomsSection } from "../sections/home/FeaturedRoomsSection";
import { ExperiencesSection } from "../sections/home/ExperiencesSection";
import { DiningPreviewSection } from "../sections/home/DiningPreviewSection";
import { TestimonialsSection } from "../sections/home/TestimonialsSection";
import { LocationSection } from "../sections/home/LocationSection";
import { FinalCTASection } from "../sections/home/FinalCTASection";

export default function HomePage() {
  useEffect(() => {
    document.title = "Hotel Newlands Shimla — Luxury Heritage Resort & Suites";
  }, []);

  return (
    <div className="w-full">
      <HeroSection />
      <IntroSection />
      <FeaturedRoomsSection />
      <ExperiencesSection />
      <DiningPreviewSection />
      <TestimonialsSection />
      <LocationSection />
      <FinalCTASection />
    </div>
  );
}
