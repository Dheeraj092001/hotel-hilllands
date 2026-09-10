import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Users, ArrowRight, Loader2, Compass, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { dashboardService, GuestBooking } from "../../services/dashboard.service";

export default function MyBookingsPage() {
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED">("ALL");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["myBookings"],
    queryFn: () => dashboardService.getMyBookings(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#183C32]" />
      </div>
    );
  }

  const allBookings = bookings || [];

  const filteredBookings = allBookings.filter((b) => {
    if (filter === "ALL") return true;
    if (filter === "UPCOMING") return b.status === "CONFIRMED" || b.status === "PENDING";
    if (filter === "COMPLETED") return b.status === "CHECKED_OUT";
    if (filter === "CANCELLED") return b.status === "CANCELLED";
    return true;
  });

  const getStatusBadge = (status: GuestBooking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Confirmed</span>;
      case "CHECKED_IN":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">In Residence</span>;
      case "CHECKED_OUT":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">Completed</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9C7A3]/30 pb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#183C32]">Reservation History</h2>
          <p className="text-xs text-[#1C1C1A]/60 mt-0.5">Manage your upcoming mountain getaways and past heritage retreats.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#D9C7A3]/40">
          {(["ALL", "UPCOMING", "COMPLETED", "CANCELLED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === tab ? "bg-[#183C32] text-[#F7F3EA]" : "text-[#1C1C1A]/70 hover:bg-[#F7F3EA]"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#D9C7A3]/30 shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#D9C7A3]/20 text-[#183C32] flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-[#183C32]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#183C32]">No reservations found</h3>
          <p className="text-xs text-[#1C1C1A]/60 mt-1 mb-5">You have no {filter !== "ALL" ? filter.toLowerCase() : ""} stays registered with Hotel Newlands.</p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#183C32] text-[#F7F3EA] text-xs font-medium hover:bg-[#315C4A] transition-colors"
          >
            <Compass className="w-4 h-4 text-[#D9C7A3]" />
            <span>Discover Suites</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => {
            const checkInFormatted = format(new Date(b.checkIn), "EEE, d MMM yyyy");
            const checkOutFormatted = format(new Date(b.checkOut), "EEE, d MMM yyyy");
            const roomImg = b.room?.images?.[0]?.url || "/images/ultra-luxury.jpeg";

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#D9C7A3]/40 hover:border-[#315C4A]/40 transition-all shadow-sm flex flex-col md:flex-row"
              >
                {/* Image preview */}
                <div className="md:w-60 h-48 md:h-auto shrink-0 relative bg-stone-100">
                  <img src={roomImg} alt={b.room.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">{getStatusBadge(b.status)}</div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-[#183C32]">{b.room.name}</h3>
                      <span className="font-mono text-xs font-semibold bg-[#F7F3EA] text-[#183C32] px-2.5 py-1 rounded border border-[#D9C7A3]/40">
                        {b.confirmationNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs text-[#1C1C1A]/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#315C4A]" />
                        <span>{checkInFormatted} — {checkOutFormatted}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#315C4A]" />
                        <span>{b.adults} Adults {b.children > 0 ? `• ${b.children} Children` : ""}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-4 border-t border-[#D9C7A3]/30">
                    <div>
                      <span className="text-[11px] text-[#1C1C1A]/50 uppercase tracking-wider block">Total Amount</span>
                      <span className="font-serif text-base font-bold text-[#183C32]">₹{Number(b.total).toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {b.status === "CHECKED_OUT" && (
                        <Link
                          to={`/dashboard/reviews?bookingId=${b.id}`}
                          className="px-3 py-1.5 rounded-lg border border-[#D9C7A3]/60 text-xs font-medium text-[#183C32] hover:bg-[#F7F3EA]"
                        >
                          Write Review
                        </Link>
                      )}

                      <Link
                        to={`/dashboard/bookings/${b.id}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#183C32] text-[#F7F3EA] text-xs font-medium hover:bg-[#315C4A] transition-colors"
                      >
                        <span>Manage Reservation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
