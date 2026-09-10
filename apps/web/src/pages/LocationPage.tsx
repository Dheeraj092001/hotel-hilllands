import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Navigation, Car, Plane, Train, Clock, Compass, ShieldCheck } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";

interface TransitRoute {
  hub: string;
  distance: string;
  duration: string;
  mode: string;
  notes: string;
}

const TRANSIT_ROUTES: TransitRoute[] = [
  {
    hub: "Chandigarh International Airport (IXC)",
    distance: "118 km",
    duration: "3.5 Hours",
    mode: "Private SUV via Himalayan Expressway (NH5)",
    notes: "Chauffeur pick-up directly at arrivals terminal with heated leather seats and refreshments.",
  },
  {
    hub: "Jubbarhatti Shimla Domestic Airport (SLV)",
    distance: "23 km",
    duration: "45 Minutes",
    mode: "Estate Luxury Chauffeur",
    notes: "Direct flights from New Delhi (DEL) and Dharamshala. Scenic ridge descent.",
  },
  {
    hub: "Kalka Heritage Railway Station (KLK)",
    distance: "88 km",
    duration: "2.5 Hours by Car / 5 Hours by Toy Train",
    mode: "Toy Train to Shimla or Chauffeur SUV",
    notes: "Connect with Delhi-Kalka Shatabdi Express. UNESCO World Heritage Kalka-Shimla toy train.",
  },
  {
    hub: "The Ridge & The Mall Road, Shimla",
    distance: "2.4 km",
    duration: "10 Minutes",
    mode: "Complimentary Resident Shuttle",
    notes: "Scheduled hourly guest drop-offs and pick-ups at the historic Gaiety Theatre gate.",
  },
];

export default function LocationPage() {
  useEffect(() => {
    document.title = "Estate Location & Arrival Directions — Hotel Newlands Shimla";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-24 bg-warm-ivory min-h-screen text-charcoal">
      {/* Hero Header */}
      <div className="bg-deep-forest text-warm-ivory py-20 mb-12">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-sand mb-3 block">
              Sanctuary Geography
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-normal text-warm-ivory mb-4">
              Finding Hotel Newlands
            </h1>
            <p className="text-base sm:text-lg text-warm-ivory/80 font-light leading-relaxed">
              Perched at an elevation of 2,205 meters on the quiet eastern ridge of Chotta Shimla,
              blessed with panoramic views of the Pir Panjal snow ranges.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Photo & Scenic Location Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border-4 border-white bg-black/10">
              <img
                src="/images/shimla.jpeg"
                alt="Himalayan Mountain Range View from Hotel Newlands"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Elevation Badge */}
            <div className="absolute -bottom-6 -right-4 bg-deep-forest text-warm-ivory p-5 rounded-sm shadow-xl border border-sand/30 text-center">
              <span className="text-[10px] tracking-widest text-sand uppercase font-bold block">
                ALTITUDE
              </span>
              <span className="font-display text-2xl font-bold">2,205m</span>
              <span className="text-[10px] text-warm-ivory/70 block">Above Sea Level</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-himalayan-green font-semibold block">
              The Setting
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal leading-tight">
              Secluded Amongst Century-Old Deodar Pines
            </h2>
            <p className="text-sm sm:text-base text-muted-stone leading-relaxed font-light">
              Unlike city hotels constrained by the noise and congestion of the commercial center,
              Hotel Newlands enjoys private forested acreage where the only sounds are whistling thrushes
              and the gentle rustling of pine needles in the mountain breeze.
            </p>
            <p className="text-sm sm:text-base text-muted-stone leading-relaxed font-light">
              Yet, when you wish to stroll along the Mall Road or visit the Gaiety Theatre, our
              private resident shuttle delivers you to the town center in under 10 minutes.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/8 text-xs text-charcoal">
              <div>
                <span className="font-semibold block text-deep-forest mb-0.5">GPS Coordinates</span>
                31.1048° N, 77.1734° E
              </div>
              <div>
                <span className="font-semibold block text-deep-forest mb-0.5">District</span>
                Shimla, Himachal Pradesh 171002
              </div>
            </div>
          </div>
        </div>

        {/* Transit Routes Table */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-himalayan-green font-semibold block mb-2">
              Chauffeur & Access
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal">
              Reaching the Retreat
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRANSIT_ROUTES.map((route, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-sm border border-black/8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="font-display text-xl text-charcoal font-normal">
                      {route.hub}
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-deep-forest/10 text-deep-forest shrink-0">
                      {route.duration}
                    </span>
                  </div>

                  <p className="text-xs text-himalayan-green font-medium mb-3">
                    {route.distance} • {route.mode}
                  </p>

                  <p className="text-xs text-muted-stone leading-relaxed">
                    {route.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parking & Grounds Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-sm border border-black/8 shadow-sm mb-16">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/20 text-[#6B5A33] text-xs font-semibold uppercase tracking-wider">
              <Car className="w-3.5 h-3.5" />
              <span>Private Secure Driveway</span>
            </div>
            <h2 className="font-display text-3xl font-normal text-charcoal">
              Private On-Site Parking & Valet
            </h2>
            <p className="text-xs sm:text-sm text-muted-stone leading-relaxed font-light">
              We provide private, secure, covered on-site parking directly on the estate grounds with
              continuous CCTV surveillance and 24-hour valet service. EV charging stations are also
              available for all resident guests complimentary.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link to="/contact">
                <Button variant="primary" size="md">
                  Request Chauffeur Transfer
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[16/10] rounded-sm overflow-hidden shadow-lg border-2 border-black/5">
              <img
                src="/images/parking.jpeg"
                alt="Hotel Newlands Estate Parking and Private Grounds"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Map Embed */}
        <div className="relative aspect-[16/7] min-h-[350px] rounded-sm overflow-hidden shadow-2xl border-4 border-white bg-deep-forest">
          <iframe
            title="Hotel Newlands Shimla Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13663.856984857417!2d77.1706689!3d31.1048145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390578e3e35d6309%3A0x2f60a921d0139b4b!2sShimla%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="w-full h-full border-0 filter grayscale-[15%] contrast-[105%]"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </div>
  );
}
