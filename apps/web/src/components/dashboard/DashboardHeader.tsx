import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, PlusCircle, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboard.service";

interface DashboardHeaderProps {
  onToggleMobileMenu?: () => void;
}

export default function DashboardHeader({ onToggleMobileMenu }: DashboardHeaderProps) {
  const location = useLocation();

  const { data: notifData } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => dashboardService.getMyNotifications(),
    refetchInterval: 60000,
  });

  const unreadCount = notifData?.meta?.unreadCount || 0;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard/bookings/")) return "Reservation Details";
    if (path.includes("/dashboard/bookings")) return "My Reservations";
    if (path.includes("/dashboard/invoices")) return "Invoices & Receipts";
    if (path.includes("/dashboard/reviews")) return "Stay Reviews";
    if (path.includes("/dashboard/notifications")) return "Notifications";
    return "Guest Sanctuary Overview";
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-[#D9C7A3]/30 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-[#183C32] hover:bg-[#F7F3EA] transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-[#183C32]">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-[#1C1C1A]/60 hidden sm:block">
            Hotel Newlands • Shimla Estate Member Portal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-xs font-medium text-[#183C32] hover:text-[#315C4A] hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9C7A3]/40 hover:bg-[#F7F3EA] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Estate Site</span>
        </Link>

        <Link
          to="/rooms"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#183C32] text-[#F7F3EA] text-xs font-medium hover:bg-[#315C4A] transition-colors shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#D9C7A3]" />
          <span>New Reservation</span>
        </Link>

        <Link
          to="/dashboard/notifications"
          className="relative p-2 rounded-lg text-[#183C32] hover:bg-[#F7F3EA] transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
