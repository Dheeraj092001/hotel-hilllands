import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Search,
  CheckCircle,
  LogOut,
  Calendar,
  Eye,
  Loader2,
  X,
  Filter,
  Receipt,
} from "lucide-react";
import { adminService, AdminBooking } from "../services/admin.service";

export default function BookingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminBookings", page, status, search],
    queryFn: () => adminService.getBookings({ page, status, search }),
  });

  const checkInMutation = useMutation({
    mutationFn: (id: string) => adminService.checkInGuest(id),
    onSuccess: () => {
      toast.success("Guest checked in successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setSelectedBooking(null);
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: (id: string) => adminService.checkOutGuest(id),
    onSuccess: () => {
      toast.success("Guest checked out successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setSelectedBooking(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: string }) =>
      adminService.updateBookingStatus(id, nextStatus),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setSelectedBooking(null);
    },
  });

  const bookings = data?.bookings || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Reservations Ledger</h2>
          <p className="text-xs text-stone-400 mt-0.5">Manage arrivals, in-residence stays, check-ins, and guest departures.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, guest, suite..."
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#12171C] border border-white/10 text-xs text-white focus:ring-1 focus:ring-[#D9C7A3] w-56"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#12171C] border border-white/10 text-xs text-stone-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">In Residence</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
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
                  <th className="px-5 py-3.5">Code</th>
                  <th className="px-5 py-3.5">Guest Name</th>
                  <th className="px-5 py-3.5">Suite Assigned</th>
                  <th className="px-5 py-3.5">Stay Dates</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5">
                    <td className="px-5 py-4 font-mono font-bold text-[#D9C7A3]">{b.confirmationNumber}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{b.guestName || b.user.name}</p>
                      <span className="text-[10px] text-stone-400">{b.guestPhone || b.user.phone || b.user.email}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-stone-300 font-medium">{b.room.name}</p>
                      <span className="text-[10px] text-stone-500">Suite #{b.room.roomNumber}</span>
                    </td>
                    <td className="px-5 py-4 text-stone-400">
                      {format(new Date(b.checkIn), "d MMM")} — {format(new Date(b.checkOut), "d MMM yyyy")}
                    </td>
                    <td className="px-5 py-4 font-bold text-white">₹{Number(b.total).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                            : b.status === "CHECKED_IN"
                            ? "bg-blue-950 text-blue-300 border border-blue-800/40"
                            : b.status === "CHECKED_OUT"
                            ? "bg-stone-800 text-stone-300"
                            : "bg-red-950 text-red-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      {b.status === "CONFIRMED" && (
                        <button
                          onClick={() => checkInMutation.mutate(b.id)}
                          className="px-2.5 py-1 rounded bg-[#183C32] text-[#D9C7A3] hover:bg-[#315C4A] text-[11px] font-medium border border-[#D9C7A3]/30"
                        >
                          Check In
                        </button>
                      )}
                      {b.status === "CHECKED_IN" && (
                        <button
                          onClick={() => checkOutMutation.mutate(b.id)}
                          className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 hover:bg-amber-900 text-[11px] font-medium border border-amber-800/40"
                        >
                          Check Out
                        </button>
                      )}
                      <button
                        onClick={() =>
                          navigate(
                            `/invoices?bookingId=${b.id}&email=${encodeURIComponent(
                              b.guestEmail || b.user.email
                            )}`
                          )
                        }
                        className="px-2.5 py-1 rounded bg-[#183C32]/50 text-[#D9C7A3] hover:bg-[#183C32] text-[11px] font-medium border border-[#D9C7A3]/30"
                        title="Generate or view checkout invoice"
                      >
                        Invoice
                      </button>
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-2.5 py-1 rounded bg-white/5 text-stone-300 hover:text-white text-[11px]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking View Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12171C] rounded-2xl max-w-lg w-full p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Reservation {selectedBooking.confirmationNumber}</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2 text-stone-300">
              <p><strong>Guest:</strong> {selectedBooking.guestName || selectedBooking.user.name}</p>
              <p><strong>Email:</strong> {selectedBooking.guestEmail || selectedBooking.user.email}</p>
              <p><strong>Suite:</strong> {selectedBooking.room.name} (#{selectedBooking.room.roomNumber})</p>
              <p><strong>Stay:</strong> {selectedBooking.checkIn.split("T")[0]} to {selectedBooking.checkOut.split("T")[0]}</p>
              <p><strong>Party:</strong> {selectedBooking.adults} Adults, {selectedBooking.children} Children</p>
              <p><strong>Total Paid:</strong> ₹{Number(selectedBooking.total).toLocaleString("en-IN")}</p>
              <p><strong>Current Status:</strong> {selectedBooking.status}</p>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() =>
                  navigate(
                    `/invoices?bookingId=${selectedBooking.id}&email=${encodeURIComponent(
                      selectedBooking.guestEmail || selectedBooking.user.email
                    )}`
                  )
                }
                className="px-3 py-1.5 rounded bg-[#183C32] text-[#D9C7A3] hover:bg-[#315C4A] text-xs font-medium border border-[#D9C7A3]/30"
              >
                Generate Checkout Invoice
              </button>
              <button
                onClick={() => statusMutation.mutate({ id: selectedBooking.id, nextStatus: "CANCELLED" })}
                className="px-3 py-1.5 rounded bg-red-950 text-red-300 hover:bg-red-900 text-xs"
              >
                Mark Cancelled
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-3 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
