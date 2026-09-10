import { api } from "../lib/api";

export interface FoodItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  isVeg: boolean;
  spiceLevel?: string;
  preparationTimeMin?: number;
  image?: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  items: FoodItem[];
}

export interface CreateOrderPayload {
  deliveryType: "ROOM" | "PICKUP";
  roomNumber?: string;
  bookingId?: string;
  specialNotes?: string;
  items: Array<{
    foodItemId: string;
    quantity: number;
    specialInstructions?: string;
  }>;
}

export const FoodService = {
  async getMenu(): Promise<FoodCategory[]> {
    const res = await api.get<{ success: boolean; data: FoodCategory[] }>("/food/menu");
    return res.data.data;
  },

  async createOrder(payload: CreateOrderPayload) {
    const res = await api.post<{ success: boolean; data: any }>("/food/orders", payload);
    return res.data.data;
  },

  async getMyOrders() {
    const res = await api.get<{ success: boolean; data: any[] }>("/food/orders/my-orders");
    return res.data.data;
  },
};
