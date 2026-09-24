import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Maximize, Flame, Mountain, Sparkles, Filter, Check, ArrowRight } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export interface RoomItem {
  id: string;
  name: string;
  category: "suite" | "deluxe" | "cottage";
  tagline: string;
  price: number;
  size: string;
  capacity: number;
  view: string;
  image: string;
  amenities: string[];
  features: string[];
}

export const ROOMS_DATA: RoomItem[] = [
  {
    id: "governors-suite",
    name: "The Governor's Heritage Suite",
    category: "suite",
    tagline: "Our premier imperial suite featuring hand-carved deodar woodwork and stone fireplace.",
    price: 14500,
    size: "680 sq ft",
    capacity: 3,
    view: "Snow Peak & Valley",
    image: "/images/ultra-luxury.jpeg",
    amenities: ["Private Fireplace", "Heritage Teak Balcony", "Butler Service", "Clawfoot Tub"],
    features: ["King Bed", "Valley Panorama", "Walk-in Closet", "Nespresso Machine"],
  },
  {
    id: "cedar-ridge-deluxe",
    name: "Cedar Ridge Deluxe Room",
    category: "deluxe",
    tagline: "Wrapped in ancient pine canopies with deep soaking tub and fragrant timber interiors.",
    price: 9800,
    size: "450 sq ft",
    capacity: 2,
    view: "Ancient Deodar Grove",
    image: "/images/luxury-suit (2).jpeg",
    amenities: ["King Feather Bed", "Forest View Alcove", "Artisan Bath Salts", "Rain Shower"],
    features: ["King Bed", "Woodland Quiet", "Organic Minibar", "Heated Bathroom"],
  },
  {
    id: "pine-mist-valley-suite",
    name: "Pine Mist Valley Suite",
    category: "suite",
    tagline: "Elevated vantage point offering golden hour sunsets across the snow-clad Shivalik range.",
    price: 12200,
    size: "560 sq ft",
    capacity: 3,
    view: "Panoramic Ridge View",
    image: "/images/premium.jpeg",
    amenities: ["Cast-Iron Wood Stove", "Sunset Vista Terrace", "Heated Floors", "Daybed Nook"],
    features: ["King + Daybed", "Sunset Facing", "Living Alcove", "French Press"],
  },
  {
    id: "himalayan-chalet-cottage",
    name: "Himalayan Forest Chalet",
    category: "cottage",
    tagline: "A standalone cedarwood chalet nestled secludedly amidst the deodars with private garden veranda.",
    price: 18500,
    size: "820 sq ft",
    capacity: 4,
    view: "Private Forest & Ridge",
    image: "/images/ultra-luxury (4).jpeg",
    amenities: ["Standalone Cottage", "Private Lawn Veranda", "Dual Fireplaces", "Whirlpool Spa"],
    features: ["Master King + Twin", "Private Garden", "Butler Pantry", "Bose Sound System"],
  },
  {
    id: "heritage-club-room",
    name: "Heritage Club Room",
    category: "deluxe",
    tagline: "Intimate colonial charm with high timber ceilings, brass accents, and sunny bay windows.",
    price: 8500,
    size: "380 sq ft",
    capacity: 2,
    view: "Courtyard & Pines",
    image: "/images/premium3.jpeg",
    amenities: ["Original Teak Floors", "Reading Bay Window", "Herbal Tea Atelier", "Walk-in Shower"],
    features: ["Queen Bed", "Quiet Garden View", "Writing Desk", "Plush Robes"],
  },
  {
    id: "viceregal-family-suite",
    name: "The Viceregal Family Sanctuary",
    category: "suite",
    tagline: "Two interconnecting heritage bedrooms with sprawling living salon for families traveling together.",
    price: 22000,
    size: "950 sq ft",
    capacity: 5,
    view: "360° Valley & Himalayan Vistas",
    image: "/images/luxury-suit (4).jpeg",
    amenities: ["2 En-Suite Bedrooms", "Central Fireplace Salon", "Dining Table for 6", "Private Butler"],
    features: ["2 King Beds + Sofa", "Dual Balconies", "Powder Room", "Curated Library"],
  },
];

