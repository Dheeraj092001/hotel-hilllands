import React, { useState, useEffect } from "react";
import { Clock, MapPin, Sparkles, Utensils, Phone, Check, ShoppingBag } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { InRoomDiningDrawer } from "../components/food/InRoomDiningDrawer";

interface MenuItem {
  id: string;
  category: "starter" | "main" | "pahadi" | "dessert";
  name: string;
  description: string;
  price: number;
  dietary: "veg" | "non-veg";
  isSpecial?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  // Starters
  {
    id: "m1",
    category: "starter",
    name: "Wild Morel & Chestnut Velouté",
    description: "Forest-harvested Himalayan guchhi simmered with roasted wild chestnuts and thyme cream.",
    price: 650,
    dietary: "veg",
    isSpecial: true,
  },
  {
    id: "m2",
    category: "starter",
    name: "Charred Himachali Apricot & Goat Cheese Crostini",
    description: "Orchard apricot compote, organic mountain goat chevre, wildflower honey on sourdough.",
    price: 580,
    dietary: "veg",
  },
  {
    id: "m3",
    category: "starter",
    name: "Spiced Mountain Quail Roast",
    description: "Free-range hill quail marinated in crushed juniper berries, wild garlic, and pomegranate reduction.",
    price: 890,
    dietary: "non-veg",
    isSpecial: true,
  },

  // Main Course
  {
    id: "m4",
    category: "main",
    name: "Glacier River Trout with Herb Beurre Blanc",
    description: "Crispy pan-seared fresh trout, crushed fingerling potatoes, mountain dill & caper sauce.",
    price: 1250,
    dietary: "non-veg",
    isSpecial: true,
  },
  {
    id: "m5",
    category: "main",
    name: "Wood-Fired Cedar Plank Salmon",
    description: "Norwegian salmon fillet baked over aromatic deodar cedar planks with glazed root vegetables.",
    price: 1550,
    dietary: "non-veg",
  },
  {
    id: "m6",
    category: "main",
    name: "Artisan Porcini & Ricotta Ravioli",
    description: "Handmade pasta parcels stuffed with wild forest porcini mushrooms in sage brown butter.",
    price: 1100,
    dietary: "veg",
  },

  // Pahadi Heritage
  {
    id: "m7",
    category: "pahadi",
    name: "Traditional Himachali Madra",
    description: "Slow-simmered white chickpeas in cultured yoghurt, cardamom, cloves and mountain ghee.",
    price: 750,
    dietary: "veg",
    isSpecial: true,
  },
  {
    id: "m8",
    category: "pahadi",
    name: "Kangra Pahadi Mutton Curry",
    description: "Tender goat meat slow-cooked in traditional brass degh with whole hill spices and dry red chilies.",
    price: 1450,
    dietary: "non-veg",
    isSpecial: true,
  },
  {
    id: "m9",
    category: "pahadi",
    name: "Siddu with Desi Ghee & Walnut Chutney",
    description: "Steamed fermented wheat bun stuffed with seasoned poppy seeds and walnuts, served with melted cow ghee.",
    price: 520,
    dietary: "veg",
  },

  // Desserts
  {
    id: "m10",
    category: "dessert",
    name: "Warm Shimla Apple Crumble",
    description: "Caramelized crisp local green apples, oat streusel, served with artisanal vanilla bean gelato.",
    price: 480,
    dietary: "veg",
    isSpecial: true,
  },
  {
    id: "m11",
    category: "dessert",
    name: "Belgian Dark Chocolate Soufflé",
    description: "Molten 70% Valrhona chocolate infused with Himalayan wild orange zest and candied peel.",
    price: 550,
    dietary: "veg",
  },
  {
    id: "m12",
    category: "dessert",
    name: "Rare Kangra First Flush High Tea Pot",
    description: "Spring harvested hand-rolled whole leaf tea from Darang tea estate, brewed table-side.",
    price: 350,
    dietary: "veg",
  },
];

