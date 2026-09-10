import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Tag, Plus, Trash2, Loader2, X, Check } from "lucide-react";
import { adminService, CouponItem } from "../services/admin.service";

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = useState(10);
  const [minAmount, setMinAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["adminCoupons"],
    queryFn: () => adminService.getCoupons(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      adminService.createCoupon({
        code: code.toUpperCase(),
        discountType,
        value: Number(value),
        minBookingAmount: minAmount > 0 ? Number(minAmount) : undefined,
        startDate,
        endDate,
      }),
    onSuccess: () => {
      toast.success("Promo code created successfully");
      setCreateModalOpen(false);
      setCode("");
      queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create promo code");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCoupon(id),
    onSuccess: () => {
      toast.success("Coupon removed");
      queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" /></div>
    );
  }

  const allCoupons = coupons || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Coupons & Seasonal Offers</h2>
          <p className="text-xs text-stone-400 mt-0.5">Campaign voucher codes, percentage discounts, and redemption tracking.</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#183C32] text-[#D9C7A3] text-xs font-medium border border-[#D9C7A3]/30 hover:bg-[#315C4A]"
        >
          <Plus className="w-3.5 h-3.5" /> Create Promo Code
        </button>
      </div>

      <div className="bg-[#12171C] rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/30 text-stone-400 font-semibold uppercase text-[10px]">
            <tr>
              <th className="px-5 py-3.5">Promo Code</th>
              <th className="px-5 py-3.5">Discount Type</th>
              <th className="px-5 py-3.5">Value</th>
              <th className="px-5 py-3.5">Validity Range</th>
              <th className="px-5 py-3.5 text-center">Times Used</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {allCoupons.map((c) => (
              <tr key={c.id} className="hover:bg-white/5">
                <td className="px-5 py-4 font-mono font-bold text-[#D9C7A3]">{c.code}</td>
                <td className="px-5 py-4 text-stone-300">{c.discountType}</td>
                <td className="px-5 py-4 font-bold text-white">
                  {c.discountType === "PERCENTAGE" ? `${c.value}% OFF` : `₹${c.value} FLAT`}
                </td>
                <td className="px-5 py-4 text-stone-400">
                  {c.startDate.split("T")[0]} to {c.endDate.split("T")[0]}
                </td>
                <td className="px-5 py-4 text-center font-bold text-[#D9C7A3]">{c.usageCount}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${c.isActive ? "bg-emerald-950 text-emerald-300" : "bg-stone-800 text-stone-400"}`}>
                    {c.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => deleteMutation.mutate(c.id)}
                    className="p-1.5 rounded text-stone-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12171C] rounded-2xl max-w-md w-full p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Create New Promo Code</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Coupon Code *</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SNOWFALL20, AUTUMN15"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button onClick={() => setCreateModalOpen(false)} className="px-3 py-1.5 rounded bg-white/5 text-stone-300 text-xs">
                Cancel
              </button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={!code || !startDate || !endDate}
                className="px-4 py-1.5 rounded bg-[#183C32] text-[#D9C7A3] text-xs font-medium hover:bg-[#315C4A] disabled:opacity-50"
              >
                Create Promo Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