export default function RoomsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  useEffect(() => {
    document.title = "Suites & Accommodations — Hotel Newlands Shimla";
  }, []);

  const filteredRooms = useMemo(() => {
    return ROOMS_DATA.filter((room) => {
      if (categoryFilter !== "all" && room.category !== categoryFilter) return false;
      if (capacityFilter > 0 && room.capacity < capacityFilter) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [categoryFilter, capacityFilter, sortBy]);

  return (
    <div className="pt-28 pb-24 bg-warm-ivory min-h-screen text-charcoal">
      {/* Header Banner */}
      <div className="bg-deep-forest text-warm-ivory py-16 sm:py-20 mb-12">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-sand mb-3 block">
              Accommodations
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-warm-ivory mb-4">
              Suites & Mountain Sanctuaries
            </h1>
            <p className="text-base sm:text-lg text-warm-ivory/80 font-light leading-relaxed">
              Every room is an intimate Himalayan haven, furnished with restored British-era
              antiques, hand-woven woolens, warm hearths, and boundless mountain vistas.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-sm shadow-sm border border-black/8 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Sanctuaries" },
              { id: "suite", label: "Heritage Suites" },
              { id: "deluxe", label: "Deluxe Rooms" },
              { id: "cottage", label: "Forest Chalets" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-sm transition-all ${
                  categoryFilter === cat.id
                    ? "bg-deep-forest text-warm-ivory shadow-sm"
                    : "bg-black/5 text-charcoal/70 hover:bg-black/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Capacity and Sort */}
          <div className="flex items-center gap-3">
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(Number(e.target.value))}
              aria-label="Filter by guests"
              className="text-xs font-medium border border-black/15 rounded-sm px-3 py-2 bg-white text-charcoal focus:outline-none focus:border-deep-forest"
            >
              <option value={0}>Any Guests</option>
              <option value={2}>2+ Guests</option>
              <option value={3}>3+ Guests</option>
              <option value={4}>4+ Guests</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort rooms by"
              className="text-xs font-medium border border-black/15 rounded-sm px-3 py-2 bg-white text-charcoal focus:outline-none focus:border-deep-forest"
            >
              <option value="featured">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <Card key={room.id} hover={true} className="flex flex-col h-full bg-white">
              {/* Image */}
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

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-2xl font-normal text-charcoal mb-2 hover:text-deep-forest transition-colors">
                    <Link to={`/rooms/${room.id}`}>{room.name}</Link>
                  </h2>
                  <p className="text-xs text-muted-stone leading-relaxed mb-4">
                    {room.tagline}
                  </p>

                  {/* Specs */}
                  <div className="flex items-center gap-4 py-3 border-y border-black/8 text-xs text-charcoal/80 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-himalayan-green" />
                      <span>Up to {room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5 text-himalayan-green" />
                      <span>{room.size}</span>
                    </div>
                  </div>

                  {/* Amenities Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {room.amenities.map((item) => (
                      <span
                        key={item}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-warm-ivory text-charcoal/80 border border-black/5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Reservation */}
                <div className="pt-4 border-t border-black/8 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-muted-stone uppercase tracking-wider block">
                      Starting From
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl font-bold text-deep-forest">
                        ₹{room.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-muted-stone">/ night</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/rooms/${room.id}`}>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </Link>
                    <Link to={`/book?room=${room.id}`}>
                      <Button variant="primary" size="sm">
                        Book
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-20 bg-white rounded-sm border border-black/10">
            <h3 className="font-display text-2xl text-charcoal mb-2">No Suites Match Criteria</h3>
            <p className="text-sm text-muted-stone mb-6">
              Try adjusting your category or guest count filters to view available accommodations.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCategoryFilter("all");
                setCapacityFilter(0);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
