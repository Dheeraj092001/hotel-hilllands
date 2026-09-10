import { api } from "../lib/api";

export interface DashboardOverviewData {
  kpis: {
    arrivalsToday: number;
    departuresToday: number;
    guestsInHouse: number;
    occupancyRate: number;
    totalRooms: number;
    todayRevenue: number;
    monthlyRevenue: number;
  };
  trends: Array<{
    date: string;
    revenue: number;
    occupancy: number;
  }>;
  recentBookings: Array<{
    id: string;
    confirmationNumber: string;
    guestName: string;
    roomName: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    total: number;
    status: string;
  }>;
}

export interface AdminBooking {
  id: string;
  confirmationNumber: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  status: string;
  total: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  room: {
    name: string;
    roomNumber: string;
    type?: { name: string };
  };
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface AdminRoom {
  id: string;
  roomNumber: string;
  name: string;
  status: string;
  housekeepingStatus: string;
  basePrice: number;
  weekendPrice: number;
  floor: number;
  type: {
    id: string;
    name: string;
  };
  images: Array<{ url: string; isPrimary: boolean }>;
}

export interface HousekeepingTaskItem {
  id: string;
  roomId: string;
  task: string;
  assignedTo?: string;
  priority: string;
  status: string;
  notes?: string;
  room: {
    roomNumber: string;
    name: string;
  };
  createdAt: string;
}

export interface GuestItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt: string;
  _count: {
    bookings: number;
    reviews: number;
  };
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: string;
  value: number;
  minBookingAmount?: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  isActive: boolean;
}

export interface ReviewItem {
  id: string;
  overallRating: number;
  cleanlinessRating: number;
  serviceRating: number;
  comment: string;
  status: string;
  adminReply?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  booking: {
    confirmationNumber: string;
    room: {
      name: string;
      roomNumber: string;
    };
  };
}

export const adminService = {
  getOverview: async () => {
    const res = await api.get<{ success: boolean; data: DashboardOverviewData }>("/analytics/dashboard");
    return res.data.data;
  },

  getBookings: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.append("page", String(params.page));
    if (params?.limit) q.append("limit", String(params.limit));
    if (params?.status) q.append("status", params.status);
    if (params?.search) q.append("search", params.search);

    const res = await api.get<{ success: boolean; data: { bookings: AdminBooking[]; meta: any } }>(
      `/bookings?${q.toString()}`
    );
    return res.data.data;
  },

  checkInGuest: async (id: string) => {
    const res = await api.post<{ success: boolean; data: any }>(`/bookings/${id}/check-in`);
    return res.data;
  },

  checkOutGuest: async (id: string) => {
    const res = await api.post<{ success: boolean; data: any }>(`/bookings/${id}/check-out`);
    return res.data;
  },

  updateBookingStatus: async (id: string, status: string, notes?: string) => {
    const res = await api.patch<{ success: boolean; data: any }>(`/bookings/${id}/status`, {
      status,
      notes,
    });
    return res.data;
  },

  getRooms: async () => {
    const res = await api.get<{ success: boolean; data: AdminRoom[] }>("/rooms/admin/all");
    return res.data.data;
  },

  createRoom: async (data: any) => {
    const res = await api.post<{ success: boolean; data: any }>("/rooms", data);
    return res.data;
  },

  updateRoomStatus: async (id: string, status: string) => {
    const res = await api.patch<{ success: boolean; data: any }>(`/rooms/${id}/status`, { status });
    return res.data;
  },

  createRoomBlock: async (data: { roomId: string; startDate: string; endDate: string; reason: string }) => {
    const res = await api.post<{ success: boolean; data: any }>("/rooms/blocks", data);
    return res.data;
  },

  getHousekeepingRooms: async () => {
    const res = await api.get<{ success: boolean; data: any[] }>("/housekeeping/rooms");
    return res.data.data;
  },

  updateHousekeepingStatus: async (id: string, status: string) => {
    const res = await api.patch<{ success: boolean; data: any }>(`/housekeeping/rooms/${id}/status`, {
      status,
    });
    return res.data;
  },

  getHousekeepingTasks: async () => {
    const res = await api.get<{ success: boolean; data: HousekeepingTaskItem[] }>("/housekeeping/tasks");
    return res.data.data;
  },

  createHousekeepingTask: async (data: any) => {
    const res = await api.post<{ success: boolean; data: any }>("/housekeeping/tasks", data);
    return res.data;
  },

  updateHousekeepingTask: async (id: string, data: { status?: string; notes?: string }) => {
    const res = await api.patch<{ success: boolean; data: any }>(`/housekeeping/tasks/${id}`, data);
    return res.data;
  },

  getGuests: async (params?: { page?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.append("page", String(params.page));
    if (params?.search) q.append("search", params.search);

    const res = await api.get<{ success: boolean; data: GuestItem[]; meta: any }>(`/users?${q.toString()}`);
    return res.data;
  },

  getGuestDetails: async (id: string) => {
    const res = await api.get<{ success: boolean; data: any }>(`/users/${id}`);
    return res.data.data;
  },

  getCoupons: async () => {
    const res = await api.get<{ success: boolean; data: CouponItem[] }>("/offers/coupons");
    return res.data.data;
  },

  createCoupon: async (data: any) => {
    const res = await api.post<{ success: boolean; data: any }>("/offers/coupons", data);
    return res.data;
  },

  deleteCoupon: async (id: string) => {
    const res = await api.delete<{ success: boolean }>(`/offers/coupons/${id}`);
    return res.data;
  },

  getReviews: async (status?: string) => {
    const q = status ? `?status=${status}` : "";
    const res = await api.get<{ success: boolean; data: ReviewItem[] }>(`/reviews/admin/all${q}`);
    return res.data.data;
  },

  updateReviewStatus: async (id: string, status: string) => {
    const res = await api.patch<{ success: boolean; data: any }>(`/reviews/${id}/status`, { status });
    return res.data;
  },

  replyToReview: async (id: string, adminReply: string) => {
    const res = await api.post<{ success: boolean; data: any }>(`/reviews/${id}/reply`, { adminReply });
    return res.data;
  },
};
