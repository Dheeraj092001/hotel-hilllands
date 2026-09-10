import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Receipt,
  Download,
  IndianRupee,
  Building2,
  UtensilsCrossed,
  FileSpreadsheet,
  Percent,
  CheckCircle2,
  Calendar,
  Loader2,
  Eye,
} from "lucide-react";
import { api } from "../lib/api";

interface FinancialSummary {
  totalCapturedPayments: number;
  totalRoomRevenue: number;
  totalRoomTax: number;
  totalFoodRevenue: number;
  totalFoodTax: number;
  totalTaxCollected: number;
  totalGrossRevenue: number;
  taxRules: Array<{
    type: string;
    name: string;
    rate: number;
    applicableOn: string;
  }>;
  recentInvoices: Array<{
    id: string;
    invoiceNumber: string;
    total: number;
    tax: number;
    issuedAt: string;
    status: string;
  }>;
}

export default function FinancePage() {
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  const { data: finance, isLoading } = useQuery<FinancialSummary>({
    queryKey: ["adminFinancialSummary"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: FinancialSummary }>(
        "/analytics/financial-summary"
      );
      return res.data.data;
    },
  });

  const handleExport = async (type: "bookings" | "guests" | "payments" | "food-orders") => {
    try {
      setDownloadingType(type);
      const res = await api.get(`/analytics/export/${type}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `hotel-newlands-${type}-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Exported ${type} CSV successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to download CSV");
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-[#D9C7A3]" /> Finance, Invoicing & Tax Ledger
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Official GST tax collection, sequential invoice records, and enterprise CSV ledger exports.
          </p>
        </div>

        {/* Quick CSV Export Menu */}
        <div className="flex items-center gap-2 flex-wrap">
          {(
            [
              { key: "bookings", label: "Bookings CSV" },
              { key: "guests", label: "Guests CRM CSV" },
              { key: "payments", label: "Payments CSV" },
              { key: "food-orders", label: "F&B Orders CSV" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => handleExport(item.key)}
              disabled={downloadingType === item.key}
              className="px-3 py-1.5 rounded-lg bg-[#12171C] text-stone-300 text-xs font-medium hover:text-white hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {downloadingType === item.key ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D9C7A3]" />
              ) : (
                <Download className="w-3.5 h-3.5 text-[#D9C7A3]" />
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {isLoading || !finance ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" />
        </div>
      ) : (
        <>
          {/* Revenue KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12171C] rounded-2xl p-5 border border-white/10">
              <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block mb-1">
                Total Gross Revenue
              </span>
              <div className="font-serif text-2xl font-bold text-[#D9C7A3]">
                ₹{finance.totalGrossRevenue.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Accommodations + F&B + Taxes</p>
            </div>

            <div className="bg-[#12171C] rounded-2xl p-5 border border-white/10">
              <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block mb-1">
                Room Booking Net Tariff
              </span>
              <div className="font-serif text-2xl font-bold text-white">
                ₹{finance.totalRoomRevenue.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-emerald-400 mt-1">
                +₹{finance.totalRoomTax.toLocaleString("en-IN")} (18% GST)
              </p>
            </div>

            <div className="bg-[#12171C] rounded-2xl p-5 border border-white/10">
              <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block mb-1">
                F&B Dining Net Revenue
              </span>
              <div className="font-serif text-2xl font-bold text-white">
                ₹{finance.totalFoodRevenue.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-amber-400 mt-1">
                +₹{finance.totalFoodTax.toLocaleString("en-IN")} (5% GST)
              </p>
            </div>

            <div className="bg-[#12171C] rounded-2xl p-5 border border-white/10">
              <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block mb-1">
                Total GST Collected
              </span>
              <div className="font-serif text-2xl font-bold text-emerald-400">
                ₹{finance.totalTaxCollected.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Ready for monthly GSTR-1 filing</p>
            </div>
          </div>

          {/* Tax Engine Rules Table */}
          <div className="bg-[#12171C] rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#D9C7A3]" /> Indian Hospitality Tax Configuration
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Tax Classification</th>
                    <th className="py-2.5 px-3">Rule Name</th>
                    <th className="py-2.5 px-3">Statutory Rate</th>
                    <th className="py-2.5 px-3">Applicable Scope</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-stone-200">
                  {finance.taxRules.map((rule) => (
                    <tr key={rule.type} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-mono font-semibold text-[#D9C7A3]">
                        {rule.type}
                      </td>
                      <td className="py-3 px-3 text-white font-medium">{rule.name}</td>
                      <td className="py-3 px-3 font-bold text-emerald-400">{rule.rate}%</td>
                      <td className="py-3 px-3 text-stone-400">{rule.applicableOn}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Invoices Ledger */}
          <div className="bg-[#12171C] rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#D9C7A3]" /> Recent Issued Tax Invoices
              </h3>
              <span className="text-[11px] text-stone-400">Prefix: NLS/2026/XXXXXX</span>
            </div>

            {finance.recentInvoices.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500">
                No invoices issued yet. Tax invoices are automatically generated upon payment capture.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-stone-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Invoice Number</th>
                      <th className="py-2.5 px-3">Issued Date</th>
                      <th className="py-2.5 px-3">Tax (18% GST)</th>
                      <th className="py-2.5 px-3">Invoice Total</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-stone-200">
                    {finance.recentInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-mono font-bold text-[#D9C7A3]">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3 px-3 text-stone-400">
                          {new Date(inv.issuedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-3 font-mono text-stone-300">
                          ₹{inv.tax.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 font-serif font-bold text-white">
                          ₹{inv.total.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
