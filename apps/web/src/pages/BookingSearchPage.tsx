import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Users, Maximize, Calendar, Sparkles, Check, ArrowRight, Filter } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ROOMS_DATA, RoomItem } from "./RoomsPage";
import { useBookingStore } from "../stores/bookingStore";

export default function BookingSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { search, setSearch } = useBookingStore();

  const todayStr = new Date().toISOString().split("T")[0];
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 2);
  const nextDayStr = nextDay.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(
    searchParams.get("checkIn") || search.checkIn || todayStr
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") || search.checkOut || nextDayStr
  );
  const [adults, setAdults] = useState<number>(
    Number(searchParams.get("adults")) || search.adults || 2
  );
  const [category, setCategory] = useState<string>("all");

  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  useEffect(() => {
    document.title = "Available Suites & Rates — Hotel Newlands Shimla";
    window.scrollTo(0, 0);
  }, []);

  const availableRooms = useMemo(() => {
    return ROOMS_DATA.filter((room) => {
      if (category !== "all" && room.category !== category) return false;
      if (room.capacity < adults) return false;
      return true;
    });
  }, [category, adults]);

  const handleSelectRoom = (roomId: string) => {
    setSearch({
      checkIn,
      checkOut,
      adults,
    });
    navigate(
      `/book/checkout?room=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`
    );
  };

  return (
    <div className="pt-28 pb-24 bg-warm-ivory min-h-screen text-charcoal">
      {/* Search Header Bar */}
      <div className="bg-deep-forest text-warm-ivory py-14 mb-8">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-8">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-sand mb-2 block">
              Reservation Engine
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-normal">
              Select Your Mountain Suite
            </h1>
            <p className="text-xs sm:text-sm text-warm-ivory/80 font-light mt-2">
              Showing available sanctuaries for {nights} {nights === 1 ? "night" : "nights"} • {adults} {adults === 1 ? "Guest" : "Guests"}
            </p>
          </div>

          {/* Quick Date Adjustment Bar */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-sm border border-sand/30 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-warm-ivory max-w-4xl mx-auto text-xs">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-sand mb-1 font-semibold">
                Check-In Date
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-deep-forest/80 border border-sand/40 rounded px-3 py-2 text-warm-ivory text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-sand mb-1 font-semibold">
                Check-Out Date
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-deep-forest/80 border border-sand/40 rounded px-3 py-2 text-warm-ivory text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-sand mb-1 font-semibold">
                Adult Guests
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-deep-forest/80 border border-sand/40 rounded px-3 py-2 text-warm-ivory text-xs"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Adult" : "Adults"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-sand mb-1 font-semibold">
                Suite Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-deep-forest/80 border border-sand/40 rounded px-3 py-2 text-warm-ivory text-xs"
              >
                <option value="all">All Categories</option>
                <option value="suite">Heritage Suites</option>
                <option value="deluxe">Deluxe Rooms</option>
                <option value="cottage">Private Chalet</option>
              </select>
            </div>
          </div>
        </Container>
      </div>

      {/* Available Suites List */}
      <Container>
        <div className="space-y-6 max-w-5xl mx-auto">
          {availableRooms.map((room) => {
            const stayCost = room.price * nights;
            const stayGst = Math.round(stayCost * 0.18);
            const totalEstimated = stayCost + stayGst;

            return (
              <Card
                key={room.id}
                hover={true}
                className="bg-white overflow-hidden flex flex-col md:flex-row border border-black/8 shadow-sm"
              >
                {/* Photo */}
                <div className="md:w-80 h-64 md:h-auto shrink-0 relative overflow-hidden bg-black/10">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold" size="sm">
                      {room.view}
                    </Badge>
                  </div>
                </div>

                {/* Info & Booking Action */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                      <h2 className="font-display text-2xl font-normal text-charcoal">
                        {room.name}
                      </h2>
                      <span className="text-xs uppercase tracking-wider font-semibold text-himalayan-green">
                        Best Rate Guaranteed
                      </span>
                    </div>

                    <p className="text-xs text-muted-stone line-clamp-2 mb-4 leading-relaxed font-light">
                      {room.tagline}
                    </p>

                    {/* Quick Specs */}
                    <div className="flex items-center gap-4 py-2.5 border-y border-black/8 text-xs text-charcoal/80 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-himalayan-green" />
                        <span>Up to {room.capacity} Guests</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-3.5 h-3.5 text-himalayan-green" />
                        <span>{room.size}</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.features.slice(0, 3).map((feat) => (
                        <span
                          key={feat}
                          className="inline-flex items-center gap-1 text-[11px] text-charcoal/70 bg-black/5 px-2.5 py-1 rounded"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-end justify-between pt-4 border-t border-black/8 mt-4">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl font-bold text-deep-forest">
                          ₹{room.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-muted-stone">/ night</span>
                      </div>
                      <span className="text-[11px] text-muted-stone block mt-0.5">
                        ₹{totalEstimated.toLocaleString("en-IN")} total for {nights} {nights === 1 ? "night" : "nights"} (incl. 18% GST)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link to={`/rooms/${room.id}`}>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </Link>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleSelectRoom(room.id)}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Reserve
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
