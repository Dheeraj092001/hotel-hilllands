import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Plus, Loader2, Edit3, Trash2, Globe, X, Check } from "lucide-react";
import { adminDestinationsService, AdminDestination } from "../services/admin.service";

const REGIONS = ["Himachal Pradesh", "Uttarakhand", "Ladakh", "Sikkim", "Arunachal Pradesh", "Other"];

function DestinationFormModal({ existing, onClose }: { existing?: AdminDestination; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: existing?.name ?? "",
    slug: existing?.slug ?? "",
    region: existing?.region ?? REGIONS[0],
    description: existing?.description ?? "",
    isPublished: existing?.isPublished ?? false,
    sortOrder: existing?.sortOrder ?? 0,
  });

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const mutation = useMutation({
    mutationFn: () =>
      existing ? adminDestinationsService.update(existing.id, form) : adminDestinationsService.create({ ...form, slug: form.slug || autoSlug(form.name) }),
    onSuccess: () => {
      toast.success(existing ? "Destination updated" : "Destination created");
      qc.invalidateQueries({ queryKey: ["adminDestinations"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? "Failed"),
  });

  const inp = "w-full rounded bg-white/5 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#D9C7A3]/50";
  const lbl = "block text-xs text-stone-400 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#12171C] border border-white/10 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="font-serif text-lg text-white">{existing ? "Edit Destination" : "New Destination"}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className={lbl}>Name *</label>
            <input className={inp} value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: existing ? f.slug : autoSlug(e.target.value) }))} />
          </div>
          <div>
            <label className={lbl}>Slug</label>
            <input className={inp} value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>Region</label>
            <select className={inp} value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Description</label>
            <textarea rows={3} className={`${inp} resize-none`} value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
              Published
            </label>
            <div className="flex items-center gap-2">
              <label className={lbl + " mb-0"}>Sort</label>
              <input type="number" className="w-16 rounded bg-white/5 border border-white/10 text-white text-sm px-2 py-1.5 focus:outline-none" value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-white/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-stone-400 hover:text-white">Cancel</button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !form.name}
            className="flex items-center gap-2 px-5 py-2 rounded bg-[#D9C7A3] text-[#0B0F12] text-sm font-semibold disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {existing ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DestinationsManagerPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; existing?: AdminDestination }>({ open: false });

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ["adminDestinations"],
    queryFn: adminDestinationsService.list,
  });

  const remove = useMutation({
    mutationFn: adminDestinationsService.remove,
    onSuccess: () => { toast.success("Destination deleted"); qc.invalidateQueries({ queryKey: ["adminDestinations"] }); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? "Cannot delete — may have tours linked"),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Destinations</h2>
          <p className="text-xs text-stone-400 mt-0.5">Manage Himalayan destinations shown on the tour website.</p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded bg-[#D9C7A3] text-[#0B0F12] text-sm font-semibold hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <div key={dest.id} className="bg-[#12171C] border border-white/10 rounded-xl p-5 hover:border-[#D9C7A3]/20 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#183C32] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#D9C7A3]" />
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setModal({ open: true, existing: dest })} className="p-1.5 rounded hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (confirm("Delete this destination?")) remove.mutate(dest.id); }}
                    className="p-1.5 rounded hover:bg-red-500/10 text-stone-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-1">{dest.name}</h3>
              {dest.region && <p className="text-xs text-stone-500 mb-2">{dest.region}</p>}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${dest.isPublished ? "bg-emerald-500/15 text-emerald-400" : "bg-stone-500/20 text-stone-400"}`}>
                  {dest.isPublished ? "Published" : "Draft"}
                </span>
                <span className="text-xs text-stone-500">{dest._count?.tours ?? 0} tours</span>
              </div>
            </div>
          ))}
          {destinations.length === 0 && (
            <div className="col-span-3 text-center py-12 text-stone-500">
              <Globe className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>No destinations yet. Create one above.</p>
            </div>
          )}
        </div>
      )}

      {modal.open && <DestinationFormModal existing={modal.existing} onClose={() => setModal({ open: false })} />}
    </div>
  );
}