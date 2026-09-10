import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { Star, MessageSquare, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { dashboardService } from "../../services/dashboard.service";

export default function MyReviewsPage() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const preselectedBookingId = searchParams.get("bookingId") || "";

  const [bookingId, setBookingId] = useState(preselectedBookingId);
  const [overallRating, setOverallRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [locationRating, setLocationRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["myReviews"],
    queryFn: () => dashboardService.getMyReviews(),
  });

  const { data: bookings } = useQuery({
    queryKey: ["myBookings"],
    queryFn: () => dashboardService.getMyBookings(),
  });

  const reviewMutation = useMutation({
    mutationFn: () =>
      dashboardService.createReview({
        bookingId,
        overallRating,
        cleanlinessRating,
        serviceRating,
        locationRating,
        foodRating,
        valueRating,
        comment,
      }),
    onSuccess: () => {
      toast.success("Thank you! Your review has been submitted.");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit review");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      toast.error("Please select a reservation to review");
      return;
    }
    if (comment.length < 20) {
      toast.error("Please share at least 20 characters in your testimonial");
      return;
    }
    reviewMutation.mutate();
  };

  const renderStars = (rating: number, onChange?: (r: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => onChange?.(s)}
            disabled={!onChange}
            className={`p-0.5 ${onChange ? "cursor-pointer" : "cursor-default"}`}
          >
            <Star
              className={`w-4 h-4 ${
                s <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-serif text-xl font-bold text-[#183C32]">Stay Reviews & Reflections</h2>
        <p className="text-xs text-[#1C1C1A]/60 mt-0.5">Share your experience of the cedar hearth, mountain trails, and estate hospitality.</p>
      </div>

      {/* Review submission box */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-[#D9C7A3]/30 shadow-sm space-y-6">
        <h3 className="font-serif text-base font-bold text-[#183C32] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D9C7A3]" /> Share a Review for a Completed Stay
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#183C32] mb-1.5">Select Completed Stay *</label>
            <select
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9C7A3]/50 text-xs focus:ring-1 focus:ring-[#183C32] bg-white"
            >
              <option value="">-- Choose Reservation --</option>
              {bookings?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.room?.name} ({b.confirmationNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183C32] mb-1.5">Overall Satisfaction</label>
            <div className="py-2">{renderStars(overallRating, setOverallRating)}</div>
          </div>
        </div>

        {/* Rating categories */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="bg-[#F7F3EA]/50 p-2.5 rounded-lg border border-[#D9C7A3]/30 text-center">
            <span className="text-[11px] font-medium text-[#183C32] block mb-1">Cleanliness</span>
            <div className="flex justify-center">{renderStars(cleanlinessRating, setCleanlinessRating)}</div>
          </div>
          <div className="bg-[#F7F3EA]/50 p-2.5 rounded-lg border border-[#D9C7A3]/30 text-center">
            <span className="text-[11px] font-medium text-[#183C32] block mb-1">Service</span>
            <div className="flex justify-center">{renderStars(serviceRating, setServiceRating)}</div>
          </div>
          <div className="bg-[#F7F3EA]/50 p-2.5 rounded-lg border border-[#D9C7A3]/30 text-center">
            <span className="text-[11px] font-medium text-[#183C32] block mb-1">Location</span>
            <div className="flex justify-center">{renderStars(locationRating, setLocationRating)}</div>
          </div>
          <div className="bg-[#F7F3EA]/50 p-2.5 rounded-lg border border-[#D9C7A3]/30 text-center">
            <span className="text-[11px] font-medium text-[#183C32] block mb-1">Dining</span>
            <div className="flex justify-center">{renderStars(foodRating, setFoodRating)}</div>
          </div>
          <div className="bg-[#F7F3EA]/50 p-2.5 rounded-lg border border-[#D9C7A3]/30 text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-[#183C32] block mb-1">Value</span>
            <div className="flex justify-center">{renderStars(valueRating, setValueRating)}</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#183C32] mb-1.5">Your Experience & Memories *</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Describe the ambiance, cedar views, hospitality, and special moments..."
            className="w-full p-3 rounded-lg border border-[#D9C7A3]/50 text-xs focus:ring-1 focus:ring-[#183C32]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={reviewMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#183C32] text-[#F7F3EA] text-xs font-medium hover:bg-[#315C4A] transition-colors disabled:opacity-50"
          >
            {reviewMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Submit Review</span>
          </button>
        </div>
      </form>

      {/* Existing Reviews List */}
      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold text-[#183C32]">Past Reviews You've Shared</h3>

        {reviewsLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#183C32]" /></div>
        ) : !reviews || reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#D9C7A3]/30">
            <p className="text-xs text-[#1C1C1A]/60">You haven't submitted any reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-5 border border-[#D9C7A3]/30 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-[#183C32] text-sm">{r.booking?.room?.name || "Suite Stay"}</h4>
                    <span className="text-[11px] text-[#1C1C1A]/50">({format(new Date(r.createdAt), "dd MMM yyyy")})</span>
                  </div>
                  {renderStars(r.overallRating)}
                </div>

                <p className="text-xs text-[#1C1C1A]/80 leading-relaxed">{r.comment}</p>

                {r.adminReply && (
                  <div className="bg-[#F7F3EA] p-3 rounded-lg border-l-2 border-[#183C32] text-xs text-[#183C32]">
                    <span className="font-bold text-[11px] block">Estate Host Response:</span>
                    <p className="mt-0.5 text-[#1C1C1A]/70">{r.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
