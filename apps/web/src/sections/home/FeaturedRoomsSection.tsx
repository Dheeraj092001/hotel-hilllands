import React from "react";
import { Link } from "react-router-dom";
import { Users, Maximize, Flame, Mountain, ArrowRight } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

export interface FeaturedRoom {
  id: string;
  name: string;
  tagline: string;
  price: number;
  size: string;
  capacity: string;
  view: string;
  image: string;
  amenities: string[];
}

export const FEATURED_ROOMS: FeaturedRoom[] = [
  {
    id: "governors-suite",
    name: "The Governor's Heritage Suite",
    tagline: "Our most regal residence with private teak balcony and working fireplace",
    price: 14500,
    size: "680 sq ft",
    capacity: "2-3 Guests",
    view: "Snow Peak & Valley",
    image: "/images/ultra-luxury.jpeg",
    amenities: ["Private Fireplace", "Heritage Teak Balcony", "Butler Service", "Clawfoot Tub"],
  },
  {
    id: "cedar-ridge-deluxe",
    name: "Cedar Ridge Deluxe Room",
    tagline: "Wreathed in fragrant pine breezes with floor-to-ceiling forest windows",
    price: 9800,
    size: "450 sq ft",
    capacity: "2 Guests",
    view: "Ancient Deodar Grove",
    image: "/images/luxury-suit (1).jpeg",
    amenities: ["King Feather Bed", "Forest View Alcove", "Artisan Bath Salts", "Rain Shower"],
  },
  {
    id: "pine-mist-valley-suite",
    name: "Pine Mist Valley Suite",
    tagline: "Elevated vantage point offering golden hour sunsets across the Shivalik range",
    price: 12200,
    size: "560 sq ft",
    capacity: "2-3 Guests",
    view: "Panoramic Ridge View",
    image: "/images/premium.jpeg",
    amenities: ["Cast-Iron Wood Stove", "Sunset Vista Terrace", "Heated Floors", "Daybed Nook"],
  },
];

export const FeaturedRoomsSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-white text-charcoal">
      <Container>
        <SectionHeading
          eyebrow="Suites & Sanctuaries"
          title="Curated Mountain Accommodations"
          description="Each chamber is an ode to understated Himalayan opulence, wrapped in hand-milled pine, plush textiles, and breathtaking mountain stillness."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {FEATURED_ROOMS.map((room) => (
            <Card key={room.id} hover={true} className="flex flex-col h-full bg-warm-ivory/40">
              {/* Room Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="gold" size="sm">
                    {room.view}
                  </Badge>
                </div>
              </div>

              {/* Room Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-2xl font-normal text-charcoal mb-2 hover:text-deep-forest transition-colors">
                    <Link to={`/rooms/${room.id}`}>{room.name}</Link>
                  </h3>
                  <p className="text-xs text-muted-stone line-clamp-2 mb-4 leading-relaxed">
                    {room.tagline}
                  </p>

                  {/* Specs */}
                  <div className="flex items-center gap-4 py-3 border-y border-black/8 text-xs text-charcoal/80 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-himalayan-green" />
                      <span>{room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5 text-himalayan-green" />
                      <span>{room.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-himalayan-green" />
                      <span>Heated</span>
                    </div>
                  </div>

                  {/* Amenity Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {room.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-black/5 text-charcoal/70"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-black/8 mt-auto">
                  <div>
                    <span className="text-[11px] text-muted-stone block uppercase tracking-wider">
                      From
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl font-semibold text-deep-forest">
                        ₹{room.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-muted-stone">/ night</span>
                    </div>
                  </div>

                  <Link to={`/rooms/${room.id}`}>
                    <Button variant="primary" size="sm">
                      Reserve
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-16 text-center">
          <Link to="/rooms">
            <Button
              variant="outline"
              size="lg"
              className="border-deep-forest text-deep-forest hover:bg-deep-forest hover:text-warm-ivory px-8"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore All 8 Suites & Rooms
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};
