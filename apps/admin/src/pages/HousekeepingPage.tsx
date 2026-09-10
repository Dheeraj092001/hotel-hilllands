import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sparkles, Plus, CheckCircle2, Clock, AlertCircle, Loader2, X } from "lucide-react";
import { adminService } from "../services/admin.service";

export default function HousekeepingPage() {
  const queryClient = useQueryClient();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("NORMAL");

  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["housekeepingRooms"],
    queryFn: () => adminService.getHousekeepingRooms(),
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["housekeepingTasks"],
    queryFn: () => adminService.getHousekeepingTasks(),
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateHousekeepingStatus(id, status),
    onSuccess: () => {
      toast.success("Room cleaning status updated");
      queryClient.invalidateQueries({ queryKey: ["housekeepingRooms"] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: () =>
      adminService.createHousekeepingTask({
        roomId: selectedRoomId,
        task: taskDesc,
        assignedTo,
        priority,
      }),
    onSuccess: () => {
      toast.success("Housekeeping task dispatched");
      setTaskModalOpen(false);
      setTaskDesc("");
      queryClient.invalidateQueries({ queryKey: ["housekeepingTasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateHousekeepingTask(id, { status }),
    onSuccess: () => {
      toast.success("Task updated");
      queryClient.invalidateQueries({ queryKey: ["housekeepingTasks"] });
    },
  });

  if (roomsLoading || tasksLoading) {
    return (
      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" /></div>
    );
  }

  const allRooms = rooms || [];
  const allTasks = tasks || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Housekeeping & Sanitization Board</h2>
          <p className="text-xs text-stone-400 mt-0.5">Live turnover tracking, linen inspections, and staff task dispatches.</p>
        </div>

        <button
          onClick={() => {
            if (allRooms.length > 0) setSelectedRoomId(allRooms[0].id);
            setTaskModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#183C32] text-[#D9C7A3] text-xs font-medium border border-[#D9C7A3]/30 hover:bg-[#315C4A]"
        >
          <Plus className="w-3.5 h-3.5" /> Dispatch Cleaning Task
        </button>
      </div>

      {/* Room Status Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {allRooms.map((r) => {
          const isClean = r.housekeepingStatus === "CLEAN";
          const isDirty = r.housekeepingStatus === "DIRTY";
          const isCleaning = r.housekeepingStatus === "CLEANING";

          return (
            <div
              key={r.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isClean
                  ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-200"
                  : isDirty
                  ? "bg-red-950/30 border-red-800/40 text-red-200"
                  : isCleaning
                  ? "bg-blue-950/30 border-blue-800/40 text-blue-200"
                  : "bg-amber-950/30 border-amber-800/40 text-amber-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm">#{r.roomNumber}</span>
                <span className="text-[10px] font-semibold uppercase">{r.housekeepingStatus}</span>
              </div>
              <p className="text-[11px] truncate opacity-80 mt-1">{r.name}</p>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() =>
                    updateRoomMutation.mutate({
                      id: r.id,
                      status: isClean ? "DIRTY" : "CLEAN",
                    })
                  }
                  className="text-[10px] underline opacity-90 hover:opacity-100"
                >
                  Mark {isClean ? "Dirty" : "Clean"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispatched Tasks Table */}
      <div className="bg-[#12171C] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Housekeeping Dispatches</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 text-stone-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3">Suite</th>
                <th className="px-5 py-3">Task Details</th>
                <th className="px-5 py-3">Assigned Staff</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allTasks.map((t) => (
                <tr key={t.id} className="hover:bg-white/5">
                  <td className="px-5 py-3.5 font-mono text-[#D9C7A3]">#{t.room?.roomNumber}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{t.task}</td>
                  <td className="px-5 py-3.5 text-stone-300">{t.assignedTo || "Unassigned Staff"}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-stone-300">
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        t.status === "COMPLETED"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                          : "bg-amber-950 text-amber-300 border border-amber-800/40"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {t.status !== "COMPLETED" ? (
                      <button
                        onClick={() => updateTaskMutation.mutate({ id: t.id, status: "COMPLETED" })}
                        className="text-xs text-emerald-400 hover:underline"
                      >
                        Complete Task
                      </button>
                    ) : (
                      <span className="text-xs text-stone-500">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Creation Modal */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12171C] rounded-2xl max-w-md w-full p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Dispatch Housekeeping Task</h3>
              <button onClick={() => setTaskModalOpen(false)} className="text-stone-400 hover:text-white">
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

              <div>
                <label className="block text-stone-300 mb-1">Task Description</label>
                <input
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Linen replacement, cedar polish, minibar restock..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Assigned Attendant</label>
                  <input
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Staff name"
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High (VIP Arrival)</option>
                    <option value="URGENT">Urgent Turnover</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button onClick={() => setTaskModalOpen(false)} className="px-3 py-1.5 rounded bg-white/5 text-stone-300 text-xs">
                Cancel
              </button>
              <button
                onClick={() => createTaskMutation.mutate()}
                disabled={!selectedRoomId || !taskDesc}
                className="px-4 py-1.5 rounded bg-[#183C32] text-[#D9C7A3] text-xs font-medium hover:bg-[#315C4A] disabled:opacity-50"
              >
                Dispatch Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
