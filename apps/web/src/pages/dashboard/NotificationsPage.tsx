import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Bell, CheckCheck, Check, Loader2, Info, Calendar, CreditCard, Sparkles } from "lucide-react";
import { dashboardService } from "../../services/dashboard.service";

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => dashboardService.getMyNotifications(),
  });

  const notifications = data?.data || [];
  const unreadCount = data?.meta?.unreadCount || 0;

  const markReadMutation = useMutation({
    mutationFn: (id: string) => dashboardService.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => dashboardService.markAllNotificationsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "BOOKING":
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case "PAYMENT":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "OFFER":
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-[#183C32]" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#183C32]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9C7A3]/30 pb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#183C32]">Estate Notifications</h2>
          <p className="text-xs text-[#1C1C1A]/60 mt-0.5">Stay updates, check-in information, and private seasonal invitations.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9C7A3] text-xs font-medium text-[#183C32] hover:bg-white transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#D9C7A3]/30 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#D9C7A3]/20 text-[#183C32] flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-[#183C32]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#183C32]">All Caught Up</h3>
          <p className="text-xs text-[#1C1C1A]/60 mt-1">You have no new notifications from Hotel Newlands at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                n.isRead
                  ? "bg-white border-[#D9C7A3]/30 opacity-75"
                  : "bg-white border-[#183C32]/30 shadow-sm"
              }`}
            >
              <div className="p-2 rounded-lg bg-[#F7F3EA] shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs font-semibold ${n.isRead ? "text-[#1C1C1A]/80" : "text-[#183C32]"}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-[#1C1C1A]/40 shrink-0">
                    {format(new Date(n.createdAt), "d MMM, h:mm a")}
                  </span>
                </div>
                <p className="text-xs text-[#1C1C1A]/70 mt-1 leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markReadMutation.mutate(n.id)}
                  title="Mark as read"
                  className="p-1 rounded text-stone-400 hover:text-[#183C32] hover:bg-[#F7F3EA] transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
