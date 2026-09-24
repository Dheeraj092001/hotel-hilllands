import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Search,
  Receipt,
  Printer,
  Mail,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building2,
  UtensilsCrossed,
  Sparkles,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Download,
  Clock,
  ChevronDown,
} from "lucide-react";
import { adminService } from "../services/admin.service";
import { MOCK_GUESTS, MOCK_BOOKINGS } from "../services/mockData";

interface CustomCharge {
  id: string;
  description: string;
  category: "ADDITIONAL" | "FOOD_BEVERAGE" | "EXTRAS";
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

const safeFormatDate = (dateVal: string | Date | undefined, fmt = "dd MMM yyyy") => {
  if (!dateVal) return "";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return format(d, fmt);
  } catch {
    return String(dateVal);
  }
};

export default function InvoiceGeneratorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Search & Selection State
  const initialEmail = searchParams.get("email") || "v.singhania@heritageholdings.in";
  const initialBookingId = searchParams.get("bookingId") || "";

  const [emailInput, setEmailInput] = useState(initialEmail);
  const [selectedEmail, setSelectedEmail] = useState(initialEmail);
  const [selectedBookingId, setSelectedBookingId] = useState(initialBookingId);

  // Additional Charges State
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>([]);
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<"ADDITIONAL" | "FOOD_BEVERAGE" | "EXTRAS">("ADDITIONAL");
  const [newQty, setNewQty] = useState(1);
  const [newPrice, setNewPrice] = useState(0);
  const [newTaxRate, setNewTaxRate] = useState(18);

  // Settlement Options
  const [paymentMode, setPaymentMode] = useState<"CREDIT_CARD" | "UPI" | "CASH" | "ROOM_BILL">("CREDIT_CARD");
  const [invoiceGeneratedData, setInvoiceGeneratedData] = useState<any | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Query: Guest lookup by email
  const { data: guestLookup, isLoading: isLookingUp } = useQuery({
    queryKey: ["adminGuestLookup", selectedEmail],
    queryFn: () => adminService.lookupGuestByEmail(selectedEmail),
    enabled: !!selectedEmail,
  });

  const availableBookings = guestLookup?.bookings || [];

  // Auto-select booking when guest data loads
  useEffect(() => {
    if (availableBookings.length > 0) {
      if (!selectedBookingId || !availableBookings.some((b) => b.id === selectedBookingId)) {
        // Prefer checked_out or checked_in
        const preferred =
          availableBookings.find((b) => b.status === "CHECKED_OUT") ||
          availableBookings.find((b) => b.status === "CHECKED_IN") ||
          availableBookings[0];
        setSelectedBookingId(preferred.id);
      }
    } else {
      setSelectedBookingId("");
    }
  }, [availableBookings, selectedBookingId]);

  // Query: Checkout preview for selected booking
  const { data: previewData, isLoading: isPreviewLoading, refetch: refetchPreview } = useQuery({
    queryKey: ["adminCheckoutPreview", selectedBookingId],
    queryFn: () => adminService.getCheckoutPreview(selectedBookingId),
    enabled: !!selectedBookingId,
  });

  // Mutation: Generate Invoice
  const generateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        bookingId: selectedBookingId,
        paymentMethod: paymentMode,
        settleBalance: true,
        additionalItems: customCharges.map((c) => ({
          description: c.description,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          taxRate: c.taxRate,
          category: c.category,
        })),
      };
      return adminService.generateCheckoutInvoice(payload);
    },
    onSuccess: (res) => {
      setInvoiceGeneratedData(res.data);
      toast.success(`Official Invoice #${res.data.invoiceNumber} generated & recorded!`);
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      queryClient.invalidateQueries({ queryKey: ["adminFinancialSummary"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to generate invoice");
    },
  });

  // Quick guest email select
  const handleSelectPresetEmail = (email: string) => {
    setEmailInput(email);
    setSelectedEmail(email);
    setInvoiceGeneratedData(null);
    setCustomCharges([]);
    setSearchParams({ email });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSelectedEmail(emailInput.trim());
      setInvoiceGeneratedData(null);
      setCustomCharges([]);
      setSearchParams({ email: emailInput.trim() });
    }
  };

  // Add custom line item
  const handleAddCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || newPrice <= 0) {
      toast.error("Please enter a valid description and price");
      return;
    }

    const newItem: CustomCharge = {
      id: `custom-${Date.now()}`,
      description: newDesc.trim(),
      category: newCategory,
      quantity: Math.max(1, newQty),
      unitPrice: Number(newPrice),
      taxRate: Number(newTaxRate),
    };

    setCustomCharges((prev) => [...prev, newItem]);
    setNewDesc("");
    setNewPrice(0);
    setNewQty(1);
    toast.success("Additional charge added to checkout folio");
  };

  const handleRemoveCharge = (id: string) => {
    setCustomCharges((prev) => prev.filter((c) => c.id !== id));
  };

  // Email invoice to guest
  const handleSendEmail = async () => {
    const invId = invoiceGeneratedData?.id || previewData?.existingInvoice?.id;
    if (!invId) {
      toast.error("Please generate the invoice before emailing the guest.");
      return;
    }

    try {
      setIsSendingEmail(true);
      const res = await adminService.sendInvoiceEmail(invId);
      toast.success(res.message || "Tax invoice sent to guest email successfully!");
    } catch {
      toast.error("Failed to dispatch invoice email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Dynamic calculations combining preview + custom charges
  const customSubtotal = customCharges.reduce((acc, c) => acc + c.quantity * c.unitPrice, 0);
  const customTax = customCharges.reduce(
    (acc, c) => acc + Math.round(c.quantity * c.unitPrice * (c.taxRate / 100)),
    0
  );

  const baseGrossSubtotal = previewData?.summary.grossSubtotal || 0;
  const baseTotalTax = previewData?.summary.totalTax || 0;
  const discount = previewData?.summary.discount || 0;
  const advancePaid = previewData?.summary.totalPaid || 0;

  const currentGrossSubtotal = baseGrossSubtotal + customSubtotal;
  const currentTotalTax = baseTotalTax + customTax;
  const currentGrandTotal = currentGrossSubtotal - discount + currentTotalTax;
  const currentBalanceDue = Math.max(0, currentGrandTotal - advancePaid);

  return (
    <div className="space-y-8 print:p-0 print:m-0">
      {/* Header bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#D9C7A3] font-medium tracking-wider uppercase mb-1">
            <Receipt className="w-3.5 h-3.5 text-[#D9C7A3]" /> Front Desk ERP • Departure Billing
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Official Invoice Generator
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Collect stay charges by guest email, aggregate room lodging, in-room dining, pre-booked extras, and generate official GST invoices.
          </p>
        </div>

        {invoiceGeneratedData && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 text-xs font-medium border border-white/10 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#D9C7A3]" /> Print / PDF
            </button>
            <button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#183C32] text-[#D9C7A3] hover:bg-[#315C4A] text-xs font-semibold border border-[#D9C7A3]/30 transition-colors disabled:opacity-50"
            >
              {isSendingEmail ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4 text-[#D9C7A3]" />
              )}
              Email to Guest
            </button>
          </div>
        )}
      </div>

      {/* Guest Email Lookup & Booking Selection (Hidden in Print) */}
      <div className="bg-[#12171C] rounded-2xl border border-white/10 p-6 space-y-5 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              Look Up Guest by Registered Email Address:
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="guest@heritageholdings.in or email..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#D9C7A3]"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-[#183C32] text-[#D9C7A3] hover:bg-[#315C4A] text-xs font-medium transition-colors"
              >
                Fetch Folio
              </button>
            </div>
          </form>

          {/* Quick Select Preset Email Chips */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
              Quick Select In-Residence & Recent Departures:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "V. Singhania (Suite 101)", email: "v.singhania@heritageholdings.in" },
                { label: "A. Deshmukh (Suite 102)", email: "ananya.deshmukh@gmail.com" },
                { label: "R. Mehra (Suite 103)", email: "rohan.mehra@techventures.co" },
                { label: "D. Rathore (Suite 107)", email: "rathore.devendra@royalmarwar.in" },
                { label: "A. Nambiar (Suite 111)", email: "arjun.nambiar@apexlegal.org" },
              ].map((chip) => (
                <button
                  key={chip.email}
                  type="button"
                  onClick={() => handleSelectPresetEmail(chip.email)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    selectedEmail === chip.email
                      ? "bg-[#D9C7A3] text-[#0B0F12] font-semibold"
                      : "bg-white/5 text-stone-300 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Guest Profile & Reservations Selection */}
        {isLookingUp ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-[#D9C7A3]" />
          </div>
        ) : availableBookings.length > 0 ? (
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Guest Details Card */}
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-[#D9C7A3] font-medium mb-1">
                <User className="w-3.5 h-3.5" /> Guest Profile
              </div>
              <p className="font-semibold text-white text-sm">
                {guestLookup?.user?.name || availableBookings[0].guestName || "Guest"}
              </p>
              <p className="text-stone-400">{selectedEmail}</p>
              {guestLookup?.user?.phone && (
                <p className="text-stone-400">{guestLookup.user.phone}</p>
              )}
            </div>

            {/* Select Specific Reservation */}
            <div className="md:col-span-2 p-4 rounded-xl bg-black/20 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 font-medium">Select Reservation for Billing:</span>
                <span className="text-[11px] text-stone-400">
                  {availableBookings.length} stay(s) found
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableBookings.map((b: any) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBookingId(b.id);
                      setInvoiceGeneratedData(null);
                    }}
                    className={`p-3 rounded-lg text-left text-xs transition-all border ${
                      selectedBookingId === b.id
                        ? "bg-[#183C32]/40 border-[#D9C7A3] text-white ring-1 ring-[#D9C7A3]"
                        : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#D9C7A3]">
                        #{b.confirmationNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          b.status === "CHECKED_OUT"
                            ? "bg-stone-800 text-stone-300"
                            : b.status === "CHECKED_IN"
                            ? "bg-blue-950 text-blue-300 border border-blue-800/40"
                            : "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="font-medium text-white mt-1">{b.room.name}</p>
                    <p className="text-[11px] text-stone-400">
                      Suite #{b.room.roomNumber} •{" "}
                      {b.checkIn ? safeFormatDate(b.checkIn, "d MMM") : ""} —{" "}
                      {b.checkOut ? safeFormatDate(b.checkOut, "d MMM yyyy") : ""}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-stone-400">
            No booking reservations found for {selectedEmail}. Please select another email or check spelling.
          </div>
        )}
      </div>

      {/* Main Aggregator & Official Invoice Preview */}
      {previewData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Aggregated Breakdown & Custom Adjustments (Hidden in Print) */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            {/* Status notice */}
            {previewData.booking.status === "CHECKED_IN" && (
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-start gap-3 text-xs text-blue-200">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold text-blue-100">Guest is Currently in Residence</strong>
                  Generating this invoice will automatically record the stay as Checked Out and finalize the bill.
                </div>
              </div>
            )}

            {/* 1. Room Charges Breakdown */}
            <div className="bg-[#12171C] rounded-2xl border border-white/10 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Building2 className="w-4 h-4 text-[#D9C7A3]" /> Suite Accommodation (SAC 996311)
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">18% GST Applicable</span>
              </div>
              <div className="space-y-1.5 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span>Suite:</span>
                  <span className="text-white font-medium">
                    {previewData.booking.room.name} (#{previewData.booking.room.roomNumber})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Stay Duration:</span>
                  <span>{previewData.roomCharges.nights} Night(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Tariff:</span>
                  <span>₹{previewData.roomCharges.nightlyRate.toLocaleString("en-IN")}/night</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5 font-medium text-white">
                  <span>Room Subtotal:</span>
                  <span>₹{previewData.roomCharges.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-[11px]">
                  <span>Lodging GST (18%):</span>
                  <span>₹{previewData.roomCharges.tax.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* 2. In-Room Dining & Kitchen Orders Breakdown */}
            <div className="bg-[#12171C] rounded-2xl border border-white/10 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <UtensilsCrossed className="w-4 h-4 text-[#D9C7A3]" /> In-Room Dining & POS Orders (SAC 996331)
                </div>
                <span className="text-[11px] text-amber-400 font-mono">5% GST Applicable</span>
              </div>

              {previewData.foodOrders.length === 0 ? (
                <p className="text-xs text-stone-500 py-2">No in-room dining orders placed during this stay.</p>
              ) : (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {previewData.foodOrders.map((order: any) => (
                    <div key={order.id} className="p-2.5 rounded-lg bg-black/20 border border-white/5 text-xs space-y-1.5">
                      <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                        <span>Ref: {order.orderNumber}</span>
                        <span className="text-emerald-400">{order.status}</span>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((it: any) => (
                          <div key={it.id} className="flex justify-between text-stone-300">
                            <span>
                              {it.quantity}x {it.dishName}
                            </span>
                            <span className="font-mono">₹{it.total.toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/5 flex justify-between text-xs font-medium text-white">
                    <span>Dining Subtotal:</span>
                    <span>₹{previewData.summary.foodSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-400">
                    <span>Food GST (5%):</span>
                    <span>₹{previewData.summary.foodTax.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Pre-Booked Stay Extras & Experiences */}
            <div className="bg-[#12171C] rounded-2xl border border-white/10 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Sparkles className="w-4 h-4 text-[#D9C7A3]" /> Pre-Booked Experiences (SAC 996339)
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">18% GST Applicable</span>
              </div>

              {previewData.extras.length === 0 ? (
                <p className="text-xs text-stone-500 py-2">No pre-booked mountain pursuits or extras.</p>
              ) : (
                <div className="space-y-1.5 text-xs text-stone-300">
                  {previewData.extras.map((ex: any) => (
                    <div key={ex.id} className="flex justify-between">
                      <span>
                        {ex.quantity}x {ex.name}
                      </span>
                      <span className="font-mono">₹{ex.total.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/5 flex justify-between font-medium text-white">
                    <span>Extras Subtotal:</span>
                    <span>₹{previewData.summary.extrasSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-400">
                    <span>Extras GST (18%):</span>
                    <span>₹{previewData.summary.extrasTax.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Add Additional Departure Charges Builder */}
            <div className="bg-[#12171C] rounded-2xl border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Plus className="w-4 h-4 text-[#D9C7A3]" /> Incidental Departure Charges
                </div>
                <span className="text-[10px] text-stone-400">Minibar, Spa, Laundry, Late Checkout</span>
              </div>

              {/* Form to add custom charge */}
              <form onSubmit={handleAddCharge} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Item Description:</label>
                  <input
                    type="text"
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="e.g., Premium Minibar Spirits, Express Laundry, Spa..."
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#D9C7A3]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Qty:</label>
                    <input
                      type="number"
                      min={1}
                      value={newQty}
                      onChange={(e) => setNewQty(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Unit Rate (₹):</label>
                    <input
                      type="number"
                      min={0}
                      value={newPrice || ""}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      placeholder="Amount"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">GST Slab:</label>
                    <select
                      value={newTaxRate}
                      onChange={(e) => setNewTaxRate(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-stone-300"
                    >
                      <option value={18}>18% (General)</option>
                      <option value={5}>5% (Dining)</option>
                      <option value={12}>12% (Services)</option>
                      <option value={0}>0% (Exempt)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-[#D9C7A3] border border-[#D9C7A3]/30 transition-colors"
                >
                  + Add Incidental Line Item
                </button>
              </form>

              {/* Added custom charges list */}
              {customCharges.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">
                    Added Incidental Items:
                  </span>
                  {customCharges.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2 rounded bg-black/30 text-xs text-stone-300"
                    >
                      <div>
                        <p className="font-medium text-white">{c.description}</p>
                        <span className="text-[10px] text-stone-400">
                          {c.quantity}x @ ₹{c.unitPrice} (+{c.taxRate}% GST)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white">
                          ₹{(c.quantity * c.unitPrice).toLocaleString("en-IN")}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCharge(c.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Settlement & Mode Selection */}
            <div className="bg-[#12171C] rounded-2xl border border-white/10 p-5 space-y-4">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Settlement & Payment Method
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Advance Online Paid:</span>
                  <span className="font-mono text-emerald-400">
                    -₹{advancePaid.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
                  <span>Net Balance Due:</span>
                  <span className="font-mono text-[#D9C7A3]">
                    ₹{currentBalanceDue.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1.5">
                  Select Settlement Method for Remaining Balance:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "CREDIT_CARD", label: "Credit / Debit Card" },
                    { id: "UPI", label: "UPI / QR Dynamic" },
                    { id: "CASH", label: "Front Desk Cash" },
                    { id: "ROOM_BILL", label: "Direct Corporate Bill" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMode(m.id as any)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                        paymentMode === m.id
                          ? "bg-[#183C32] border-[#D9C7A3] text-white"
                          : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="w-full py-3 rounded-xl bg-[#D9C7A3] text-[#0B0F12] font-semibold text-xs hover:bg-[#c9b58f] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B0F12]" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#0B0F12]" />
                )}
                Generate & Record Official Tax Invoice
              </button>
            </div>
          </div>

          {/* Right Column: Authentic Luxury Official Invoice Document */}
          <div className="lg:col-span-7 print:w-full print:m-0">
            <div className="bg-[#FAF7F0] text-[#1C1C1A] rounded-2xl border border-[#D9C7A3]/50 p-8 shadow-2xl space-y-6 print:border-none print:shadow-none print:p-0 print:bg-white">
              {/* Hotel Crest & Letterhead */}
              <div className="flex items-start justify-between border-b-2 border-[#183C32] pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-[#183C32] text-[#D9C7A3] font-serif font-bold text-base flex items-center justify-center shadow-sm">
                      N
                    </div>
                    <h1 className="font-serif text-2xl font-bold tracking-wider text-[#183C32] uppercase">
                      Hotel Newlands
                    </h1>
                  </div>
                  <p className="text-[11px] tracking-widest uppercase text-[#315C4A] font-semibold">
                    Colonial Himalayan Sanctuary • Est. 1928
                  </p>
                  <p className="text-[10px] text-[#1C1C1A]/70 mt-1">
                    The Mall Road, The Ridge, Shimla, Himachal Pradesh 171001
                  </p>
                  <p className="text-[10px] text-[#1C1C1A]/70">
                    GSTIN: <strong className="text-[#183C32]">02AAACN1234F1Z5</strong> • CIN: U55101HP1928PTC002819
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded bg-[#183C32] text-[#D9C7A3] text-[11px] font-mono font-bold tracking-wider uppercase inline-block mb-2">
                    Tax Invoice
                  </span>
                  <p className="font-mono text-xs font-bold text-[#183C32]">
                    {invoiceGeneratedData?.invoiceNumber ||
                      previewData.existingInvoice?.invoiceNumber ||
                      `NLS/2026/000${Math.floor(100 + Math.random() * 900)} (Draft)`}
                  </p>
                  <p className="text-[11px] text-[#1C1C1A]/60 mt-0.5">
                    Date: {safeFormatDate(new Date(), "dd MMMM yyyy")}
                  </p>
                  <p className="text-[11px] text-[#1C1C1A]/60">
                    Booking Ref: <strong className="font-mono">{previewData.booking.confirmationNumber}</strong>
                  </p>
                </div>
              </div>

              {/* Billed To / Stay Details */}
              <div className="grid grid-cols-2 gap-6 text-xs pb-4 border-b border-[#D9C7A3]/30">
                <div>
                  <span className="text-[10px] text-[#1C1C1A]/50 font-bold uppercase tracking-wider block mb-1">
                    Billed To (Guest Details):
                  </span>
                  <p className="font-bold text-sm text-[#183C32]">{previewData.booking.guestName}</p>
                  <p className="text-[#1C1C1A]/80">{previewData.booking.guestEmail}</p>
                  <p className="text-[#1C1C1A]/80">{previewData.booking.guestPhone}</p>
                  <p className="text-[10px] text-[#1C1C1A]/60 mt-1">
                    Registered Guest ID: {guestLookup?.user?.id?.slice(0, 12) || "GUEST-REG"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#1C1C1A]/50 font-bold uppercase tracking-wider block mb-1">
                    Stay & Suite Particulars:
                  </span>
                  <p className="font-semibold text-[#183C32]">
                    {previewData.booking.room.name} (Suite #{previewData.booking.room.roomNumber})
                  </p>
                  <p className="text-[#1C1C1A]/80">
                    Check-In: {safeFormatDate(previewData.booking.checkIn, "dd MMM yyyy")}, 2:00 PM
                  </p>
                  <p className="text-[#1C1C1A]/80">
                    Check-Out: {safeFormatDate(previewData.booking.checkOut, "dd MMM yyyy")}, 11:00 AM
                  </p>
                  <p className="text-[10px] text-[#1C1C1A]/60 mt-1">
                    Stay Duration: {previewData.roomCharges.nights} Night(s) • {previewData.booking.adults} Adults
                  </p>
                </div>
              </div>

              {/* Complete Itemized Line Items Table */}
              <div className="overflow-hidden rounded-xl border border-[#D9C7A3]/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#183C32] text-[#D9C7A3] font-semibold text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">Particulars / Description</th>
                      <th className="px-3 py-2.5 text-center">HSN/SAC</th>
                      <th className="px-3 py-2.5 text-center">Qty</th>
                      <th className="px-3 py-2.5 text-right">Unit Rate</th>
                      <th className="px-3 py-2.5 text-right">Taxable Amt</th>
                      <th className="px-3 py-2.5 text-right">GST %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9C7A3]/20 text-[11px]">
                    {/* Room tariff */}
                    <tr>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#183C32]">Suite Lodging Accommodation</p>
                        <span className="text-[10px] text-[#1C1C1A]/60">
                          {previewData.booking.room.name} ({previewData.roomCharges.nights} Night(s) @ ₹{previewData.roomCharges.nightlyRate}/night)
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-[10px]">996311</td>
                      <td className="px-3 py-3 text-center">{previewData.roomCharges.nights}</td>
                      <td className="px-3 py-3 text-right">₹{previewData.roomCharges.nightlyRate.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-3 text-right font-medium">₹{previewData.roomCharges.subtotal.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-3 text-right text-emerald-800 font-semibold">18%</td>
                    </tr>

                    {/* Pre-booked extras */}
                    {previewData.extras.map((ex: any) => (
                      <tr key={ex.id}>
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-[#183C32]">{ex.name}</p>
                          <span className="text-[10px] text-[#1C1C1A]/60">Estate Experience / Pursuit</span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-[10px]">996339</td>
                        <td className="px-3 py-2.5 text-center">{ex.quantity}</td>
                        <td className="px-3 py-2.5 text-right">₹{ex.unitPrice.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2.5 text-right font-medium">₹{ex.total.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2.5 text-right text-emerald-800 font-semibold">18%</td>
                      </tr>
                    ))}

                    {/* Food items from dining orders */}
                    {previewData.foodOrders.flatMap((order: any) =>
                      order.items.map((it: any) => (
                        <tr key={it.id}>
                          <td className="px-4 py-2">
                            <p className="text-[#1C1C1A]/90">
                              {it.dishName}
                              <span className="text-[9px] text-[#1C1C1A]/50 ml-1">({order.orderNumber})</span>
                            </p>
                          </td>
                          <td className="px-3 py-2 text-center font-mono text-[10px]">996331</td>
                          <td className="px-3 py-2 text-center">{it.quantity}</td>
                          <td className="px-3 py-2 text-right">₹{it.unitPrice.toLocaleString("en-IN")}</td>
                          <td className="px-3 py-2 text-right font-medium">₹{it.total.toLocaleString("en-IN")}</td>
                          <td className="px-3 py-2 text-right text-amber-800 font-semibold">5%</td>
                        </tr>
                      ))
                    )}

                    {/* Custom additional departure charges */}
                    {customCharges.map((c) => (
                      <tr key={c.id}>
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-[#183C32]">{c.description}</p>
                          <span className="text-[10px] text-[#1C1C1A]/60">Incidental Departure Settlement</span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-[10px]">996339</td>
                        <td className="px-3 py-2.5 text-center">{c.quantity}</td>
                        <td className="px-3 py-2.5 text-right">₹{c.unitPrice.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2.5 text-right font-medium">
                          ₹{(c.quantity * c.unitPrice).toLocaleString("en-IN")}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold">{c.taxRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Breakdowns & Totals Ledger */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* GST Slab Classification */}
                <div className="p-3.5 rounded-xl bg-[#F0EBE1] border border-[#D9C7A3]/40 text-[11px] space-y-1.5">
                  <span className="text-[10px] text-[#183C32] font-bold uppercase tracking-wider block">
                    Statutory GST Classification:
                  </span>
                  <div className="flex justify-between text-[#1C1C1A]/70">
                    <span>Lodging & Extras GST (18% - CGST 9% + SGST 9%):</span>
                    <span className="font-mono">
                      ₹{(previewData.summary.roomTax + previewData.summary.extrasTax + customTax).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#1C1C1A]/70">
                    <span>Restaurant F&B GST (5% - CGST 2.5% + SGST 2.5%):</span>
                    <span className="font-mono">
                      ₹{previewData.summary.foodTax.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#183C32] pt-1 border-t border-[#D9C7A3]/40">
                    <span>Total GST Collected:</span>
                    <span className="font-mono">₹{currentTotalTax.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Final Totals Table */}
                <div className="space-y-1.5 text-xs text-[#1C1C1A]/80">
                  <div className="flex justify-between">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono font-medium">₹{currentGrossSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Tax (GST):</span>
                    <span className="font-mono font-medium">₹{currentTotalTax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#183C32] pt-2 border-t-2 border-[#183C32]">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base">₹{currentGrandTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 text-[11px]">
                    <span>Less Advance Paid Online:</span>
                    <span className="font-mono">-₹{advancePaid.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-[#D9C7A3]/40">
                    <span className="text-[#183C32]">Balance Settled at Checkout:</span>
                    <span className="font-mono text-[#183C32]">
                      ₹{currentBalanceDue.toLocaleString("en-IN")} ({paymentMode})
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Paid Stamp & Signatory */}
              <div className="pt-6 border-t border-[#D9C7A3]/30 flex items-center justify-between text-[11px] text-[#1C1C1A]/60">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded border-2 border-emerald-700 text-emerald-800 font-bold tracking-widest uppercase text-xs">
                    PAID &amp; SETTLED
                  </div>
                  <span className="text-[10px]">Settled via Front Desk Folio</span>
                </div>

                <div className="text-right">
                  <p className="font-serif italic text-xs text-[#183C32]">For Hotel Newlands Shimla</p>
                  <p className="text-[9px] uppercase tracking-wider text-[#1C1C1A]/50 mt-4">Authorized Front Desk Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
