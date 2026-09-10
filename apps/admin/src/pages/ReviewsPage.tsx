import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Star, Check, X as XIcon, MessageSquare, Loader2, Sparkles } from "lucide-react";
import { adminService, ReviewItem } from "../services/admin.service";

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState("");
  const [replyText, setReplyText] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["adminReviews", statusFilter],
    queryFn: () => adminService.getReviews(statusFilter !== "ALL" ? statusFilter : undefined),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateReviewStatus(id, status),
    onSuccess: () => {
      toast.success("Review status updated");
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: () => adminService.replyToReview(selectedReviewId, replyText),
    onSuccess: () => {
      toast.success("Reply published to guest review");
      setReplyModalOpen(false);
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" /></div>
    );
  }

  const allReviews = reviews || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Reviews Moderation & Host Replies</h2>
          <p className="text-xs text-stone-400 mt-0.5">Moderate guest reflections, publish official host responses, and verify testimonials.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#12171C] p-1 rounded-xl border border-white/10">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st ? "bg-[#183C32] text-[#D9C7A3]" : "text-stone-400 hover:text-white"
              }`}
            >
              {st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {allReviews.map((r) => (
          <div key={r.id} className="bg-[#12171C] rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <span className="font-medium text-white text-sm">{r.user?.name || "Estate Guest"}</span>
                <span className="text-xs text-stone-400 ml-2">
                  for {r.booking?.room?.name} (#{r.booking?.confirmationNumber})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= r.overallRating ? "fill-amber-400 text-amber-400" : "text-stone-600"}`}
                    />
                  ))}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  r.status === "APPROVED" ? "bg-emerald-950 text-emerald-300" : "bg-amber-950 text-amber-300"
                }`}>
                  {r.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed italic">"{r.comment}"</p>

            {r.adminReply && (
              <div className="bg-black/30 p-3 rounded-lg border-l-2 border-[#D9C7A3] text-xs">
                <span className="font-bold text-[#D9C7A3] block text-[11px]">Official Estate Response:</span>
                <p className="text-stone-300 mt-0.5">{r.adminReply}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span className="text-stone-500">{format(new Date(r.createdAt), "dd MMMM yyyy")}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedReviewId(r.id);
                    setReplyText(r.adminReply || "");
                    setReplyModalOpen(true);
                  }}
                  className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-stone-300 text-[11px] inline-flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" /> Reply as Host
                </button>
                {r.status !== "APPROVED" && (
                  <button
                    onClick={() => statusMutation.mutate({ id: r.id, status: "APPROVED" })}
                    className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 text-[11px] hover:bg-emerald-900"
                  >
                    Approve
                  </button>
                )}
                {r.status !== "REJECTED" && (
                  <button
                    onClick={() => statusMutation.mutate({ id: r.id, status: "REJECTED" })}
                    className="px-2.5 py-1 rounded bg-red-950 text-red-300 text-[11px] hover:bg-red-900"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12171C] rounded-2xl max-w-md w-full p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Host Reflection & Reply</h3>
              <button onClick={() => setReplyModalOpen(false)} className="text-stone-400 hover:text-white">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-stone-300 text-xs mb-1">Estate Official Response</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Thank you for staying with us at Hotel Newlands Shimla..."
                className="w-full p-3 rounded-lg bg-[#0B0F12] border border-white/10 text-xs text-white"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button onClick={() => setReplyModalOpen(false)} className="px-3 py-1.5 rounded bg-white/5 text-stone-300 text-xs">
                Cancel
              </button>
              <button
                onClick={() => replyMutation.mutate()}
                disabled={!replyText}
                className="px-4 py-1.5 rounded bg-[#183C32] text-[#D9C7A3] text-xs font-medium hover:bg-[#315C4A] disabled:opacity-50"
              >
                Publish Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
