import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BedDouble, Plus, ShieldAlert, Loader2, X, Check } from "lucide-react";
import { adminService, AdminRoom } from "../services/admin.service";

export default function RoomsPage() {
  const queryClient = useQueryClient();
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["adminRoomsList"],
    queryFn: () => adminService.getRooms(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateRoomStatus(id, status),
    onSuccess: () => {
      toast.success("Room status updated");
      queryClient.invalidateQueries({ queryKey: ["adminRoomsList"] });
    },
  });

  const blockMutation = useMutation({
    mutationFn: () =>
      adminService.createRoomBlock({
        roomId: selectedRoomId,
        startDate,
        endDate,
        reason,
      }),
    onSuccess: () => {
      toast.success("Room blocked for maintenance");
      setBlockModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["adminRoomsList"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to block room");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" /></div>
    );
  }

  const allRooms = rooms || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Suites & Inventory</h2>
          <p className="text-xs text-stone-400 mt-0.5">Manage physical keys, baseline tariffs, and maintenance holds.</p>
        </div>

        <button
          onClick={() => {
            if (allRooms.length > 0) setSelectedRoomId(allRooms[0].id);
            setBlockModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#183C32] text-[#D9C7A3] text-xs font-medium border border-[#D9C7A3]/30 hover:bg-[#315C4A]"
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Maintenance Hold
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRooms.map((r) => (
          <div key={r.id} className="bg-[#12171C] rounded-2xl border border-white/10 p-5 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#D9C7A3] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  Suite #{r.roomNumber}
                </span>
                <h3 className="font-serif text-lg font-bold text-white mt-1.5">{r.name}</h3>
                <p className="text-xs text-stone-400">{r.type?.name} • Floor {r.floor}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  r.status === "AVAILABLE"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                    : r.status === "OCCUPIED"
                    ? "bg-blue-950 text-blue-300 border border-blue-800/40"
                    : "bg-red-950 text-red-300 border border-red-800/40"
                }`}
              >
                {r.status}
              </span>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Base Tariff</span>
                <span className="font-bold text-white">₹{Number(r.basePrice).toLocaleString("en-IN")} / night</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Housekeeping</span>
                <span className="text-stone-300 font-medium">{r.housekeepingStatus}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
              <span className="text-[11px] text-stone-400">Toggle Status:</span>
              <div className="flex items-center gap-1.5">
                {(["AVAILABLE", "MAINTENANCE", "BLOCKED"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => statusMutation.mutate({ id: r.id, status: st })}
                    disabled={r.status === st}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      r.status === st
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-stone-400 hover:text-white"
                    }`}
                  >
                    {st.charAt(0) + st.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Maintenance Block Modal */}
      {blockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12171C] rounded-2xl max-w-md w-full p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Schedule Maintenance Hold</h3>
              <button onClick={() => setBlockModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Select Suite</label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                >
                  {allRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      #{r.roomNumber} - {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Reason for Hold</label>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Timber restoration, plumbing inspection, etc."
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setBlockModalOpen(false)}
                className="px-3 py-1.5 rounded bg-white/5 text-stone-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => blockMutation.mutate()}
                disabled={!selectedRoomId || !startDate || !endDate || !reason}
                className="px-4 py-1.5 rounded bg-[#183C32] text-[#D9C7A3] text-xs font-medium hover:bg-[#315C4A] disabled:opacity-50"
              >
                Create Maintenance Hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
