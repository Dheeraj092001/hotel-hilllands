import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { adminService } from "../services/admin.service";

export default function CalendarPage() {
  const [startDate, setStartDate] = useState(new Date());

  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["adminRooms"],
    queryFn: () => adminService.getRooms(),
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["adminBookingsCalendar"],
    queryFn: () => adminService.getBookings({ limit: 100 }),
  });

  if (roomsLoading || bookingsLoading) {
    return (
      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" /></div>
    );
  }

  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const allRooms = rooms || [];
  const bookings = bookingsData?.bookings || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Stay Calendar Matrix</h2>
          <p className="text-xs text-stone-400 mt-0.5">7-day suite allocation, in-residence occupancy, and vacant turnover schedules.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartDate(subDays(startDate, 7))}
            className="p-1.5 rounded-lg bg-[#12171C] border border-white/10 text-stone-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#12171C] border border-white/10 text-[#D9C7A3]">
            {format(startDate, "d MMM")} — {format(addDays(startDate, 6), "d MMM yyyy")}
          </span>
          <button
            onClick={() => setStartDate(addDays(startDate, 7))}
            className="p-1.5 rounded-lg bg-[#12171C] border border-white/10 text-stone-300 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-[#12171C] rounded-2xl border border-white/10 overflow-x-auto shadow-sm">
        <table className="w-full text-xs text-left min-w-[700px]">
          <thead className="bg-black/40 text-stone-400 uppercase text-[10px] border-b border-white/10">
            <tr>
              <th className="p-3.5 w-48 sticky left-0 bg-[#12171C] z-10">Suite / Room</th>
              {days.map((day) => (
                <th key={day.toISOString()} className="p-3.5 text-center">
                  <div className="font-semibold text-white">{format(day, "EEE")}</div>
                  <div className="text-[10px] text-stone-400">{format(day, "d MMM")}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {allRooms.map((r) => (
              <tr key={r.id} className="hover:bg-white/5">
                <td className="p-3.5 font-medium text-white sticky left-0 bg-[#12171C] z-10 border-r border-white/5">
                  <span className="text-xs block text-stone-200">{r.name}</span>
                  <span className="text-[10px] text-[#D9C7A3] font-mono">#{r.roomNumber} • {r.type?.name}</span>
                </td>
                {days.map((day) => {
                  const dayStr = format(day, "yyyy-MM-dd");
                  // Check if any booking occupies this room on this day
                  const activeBooking = bookings.find((b) => {
                    if (b.room.name !== r.name && b.room.roomNumber !== r.roomNumber) return false;
                    if (b.status === "CANCELLED") return false;
                    const bStart = b.checkIn.split("T")[0];
                    const bEnd = b.checkOut.split("T")[0];
                    return dayStr >= bStart && dayStr < bEnd;
                  });

                  return (
                    <td key={dayStr} className="p-2 text-center border-r border-white/5">
                      {activeBooking ? (
                        <div
                          className={`p-1.5 rounded text-[10px] font-medium truncate ${
                            activeBooking.status === "CHECKED_IN"
                              ? "bg-blue-900/60 text-blue-200 border border-blue-600/40"
                              : "bg-emerald-900/60 text-emerald-200 border border-emerald-600/40"
                          }`}
                          title={`${activeBooking.guestName || activeBooking.user.name} (${activeBooking.confirmationNumber})`}
                        >
                          {activeBooking.guestName || activeBooking.user.name}
                        </div>
                      ) : (
                        <div className="h-6 rounded bg-white/[0.02] border border-dashed border-white/5 flex items-center justify-center text-[10px] text-stone-600">
                          Vacant
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
