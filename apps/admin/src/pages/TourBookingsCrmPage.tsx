import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ClipboardList, Loader2, Search, ChevronRight,
  User, Phone, Mail, Users, Calendar, StickyNote,
  X, Check, AlertCircle
} from "lucide-react";
import { adminTourBookingsService, AdminTourBooking, TourBookingStats } from "../services/admin.service";

const STATUS_COLORS: Record<string, string> = {
  PENDING:    "bg-yellow-500/15 text-yellow-400",
  CONFIRMED:  "bg-emerald-500/15 text-emerald-400",
  DEPARTED:   "bg-blue-500/15 text-blue-400",
  COMPLETED:  "bg-purple-500/15 text-purple-400",
  CANCELLED:  "bg-red-500/15 text-red-400",
  REFUNDED:   "bg-stone-500/20 text-stone-400",
};

const PIPELINE_STATUSES = ["PENDING", "CONFIRMED", "DEPARTED", "COMPLETED", "CANCELLED"];

function BookingDetailDrawer({ booking, onClose }: { booking: AdminTourBooking & { statusHistory?: unknown[] }; onClose: () => void }) {
  const qc = useQueryClient();
  const [newStatus, setNewStatus] = useState(booking.status);
  const [note, setNote] = useState("");

  const updateStatus = useMutation({
    mutationFn: () => adminTourBookingsService.updateStatus(booking.id, newStatus, note || undefined),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["adminTourBookings"] });
      qc.invalidateQueries({ queryKey: ["adminTourBookingStats"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const inp = "w-full rounded bg-white/5 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#D9C7A3]/50";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/60">
      <div className="bg-[#12171C] border-l border-white/10 w-full max-w-md h-full overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#12171C] z-10">
          <div>
            <h3 className="font-serif text-lg text-white">{booking.confirmationNumber}</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${STATUS_COLORS[booking.status] ?? "bg-stone-500/20 text-stone-400"}`}>
              {booking.status}
            </span>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-6">
          {/* Guest info */}
          <div>
            <h4 className="text-xs text-stone-400 uppercase tracking-wider mb-3">Guest</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-stone-300"><User className="w-3.5 h-3.5 text-[#D9C7A3]" />{booking.guestName}</div>
              <div className="flex items-center gap-2 text-stone-300"><Phone className="w-3.5 h-3.5 text-[#D9C7A3]" />{booking.guestPhone}</div>
              {booking.guestEmail && <div className="flex items-center gap-2 text-stone-300"><Mail className="w-3.5 h-3.5 text-[#D9C7A3]" />{booking.guestEmail}</div>}
              <div className="flex items-center gap-2 text-stone-300"><Users className="w-3.5 h-3.5 text-[#D9C7A3]" />{booking.adults} adults, {booking.children} children</div>
            </div>
          </div>

          {/* Tour info */}
          <div>
            <h4 className="text-xs text-stone-400 uppercase tracking-wider mb-3">Tour</h4>
            <div className="bg-[#183C32]/30 rounded-lg p-4">
              <p className="font-semibold text-white text-sm mb-1">{booking.tour.title}</p>
              {booking.departure && (
                <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(booking.departure.startDate).toLocaleDateString("en-IN")} →{" "}
                  {new Date(booking.departure.endDate).toLocaleDateString("en-IN")}
                </div>
              )}
              <p className="text-sm font-semibold text-[#D9C7A3] mt-2">₹{Number(booking.totalAmount).toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Travelers */}
          {booking.travelers.length > 0 && (
            <div>
              <h4 className="text-xs text-stone-400 uppercase tracking-wider mb-3">Travelers</h4>
              <div className="space-y-1.5">
                {booking.travelers.map((t: any) => (
                  <div key={t.id} className="flex items-center gap-2 text-sm text-stone-300 bg-white/3 rounded px-3 py-2">
                    <User className="w-3 h-3 text-[#D9C7A3]" /> {t.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Update status */}
          <div>
            <h4 className="text-xs text-stone-400 uppercase tracking-wider mb-3">Update Status</h4>
            <select className={inp} value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              {PIPELINE_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <textarea
              rows={2}
              placeholder="Add a note (optional)"
              className={`${inp} mt-2 resize-none`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              onClick={() => updateStatus.mutate()}
              disabled={updateStatus.isPending || newStatus === booking.status}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-[#D9C7A3] text-[#0B0F12] text-sm font-semibold disabled:opacity-50"
            >
              {updateStatus.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TourBookingsCrmPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminTourBooking | null>(null);

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["adminTourBookings", page, statusFilter],
    queryFn: () => adminTourBookingsService.list({ page, status: statusFilter === "ALL" ? undefined : statusFilter }),
  });

  const { data: stats } = useQuery({
    queryKey: ["adminTourBookingStats"],
    queryFn: adminTourBookingsService.stats,
  });

  const bookings = bookingsData?.data ?? [];
  const meta = bookingsData?.meta;
  const filtered = search ? bookings.filter((b) => b.guestName.toLowerCase().includes(search.toLowerCase()) || b.confirmationNumber.toLowerCase().includes(search.toLowerCase())) : bookings;

  const statCards = [
    { label: "Total", value: stats?.total ?? 0, color: "text-white" },
    { label: "Pending", value: stats?.pending ?? 0, color: "text-yellow-400" },
    { label: "Confirmed", value: stats?.confirmed ?? 0, color: "text-emerald-400" },
    { label: "Cancelled", value: stats?.cancelled ?? 0, color: "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Tour Bookings CRM</h2>
          <p className="text-xs text-stone-400 mt-0.5">Manage tour reservations, traveler details, and booking pipeline.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ label, value, color }) => (
          <div key={label} className="bg-[#12171C] border border-white/10 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold font-serif ${color}`}>{value}</p>
            <p className="text-xs text-stone-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <input
            type="search"
            placeholder="Name or confirmation #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm placeholder:text-stone-500 focus:outline-none focus:border-[#D9C7A3]/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", ...PIPELINE_STATUSES].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${statusFilter === s ? "bg-[#183C32] text-[#D9C7A3] border border-[#D9C7A3]/40" : "bg-white/5 text-stone-400 hover:text-white border border-white/10"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings table */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" /></div>
      ) : (
        <div className="bg-[#12171C] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Confirmation</th>
                <th className="text-left px-4 py-3">Guest</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Tour</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Amount</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3">View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-stone-500">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-40" />No bookings found.
                </td></tr>
              ) : (
                filtered.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer" onClick={() => setSelected(booking)}>
                    <td className="px-4 py-3 font-mono text-xs text-[#D9C7A3]">{booking.confirmationNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm">{booking.guestName}</p>
                      <p className="text-stone-500 text-xs">{booking.guestPhone}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-stone-300 text-xs line-clamp-1">{booking.tour.title}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-stone-300 text-xs">₹{Number(booking.totalAmount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${STATUS_COLORS[booking.status] ?? "bg-stone-500/20 text-stone-400"}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-stone-400 text-xs">
                      {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight className="w-4 h-4 text-stone-500 ml-auto" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {meta && meta.totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-white/10">
              <span className="text-xs text-stone-400">{meta.total} bookings</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded border border-white/10 text-xs text-stone-400 hover:text-white disabled:opacity-40">Prev</button>
                <span className="px-3 py-1 text-xs text-stone-300">{page}/{meta.totalPages}</span>
                <button disabled={page === meta.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded border border-white/10 text-xs text-stone-400 hover:text-white disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {selected && (
        <BookingDetailDrawer
          booking={selected as any}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}