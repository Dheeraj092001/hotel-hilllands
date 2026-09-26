import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Map, Plus, Loader2, Search, ChevronDown, ChevronUp,
  Eye, EyeOff, Star, Trash2, Edit3, X, Check
} from "lucide-react";
import { adminToursService, adminDestinationsService, AdminTour } from "../services/admin.service";

const TRAVEL_STYLES = ["Trekking", "Cultural", "Wildlife", "Family", "Adventure", "Luxury"];

const statusBadge = (published: boolean, featured: boolean) => (
  <div className="flex gap-1.5">
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${published ? "bg-emerald-500/15 text-emerald-400" : "bg-stone-500/20 text-stone-400"}`}>
      {published ? "Live" : "Draft"}
    </span>
    {featured && (
      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-400">
        Featured
      </span>
    )}
  </div>
);

function CreateTourModal({ destinations, onClose }: { destinations: { id: string; name: string }[]; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    destinationId: destinations[0]?.id ?? "",
    title: "", slug: "", travelStyle: "Trekking", durationDays: 7,
    maxGroup: 12, basePriceInr: "", summary: "",
    isPublished: false, isFeatured: false,
  });

  const createMutation = useMutation({
    mutationFn: () => adminToursService.create({ ...form, basePriceInr: form.basePriceInr ? Number(form.basePriceInr) : undefined }),
    onSuccess: () => {
      toast.success("Tour created!");
      qc.invalidateQueries({ queryKey: ["adminTours"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? "Failed to create tour"),
  });

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const inp = "w-full rounded bg-white/5 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#D9C7A3]/50";
  const lbl = "block text-xs text-stone-400 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#12171C] border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="font-serif text-lg text-white">New Tour</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className={lbl}>Title *</label>
            <input className={inp} value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: autoSlug(e.target.value) }))} />
          </div>
          <div>
            <label className={lbl}>Slug</label>
            <input className={inp} value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Destination *</label>
              <select className={inp} value={form.destinationId} onChange={(e) => setForm((f) => ({ ...f, destinationId: e.target.value }))}>
                {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Travel Style</label>
              <select className={inp} value={form.travelStyle} onChange={(e) => setForm((f) => ({ ...f, travelStyle: e.target.value }))}>
                {TRAVEL_STYLES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={lbl}>Duration (days)</label>
              <input type="number" min={1} className={inp} value={form.durationDays}
                onChange={(e) => setForm((f) => ({ ...f, durationDays: Number(e.target.value) }))} />
            </div>
            <div>
              <label className={lbl}>Max Group</label>
              <input type="number" min={1} className={inp} value={form.maxGroup}
                onChange={(e) => setForm((f) => ({ ...f, maxGroup: Number(e.target.value) }))} />
            </div>
            <div>
              <label className={lbl}>Base Price (₹)</label>
              <input type="number" min={0} className={inp} value={form.basePriceInr}
                onChange={(e) => setForm((f) => ({ ...f, basePriceInr: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className={lbl}>Summary</label>
            <textarea rows={3} className={`${inp} resize-none`} value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
              Publish immediately
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} />
              Featured
            </label>
          </div>
        </div>
        <div className="p-5 border-t border-white/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-stone-400 hover:text-white">Cancel</button>
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !form.title || !form.destinationId}
            className="flex items-center gap-2 px-5 py-2 rounded bg-[#D9C7A3] text-[#0B0F12] text-sm font-semibold disabled:opacity-50"
          >
            {createMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Create Tour
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ToursManagerPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { data: toursData, isLoading: toursLoading } = useQuery({
    queryKey: ["adminTours", page, styleFilter],
    queryFn: () => adminToursService.list({ page, limit: 15, travelStyle: styleFilter === "All" ? undefined : styleFilter }),
  });

  const { data: destinations = [] } = useQuery({
    queryKey: ["adminDestinationsList"],
    queryFn: () => adminDestinationsService.list(),
  });

  const togglePublish = useMutation({
    mutationFn: (tour: AdminTour) => adminToursService.update(tour.id, { isPublished: !tour.isPublished }),
    onSuccess: () => { toast.success("Tour updated"); qc.invalidateQueries({ queryKey: ["adminTours"] }); },
  });

  const toggleFeatured = useMutation({
    mutationFn: (tour: AdminTour) => adminToursService.update(tour.id, { isFeatured: !tour.isFeatured }),
    onSuccess: () => { toast.success("Tour updated"); qc.invalidateQueries({ queryKey: ["adminTours"] }); },
  });

  const removeTour = useMutation({
    mutationFn: (id: string) => adminToursService.remove(id),
    onSuccess: () => { toast.success("Tour deleted"); qc.invalidateQueries({ queryKey: ["adminTours"] }); },
  });

  const tours = toursData?.data ?? [];
  const meta = toursData?.meta;
  const filtered = search ? tours.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())) : tours;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Tours Manager</h2>
          <p className="text-xs text-stone-400 mt-0.5">Create and manage Himalayan tour packages.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded bg-[#D9C7A3] text-[#0B0F12] text-sm font-semibold hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Tour
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <input
            type="search"
            placeholder="Search tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm placeholder:text-stone-500 focus:outline-none focus:border-[#D9C7A3]/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...TRAVEL_STYLES].map((s) => (
            <button key={s} onClick={() => { setStyleFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${styleFilter === s ? "bg-[#183C32] text-[#D9C7A3] border border-[#D9C7A3]/40" : "bg-white/5 text-stone-400 hover:text-white border border-white/10"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {toursLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" /></div>
      ) : (
        <div className="bg-[#12171C] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Tour</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Style</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Duration</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Price</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-stone-500">No tours found.</td></tr>
              ) : (
                filtered.map((tour) => (
                  <tr key={tour.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium text-sm line-clamp-1">{tour.title}</p>
                        <p className="text-stone-500 text-xs">{tour.destination.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#183C32]/60 text-[#D9C7A3]">{tour.travelStyle ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-stone-300 text-xs">
                      {tour.durationDays ? `${tour.durationDays}D` : "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-stone-300 text-xs">
                      {tour.basePriceInr ? `₹${Number(tour.basePriceInr).toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-4 py-3">{statusBadge(tour.isPublished, tour.isFeatured)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => togglePublish.mutate(tour)}
                          title={tour.isPublished ? "Unpublish" : "Publish"}
                          className="p-1.5 rounded hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
                        >
                          {tour.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => toggleFeatured.mutate(tour)}
                          title={tour.isFeatured ? "Unfeature" : "Feature"}
                          className={`p-1.5 rounded hover:bg-white/10 transition-colors ${tour.isFeatured ? "text-amber-400" : "text-stone-400 hover:text-amber-400"}`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm("Delete this tour?")) removeTour.mutate(tour.id); }}
                          className="p-1.5 rounded hover:bg-red-500/10 text-stone-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-white/10">
              <span className="text-xs text-stone-400">{meta.total} tours</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded border border-white/10 text-xs text-stone-400 hover:text-white disabled:opacity-40">Prev</button>
                <span className="px-3 py-1 text-xs text-stone-300">{page}/{meta.totalPages}</span>
                <button disabled={page === meta.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded border border-white/10 text-xs text-stone-400 hover:text-white disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {showCreate && <CreateTourModal destinations={destinations} onClose={() => setShowCreate(false)} />}
    </div>
  );
}