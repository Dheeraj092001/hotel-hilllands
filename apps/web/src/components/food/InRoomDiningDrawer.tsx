import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  UtensilsCrossed,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { FoodService, FoodItem, FoodCategory } from "../../services/food.service";
import { useAuthStore } from "../../stores/authStore";

interface CartItem {
  item: FoodItem;
  quantity: number;
  specialInstructions?: string;
}

interface InRoomDiningDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InRoomDiningDrawer: React.FC<InRoomDiningDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [deliveryType, setDeliveryType] = useState<"ROOM" | "PICKUP">("ROOM");
  const [specialNotes, setSpecialNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrderNum, setSubmittedOrderNum] = useState("");

  const { data: menu = [], isLoading } = useQuery<FoodCategory[]>({
    queryKey: ["publicFoodMenu"],
    queryFn: FoodService.getMenu,
    enabled: isOpen,
  });

  const activeCategory =
    menu.find((c) => c.id === selectedCatId) || (menu.length > 0 ? menu[0] : null);

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) =>
      prev
        .map((ci) => (ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci))
        .filter((ci) => ci.quantity > 0)
    );
  };

  const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + tax;

  const orderMutation = useMutation({
    mutationFn: async () => {
      if (deliveryType === "ROOM" && !roomNumber.trim()) {
        throw new Error("Please specify your Suite or Room Number");
      }
      return FoodService.createOrder({
        deliveryType,
        roomNumber: deliveryType === "ROOM" ? roomNumber : undefined,
        specialNotes,
        items: cart.map((ci) => ({
          foodItemId: ci.item.id,
          quantity: ci.quantity,
          specialInstructions: ci.specialInstructions,
        })),
      });
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      setSubmittedOrderNum(data.orderNumber);
      setCart([]);
      toast.success("Dining order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["guestFoodOrders"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to place dining order");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-[#0B0F12] text-warm-ivory h-full shadow-2xl flex flex-col border-l border-white/10 animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#12171C]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#183C32] border border-[#D9C7A3]/40 flex items-center justify-center text-[#D9C7A3]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                The Cedar Hearth — In-Room Dining
              </h3>
              <p className="text-xs text-stone-400">
                Fresh mountain ingredients served directly to your fireside suite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {isSubmitted ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-white">Order Confirmed</h4>
            <p className="text-sm text-stone-300 max-w-md">
              Your dining order <span className="font-mono text-[#D9C7A3] font-bold">#{submittedOrderNum}</span> has been transmitted to our kitchen.
              Our chef is preparing your courses.
            </p>
            <div className="bg-[#12171C] p-4 rounded-xl border border-white/10 text-xs text-stone-400 max-w-sm">
              <p className="flex items-center justify-center gap-2 text-[#D9C7A3] font-medium mb-1">
                <Clock className="w-4 h-4" /> Estimated Delivery: 25-35 Minutes
              </p>
              Delivered straight to your suite with warm Himalayan hearth service.
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 rounded-lg bg-[#183C32] text-[#D9C7A3] text-xs font-semibold hover:bg-[#315C4A] border border-[#D9C7A3]/30 transition-colors"
            >
              Close Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" />
              </div>
            ) : (
              <>
                {/* Category Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
                  {menu.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCatId(cat.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        (selectedCatId === cat.id || (!selectedCatId && menu[0]?.id === cat.id))
                          ? "bg-[#183C32] text-[#D9C7A3] border border-[#D9C7A3]/40"
                          : "bg-[#12171C] text-stone-400 hover:text-white"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Items Grid */}
                <div className="space-y-3">
                  {activeCategory?.items.map((item) => {
                    const inCart = cart.find((c) => c.item.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className="bg-[#12171C] rounded-xl p-4 border border-white/10 flex items-start justify-between gap-4 hover:border-white/20 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isVeg ? "bg-emerald-400" : "bg-red-400"
                              }`}
                            />
                            <h5 className="text-sm font-semibold text-white">{item.name}</h5>
                          </div>
                          {item.description && (
                            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 pt-1 text-xs">
                            <span className="font-serif font-bold text-[#D9C7A3]">
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                            {item.preparationTimeMin && (
                              <span className="text-[10px] text-stone-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {item.preparationTimeMin} mins
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="shrink-0 flex items-center gap-2 bg-[#0B0F12] border border-white/10 rounded-lg p-1">
                          {inCart ? (
                            <>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 rounded text-stone-400 hover:text-white hover:bg-white/10"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold text-white px-1">
                                {inCart.quantity}
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                className="p-1 rounded text-stone-400 hover:text-white hover:bg-white/10"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="px-3 py-1 rounded bg-[#183C32] text-[#D9C7A3] text-xs font-medium hover:bg-[#315C4A] border border-[#D9C7A3]/30 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer / Cart Tray */}
        {!isSubmitted && cart.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#12171C] space-y-3">
            {/* Delivery Option & Suite Input */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Delivery Destination</label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0F12] border border-white/10 text-white"
                >
                  <option value="ROOM">Suite Delivery</option>
                  <option value="PICKUP">Restaurant Pickup</option>
                </select>
              </div>

              {deliveryType === "ROOM" && (
                <div>
                  <label className="block text-stone-400 mb-1">Suite / Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 204 or Pine Ridge"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0F12] border border-white/10 text-white placeholder-stone-600"
                  />
                </div>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Kitchen notes (e.g., extra cutlery, mild spice)..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#0B0F12] border border-white/10 text-white placeholder-stone-600"
              />
            </div>

            {/* Price Summary */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
              <span className="text-stone-400">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items • Subtotal: ₹{subtotal} + 5% GST (₹{tax})
              </span>
              <span className="font-serif text-base font-bold text-[#D9C7A3]">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={() => orderMutation.mutate()}
              disabled={orderMutation.isPending}
              className="w-full py-3 rounded-lg bg-[#183C32] text-[#D9C7A3] font-serif font-bold text-sm tracking-wide hover:bg-[#315C4A] border border-[#D9C7A3]/40 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {orderMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              <span>Place Kitchen Order — ₹{total.toLocaleString("en-IN")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
