import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Compass, Trees, Coffee, MapPin, Sparkles } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

interface FullExperience {
  id: string;
  title: string;
  category: string;
  duration: string;
  groupSize: string;
  timeOfDay: string;
  image: string;
  description: string;
  highlights: string[];
}

const ALL_EXPERIENCES: FullExperience[] = [
  {
    id: "ridge-high-tea",
    title: "Twilight Ridge High Tea",
    category: "Culinary & Scenic",
    duration: "2 Hours",
    groupSize: "2 – 6 Guests",
    timeOfDay: "4:00 PM – 6:00 PM",
    image: "/images/balcony-view.jpeg",
    description:
      "Perched on our private panoramic viewpoint, savor freshly baked scones with clotted cream, mountain berry preserves, and whole-leaf Kangra tea flushes as alpenglow warms the Pir Panjal range.",
    highlights: ["Single-Estate Kangra Teas", "Warm Clotted Cream Scones", "Private Butler Service", "Unobstructed Sunset Views"],
  },
  {
    id: "deodar-forest-bathing",
    title: "Ancient Pine Shinrin-Yoku",
    category: "Nature & Wellness",
    duration: "3 Hours",
    groupSize: "Private or Small Group",
    timeOfDay: "Morning 8:00 AM",
    image: "/images/view-from-room.jpeg",
    description:
      "A meditative nature immersion through century-old deodar cedar forests led by our resident naturalist. Inhale restorative alpine phytoncides while learning the medicinal botany of Himachal hills.",
    highlights: ["Guided Sensory Meditation", "Herbal Botanical Walk", "Naturalist Accompaniment", "Wildflower Honey Infusion"],
  },
  {
    id: "hearth-bonfire-stargazing",
    title: "Private Cedarwood Hearth & Stargazing",
    category: "Evening Gathering",
    duration: "Nightly 7:30 PM",
    groupSize: "Resident Guests",
    timeOfDay: "Evening",
    image: "/images/common-area.jpeg",
    description:
      "Gather around glowing logs of seasoned pine under crystalline high-altitude skies. Peer into celestial nebulae through our computerized telescope with hot spiced apple toddies in hand.",
    highlights: ["High-Powered Astronomy Telescope", "Hot Spiced Himachali Cider", "Charred Marshmallows", "Fireside Acoustic Music"],
  },
  {
    id: "colonial-heritage-walk",
    title: "The Viceregal Simla Heritage Trail",
    category: "Historical Culture",
    duration: "4 Hours",
    groupSize: "2 – 8 Guests",
    timeOfDay: "Morning 9:30 AM",
    image: "/images/shimla.jpeg",
    description:
      "An exclusive architectural walk through forgotten colonial summer estates, the Gaiety Theatre archives, Christ Church, and private libraries, curated by local Shimla cultural historians.",
    highlights: ["Historian Guide", "Archival Access to Gaiety Theatre", "Chauffeur Transport", "Printed Heritage Booklet"],
  },
  {
    id: "pari-mahal-picnic",
    title: "Mountain Meadow Gourmet Hamper",
    category: "Outdoor Leisure",
    duration: "Half Day",
    groupSize: "2 – 4 Guests",
    timeOfDay: "11:30 AM – 3:30 PM",
    image: "/images/reception.jpeg",
    description:
      "Let our team set up an opulent picnic layout in a wildflower mountain meadow. Features wicker hampers filled with charcuterie, artisanal cheeses, crusty baguettes, and fresh orchard cider.",
    highlights: ["Vintage Wicker Basket Setup", "Curated Cheese & Fruit Selection", "Luxury Wool Throw Blankets", "Scenic Valley Lookout"],
  },
];

export default function ExperiencesPage() {
  useEffect(() => {
    document.title = "Bespoke Mountain Experiences — Hotel Newlands Shimla";
  }, []);

  return (
    <div className="pt-28 pb-24 bg-warm-ivory min-h-screen text-charcoal">
      {/* Banner */}
      <div className="bg-deep-forest text-warm-ivory py-20 mb-12">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-sand mb-3 block">
              Curated Pursuits
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-normal text-warm-ivory mb-4">
              Alpine Experiences & Mountain Heritage
            </h1>
            <p className="text-base sm:text-lg text-warm-ivory/80 font-light leading-relaxed">
              Step beyond the ordinary. Each curated journey is designed to connect you deeply with
              the majesty, stillness, and historical elegance of the Western Himalayas.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="space-y-12">
          {ALL_EXPERIENCES.map((exp, idx) => (
            <div
              key={exp.id}
              className={`bg-white rounded-sm border border-black/8 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className={`lg:col-span-6 relative aspect-[16/10] overflow-hidden ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="gold" size="sm">
                    {exp.category}
                  </Badge>
                </div>
              </div>

              {/* Text Info */}
              <div className={`lg:col-span-6 p-6 sm:p-8 lg:p-10 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="flex items-center gap-4 text-xs text-muted-stone mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-himalayan-green" />
                    {exp.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-himalayan-green" />
                    {exp.groupSize}
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-normal text-charcoal mb-3">
                  {exp.title}
                </h2>

                <p className="text-sm text-muted-stone leading-relaxed mb-6 font-light">
                  {exp.description}
                </p>

                {/* Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8 pt-4 border-t border-black/8 text-xs text-charcoal/80">
                  {exp.highlights.map((hl) => (
                    <div key={hl} className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-sand shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                <Link to="/contact">
                  <Button variant="primary" size="md">
                    Reserve with Concierge
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
