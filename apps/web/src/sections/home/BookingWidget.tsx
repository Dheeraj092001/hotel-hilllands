import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, ChevronRight, Sparkles } from "lucide-react";
import { useBookingStore } from "../../stores/bookingStore";
import { Button } from "../../components/ui/Button";

interface BookingWidgetProps {
  className?: string;
  isFloating?: boolean;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  className = "",
  isFloating = false,
}) => {
  const navigate = useNavigate();
  const { search, setSearch } = useBookingStore();

  const todayStr = new Date().toISOString().split("T")[0];
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 2);
  const nextDayStr = nextDay.toISOString().split("T")[0];

  const [checkIn, setLocalCheckIn] = useState(search.checkIn || todayStr);
  const [checkOut, setLocalCheckOut] = useState(search.checkOut || nextDayStr);
  const [adults, setLocalAdults] = useState(search.adults || 2);
  const [children, setLocalChildren] = useState(search.children || 0);
  const [rooms, setLocalRooms] = useState(search.rooms || 1);

  // Calculate nights
  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch({
      checkIn,
      checkOut,
      adults: Number(adults),
      children: Number(children),
      rooms: Number(rooms),
    });
    navigate("/rooms");
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto ${
        isFloating
          ? "bg-warm-ivory/95 backdrop-blur-md shadow-2xl border border-black/10 rounded-sm p-4 sm:p-6 lg:p-8"
          : "bg-white shadow-xl border border-black/8 rounded-sm p-6"
      } ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch gap-4">
        {/* Dates Column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {/* Check In */}
          <div className="relative border border-black/15 hover:border-black/30 transition-colors p-3 rounded-sm bg-white">
            <label
              htmlFor="checkin-date"
              className="block text-[11px] uppercase tracking-widest text-muted-stone font-semibold mb-1"
            >
              Check-In Date
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-himalayan-green shrink-0" />
              <input
                id="checkin-date"
                type="date"
                min={todayStr}
                value={checkIn}
                onChange={(e) => {
                  setLocalCheckIn(e.target.value);
                  if (new Date(e.target.value) >= new Date(checkOut)) {
                    const d = new Date(e.target.value);
                    d.setDate(d.getDate() + 1);
                    setLocalCheckOut(d.toISOString().split("T")[0]);
                  }
                }}
                className="w-full text-sm font-medium text-charcoal bg-transparent focus:outline-none cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Check Out */}
          <div className="relative border border-black/15 hover:border-black/30 transition-colors p-3 rounded-sm bg-white">
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="checkout-date"
                className="block text-[11px] uppercase tracking-widest text-muted-stone font-semibold"
              >
                Check-Out Date
              </label>
              <span className="text-[10px] text-himalayan-green font-medium px-1.5 py-0.2 bg-himalayan-green/10 rounded">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-himalayan-green shrink-0" />
              <input
                id="checkout-date"
                type="date"
                min={checkIn || todayStr}
                value={checkOut}
                onChange={(e) => setLocalCheckOut(e.target.value)}
                className="w-full text-sm font-medium text-charcoal bg-transparent focus:outline-none cursor-pointer"
                required
              />
            </div>
          </div>
        </div>

        {/* Guests & Rooms */}
        <div className="grid grid-cols-3 gap-3 flex-1">
          {/* Adults */}
          <div className="border border-black/15 hover:border-black/30 transition-colors p-3 rounded-sm bg-white">
            <label
              htmlFor="adults-select"
              className="block text-[11px] uppercase tracking-widest text-muted-stone font-semibold mb-1"
            >
              Adults
            </label>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-himalayan-green shrink-0" />
              <select
                id="adults-select"
                value={adults}
                onChange={(e) => setLocalAdults(Number(e.target.value))}
                className="w-full text-sm font-medium text-charcoal bg-transparent focus:outline-none cursor-pointer"
              >
                <option value={1}>1 Adult</option>
                <option value={2}>2 Adults</option>
                <option value={3}>3 Adults</option>
                <option value={4}>4 Adults</option>
              </select>
            </div>
          </div>

          {/* Children */}
          <div className="border border-black/15 hover:border-black/30 transition-colors p-3 rounded-sm bg-white">
            <label
              htmlFor="children-select"
              className="block text-[11px] uppercase tracking-widest text-muted-stone font-semibold mb-1"
            >
              Children
            </label>
            <select
              id="children-select"
              value={children}
              onChange={(e) => setLocalChildren(Number(e.target.value))}
              className="w-full text-sm font-medium text-charcoal bg-transparent focus:outline-none cursor-pointer mt-0.5"
            >
              <option value={0}>0 Children</option>
              <option value={1}>1 Child</option>
              <option value={2}>2 Children</option>
            </select>
          </div>

          {/* Rooms */}
          <div className="border border-black/15 hover:border-black/30 transition-colors p-3 rounded-sm bg-white">
            <label
              htmlFor="rooms-select"
              className="block text-[11px] uppercase tracking-widest text-muted-stone font-semibold mb-1"
            >
              Rooms
            </label>
            <select
              id="rooms-select"
              value={rooms}
              onChange={(e) => setLocalRooms(Number(e.target.value))}
              className="w-full text-sm font-medium text-charcoal bg-transparent focus:outline-none cursor-pointer mt-0.5"
            >
              <option value={1}>1 Room</option>
              <option value={2}>2 Rooms</option>
              <option value={3}>3 Rooms</option>
            </select>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="flex items-end">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full lg:w-auto h-[54px] whitespace-nowrap shadow-lg px-8 text-deep-forest hover:bg-sand"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Check Availability
          </Button>
        </div>
      </form>

      {/* Special Offer Tagline */}
      <div className="mt-3.5 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-muted-stone">
        <div className="flex items-center gap-1.5 text-himalayan-green font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Best Rate Guarantee — Complimentary Himalayan breakfast included</span>
        </div>
        <span className="hidden sm:inline-block text-[11px]">Free cancellation up to 48h prior</span>
      </div>
    </div>
  );
};
