import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  Clock,
  Loader2,
  FileText,
} from "lucide-react";
import { dashboardService } from "../../services/dashboard.service";

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["bookingDetail", id],
    queryFn: () => dashboardService.getBooking(id!),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => dashboardService.cancelBooking(id!, cancelReason),
    onSuccess: (res) => {
      toast.success(res.message || "Reservation cancelled successfully");
      setCancelModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["bookingDetail", id] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to cancel reservation");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#183C32]" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-[#D9C7A3]/30 max-w-lg mx-auto">
        <h3 className="font-serif text-lg font-bold text-[#183C32]">Reservation Not Found</h3>
        <p className="text-xs text-[#1C1C1A]/60 mt-1 mb-4">We were unable to locate this reservation record.</p>
        <Link to="/dashboard/bookings" className="text-xs font-semibold text-[#183C32] underline">
          Return to Reservations
        </Link>
      </div>
    );
  }

  const isCancellable = booking.status === "CONFIRMED" || booking.status === "PENDING";
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#183C32] hover:text-[#315C4A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Reservations
        </Link>
        <span className="font-mono text-xs font-bold bg-[#183C32] text-[#F7F3EA] px-3 py-1 rounded">
          {booking.confirmationNumber}
        </span>
      </div>

      {/* Main Reservation Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#D9C7A3]/30 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9C7A3]/30 pb-5">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#183C32]">{booking.room?.name}</h2>
            <p className="text-xs text-[#1C1C1A]/60 mt-0.5">Room #{booking.room?.roomNumber} • Hotel Newlands Shimla</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#1C1C1A]/60">Status:</span>
            <span className="font-semibold text-xs text-[#183C32] uppercase">{booking.status}</span>
          </div>
        </div>

        {/* Stay Timing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#F7F3EA]/50 p-4 rounded-xl border border-[#D9C7A3]/30 text-xs">
          <div>
            <span className="text-[#1C1C1A]/50 block text-[11px] uppercase tracking-wider">Check-in</span>
            <p className="font-semibold text-[#183C32] mt-0.5">{format(checkInDate, "EEEE, d MMMM yyyy")}</p>
            <p className="text-[11px] text-[#1C1C1A]/60">From 3:00 PM</p>
          </div>
          <div>
            <span className="text-[#1C1C1A]/50 block text-[11px] uppercase tracking-wider">Check-out</span>
            <p className="font-semibold text-[#183C32] mt-0.5">{format(checkOutDate, "EEEE, d MMMM yyyy")}</p>
            <p className="text-[11px] text-[#1C1C1A]/60">Until 11:00 AM</p>
          </div>
          <div>
            <span className="text-[#1C1C1A]/50 block text-[11px] uppercase tracking-wider">Party Size</span>
            <p className="font-semibold text-[#183C32] mt-0.5">{booking.adults} Adults {booking.children > 0 ? `• ${booking.children} Children` : ""}</p>
            <p className="text-[11px] text-[#1C1C1A]/60">Bedding: {booking.room?.bedType || "King Bed"}</p>
          </div>
        </div>

        {/* Extras & Requests */}
        {booking.specialRequests && (
          <div className="text-xs p-3.5 bg-amber-50 rounded-lg border border-amber-200/60">
            <span className="font-semibold text-amber-900 block mb-1">Special Guest Request:</span>
            <p className="text-amber-800">{booking.specialRequests}</p>
          </div>
        )}

        {/* Financial Ledger */}
        <div className="border border-[#D9C7A3]/30 rounded-xl p-5 space-y-3">
          <h4 className="font-serif text-sm font-bold text-[#183C32]">Billing Summary</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#1C1C1A]/70">
              <span>Room Tariff & Accommodation</span>
              <span>₹{Number(booking.total).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#183C32] pt-2 border-t border-[#D9C7A3]/30">
              <span>Total Reservation Paid</span>
              <span>₹{Number(booking.total).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Invoices & Cancellation Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D9C7A3]/30">
          <Link
            to="/dashboard/invoices"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D9C7A3] text-xs font-medium text-[#183C32] hover:bg-[#F7F3EA]"
          >
            <FileText className="w-4 h-4 text-[#315C4A]" /> View Invoices & Tax Receipts
          </Link>

          {isCancellable && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="px-4 py-2 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Cancel Reservation
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#D9C7A3]/40 shadow-xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold text-[#183C32]">Cancel Reservation</h3>
            </div>
            <p className="text-xs text-[#1C1C1A]/70">
              Are you sure you want to cancel reservation <strong>{booking.confirmationNumber}</strong>? According to estate policy, reservations cancelled 48 hours prior to check-in are eligible for a refund.
            </p>
            <div>
              <label className="block text-[11px] font-semibold text-[#183C32] mb-1">Reason for Cancellation (Optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Change of travel plans, flight reschedule, etc."
                className="w-full p-2.5 rounded-lg border border-[#D9C7A3]/60 text-xs focus:ring-1 focus:ring-[#183C32] h-20"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 rounded-lg border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50"
              >
                Keep Reservation
              </button>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 flex items-center gap-1.5"
              >
                {cancelMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Confirm Cancellation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
