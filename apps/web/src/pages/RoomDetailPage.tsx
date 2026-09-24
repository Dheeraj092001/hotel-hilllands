import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Users,
  Maximize,
  Flame,
  Mountain,
  Check,
  Calendar,
  ShieldCheck,
  Coffee,
  Sparkles,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ROOMS_DATA } from "./RoomsPage";
import { useBookingStore } from "../stores/bookingStore";

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { search, setSearch } = useBookingStore();

  const room = ROOMS_DATA.find((r) => r.id === id) || ROOMS_DATA[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Gallery of high-res photos
  const gallery = room.id === "cedar-ridge-deluxe"
    ? [
        room.image, // /images/luxury-suit (2).jpeg
        "/images/luxury-suit (5).jpeg",
        "/images/luxury-suit (3).jpeg",
        "/images/luxury-suit-washroom(1).jpeg",
        "/images/balcony-view.jpeg",
        "/images/view-from-room.jpeg",
      ]
    : [
        room.image,
        room.category === "suite"
          ? "/images/ultra-luxury (1).jpeg"
          : room.category === "cottage"
          ? "/images/ultra-luxury (5).jpeg"
          : "/images/premium(2).jpeg",
        room.category === "suite"
          ? "/images/ultra-luxury (2).jpeg"
          : room.category === "cottage"
          ? "/images/ultra-luxury (6).jpeg"
          : "/images/premium4.jpeg",
        room.category === "suite"
          ? "/images/ultra-luxury-washroom.jpeg"
          : "/images/primium-washroom.jpeg",
        "/images/balcony-view.jpeg",
        "/images/view-from-room.jpeg",
      ];

  const todayStr = new Date().toISOString().split("T")[0];
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 2);
  const nextDayStr = nextDay.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(search.checkIn || todayStr);
  const [checkOut, setCheckOut] = useState(search.checkOut || nextDayStr);
  const [guests, setGuests] = useState(search.adults || 2);

  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const totalPrice = room.price * nights;
  const gst = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + gst;

  useEffect(() => {
    document.title = `${room.name} — Hotel Newlands Shimla`;
    window.scrollTo(0, 0);
  }, [room]);

  const handleBookNow = () => {
    setSearch({
      checkIn,
      checkOut,
      adults: Number(guests),
    });
    navigate(`/book?room=${room.id}`);
  };

  return (
    <div className="pt-28 pb-24 bg-warm-ivory min-h-screen text-charcoal">
      <Container>
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-stone mb-6">
          <Link to="/" className="hover:text-deep-forest">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/rooms" className="hover:text-deep-forest">Suites</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-charcoal font-medium">{room.name}</span>
        </div>

        {/* Suite Header Title */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-black/10 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold" size="sm">
                {room.view}
              </Badge>
              <span className="text-xs uppercase tracking-widest text-himalayan-green font-semibold">
                Altitude 2,205m
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-normal text-charcoal leading-tight">
              {room.name}
            </h1>
            <p className="text-sm sm:text-base text-muted-stone mt-2 font-light max-w-2xl">
              {room.tagline}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-stone uppercase tracking-wider">From</span>
            <span className="font-display text-3xl sm:text-4xl font-bold text-deep-forest">
              ₹{room.price.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted-stone">/ night + taxes</span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-4 mb-14">
          <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-sm overflow-hidden shadow-2xl bg-black/5">
            <img
              src={gallery[activeImageIndex]}
              alt={room.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] rounded-sm overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? "border-deep-forest shadow-md scale-[1.02]"
                    : "border-transparent opacity-65 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Suite Details (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Quick Specs Bar */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-sm border border-black/8 text-center shadow-sm">
              <div className="border-r border-black/8">
                <Users className="w-5 h-5 text-himalayan-green mx-auto mb-1" />
                <span className="text-xs text-muted-stone block">Capacity</span>
                <span className="text-sm font-semibold text-charcoal">{room.capacity} Guests</span>
              </div>
              <div className="border-r border-black/8">
                <Maximize className="w-5 h-5 text-himalayan-green mx-auto mb-1" />
                <span className="text-xs text-muted-stone block">Suite Size</span>
                <span className="text-sm font-semibold text-charcoal">{room.size}</span>
              </div>
              <div>
                <Mountain className="w-5 h-5 text-himalayan-green mx-auto mb-1" />
                <span className="text-xs text-muted-stone block">Orientation</span>
                <span className="text-sm font-semibold text-charcoal">{room.view}</span>
              </div>
            </div>

            {/* Narrative Overview */}
            <div>
              <h2 className="font-display text-2xl font-normal text-charcoal mb-4">
                About the Sanctuary
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-muted-stone leading-relaxed font-light">
                <p>
                  Imbued with the quiet majesty of colonial Shimla, this chamber pairs antique
                  Himalayan deodar woodwork with modern bespoke comforts. Floor-to-ceiling windows
                  open toward whispering pine forests and distant snow-covered peaks of the Pir Panjal range.
                </p>
                <p>
                  Evenings invite relaxation beside your personal fireplace, attended by our dedicated
                  butler service. Hand-woven cashmere blankets, customized pillow configurations, and
                  artisan teas ensure tranquil mountain slumber.
                </p>
              </div>
            </div>

            {/* Categorized Amenities */}
            <div>
              <h3 className="font-display text-2xl font-normal text-charcoal mb-6">
                Curated Amenities & Inclusions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Column 1 */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-himalayan-green font-semibold">
                    Comfort & Fireplace
                  </h4>
                  <ul className="space-y-2.5 text-sm text-charcoal/80">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Hand-built stone fireplace with firewood service</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Heated solid oak flooring throughout</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Custom plush king bed with Egyptian cotton linens</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Down duvet and personalized aromatherapy pillow menu</span>
                    </li>
                  </ul>
                </div>

                {/* Column 2 */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-himalayan-green font-semibold">
                    Wellness & Bath
                  </h4>
                  <ul className="space-y-2.5 text-sm text-charcoal/80">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Deep freestanding clawfoot soaking tub</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Walk-in rain shower with cedarwood bath amenities</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Plush terry bathrobes & Himalayan felt slippers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Heated towel racks & premium hair dryer</span>
                    </li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-himalayan-green font-semibold">
                    Hospitality & Refreshments
                  </h4>
                  <ul className="space-y-2.5 text-sm text-charcoal/80">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Complimentary multi-course Himalayan breakfast</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Artisan Kangra tea and French press coffee station</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Evening lavender turndown service with handmade treats</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Fresh spring water in glass carafes replenished daily</span>
                    </li>
                  </ul>
                </div>

                {/* Column 4 */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-himalayan-green font-semibold">
                    Connectivity & Technology
                  </h4>
                  <ul className="space-y-2.5 text-sm text-charcoal/80">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>High-speed fiber Wi-Fi throughout the suite</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Smart 55" 4K TV with streaming integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Marshall Bluetooth speaker</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Electronic in-room safe and multiple universal outlets</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="p-6 bg-white rounded-sm border border-black/8 space-y-4">
              <h3 className="font-display text-xl font-normal text-charcoal">
                Hotel Policies & House Rules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-stone">
                <div>
                  <span className="font-semibold text-charcoal block mb-0.5">Check-In & Check-Out</span>
                  Check-in from 2:00 PM • Check-out by 11:00 AM. Early check-in upon request.
                </div>
                <div>
                  <span className="font-semibold text-charcoal block mb-0.5">Cancellation Policy</span>
                  Full refund if cancelled up to 48 hours before scheduled arrival date.
                </div>
                <div>
                  <span className="font-semibold text-charcoal block mb-0.5">Child & Extra Bed Policy</span>
                  Children under 6 stay complimentary. Extra bedding available at ₹2,500/night.
                </div>
                <div>
                  <span className="font-semibold text-charcoal block mb-0.5">Pet & Smoke Free</span>
                  All indoor suites are strictly non-smoking to preserve the deodar wood integrity.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sticky Booking Calculator (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-sm shadow-xl border border-black/10">
              <div className="flex justify-between items-baseline mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-stone block">Rate</span>
                  <span className="font-display text-3xl font-bold text-deep-forest">
                    ₹{room.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-xs text-muted-stone">per night</span>
              </div>

              {/* Date Pickers */}
              <div className="space-y-3 mb-6">
                <div className="border border-black/15 p-3 rounded-sm">
                  <label htmlFor="detail-checkin" className="block text-[10px] uppercase font-semibold text-muted-stone mb-1">
                    Check-In
                  </label>
                  <input
                    id="detail-checkin"
                    type="date"
                    value={checkIn}
                    min={todayStr}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-sm font-medium text-charcoal bg-transparent focus:outline-none"
                  />
                </div>

                <div className="border border-black/15 p-3 rounded-sm">
                  <label htmlFor="detail-checkout" className="block text-[10px] uppercase font-semibold text-muted-stone mb-1">
                    Check-Out
                  </label>
                  <input
                    id="detail-checkout"
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-sm font-medium text-charcoal bg-transparent focus:outline-none"
                  />
                </div>

                <div className="border border-black/15 p-3 rounded-sm">
                  <label htmlFor="detail-guests" className="block text-[10px] uppercase font-semibold text-muted-stone mb-1">
                    Guests
                  </label>
                  <select
                    id="detail-guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-sm font-medium text-charcoal bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    {room.capacity >= 3 && <option value={3}>3 Adults</option>}
                    {room.capacity >= 4 && <option value={4}>4 Adults</option>}
                  </select>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-2 py-4 border-y border-black/8 text-xs text-muted-stone mb-6">
                <div className="flex justify-between">
                  <span>₹{room.price.toLocaleString("en-IN")} × {nights} {nights === 1 ? "night" : "nights"}</span>
                  <span className="text-charcoal font-medium">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Himalayan Gourmet Breakfast</span>
                  <span className="text-emerald-700 font-medium">Included</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span className="text-charcoal font-medium">₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-black/5 text-sm text-charcoal font-semibold">
                  <span>Total Amount</span>
                  <span className="text-deep-forest text-base">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button
                variant="gold"
                size="lg"
                onClick={handleBookNow}
                className="w-full text-deep-forest font-semibold py-4 shadow-md hover:bg-sand"
              >
                Proceed to Reservation
              </Button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-stone text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Confirmation • No Booking Fees</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
