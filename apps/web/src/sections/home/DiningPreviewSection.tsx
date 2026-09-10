import React from "react";
import { Link } from "react-router-dom";
import { Utensils, Sparkles, Clock, MapPin, ArrowRight } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Button } from "../../components/ui/Button";

interface DishHighlight {
  name: string;
  description: string;
  price: string;
  tag?: string;
}

const DISHES: DishHighlight[] = [
  {
    name: "Pan-Seared Himalayan River Trout",
    description: "Caught daily from crystal glacier streams, served with mountain chive butter & roasted baby tubers.",
    price: "₹1,250",
    tag: "Chef's Signature",
  },
  {
    name: "Slow-Braised Kangra Pahadi Lamb",
    description: "Tender mountain mutton simmered for 8 hours with whole aromatic spices and wild coriander.",
    price: "₹1,450",
    tag: "Heritage Recipe",
  },
  {
    name: "Wild Himalayan Guchhi (Morel) Risotto",
    description: "Forest-foraged black morels folded into arborio rice with aged parmesan and white truffle essence.",
    price: "₹1,350",
    tag: "Vegetarian",
  },
  {
    name: "Shimla Orchard Warm Apple Crumble",
    description: "Crisp local green apples baked with cinnamon, served alongside hand-churned vanilla bean ice cream.",
    price: "₹650",
    tag: "Dessert",
  },
];

export const DiningPreviewSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-warm-ivory text-charcoal">
      <Container>
        <SectionHeading
          eyebrow="Alpine Gastronomy"
          title="The Cedar Hearth Restaurant & Lounge"
          description="A celebration of local mountain produce, Anglo-Indian culinary heritage, and cozy fireside fine dining."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mt-12">
          {/* Left: Atmospheric Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/images/common-area.jpeg"
                alt="The Cedar Hearth Dining Room at Hotel Newlands Shimla"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Overlay Info Card */}
            <div className="absolute -bottom-6 -right-4 bg-deep-forest text-warm-ivory p-6 rounded-sm shadow-xl max-w-xs border border-sand/30">
              <div className="flex items-center gap-2 text-sand text-xs font-semibold tracking-wider uppercase mb-2">
                <Clock className="w-4 h-4" />
                <span>Service Hours</span>
              </div>
              <p className="text-xs text-warm-ivory/80 leading-relaxed mb-1">
                Breakfast: 7:30 AM – 10:30 AM
              </p>
              <p className="text-xs text-warm-ivory/80 leading-relaxed mb-1">
                Lunch: 12:30 PM – 3:30 PM
              </p>
              <p className="text-xs text-warm-ivory/80 leading-relaxed">
                Dinner: 7:00 PM – 10:30 PM
              </p>
            </div>
          </div>

          {/* Right: Curated Menu Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-himalayan-green text-xs font-semibold tracking-widest uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Selected Evening Highlights</span>
            </div>

            <div className="space-y-6 divide-y divide-black/10">
              {DISHES.map((dish, idx) => (
                <div key={idx} className={`pt-6 ${idx === 0 ? "pt-0" : ""}`}>
                  <div className="flex justify-between items-baseline gap-4 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-xl text-charcoal font-medium">
                        {dish.name}
                      </h4>
                      {dish.tag && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sand/30 text-[#6B5A33]">
                          {dish.tag}
                        </span>
                      )}
                    </div>
                    <span className="font-display text-lg font-semibold text-deep-forest shrink-0">
                      {dish.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-stone leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 pt-6 border-t border-black/10">
              <Link to="/dining">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Full Dining & Wine Menu
                </Button>
              </Link>
              <span className="text-xs text-muted-stone">
                In-room dining available 24/7 for resident guests
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
