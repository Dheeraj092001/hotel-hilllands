import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";

interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "ultra" | "luxury" | "premium" | "views" | "estate";
  categoryLabel: string;
  src: string;
  aspect?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  // Ultra Luxury Suites
  {
    id: "ultra-1",
    title: "The Governor's Imperial Suite",
    category: "ultra",
    categoryLabel: "Ultra Luxury",
    src: "/images/ultra-luxury.jpeg",
  },
  {
    id: "ultra-2",
    title: "Grand Hearth Master Bedroom",
    category: "ultra",
    categoryLabel: "Ultra Luxury",
    src: "/images/ultra-luxury (1).jpeg",
  },
  {
    id: "ultra-3",
    title: "Hand-Carved Teakwood Living Area",
    category: "ultra",
    categoryLabel: "Ultra Luxury",
    src: "/images/ultra-luxury (2).jpeg",
  },
  {
    id: "ultra-4",
    title: "Snow-Capped Ridge View Chamber",
    category: "ultra",
    categoryLabel: "Ultra Luxury",
    src: "/images/ultra-luxury (3).jpeg",
  },
  {
    id: "ultra-5",
    title: "Chalet Forest Retreat",
    category: "ultra",
    categoryLabel: "Ultra Luxury",
    src: "/images/ultra-luxury (4).jpeg",
  },
  {
    id: "ultra-6",
    title: "High-Gable Attic Master Suite",
    category: "ultra",
    categoryLabel: "Ultra Luxury",
    src: "/images/ultra-luxury (5).jpeg",
  },
  {
    id: "ultra-7",
    title: "Himalayan Wood Timber Bedroom",
    category: "ultra",
    categoryLabel: "Ultra Luxury",
    src: "/images/ultra-luxury (6).jpeg",
  },
  {
    id: "ultra-8",
    title: "Ultra Luxury Italian Stone En-Suite",
    category: "ultra",
    categoryLabel: "Ultra Luxury",
    src: "/images/ultra-luxury-washroom.jpeg",
  },

  // Luxury Suites
  {
    id: "lux-1",
    title: "Cedar Ridge Luxury Suite",
    category: "luxury",
    categoryLabel: "Luxury Suite",
    src: "/images/luxury-suit (1).jpeg",
  },
  {
    id: "lux-2",
    title: "Colonial Teakwood Suite Interior",
    category: "luxury",
    categoryLabel: "Luxury Suite",
    src: "/images/luxury-suit (2).jpeg",
  },
  {
    id: "lux-3",
    title: "Valley Facing Deluxe Residence",
    category: "luxury",
    categoryLabel: "Luxury Suite",
    src: "/images/luxury-suit (3).jpeg",
  },
  {
    id: "lux-4",
    title: "Viceregal Family Grand Suite",
    category: "luxury",
    categoryLabel: "Luxury Suite",
    src: "/images/luxury-suit (4).jpeg",
  },
  {
    id: "lux-5",
    title: "Plush Feather Bed & Sitting Nook",
    category: "luxury",
    categoryLabel: "Luxury Suite",
    src: "/images/luxury-suit (5).jpeg",
  },
  {
    id: "lux-6",
    title: "Luxury Suite Polished Stone Bath",
    category: "luxury",
    categoryLabel: "Luxury Suite",
    src: "/images/luxury-suit-washroom(1).jpeg",
  },
  {
    id: "lux-7",
    title: "Warm Pine Hearthside Chamber",
    category: "luxury",
    categoryLabel: "Luxury Suite",
    src: "/images/luxrry.jpeg",
  },

  // Premium Rooms
  {
    id: "prem-1",
    title: "Pine Mist Valley Room",
    category: "premium",
    categoryLabel: "Premium Room",
    src: "/images/premium.jpeg",
  },
  {
    id: "prem-2",
    title: "Heritage Club Deluxe Bedroom",
    category: "premium",
    categoryLabel: "Premium Room",
    src: "/images/premium(2).jpeg",
  },
  {
    id: "prem-3",
    title: "Sunlit Mountain Reading Alcove",
    category: "premium",
    categoryLabel: "Premium Room",
    src: "/images/premium3.jpeg",
  },
  {
    id: "prem-4",
    title: "Cedar Forest Deluxe Room",
    category: "premium",
    categoryLabel: "Premium Room",
    src: "/images/premium4.jpeg",
  },
  {
    id: "prem-5",
    title: "Alpine Ridge Queen Room",
    category: "premium",
    categoryLabel: "Premium Room",
    src: "/images/premium6.jpeg",
  },
  {
    id: "prem-6",
    title: "Highland Warm Wood Bedroom",
    category: "premium",
    categoryLabel: "Premium Room",
    src: "/images/primium7.jpeg",
  },
  {
    id: "prem-7",
    title: "Premium Glass Shower & Bath",
    category: "premium",
    categoryLabel: "Premium Room",
    src: "/images/primium-washroom.jpeg",
  },

  // Views & Outdoors
  {
    id: "view-1",
    title: "Private Teak Balcony Snow View",
    category: "views",
    categoryLabel: "Vistas & Grounds",
    src: "/images/balcony-view.jpeg",
  },
  {
    id: "view-2",
    title: "Bedroom Window Valley Panorama",
    category: "views",
    categoryLabel: "Vistas & Grounds",
    src: "/images/view-from-room.jpeg",
  },
  {
    id: "view-3",
    title: "Majestic Himalayan Range at Dawn",
    category: "views",
    categoryLabel: "Vistas & Grounds",
    src: "/images/shimla.jpeg",
  },
  {
    id: "view-4",
    title: "Estate Driveway & Private Forest Parking",
    category: "views",
    categoryLabel: "Vistas & Grounds",
    src: "/images/parking.jpeg",
  },

  // Estate & Living
  {
    id: "est-1",
    title: "The Grand Heritage Reception & Lobby",
    category: "estate",
    categoryLabel: "Estate & Dining",
    src: "/images/reception.jpeg",
  },
  {
    id: "est-2",
    title: "The Fireside Heritage Salon & Library",
    category: "estate",
    categoryLabel: "Estate & Dining",
    src: "/images/common-area.jpeg",
  },
  {
    id: "est-3",
    title: "Restored Heritage Brass Fitted Washroom",
    category: "estate",
    categoryLabel: "Estate & Dining",
    src: "/images/washroom.jpeg",
  },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Estate Photo Gallery — Hotel Newlands Shimla";
    window.scrollTo(0, 0);
  }, []);

  const filteredItems =
    activeTab === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev! === 0 ? filteredItems.length - 1 : prev! - 1
    );
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev! === 0 ? 1 : (prev! + 1) % filteredItems.length
    );
  };

  return (
    <div className="pt-28 pb-24 bg-warm-ivory min-h-screen text-charcoal">
      {/* Hero Header */}
      <div className="bg-deep-forest text-warm-ivory py-20 mb-12">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-sand mb-3 block">
              Visual Archives
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-normal text-warm-ivory mb-4">
              Estate & Suites Gallery
            </h1>
            <p className="text-base sm:text-lg text-warm-ivory/80 font-light leading-relaxed">
              Explore the authentic architectural beauty, hand-carved deodar interiors,
              and panoramic Himalayan views of Hotel Newlands Shimla.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: "all", label: "All Photographs" },
            { id: "ultra", label: "Ultra Luxury Suites" },
            { id: "luxury", label: "Luxury Suites" },
            { id: "premium", label: "Premium Rooms" },
            { id: "views", label: "Himalayan Vistas" },
            { id: "estate", label: "Estate & Living" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setLightboxIndex(null);
              }}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-deep-forest text-warm-ivory shadow-lg scale-105"
                  : "bg-white text-charcoal/70 border border-black/10 hover:border-deep-forest/40 hover:text-deep-forest"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-[4/3] rounded-sm overflow-hidden bg-black/10 shadow-md cursor-pointer border border-black/5"
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover Overlay with Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/90 via-deep-forest/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-warm-ivory">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-sand mb-1">
                  {item.categoryLabel}
                </span>
                <h3 className="font-display text-lg font-normal text-warm-ivory">
                  {item.title}
                </h3>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-sand/20 backdrop-blur-md flex items-center justify-center text-sand border border-sand/30">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Booking Callout */}
        <div className="mt-20 p-8 sm:p-12 rounded-sm bg-deep-forest text-warm-ivory text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D9C7A3_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <Sparkles className="w-6 h-6 text-sand mx-auto" />
            <h2 className="font-display text-3xl sm:text-4xl font-normal">
              Experience the Grandeur in Person
            </h2>
            <p className="text-sm text-warm-ivory/80 font-light leading-relaxed">
              Escape into century-old deodar stillness and personalized colonial hospitality.
              Reserve directly for preferred suite allocations.
            </p>
            <div className="pt-2">
              <Link to="/rooms">
                <Button variant="gold" size="lg" className="px-8 shadow-xl">
                  Reserve Your Suite
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-warm-ivory hover:bg-white/20 flex items-center justify-center transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Previous Image"
            className="absolute left-6 w-12 h-12 rounded-full bg-white/10 text-warm-ivory hover:bg-white/20 flex items-center justify-center transition-colors z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next Image"
            className="absolute right-6 w-12 h-12 rounded-full bg-white/10 text-warm-ivory hover:bg-white/20 flex items-center justify-center transition-colors z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Caption */}
          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredItems[lightboxIndex].src}
              alt={filteredItems[lightboxIndex].title}
              className="max-h-[75vh] w-auto object-contain rounded-sm shadow-2xl border border-white/10"
            />
            <div className="text-center mt-4 text-warm-ivory">
              <span className="text-xs uppercase tracking-widest text-sand font-semibold block mb-1">
                {filteredItems[lightboxIndex].categoryLabel} • {lightboxIndex + 1} of{" "}
                {filteredItems.length}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-normal">
                {filteredItems[lightboxIndex].title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
