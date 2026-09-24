import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Calendar, Tag, Check, ArrowRight } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useBookingStore } from "../stores/bookingStore";

interface Offer {
  id: string;
  code: string;
  title: string;
  tagline: string;
  discount: string;
  image: string;
  validTill: string;
  inclusions: string[];
}

const OFFERS: Offer[] = [
  {
    id: "honeymoon",
    code: "HONEYMOON",
    title: "The Himalayan Honeymoon Sanctuary",
    tagline: "Celebrate romance amidst roaring cedar hearths and panoramic snow-peaked vistas.",
    discount: "Complimentary Suite Upgrade & Dining",
    image: "/images/ultra-luxury (1).jpeg",
    validTill: "Valid Year-Round",
    inclusions: [
      "Bottle of Chilled Sparkling Wine & Handcrafted Chocolates",
      "Private 4-Course Fireside Dinner at The Cedar Hearth",
      "Daily Multi-Course Champagne Breakfast in Bed",
      "Complimentary Twilight Ridge High Tea",
      "Late Check-Out until 3:00 PM",
    ],
  },
  {
    id: "winterglow",
    code: "WINTERGLOW",
    title: "Winter Snow & Hearth Retreat",
    tagline: "Stay 3 nights for the price of 2 during the enchanting Himalayan winter snowfall season.",
    discount: "33% Off (Stay 3, Pay 2)",
    image: "/images/shimla.jpeg",
    validTill: "Valid Nov 15 – Mar 31",
    inclusions: [
      "Complimentary 3rd Night Accommodation",
      "Complimentary Evening Firewood Service",
      "20% Privilege Discount across Dining & High Tea",
      "Unlimited Hot Spiced Cider by the Hearth",
    ],
  },
  {
    id: "workation",
    code: "WRITERRETREAT",
    title: "Alpine Sabbatical & Writing Retreat",
    tagline: "Extended tranquility for thinkers, writers, and remote leaders seeking mountain clarity.",
    discount: "25% Off Stays of 7+ Nights",
    image: "/images/balcony-view.jpeg",
    validTill: "Valid for Stays 7 Nights or More",
    inclusions: [
      "25% Off Best Available Rates",
      "Dedicated High-Speed Fiber Optical Wi-Fi (150 Mbps)",
      "Ergonomic Solid Wood Desk with Mountain View",
      "Complimentary Laundry Service (4 Pieces Daily)",
      "Unlimited Artisanal Kangra Green & Black Teas",
    ],
  },
  {
    id: "earlybird",
    code: "EARLYBIRD",
    title: "Early Bird Mountain Reserve",
    tagline: "Plan your summer getaway ahead and unlock exclusive guaranteed preferred suite allocations.",
    discount: "15% Off Any Suite",
    image: "/images/luxury-suit (2).jpeg",
    validTill: "Book 45 Days in Advance",
    inclusions: [
      "15% Direct Booking Discount",
      "Complimentary Gourmet Mountain Breakfast",
      "Flexible Cancellation up to 7 Days prior",
      "Priority Table Seating at The Cedar Hearth",
    ],
  },
];

export default function OffersPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Exclusive Offers & Packages — Hotel Newlands Shimla";
  }, []);

  const handleApplyOffer = (code: string) => {
    navigate(`/book?promo=${code}`);
  };

  return (
    <div className="pt-28 pb-24 bg-warm-ivory min-h-screen text-charcoal">
      {/* Banner */}
      <div className="bg-deep-forest text-warm-ivory py-20 mb-12">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-sand mb-3 block">
              Curated Privileges
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-normal text-warm-ivory mb-4">
              Seasonal Offers & Retreat Packages
            </h1>
            <p className="text-base sm:text-lg text-warm-ivory/80 font-light leading-relaxed">
              Experience the unmatched hospitality of Hotel Newlands Shimla with our tailored
              residential packages, romantic getaways, and long-stay mountain retreats.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OFFERS.map((offer) => (
            <Card key={offer.id} className="flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              {/* Image & Promo Banner */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge variant="gold" size="sm">
                    {offer.discount}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-warm-ivory">
                  <span className="text-xs font-light">{offer.validTill}</span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-black/60 backdrop-blur-sm border border-sand/40 font-mono text-xs text-sand">
                    <Tag className="w-3 h-3" />
                    <span>{offer.code}</span>
                  </div>
                </div>
              </div>

              {/* Offer Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-2xl font-normal text-charcoal mb-2">
                    {offer.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-stone leading-relaxed mb-6 font-light">
                    {offer.tagline}
                  </p>

                  {/* Inclusions */}
                  <div className="space-y-2 mb-8 pt-4 border-t border-black/8">
                    <span className="text-[11px] uppercase font-semibold text-himalayan-green tracking-wider block mb-2">
                      Package Inclusions:
                    </span>
                    {offer.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-charcoal/80">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/8 flex items-center justify-between mt-auto">
                  <div className="text-xs text-muted-stone">
                    Use code <strong className="text-deep-forest">{offer.code}</strong>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleApplyOffer(offer.code)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Claim Offer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
