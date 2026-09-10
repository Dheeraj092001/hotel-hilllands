import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Users, Calendar, Star, Eye, Loader2, X, MapPin } from "lucide-react";
import { adminService, GuestItem } from "../services/admin.service";

export default function GuestsCrmPage() {
  const [search, setSearch] = useState("");
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminGuests", search],
    queryFn: () => adminService.getGuests({ search }),
  });

  const { data: guestDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["guestDetail", selectedGuestId],
    queryFn: () => adminService.getGuestDetails(selectedGuestId!),
    enabled: !!selectedGuestId,
  });

  const guests = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Guests Directory & CRM</h2>
          <p className="text-xs text-stone-400 mt-0.5">Guest relationship records, lifetime reservation histories, and stay preferences.</p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="pl-9 pr-3 py-1.5 rounded-lg bg-[#12171C] border border-white/10 text-xs text-white focus:ring-1 focus:ring-[#D9C7A3] w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" /></div>
      ) : (
        <div className="bg-[#12171C] rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/30 text-stone-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Guest Profile</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">City / State</th>
                  <th className="px-5 py-3.5 text-center">Total Stays</th>
                  <th className="px-5 py-3.5 text-center">Reviews</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {guests.map((g) => (
                  <tr key={g.id} className="hover:bg-white/5">
                    <td className="px-5 py-4 font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#183C32] text-[#D9C7A3] font-bold text-xs flex items-center justify-center">
                          {g.name ? g.name.charAt(0).toUpperCase() : "G"}
                        </div>
                        <span>{g.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-stone-300">{g.email}</p>
                      <span className="text-[10px] text-stone-500">{g.phone || "No phone listed"}</span>
                    </td>
                    <td className="px-5 py-4 text-stone-400">
                      {g.city ? `${g.city}, ${g.state || ""}` : "Not specified"}
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-[#D9C7A3]">
                      {g._count?.bookings || 0}
                    </td>
                    <td className="px-5 py-4 text-center text-stone-300">
                      {g._count?.reviews || 0}
                    </td>
                    <td className="px-5 py-4 text-stone-400">
                      {format(new Date(g.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedGuestId(g.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs"
                      >
                        <Eye className="w-3 h-3" /> View Journey
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guest Journey Modal */}
      {selectedGuestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12171C] rounded-2xl max-w-2xl w-full p-6 border border-white/10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">{guestDetail?.name || "Guest Details"}</h3>
                <p className="text-xs text-stone-400">{guestDetail?.email} • {guestDetail?.phone || "No phone"}</p>
              </div>
              <button onClick={() => setSelectedGuestId(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#D9C7A3]" /></div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-stone-300 uppercase tracking-wider text-[10px] mb-2">Reservation History</h4>
                  {guestDetail?.bookings?.length === 0 ? (
                    <p className="text-stone-500">No reservations found.</p>
                  ) : (
                    <div className="space-y-2">
                      {guestDetail?.bookings?.map((b: any) => (
                        <div key={b.id} className="p-3 rounded-lg bg-black/20 border border-white/5 flex items-center justify-between">
                          <div>
                            <span className="font-mono text-[#D9C7A3] font-semibold">{b.confirmationNumber}</span>
                            <p className="text-white font-medium">{b.room?.name} (#{b.room?.roomNumber})</p>
                            <span className="text-[10px] text-stone-500">{b.checkIn.split("T")[0]} to {b.checkOut.split("T")[0]}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-white">₹{Number(b.total).toLocaleString("en-IN")}</span>
                            <span className="block text-[10px] text-emerald-400 font-semibold">{b.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
