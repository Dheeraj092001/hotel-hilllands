import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Truck,
  RotateCcw,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { api } from "../lib/api";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  total: number;
  specialInstructions?: string;
  foodItem: {
    id: string;
    name: string;
    isVeg: boolean;
  };
}

interface FoodOrder {
  id: string;
  orderNumber: string;
  roomNumber?: string;
  deliveryType: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  specialNotes?: string;
  createdAt: string;
  user?: {
    name: string;
    phone?: string;
  };
  items: OrderItem[];
}

const statusBadgeColors: Record<string, string> = {
  PLACED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  CONFIRMED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PREPARING: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  READY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DELIVERED: "bg-stone-500/10 text-stone-400 border-stone-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

import { MOCK_FOOD_ORDERS } from "../services/mockData";

let localFoodOrders = [...MOCK_FOOD_ORDERS];

export default function DiningPosPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const { data: orders = [], isLoading } = useQuery<FoodOrder[]>({
    queryKey: ["adminFoodOrders"],
    queryFn: async () => {
      try {
        const res = await api.get<{ success: boolean; data: FoodOrder[] }>("/food/admin/orders");
        if (res.data?.data && res.data.data.length > 0) {
          return res.data.data;
        }
        return localFoodOrders;
      } catch {
        return localFoodOrders;
      }
    },
    refetchInterval: 10000, // Live kitchen polling every 10 seconds
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      try {
        await api.patch(`/food/admin/orders/${orderId}/status`, { status });
      } catch {
        localFoodOrders = localFoodOrders.map((o) =>
          o.id === orderId ? { ...o, status } : o
        );
      }
    },
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["adminFoodOrders"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.roomNumber && o.roomNumber.toLowerCase().includes(search.toLowerCase())) ||
      (o.user?.name && o.user.name.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const activeCount = orders.filter(
    (o) => ["PLACED", "CONFIRMED", "PREPARING", "READY"].includes(o.status)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2.5">
            <UtensilsCrossed className="w-6 h-6 text-[#D9C7A3]" /> The Cedar Hearth — Kitchen POS
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Live in-room dining tickets, pantry preparation pipeline, and room delivery tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-[#183C32] border border-[#D9C7A3]/30 text-xs text-[#D9C7A3] font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{activeCount} Active Kitchen Tickets</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {["ALL", "PLACED", "CONFIRMED", "PREPARING", "READY", "DELIVERED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                filterStatus === st
                  ? "bg-[#183C32] text-[#D9C7A3] border border-[#D9C7A3]/40"
                  : "bg-[#12171C] text-stone-400 hover:text-white border border-white/5"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search order or suite..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#12171C] border border-white/10 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-[#D9C7A3]"
          />
        </div>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#12171C] rounded-2xl border border-white/10 p-12 text-center">
          <UtensilsCrossed className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <p className="text-white font-serif text-lg font-medium">No dining orders found</p>
          <p className="text-xs text-stone-400 mt-1">
            New dining orders placed from guest rooms will appear here automatically in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#12171C] rounded-2xl border border-white/10 p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#D9C7A3]">
                      #{order.orderNumber}
                    </span>
                    <div className="text-xs text-white font-medium mt-0.5">
                      {order.deliveryType === "ROOM"
                        ? `Suite ${order.roomNumber || "N/A"}`
                        : "Restaurant Pickup"}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      statusBadgeColors[order.status] || "text-stone-400 border-white/10"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="text-[11px] text-stone-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Clock className="w-3 h-3 text-[#D9C7A3]" />
                  <span>
                    {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>• Guest: {order.user?.name || "In-House Guest"}</span>
                </div>

                {/* Items List */}
                <div className="space-y-1.5 py-1">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs text-stone-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.foodItem?.isVeg ? "bg-emerald-400" : "bg-red-400"
                          }`}
                        />
                        <span className="font-medium text-white">{item.quantity}x</span>
                        <span className="truncate">{item.foodItem?.name}</span>
                      </div>
                      <span className="text-stone-400 font-mono text-[11px] shrink-0">
                        ₹{item.total}
                      </span>
                    </div>
                  ))}
                </div>

                {order.specialNotes && (
                  <div className="bg-white/5 p-2 rounded-lg text-[11px] text-amber-200/90 italic">
                    "{order.specialNotes}"
                  </div>
                )}
              </div>

              {/* Footer & Actions */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Total (incl. 5% GST)</span>
                  <span className="font-serif text-sm font-bold text-[#D9C7A3]">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Status Advancement Buttons */}
                <div className="flex items-center gap-1.5">
                  {order.status === "PLACED" && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({ orderId: order.id, status: "CONFIRMED" })
                      }
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/30 border border-amber-500/30 transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {order.status === "CONFIRMED" && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({ orderId: order.id, status: "PREPARING" })
                      }
                      className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-xs font-medium hover:bg-orange-500/30 border border-orange-500/30 transition-colors flex items-center gap-1"
                    >
                      <ChefHat className="w-3 h-3" /> Preparing
                    </button>
                  )}
                  {order.status === "PREPARING" && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({ orderId: order.id, status: "READY" })
                      }
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-medium hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </button>
                  )}
                  {order.status === "READY" && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({ orderId: order.id, status: "DELIVERED" })
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#183C32] text-[#D9C7A3] text-xs font-semibold hover:bg-[#315C4A] border border-[#D9C7A3]/30 transition-colors flex items-center gap-1"
                    >
                      <Truck className="w-3 h-3" /> Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
