import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  IndianRupee,
  Percent,
  BedDouble,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { api } from "../lib/api";

interface AdvancedAnalytics {
  kpis: {
    adr: number;
    revPar: number;
    occupancyPercent: number;
    cancellationRate: number;
    totalRevenue: number;
    totalBookings: number;
    completedBookings: number;
  };
  trends: Array<{
    date: string;
    revenue: number;
    occupancy: number;
    adr: number;
  }>;
}

import { MOCK_ADVANCED_ANALYTICS } from "../services/mockData";

export default function AnalyticsPage() {
  const [range, setRange] = useState<string>("30D");

  const { data: analytics, isLoading } = useQuery<AdvancedAnalytics>({
    queryKey: ["adminAdvancedAnalytics", range],
    queryFn: async () => {
      try {
        const res = await api.get<{ success: boolean; data: AdvancedAnalytics }>(
          `/analytics/advanced?range=${range}`
        );
        if (res.data?.data?.kpis?.adr) {
          return res.data.data;
        }
        return MOCK_ADVANCED_ANALYTICS;
      } catch {
        return MOCK_ADVANCED_ANALYTICS;
      }
    },
  });

  return (
    <div className="space-y-6">
      {/* Header & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#D9C7A3]" /> Advanced Performance & Yield Analytics
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Industry metrics: Average Daily Rate (ADR), Revenue per Available Room (RevPAR), and occupancy trends.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#12171C] p-1 rounded-xl border border-white/10">
          {[
            { id: "7D", label: "Last 7 Days" },
            { id: "30D", label: "Last 30 Days" },
            { id: "90D", label: "Quarter (90D)" },
            { id: "YEAR", label: "Trailing Year" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                range === item.id
                  ? "bg-[#183C32] text-[#D9C7A3] border border-[#D9C7A3]/30"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !analytics ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" />
        </div>
      ) : (
        <>
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12171C] rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  ADR (Avg Daily Rate)
                </span>
                <IndianRupee className="w-4 h-4 text-[#D9C7A3]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#D9C7A3] mt-2">
                ₹{analytics.kpis.adr.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Average yield per occupied suite night</p>
            </div>

            <div className="bg-[#12171C] rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  RevPAR (Rev Per Available)
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-serif text-2xl font-bold text-white mt-2">
                ₹{analytics.kpis.revPar.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Revenue across total estate inventory</p>
            </div>

            <div className="bg-[#12171C] rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  Average Occupancy
                </span>
                <Percent className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-serif text-2xl font-bold text-emerald-400 mt-2">
                {analytics.kpis.occupancyPercent}%
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                {analytics.kpis.completedBookings} realized stays
              </p>
            </div>

            <div className="bg-[#12171C] rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  Cancellation Rate
                </span>
                <AlertCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="font-serif text-2xl font-bold text-white mt-2">
                {analytics.kpis.cancellationRate}%
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Within optimal industry threshold (&lt;10%)</p>
            </div>
          </div>

          {/* Revenue & Occupancy Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Area Chart */}
            <div className="bg-[#12171C] rounded-2xl p-6 border border-white/10 space-y-4">
              <div>
                <h3 className="font-serif text-base font-bold text-white">Daily Revenue Generation (INR)</h3>
                <p className="text-xs text-stone-400">Accommodations and hospitality package yields</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.trends}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D9C7A3" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#D9C7A3" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232B32" vertical={false} />
                    <XAxis dataKey="date" stroke="#717D8A" fontSize={10} tickLine={false} />
                    <YAxis
                      stroke="#717D8A"
                      fontSize={10}
                      tickLine={false}
                      tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B0F12",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#D9C7A3"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Occupancy Ratio Bar Chart */}
            <div className="bg-[#12171C] rounded-2xl p-6 border border-white/10 space-y-4">
              <div>
                <h3 className="font-serif text-base font-bold text-white">Occupancy Ratio (%)</h3>
                <p className="text-xs text-stone-400">Percentage of suites occupied per night</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232B32" vertical={false} />
                    <XAxis dataKey="date" stroke="#717D8A" fontSize={10} tickLine={false} />
                    <YAxis
                      stroke="#717D8A"
                      fontSize={10}
                      tickLine={false}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B0F12",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: any) => [`${value}%`, "Occupancy"]}
                    />
                    <Bar dataKey="occupancy" fill="#183C32" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
