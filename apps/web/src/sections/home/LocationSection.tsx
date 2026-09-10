import React from "react";
import { MapPin, Navigation, Car, Train, Plane, Clock } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";

interface Landmark {
  name: string;
  distance: string;
  time: string;
  type: string;
}

const LANDMARKS: Landmark[] = [
  { name: "The Mall Road & Gaiety Theatre", distance: "2.4 km", time: "10 mins", type: "Culture & Shopping" },
  { name: "The Ridge & Christ Church", distance: "2.1 km", time: "8 mins", type: "Heritage Architecture" },
  { name: "Jakhoo Hill & Temple", distance: "3.8 km", time: "15 mins", type: "Panoramic Viewpoint" },
  { name: "Shimla Heritage Railway Station", distance: "4.5 km", time: "20 mins", type: "Kalka Toy Train" },
  { name: "Jubbarhatti Shimla Airport", distance: "23 km", time: "45 mins", type: "Domestic Flights" },
  { name: "Chandigarh International Airport", distance: "118 km", time: "3.5 hrs", type: "Major Hub" },
];

export const LocationSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-warm-ivory text-charcoal">
      <Container>
        <SectionHeading
          eyebrow="The Sanctuary Location"
          title="Nestled Above the Clouds"
          description="Perched in the secluded Chotta Shimla ridge, safely insulated from tourist crowds while offering effortless access to historic landmarks."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-center">
          {/* Landmarks Table & Transit info */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-display text-2xl text-charcoal font-normal">
              Proximity to Notable Attractions
            </h3>
            <p className="text-sm text-muted-stone leading-relaxed">
              Our dedicated guest fleet provides on-demand luxury transfers in heated
              all-wheel-drive vehicles with private mountain chauffeurs.
            </p>

            <div className="space-y-3 divide-y divide-black/8">
              {LANDMARKS.map((item, idx) => (
                <div key={idx} className="pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-deep-forest/5 flex items-center justify-center text-deep-forest shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-charcoal">{item.name}</h4>
                      <span className="text-[11px] text-muted-stone">{item.type}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-deep-forest block">
                      {item.time}
                    </span>
                    <span className="text-[10px] text-muted-stone">{item.distance}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chauffeur Note */}
            <div className="p-4 rounded-sm bg-sand/20 border border-sand/40 flex items-start gap-3 mt-6">
              <Car className="w-5 h-5 text-[#6B5A33] shrink-0 mt-0.5" />
              <div className="text-xs text-[#524424] leading-relaxed">
                <span className="font-semibold block mb-0.5">Complimentary Valley Valet</span>
                Resident guests enjoy secure covered on-site parking and 24-hour EV charging points.
              </div>
            </div>
          </div>

          {/* Interactive Styled Map Card */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border-4 border-white bg-deep-forest">
              <iframe
                title="Hotel Newlands Shimla Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13663.856984857417!2d77.1706689!3d31.1048145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390578e3e35d6309%3A0x2f60a921d0139b4b!2sShimla%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 filter grayscale-[20%] contrast-[105%]"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-4 left-4 bg-deep-forest/90 backdrop-blur-md text-warm-ivory px-4 py-2 rounded-sm border border-sand/40 shadow-lg pointer-events-none">
                <span className="text-[10px] tracking-widest text-sand uppercase font-semibold block">
                  COORDINATES
                </span>
                <span className="font-mono text-xs">31.1048° N, 77.1734° E</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
