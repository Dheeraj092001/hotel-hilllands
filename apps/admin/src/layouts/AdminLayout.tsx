import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  BedDouble,
  Sparkles,
  Users,
  Tag,
  Star,
  LogOut,
  Bell,
  Clock,
  Menu,
  X,
  ShieldCheck,
  UtensilsCrossed,
  Receipt,
  BarChart3,
  Globe,
  FileText,
  Mountain,
  MapPin,
  ClipboardList,
} from "lucide-react";
import { useAdminAuthStore } from "../stores/authStore";
import { auth } from "../lib/firebase";

const navItems = [
  { label: "Executive Overview", path: "/", icon: LayoutDashboard },
  { label: "Reservations Ledger", path: "/bookings", icon: CalendarCheck },
  { label: "Stay Calendar", path: "/calendar", icon: CalendarDays },
  { label: "Rooms & Suites", path: "/rooms", icon: BedDouble },
  { label: "Housekeeping Board", path: "/housekeeping", icon: Sparkles },
  { label: "Dining & Kitchen POS", path: "/dining-pos", icon: UtensilsCrossed },
  { label: "Finance & Tax Ledger", path: "/finance", icon: Receipt },
  { label: "Invoice Generator", path: "/invoices", icon: FileText },
  { label: "Yield & Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Website CMS", path: "/cms", icon: Globe },
  { label: "Guests CRM", path: "/guests", icon: Users },
  { label: "Coupons & Offers", path: "/coupons", icon: Tag },
  { label: "Reviews Moderation", path: "/reviews", icon: Star },
  // ── Tour & Travel section ─────────────────
  { label: "Tour Packages",      path: "/tours-manager",    icon: Mountain },
  { label: "Destinations",       path: "/destinations-mgr",  icon: MapPin },
  { label: "Tour Bookings CRM",  path: "/tour-bookings-crm", icon: ClipboardList },
];

export default function AdminLayout() {
  const { user, logout } = useAdminAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-5 text-[#E6E8EA]">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#183C32] border border-[#D9C7A3]/40 flex items-center justify-center text-[#D9C7A3] font-serif font-bold text-lg shadow-sm">
            N
          </div>
          <div>
            <h2 className="font-serif text-sm font-bold tracking-wider text-white uppercase">
              Hotel Newlands
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-[#D9C7A3] font-medium tracking-wider uppercase">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Estate ERP
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#183C32] text-[#D9C7A3] font-semibold border-l-2 border-[#D9C7A3] shadow-inner"
                      : "text-stone-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon className="w-4 h-4 text-[#D9C7A3]/80" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Staff profile & Logout */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#183C32] border border-[#D9C7A3]/30 text-[#D9C7A3] font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">{user?.name || "Estate Staff"}</p>
              <p className="text-[10px] text-[#D9C7A3]/80 truncate uppercase">{user?.role || "ADMIN"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded text-stone-400 hover:text-red-400 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F12] text-[#E6E8EA] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#12171C] border-r border-white/10 hidden md:block shrink-0 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/80" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-64 bg-[#12171C] h-full flex flex-col border-r border-white/10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#12171C]/90 backdrop-blur border-b border-white/10 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded text-stone-300 hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Clock className="w-3.5 h-3.5 text-[#D9C7A3]" />
              <span className="font-mono">{timeStr} IST</span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span className="hidden sm:inline">Shimla Estate Station 2,205m</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:5175"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#D9C7A3] hover:underline px-3 py-1 rounded bg-[#183C32]/40 border border-[#D9C7A3]/30 hidden sm:block"
            >
              Tour Site ↗
            </a>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-stone-400 hover:underline px-3 py-1 rounded bg-white/5 border border-white/10 hidden sm:block"
            >
              Hotel Site ↗
            </a>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
