import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  CalendarCheck,
  Receipt,
  Star,
  Bell,
  LogOut,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { auth } from "../../lib/firebase";

const navItems = [
  { label: "Profile & Overview", path: "/dashboard", icon: User, end: true },
  { label: "My Reservations", path: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Invoices & Receipts", path: "/dashboard/invoices", icon: Receipt },
  { label: "Stay Reviews", path: "/dashboard/reviews", icon: Star },
  { label: "Notifications", path: "/dashboard/notifications", icon: Bell },
];

export default function DashboardSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="w-64 bg-[#183C32] text-[#F7F3EA] flex flex-col justify-between p-6 shrink-0 border-r border-[#315C4A]/40 min-h-screen">
      {/* Brand & Emblem */}
      <div>
        <div className="flex items-center gap-3 pb-6 border-b border-[#315C4A]/40 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#D9C7A3]/20 flex items-center justify-center border border-[#D9C7A3]/40">
            <span className="font-serif text-lg font-bold text-[#D9C7A3]">N</span>
          </div>
          <div>
            <h2 className="font-serif text-base font-semibold tracking-wider uppercase text-[#F7F3EA]">
              Newlands
            </h2>
            <p className="text-[10px] tracking-widest text-[#D9C7A3] uppercase">
              Guest Sanctuary
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#315C4A] text-[#F7F3EA] shadow-sm shadow-black/20"
                      : "text-[#F7F3EA]/70 hover:text-[#F7F3EA] hover:bg-[#315C4A]/30"
                  }`
                }
              >
                <Icon className="w-4 h-4 text-[#D9C7A3]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Quick Book & User info */}
      <div className="pt-6 border-t border-[#315C4A]/40 space-y-4">
        <a
          href="/rooms"
          className="flex items-center justify-between p-3 rounded-lg bg-[#315C4A]/20 hover:bg-[#315C4A]/40 border border-[#D9C7A3]/20 text-xs font-medium transition-colors group"
        >
          <div className="flex items-center gap-2 text-[#D9C7A3]">
            <Compass className="w-4 h-4" />
            <span>Explore Suites</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#D9C7A3] opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* User Card */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#D9C7A3] text-[#183C32] font-semibold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-[#F7F3EA] truncate">
                {user?.name || "Valued Guest"}
              </p>
              <p className="text-[10px] text-[#F7F3EA]/50 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="text-[#F7F3EA]/50 hover:text-red-300 transition-colors p-1.5 rounded"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
