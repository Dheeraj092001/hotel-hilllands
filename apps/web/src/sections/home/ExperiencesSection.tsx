import React from "react";
import { Link } from "react-router-dom";
import { Coffee, Trees, Moon, Compass, ArrowRight } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Button } from "../../components/ui/Button";

interface Experience {
  title: string;
  category: string;
  duration: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

const EXPERIENCES: Experience[] = [
  {
    title: "Twilight Ridge High Tea",
    category: "Culinary & Vista",
    duration: "2 Hours",
    description:
      "Hand-selected Kangra flushes and artisanal pastries served at sunset as the snow peaks blush pink.",
    image: "/images/balcony-view.jpeg",
    icon: <Coffee className="w-4 h-4" />,
  },
  {
    title: "Ancient Deodar Forest Bathing",
    category: "Wellness & Nature",
    duration: "3 Hours",
    description:
      "A guided contemplative walk through fragrant century-old pines designed to restore physiological balance.",
    image: "/images/view-from-room.jpeg",
    icon: <Trees className="w-4 h-4" />,
  },
  {
    title: "Stargazing by the Pine Hearth",
    category: "Evening Gathering",
    duration: "Nightly",
    description:
      "Crisp mountain night air warmed by crackling cedar logs, telescope sky viewings, and hot spiced Himachali cider.",
    image: "/images/common-area.jpeg",
    icon: <Moon className="w-4 h-4" />,
  },
  {
    title: "Colonial Heritage Trail",
    category: "Curated Culture",
    duration: "Half Day",
    description:
      "A bespoke architectural journey tracing British summer capital heritage, archival libraries, and hidden viewpoints.",
    image: "/images/shimla.jpeg",
    icon: <Compass className="w-4 h-4" />,
  },
];

export const ExperiencesSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-deep-forest text-warm-ivory relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D9C7A3_1px,transparent_1px)] [background-size:24px_24px]" />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Curated Pursuits"
          title="Bespoke Alpine Experiences"
          description="Immerse your senses in the living traditions, mystical woodlands, and starlit nights of the Great Himalayan ranges."
          theme="dark"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {EXPERIENCES.map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-white/5 border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between hover:bg-white/10 transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-black/50 backdrop-blur-md text-sand text-[10px] font-semibold tracking-wider uppercase border border-sand/30">
                  {item.icon}
                  <span>{item.category}</span>
                </div>
                <div className="absolute bottom-3 right-3 text-warm-ivory/80 text-xs font-medium">
                  {item.duration}
                </div>
              </div>

              {/* Text */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl text-warm-ivory mb-2 group-hover:text-sand transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-warm-ivory/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/10 flex items-center text-xs text-sand font-medium group-hover:translate-x-1 transition-transform">
                  <span>Explore Experience</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/experiences">
            <Button
              variant="gold"
              size="lg"
              className="px-8 shadow-xl"
            >
              View Full Experience Catalogue
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};