export default function DiningPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [diningDrawerOpen, setDiningDrawerOpen] = useState(false);

  useEffect(() => {
    document.title = "The Cedar Hearth Dining — Hotel Newlands Shimla";
  }, []);

  const filteredMenu =
    activeTab === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeTab);

  return (
    <div className="pt-28 pb-24 bg-warm-ivory min-h-screen text-charcoal">
      {/* Hero Banner */}
      <div className="relative py-20 bg-deep-forest text-warm-ivory overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80"
            alt="The Cedar Hearth Ambiance"
            className="w-full h-full object-cover"
          />
        </div>
        <Container className="relative z-10 text-center max-w-3xl">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-sand mb-3 block">
            The Cedar Hearth
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal text-warm-ivory mb-4 leading-tight">
            Alpine Hearth & Cellar
          </h1>
          <p className="text-base sm:text-lg text-warm-ivory/80 font-light leading-relaxed mb-6">
            Where colonial recipes meet the wild culinary riches of the Himalayas. Fresh glacier
            trout, foraged morels, orchard fruits, and fireside companionship.
          </p>

          <div className="flex justify-center">
            <Button
              variant="gold"
              size="lg"
              onClick={() => setDiningDrawerOpen(true)}
              className="shadow-xl text-deep-forest font-semibold"
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              Order In-Room Dining & Fireside Service
            </Button>
          </div>
        </Container>
      </div>

      <Container>
        {/* Atmosphere & Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                alt="Dining Table Setup by Candlelight"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-himalayan-green font-semibold block">
              Philosophy
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal">
              Flavors Shaped by Mountain Altitude and Wood-Fired Warmth
            </h2>
            <p className="text-sm sm:text-base text-muted-stone leading-relaxed font-light">
              Under the direction of our executive chef, The Cedar Hearth sources organic
              seasonal produce directly from valley farmers in Kullu, Kotgarh, and Kangra.
              Everything from our slow-proved sourdough to our infused herb salts is crafted
              in-house with painstaking mountain care.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/8 text-xs text-charcoal">
              <div>
                <span className="font-semibold block text-deep-forest mb-0.5">Breakfast</span>
                7:30 AM – 10:30 AM Daily
              </div>
              <div>
                <span className="font-semibold block text-deep-forest mb-0.5">Lunch</span>
                12:30 PM – 3:30 PM
              </div>
              <div>
                <span className="font-semibold block text-deep-forest mb-0.5">High Tea</span>
                4:00 PM – 6:00 PM
              </div>
              <div>
                <span className="font-semibold block text-deep-forest mb-0.5">Dinner</span>
                7:00 PM – 10:30 PM
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigation Tabs */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-himalayan-green font-semibold block mb-2">
            Artisan Selection
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal mb-8">
            The Seasonal À La Carte Menu
          </h2>

          <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-white border border-black/8 rounded-sm shadow-sm">
            {[
              { id: "all", label: "Full Menu" },
              { id: "starter", label: "Appetizers & Soups" },
              { id: "main", label: "Continental Mains" },
              { id: "pahadi", label: "Himachali Heritage" },
              { id: "dessert", label: "Desserts & Tea" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-deep-forest text-warm-ivory shadow-sm"
                    : "text-charcoal/70 hover:bg-black/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-sm border border-black/8 shadow-sm flex flex-col justify-between hover:border-black/20 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full border ${
                        item.dietary === "veg"
                          ? "border-emerald-600 bg-emerald-500"
                          : "border-rose-600 bg-rose-500"
                      }`}
                      title={item.dietary === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                    />
                    <h3 className="font-display text-xl font-normal text-charcoal">
                      {item.name}
                    </h3>
                  </div>
                  <span className="font-display text-xl font-semibold text-deep-forest shrink-0">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-xs text-muted-stone leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              {item.isSpecial && (
                <div className="pt-3 border-t border-black/5 flex items-center gap-1.5 text-[10px] text-[#6B5A33] font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chef's Recommended Pairing</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Table Reservation CTA Box */}
        <div className="bg-deep-forest text-warm-ivory p-8 sm:p-12 rounded-sm text-center max-w-3xl mx-auto border border-sand/30 shadow-xl">
          <Utensils className="w-8 h-8 text-sand mx-auto mb-3" />
          <h3 className="font-display text-2xl sm:text-3xl text-warm-ivory mb-3">
            Reserve a Fireside Table
          </h3>
          <p className="text-sm text-warm-ivory/80 max-w-md mx-auto mb-6 font-light">
            Due to our intimate seating layout, we recommend non-resident visitors make reservations at least 4 hours in advance.
          </p>
          <a href="tel:+910000000000">
            <Button variant="gold" size="lg" leftIcon={<Phone className="w-4 h-4" />}>
              Call Dining Host (+91 00000 00000)
            </Button>
          </a>
        </div>
      </Container>

      <InRoomDiningDrawer
        isOpen={diningDrawerOpen}
        onClose={() => setDiningDrawerOpen(false)}
      />
    </div>
  );
}
