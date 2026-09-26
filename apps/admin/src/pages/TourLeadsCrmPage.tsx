import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Inbox,
  Search,
  Phone,
  Mail,
  Calendar,
  Users,
  MapPin,
  Compass,
  ArrowRight,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  adminTourLeadsService,
  adminToursService,
  AdminTourLead,
  AdminTour,
} from "../services/admin.service";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  CONTACTED: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  QUALIFIED: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  PROPOSAL_SENT: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  CONVERTED: "bg-teal-500/15 text-teal-300 border border-teal-500/30",
  CLOSED_LOST: "bg-stone-500/20 text-stone-400 border border-stone-500/30",
};

const TABS = [
  { id: "ALL", label: "All Enquiries" },
  { id: "NEW", label: "New / Unread" },
  { id: "CONTACTED", label: "Contacted" },
  { id: "QUALIFIED", label: "Qualified" },
  { id: "PROPOSAL_SENT", label: "Proposal Sent" },
  { id: "CONVERTED", label: "Converted" },
  { id: "CLOSED_LOST", label: "Lost" },
];

export default function TourLeadsCrmPage() {
  const qc = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [activeLead, setActiveLead] = useState<AdminTourLead | null>(null);
  const [convertLead, setConvertLead] = useState<AdminTourLead | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminTourLeads", selectedTab, search],
    queryFn: () =>
      adminTourLeadsService.list({
        status: selectedTab === "ALL" ? undefined : selectedTab,
        search: search.trim() || undefined,
        limit: 50,
      }),
  });

  const leads = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  // Counters
  const newCount = leads.filter((l) => l.lead.status === "NEW").length;
  const contactedCount = leads.filter((l) => l.lead.status === "CONTACTED" || l.lead.status === "QUALIFIED").length;
  const convertedCount = leads.filter((l) => l.lead.status === "CONVERTED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold tracking-wide text-white">
              Tour Leads & Inquiries CRM
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#183C32] text-[#D9C7A3] border border-[#D9C7A3]/30">
              Live Pipeline
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Incoming public inquiries from Fayul Retreat website, automated conversion to tour bookings, and follow-up ledger.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12171C] border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span>Total Enquiries</span>
            <Inbox className="w-4 h-4 text-[#D9C7A3]" />
          </div>
          <p className="text-2xl font-bold font-serif text-white">{total}</p>
          <p className="text-[11px] text-stone-500 mt-1">All captured leads</p>
        </div>

        <div className="bg-[#12171C] border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
            <span>Action Required</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-amber-300">{newCount}</p>
          <p className="text-[11px] text-stone-500 mt-1">New uncontacted leads</p>
        </div>

        <div className="bg-[#12171C] border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-blue-400 mb-1">
            <span>Active Follow-ups</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-blue-300">{contactedCount}</p>
          <p className="text-[11px] text-stone-500 mt-1">In communication</p>
        </div>

        <div className="bg-[#12171C] border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
            <span>Converted to Bookings</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-emerald-300">{convertedCount}</p>
          <p className="text-[11px] text-stone-500 mt-1">Won reservations</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-[#12171C] border border-white/10 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedTab === tab.id
                    ? "bg-[#183C32] text-[#D9C7A3] font-semibold border border-[#D9C7A3]/40 shadow-sm"
                    : "text-stone-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search name, phone, destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D9C7A3]/50"
            />
          </div>
        </div>

        {/* Leads Table */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#D9C7A3]" />
            <p className="text-xs">Loading inquiry pipeline...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <Inbox className="w-10 h-10 mx-auto text-stone-600 mb-2" />
            <p className="text-sm font-medium text-white">No inquiries found</p>
            <p className="text-xs text-stone-500 mt-1">
              Public inquiries submitted via the web-tour form will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-stone-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-4 font-medium">Guest / Contact</th>
                  <th className="py-3 px-4 font-medium">Interest & Destination</th>
                  <th className="py-3 px-4 font-medium">Travel Plan</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Received</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {leads.map((item) => {
                  const lead = item.lead;
                  const phoneClean = lead.phone?.replace(/[^0-9]/g, "") || "";
                  const waNumber = phoneClean.startsWith("91")
                    ? phoneClean
                    : `91${phoneClean}`;
                  const waMsg = encodeURIComponent(
                    `Hello ${lead.name}! Greetings from Fayul Retreat / Himalayas Tour & Travel. We received your enquiry for ${
                      item.destination || lead.subject || "our Himalayan journeys"
                    }. How can we assist you with your travel plan?`
                  );

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Guest Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white text-sm">{lead.name}</div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-stone-400">
                          {lead.phone && (
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-[#D9C7A3]" /> {lead.phone}
                            </span>
                          )}
                          {lead.email && !lead.email.includes("@noreply") && (
                            <span className="flex items-center gap-1 truncate max-w-[150px]">
                              <Mail className="w-3 h-3 text-[#D9C7A3]" /> {lead.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Interest & Destination */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-stone-200 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#D9C7A3]" />
                          <span>{item.destination || "Himachal Explorer"}</span>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                          {lead.subject || item.travelStyle || "Custom Journey"}
                        </div>
                      </td>

                      {/* Travel Plan Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 text-[11px] text-stone-300">
                          {(item.travelMonth || lead.travelDate) && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-stone-400" />
                              {item.travelMonth ||
                                new Date(lead.travelDate!).toLocaleDateString("en-IN", {
                                  month: "short",
                                  year: "numeric",
                                })}
                            </span>
                          )}
                          {(item.groupSize || lead.numberOfGuests) && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-stone-400" />
                              {item.groupSize || lead.numberOfGuests} guests
                            </span>
                          )}
                        </div>
                        {item.budgetBand && (
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-stone-300">
                            Budget: {item.budgetBand}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            STATUS_COLORS[lead.status] || "bg-stone-500/20 text-stone-300"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      {/* Received Date */}
                      <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Direct WhatsApp button */}
                          {phoneClean && (
                            <a
                              href={`https://wa.me/${waNumber}?text=${waMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp"
                              className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Direct Call button */}
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              title="Call Guest"
                              className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Convert to Tour Booking button */}
                          {lead.status !== "CONVERTED" && (
                            <button
                              onClick={() => setConvertLead(item)}
                              title="Convert to Tour Booking"
                              className="px-2.5 py-1 rounded-lg bg-[#183C32] hover:bg-[#1f4c3f] text-[#D9C7A3] font-medium text-[11px] border border-[#D9C7A3]/30 transition-all flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Convert</span>
                            </button>
                          )}

                          {/* Manage / Details drawer button */}
                          <button
                            onClick={() => setActiveLead(item)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 font-medium text-[11px] transition-all flex items-center gap-1"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Details Drawer */}
      {activeLead && (
        <LeadDetailDrawer
          leadItem={activeLead}
          onClose={() => setActiveLead(null)}
          onConverted={() => {
            setActiveLead(null);
            refetch();
          }}
        />
      )}

      {/* Convert to Booking Modal */}
      {convertLead && (
        <ConvertToBookingModal
          leadItem={convertLead}
          onClose={() => setConvertLead(null)}
          onSuccess={() => {
            setConvertLead(null);
            refetch();
            qc.invalidateQueries({ queryKey: ["adminTourBookings"] });
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Lead Detail & Activity Drawer
// ─────────────────────────────────────────────────────────────
function LeadDetailDrawer({
  leadItem,
  onClose,
  onConverted,
}: {
  leadItem: AdminTourLead;
  onClose: () => void;
  onConverted: () => void;
}) {
  const qc = useQueryClient();
  const lead = leadItem.lead;
  const [status, setStatus] = useState(lead.status);
  const [note, setNote] = useState("");

  const updateStatusMutation = useMutation({
    mutationFn: () => adminTourLeadsService.updateStatus(lead.id, status, note || undefined),
    onSuccess: () => {
      toast.success("Lead status updated successfully");
      qc.invalidateQueries({ queryKey: ["adminTourLeads"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err.message || "Failed to update lead");
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/70 backdrop-blur-xs">
      <div className="bg-[#12171C] border-l border-white/10 w-full max-w-lg h-full overflow-y-auto flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#12171C] z-10">
            <div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  STATUS_COLORS[lead.status] || "bg-stone-500/20 text-stone-300"
                }`}
              >
                {lead.status}
              </span>
              <h2 className="font-serif text-lg font-bold text-white mt-1">{lead.name}</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#D9C7A3] uppercase tracking-wider">
                Contact & Preferences
              </h4>
              <div className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-2.5 text-xs text-stone-300">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="font-mono text-white">{lead.phone || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Email:</span>
                  <span className="text-white">{lead.email || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Destination:</span>
                  <span className="text-[#D9C7A3] font-medium">{leadItem.destination || "General"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Travel Style:</span>
                  <span>{leadItem.travelStyle || "Custom"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Travel Month:</span>
                  <span>{leadItem.travelMonth || "Flexible"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Group Size:</span>
                  <span>{leadItem.groupSize || lead.numberOfGuests || "Flexible"} guests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Budget:</span>
                  <span>{leadItem.budgetBand || "Standard"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Source:</span>
                  <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-stone-300">
                    {leadItem.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Submitted Message */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#D9C7A3] uppercase tracking-wider">
                Inquiry Message
              </h4>
              <div className="p-4 rounded-xl bg-white/3 border border-white/5 text-xs text-stone-200 leading-relaxed italic">
                "{lead.message || "No special note provided"}"
              </div>
            </div>

            {/* CRM Status & Notes Update */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <h4 className="text-xs font-semibold text-[#D9C7A3] uppercase tracking-wider">
                Update Lead Status
              </h4>

              <div className="space-y-1.5">
                <label className="text-[11px] text-stone-400">Pipeline Stage</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-xs px-3 py-2.5 focus:outline-none focus:border-[#D9C7A3]/50"
                >
                  <option value="NEW">NEW — Uncontacted</option>
                  <option value="CONTACTED">CONTACTED — Reached out via WhatsApp/Phone</option>
                  <option value="QUALIFIED">QUALIFIED — Dates & Budget confirmed</option>
                  <option value="PROPOSAL_SENT">PROPOSAL_SENT — Itinerary & Quote sent</option>
                  <option value="CONVERTED">CONVERTED — Booking confirmed</option>
                  <option value="CLOSED_LOST">CLOSED_LOST — Did not proceed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-stone-400">Add Internal Note / Call Summary</label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Called guest, interested in 5-day Spiti tour in October, 2 adults..."
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-xs px-3 py-2 focus:outline-none focus:border-[#D9C7A3]/50 resize-none"
                />
              </div>

              <button
                onClick={() => updateStatusMutation.mutate()}
                disabled={updateStatusMutation.isPending}
                className="w-full py-2.5 rounded-lg bg-[#183C32] hover:bg-[#1f4c3f] text-[#D9C7A3] text-xs font-semibold border border-[#D9C7A3]/30 transition-all flex items-center justify-center gap-2"
              >
                {updateStatusMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Save Stage & Note</span>
              </button>
            </div>

            {/* Notes History */}
            {lead.notes && lead.notes.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="text-xs font-semibold text-[#D9C7A3] uppercase tracking-wider">
                  Activity Timeline ({lead.notes.length})
                </h4>
                <div className="space-y-2">
                  {lead.notes.map((n) => (
                    <div key={n.id} className="p-3 rounded-lg bg-white/2 border border-white/5 text-xs">
                      <p className="text-stone-300">{n.note}</p>
                      <div className="flex items-center justify-between text-[10px] text-stone-500 mt-2">
                        <span>by {n.createdBy}</span>
                        <span>{new Date(n.createdAt).toLocaleDateString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#12171C] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs text-stone-400 hover:text-white hover:bg-white/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Convert to Tour Booking Modal
// ─────────────────────────────────────────────────────────────
function ConvertToBookingModal({
  leadItem,
  onClose,
  onSuccess,
}: {
  leadItem: AdminTourLead;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const lead = leadItem.lead;

  // Fetch all tour packages for dropdown
  const { data: toursData } = useQuery({
    queryKey: ["adminToursForConvert"],
    queryFn: () => adminToursService.list({ limit: 100 }),
  });

  const tours = toursData?.data ?? [];

  const [tourId, setTourId] = useState(leadItem.tourId || tours[0]?.id || "");
  const [totalAmount, setTotalAmount] = useState(
    tours.find((t) => t.id === tourId)?.basePriceInr || 25000
  );
  const [adults, setAdults] = useState(leadItem.groupSize || lead.numberOfGuests || 2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState(lead.message || "");

  // Update totalAmount when tour selection changes
  const handleTourChange = (selectedId: string) => {
    setTourId(selectedId);
    const selected = tours.find((t) => t.id === selectedId);
    if (selected?.basePriceInr) {
      setTotalAmount(Number(selected.basePriceInr) * adults);
    }
  };

  const convertMutation = useMutation({
    mutationFn: () =>
      adminTourLeadsService.convertToBooking(lead.id, {
        tourId,
        totalAmount: Number(totalAmount),
        guestName: lead.name,
        guestPhone: lead.phone || "",
        guestEmail: lead.email?.includes("@noreply") ? undefined : lead.email,
        adults: Number(adults),
        children: Number(children),
        specialRequests,
      }),
    onSuccess: (booking) => {
      toast.success(
        `Converted! Booking #${booking.confirmationNumber} generated.`
      );
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to convert lead to booking"
      );
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#12171C] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#183C32] text-[#D9C7A3] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">Convert Enquiry to Tour Booking</h3>
              <p className="text-[11px] text-stone-400">Creates a confirmed reservation linked to this lead</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Guest pre-fill summary */}
          <div className="p-3 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white text-sm">{lead.name}</span>
              <p className="text-[11px] text-stone-400 font-mono mt-0.5">{lead.phone || "No phone"} • {lead.email}</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#183C32] text-[#D9C7A3]">
              {leadItem.destination || "Himalayas"}
            </span>
          </div>

          {/* Tour Selection */}
          <div className="space-y-1.5">
            <label className="text-stone-300 font-medium">Select Tour Package *</label>
            <select
              value={tourId}
              onChange={(e) => handleTourChange(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2.5 focus:outline-none focus:border-[#D9C7A3]/50"
            >
              {tours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.durationDays}D) — ₹{Number(t.basePriceInr).toLocaleString("en-IN")}
                </option>
              ))}
            </select>
          </div>

          {/* Travelers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Adults</label>
              <input
                type="number"
                min={1}
                value={adults}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAdults(val);
                  const selected = tours.find((t) => t.id === tourId);
                  if (selected?.basePriceInr) {
                    setTotalAmount(Number(selected.basePriceInr) * val);
                  }
                }}
                className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#D9C7A3]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Children</label>
              <input
                type="number"
                min={0}
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#D9C7A3]/50"
              />
            </div>
          </div>

          {/* Total Amount */}
          <div className="space-y-1.5">
            <label className="text-stone-300 font-medium">Agreed Package Price (₹ INR) *</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-[#D9C7A3] font-bold text-sm px-3 py-2 focus:outline-none focus:border-[#D9C7A3]/50"
            />
          </div>

          {/* Special Requests */}
          <div className="space-y-1.5">
            <label className="text-stone-300 font-medium">Special Requests & Inclusions</label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#D9C7A3]/50 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#12171C] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs text-stone-400 hover:text-white hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => convertMutation.mutate()}
            disabled={convertMutation.isPending || !tourId}
            className="px-5 py-2.5 rounded-lg bg-[#183C32] hover:bg-[#1f4c3f] text-[#D9C7A3] text-xs font-semibold border border-[#D9C7A3]/30 transition-all flex items-center gap-2"
          >
            {convertMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Confirm & Generate Booking</span>
          </button>
        </div>
      </div>
    </div>
  );
}
