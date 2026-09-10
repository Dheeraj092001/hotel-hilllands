import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  CalendarCheck,
  TrendingUp,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  BedDouble,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { adminService } from "../services/admin.service";

export default function OverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminOverview"],
    queryFn: () => adminService.getOverview(),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" />
      </div>
    );
  }

  const kpis = data?.kpis || {
    arrivalsToday: 0,
    departuresToday: 0,
    guestsInHouse: 0,
    occupancyRate: 0,
    totalRooms: 14,
    todayRevenue: 0,
    monthlyRevenue: 0,
  };

  const trends = data?.trends || [];
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Estate Performance Command</h2>
        <p className="text-xs text-stone-400 mt-0.5">Real-time room occupancy, revenue flow, and guest movements.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-[#12171C] p-4 rounded-xl border border-white/10">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Arrivals Today</span>
          <p className="font-serif text-2xl font-bold text-white mt-1">{kpis.arrivalsToday}</p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> Check-in ready
          </span>
        </div>

        <div className="bg-[#12171C] p-4 rounded-xl border border-white/10">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Departures</span>
          <p className="font-serif text-2xl font-bold text-white mt-1">{kpis.departuresToday}</p>
          <span className="text-[10px] text-amber-400 flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="w-3 h-3" /> Check-out pending
          </span>
        </div>

        <div className="bg-[#12171C] p-4 rounded-xl border border-white/10">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">In-House Guests</span>
          <p className="font-serif text-2xl font-bold text-[#D9C7A3] mt-1">{kpis.guestsInHouse}</p>
          <span className="text-[10px] text-stone-400 mt-1 block">In residence</span>
        </div>

        <div className="bg-[#12171C] p-4 rounded-xl border border-white/10">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Occupancy Rate</span>
          <p className="font-serif text-2xl font-bold text-white mt-1">{kpis.occupancyRate}%</p>
          <span className="text-[10px] text-emerald-400 mt-1 block">Of {kpis.totalRooms} suites</span>
        </div>

        <div className="bg-[#12171C] p-4 rounded-xl border border-white/10">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Today's Revenue</span>
          <p className="font-serif text-xl font-bold text-[#D9C7A3] mt-1">₹{kpis.todayRevenue.toLocaleString("en-IN")}</p>
          <span className="text-[10px] text-emerald-400 mt-1 block">Captured settlements</span>
        </div>

        <div className="bg-[#12171C] p-4 rounded-xl border border-white/10">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Monthly Total</span>
          <p className="font-serif text-xl font-bold text-white mt-1">₹{kpis.monthlyRevenue.toLocaleString("en-IN")}</p>
          <span className="text-[10px] text-stone-400 mt-1 block">Current cycle</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="bg-[#12171C] p-5 rounded-2xl border border-white/10">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">7-Day Revenue Velocity (₹)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D9C7A3" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D9C7A3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#78756E" fontSize={11} tickLine={false} />
                <YAxis stroke="#78756E" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#183C32", borderColor: "#D9C7A3", borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: "#F7F3EA" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D9C7A3" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Trend Bar Chart */}
        <div className="bg-[#12171C] p-5 rounded-2xl border border-white/10">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Daily Occupancy Ratio (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <XAxis dataKey="date" stroke="#78756E" fontSize={11} tickLine={false} />
                <YAxis stroke="#78756E" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#183C32", borderColor: "#D9C7A3", borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: "#F7F3EA" }}
                />
                <Bar dataKey="occupancy" fill="#315C4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bookings Quick Table */}
      <div className="bg-[#12171C] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Reservations</h3>
          <Link to="/bookings" className="text-xs text-[#D9C7A3] hover:underline">View All Ledger ↗</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 text-stone-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Guest</th>
                <th className="px-5 py-3">Suite</th>
                <th className="px-5 py-3">Dates</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/5">
                  <td className="px-5 py-3.5 font-mono text-[#D9C7A3]">{b.confirmationNumber}</td>
                  <td className="px-5 py-3.5 font-medium text-white">{b.guestName}</td>
                  <td className="px-5 py-3.5 text-stone-300">{b.roomName} (#{b.roomNumber})</td>
                  <td className="px-5 py-3.5 text-stone-400">{b.checkIn.split("T")[0]}</td>
                  <td className="px-5 py-3.5 font-bold text-white">₹{b.total.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
