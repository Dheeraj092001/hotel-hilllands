import { api } from "../lib/api";

export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  preferences?: Record<string, any>;
  stats?: {
    totalBookings: number;
    activeBookings: number;
    completedStays: number;
    reviewsCount: number;
  };
}

export interface GuestBooking {
  id: string;
  confirmationNumber: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
  total: number;
  currency: string;
  specialRequests?: string;
  room: {
    id: string;
    name: string;
    roomNumber: string;
    bedType?: string;
    images?: Array<{ url: string; isPrimary: boolean }>;
  };
  payments?: Array<{
    id: string;
    amount: number;
    status: string;
    provider: string;
    createdAt: string;
  }>;
  extras?: Array<{
    extra: { name: string };
    quantity: number;
    price: number;
  }>;
  invoice?: {
    id: string;
    invoiceNumber: string;
    total: number;
    status: string;
  };
}

export interface GuestInvoice {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: string;
  issuedAt: string;
  booking: {
    confirmationNumber: string;
    checkIn: string;
    checkOut: string;
    room: {
      name: string;
      roomNumber: string;
    };
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
}

export interface GuestReview {
  id: string;
  bookingId: string;
  overallRating: number;
  cleanlinessRating: number;
  serviceRating: number;
  locationRating: number;
  foodRating: number;
  valueRating: number;
  comment: string;
  status: string;
  adminReply?: string;
  createdAt: string;
  booking?: {
    confirmationNumber: string;
    checkIn: string;
    checkOut: string;
    room?: {
      name: string;
      images?: Array<{ url: string }>;
    };
  };
}

export interface GuestNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export const dashboardService = {
  getProfile: async () => {
    const res = await api.get<{ success: boolean; data: GuestProfile }>("/users/me");
    return res.data.data;
  },

  updateProfile: async (data: Partial<GuestProfile>) => {
    const res = await api.put<{ success: boolean; data: GuestProfile }>("/users/me", data);
    return res.data.data;
  },

  getMyBookings: async () => {
    const res = await api.get<{ success: boolean; data: GuestBooking[] }>("/bookings/my-bookings");
    return res.data.data;
  },

  getBooking: async (id: string) => {
    const res = await api.get<{ success: boolean; data: GuestBooking }>(`/bookings/${id}`);
    return res.data.data;
  },

  cancelBooking: async (id: string, reason?: string) => {
    const res = await api.post<{ success: boolean; data: any; message: string }>(
      `/bookings/${id}/cancel`,
      { reason }
    );
    return res.data;
  },

  getMyInvoices: async (page = 1) => {
    const res = await api.get<{ success: boolean; data: GuestInvoice[]; meta: any }>(
      `/invoices/my-invoices?page=${page}`
    );
    return res.data;
  },

  getInvoice: async (id: string) => {
    const res = await api.get<{ success: boolean; data: GuestInvoice }>(`/invoices/${id}`);
    return res.data.data;
  },

  getMyReviews: async () => {
    const res = await api.get<{ success: boolean; data: GuestReview[] }>("/reviews/my-reviews");
    return res.data.data;
  },

  createReview: async (reviewData: {
    bookingId: string;
    overallRating: number;
    cleanlinessRating: number;
    serviceRating: number;
    locationRating: number;
    foodRating: number;
    valueRating: number;
    comment: string;
  }) => {
    const res = await api.post<{ success: boolean; data: GuestReview }>("/reviews", reviewData);
    return res.data.data;
  },

  getMyNotifications: async () => {
    const res = await api.get<{
      success: boolean;
      data: GuestNotification[];
      meta: { unreadCount: number };
    }>("/notifications/my-notifications");
    return res.data;
  },

  markNotificationRead: async (id: string) => {
    const res = await api.patch<{ success: boolean }>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllNotificationsRead: async () => {
    const res = await api.patch<{ success: boolean }>("/notifications/mark-all-read");
    return res.data;
  },
};
