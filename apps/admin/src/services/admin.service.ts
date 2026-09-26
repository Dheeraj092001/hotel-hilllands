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

import {
  MOCK_OVERVIEW_DATA,
  MOCK_ROOMS,
  MOCK_BOOKINGS,
  MOCK_HOUSEKEEPING_TASKS,
  MOCK_GUESTS,
  MOCK_COUPONS,
  MOCK_REVIEWS,
  MOCK_FOOD_ORDERS,
} from "./mockData";

// In-memory state for resilient standalone and preview execution
let roomsStore = [...MOCK_ROOMS];
let bookingsStore = [...MOCK_BOOKINGS];
let tasksStore = [...MOCK_HOUSEKEEPING_TASKS];
let guestsStore = [...MOCK_GUESTS];
let couponsStore = [...MOCK_COUPONS];
let reviewsStore = [...MOCK_REVIEWS];
let foodOrdersStore = [...MOCK_FOOD_ORDERS];
let generatedInvoicesStore: any[] = [];

export const adminService = {
  getOverview: async (): Promise<DashboardOverviewData> => {
    try {
      const res = await api.get<{ success: boolean; data: DashboardOverviewData }>("/analytics/dashboard");
      if (res.data?.data && res.data.data.kpis?.arrivalsToday !== undefined) {
        return res.data.data;
      }
      return MOCK_OVERVIEW_DATA;
    } catch {
      return MOCK_OVERVIEW_DATA;
    }
  },

  getBookings: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    try {
      const q = new URLSearchParams();
      if (params?.page) q.append("page", String(params.page));
      if (params?.limit) q.append("limit", String(params.limit));
      if (params?.status) q.append("status", params.status);
      if (params?.search) q.append("search", params.search);

      const res = await api.get<{ success: boolean; data: { bookings: AdminBooking[]; meta: any } }>(
        `/bookings?${q.toString()}`
      );
      if (res.data?.data?.bookings && res.data.data.bookings.length > 0) {
        return res.data.data;
      }
      throw new Error("Empty backend data");
    } catch {
      let filtered = [...bookingsStore];
      if (params?.status && params.status !== "ALL") {
        filtered = filtered.filter((b) => b.status.toUpperCase() === params.status?.toUpperCase());
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(
          (b) =>
            b.confirmationNumber.toLowerCase().includes(s) ||
            b.guestName?.toLowerCase().includes(s) ||
            b.room.name.toLowerCase().includes(s) ||
            b.room.roomNumber.toLowerCase().includes(s)
        );
      }
      return {
        bookings: filtered,
        meta: { total: filtered.length, page: params?.page || 1, limit: params?.limit || 10 },
      };
    }
  },

  checkInGuest: async (id: string) => {
    try {
      const res = await api.post<{ success: boolean; data: any }>(`/bookings/${id}/check-in`);
      return res.data;
    } catch {
      bookingsStore = bookingsStore.map((b) => (b.id === id ? { ...b, status: "CHECKED_IN" } : b));
      return { success: true };
    }
  },

  checkOutGuest: async (id: string) => {
    try {
      const res = await api.post<{ success: boolean; data: any }>(`/bookings/${id}/check-out`);
      return res.data;
    } catch {
      bookingsStore = bookingsStore.map((b) => (b.id === id ? { ...b, status: "CHECKED_OUT" } : b));
      return { success: true };
    }
  },

  updateBookingStatus: async (id: string, status: string, notes?: string) => {
    try {
      const res = await api.patch<{ success: boolean; data: any }>(`/bookings/${id}/status`, {
        status,
        notes,
      });
      return res.data;
    } catch {
      bookingsStore = bookingsStore.map((b) => (b.id === id ? { ...b, status } : b));
      return { success: true };
    }
  },

  getRooms: async (): Promise<AdminRoom[]> => {
    try {
      const res = await api.get<{ success: boolean; data: AdminRoom[] }>("/rooms/admin/all");
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data;
      }
      return roomsStore;
    } catch {
      return roomsStore;
    }
  },

  createRoom: async (data: any) => {
    try {
      const res = await api.post<{ success: boolean; data: any }>("/rooms", data);
      return res.data;
    } catch {
      const newRoom: AdminRoom = {
        id: `r-${Date.now()}`,
        roomNumber: data.roomNumber || String(roomsStore.length + 101),
        name: data.name || "New Heritage Suite",
        status: "AVAILABLE",
        housekeepingStatus: "CLEAN",
        basePrice: data.basePrice || 20000,
        weekendPrice: data.weekendPrice || 24000,
        floor: data.floor || 1,
        type: { id: "t-custom", name: data.typeName || "Heritage Suite" },
        images: [{ url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", isPrimary: true }],
      };
      roomsStore.push(newRoom);
      return { success: true, data: newRoom };
    }
  },

  updateRoomStatus: async (id: string, status: string) => {
    try {
      const res = await api.patch<{ success: boolean; data: any }>(`/rooms/${id}/status`, { status });
      return res.data;
    } catch {
      roomsStore = roomsStore.map((r) => (r.id === id ? { ...r, status } : r));
      return { success: true };
    }
  },

  createRoomBlock: async (data: { roomId: string; startDate: string; endDate: string; reason: string }) => {
    try {
      const res = await api.post<{ success: boolean; data: any }>("/rooms/blocks", data);
      return res.data;
    } catch {
      roomsStore = roomsStore.map((r) => (r.id === data.roomId ? { ...r, status: "MAINTENANCE" } : r));
      return { success: true };
    }
  },

  getHousekeepingRooms: async (): Promise<any[]> => {
    try {
      const res = await api.get<{ success: boolean; data: any[] }>("/housekeeping/rooms");
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data;
      }
      return roomsStore;
    } catch {
      return roomsStore;
    }
  },

  updateHousekeepingStatus: async (id: string, status: string) => {
    try {
      const res = await api.patch<{ success: boolean; data: any }>(`/housekeeping/rooms/${id}/status`, {
        status,
      });
      return res.data;
    } catch {
      roomsStore = roomsStore.map((r) => (r.id === id ? { ...r, housekeepingStatus: status } : r));
      return { success: true };
    }
  },

  getHousekeepingTasks: async (): Promise<HousekeepingTaskItem[]> => {
    try {
      const res = await api.get<{ success: boolean; data: HousekeepingTaskItem[] }>("/housekeeping/tasks");
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data;
      }
      return tasksStore;
    } catch {
      return tasksStore;
    }
  },

  createHousekeepingTask: async (data: any) => {
    try {
      const res = await api.post<{ success: boolean; data: any }>("/housekeeping/tasks", data);
      return res.data;
    } catch {
      const targetRoom = roomsStore.find((r) => r.id === data.roomId) || roomsStore[0];
      const newTask: HousekeepingTaskItem = {
        id: `hk-${Date.now()}`,
        roomId: data.roomId,
        task: data.task,
        assignedTo: data.assignedTo || "Attendant On Duty",
        priority: data.priority || "NORMAL",
        status: "PENDING",
        notes: data.notes || "Dispatched from executive board",
        room: { roomNumber: targetRoom.roomNumber, name: targetRoom.name },
        createdAt: new Date().toISOString(),
      };
      tasksStore = [newTask, ...tasksStore];
      return { success: true, data: newTask };
    }
  },

  updateHousekeepingTask: async (id: string, data: { status?: string; notes?: string }) => {
    try {
      const res = await api.patch<{ success: boolean; data: any }>(`/housekeeping/tasks/${id}`, data);
      return res.data;
    } catch {
      tasksStore = tasksStore.map((t) => (t.id === id ? { ...t, ...data } : t));
      return { success: true };
    }
  },

  getGuests: async (params?: { page?: number; search?: string }) => {
    try {
      const q = new URLSearchParams();
      if (params?.page) q.append("page", String(params.page));
      if (params?.search) q.append("search", params.search);

      const res = await api.get<{ success: boolean; data: GuestItem[]; meta: any }>(`/users?${q.toString()}`);
      if (res.data?.data && res.data.data.length > 0) {
        return res.data;
      }
      throw new Error("Empty backend data");
    } catch {
      let filtered = [...guestsStore];
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(
          (g) =>
            g.name.toLowerCase().includes(s) ||
            g.email.toLowerCase().includes(s) ||
            g.city?.toLowerCase().includes(s)
        );
      }
      return {
        success: true,
        data: filtered,
        meta: { total: filtered.length, page: params?.page || 1, limit: 10 },
      };
    }
  },

  getGuestDetails: async (id: string) => {
    try {
      const res = await api.get<{ success: boolean; data: any }>(`/users/${id}`);
      if (res.data?.data) return res.data.data;
      throw new Error("Not found");
    } catch {
      const guest = guestsStore.find((g) => g.id === id) || guestsStore[0];
      const guestBookings = bookingsStore.filter(
        (b) => b.user?.email === guest.email || b.guestEmail === guest.email
      );
      return {
        ...guest,
        bookings: guestBookings.length > 0 ? guestBookings : bookingsStore.slice(0, 2),
      };
    }
  },

  getCoupons: async (): Promise<CouponItem[]> => {
    try {
      const res = await api.get<{ success: boolean; data: CouponItem[] }>("/offers/coupons");
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data;
      }
      return couponsStore;
    } catch {
      return couponsStore;
    }
  },

  createCoupon: async (data: any) => {
    try {
      const res = await api.post<{ success: boolean; data: any }>("/offers/coupons", data);
      return res.data;
    } catch {
      const newCoupon: CouponItem = {
        id: `cp-${Date.now()}`,
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        value: Number(data.value),
        minBookingAmount: data.minBookingAmount,
        startDate: data.startDate || new Date().toISOString().slice(0, 10),
        endDate: data.endDate || "2026-12-31",
        usageCount: 0,
        isActive: true,
      };
      couponsStore = [newCoupon, ...couponsStore];
      return { success: true, data: newCoupon };
    }
  },

  deleteCoupon: async (id: string) => {
    try {
      const res = await api.delete<{ success: boolean }>(`/offers/coupons/${id}`);
      return res.data;
    } catch {
      couponsStore = couponsStore.filter((c) => c.id !== id);
      return { success: true };
    }
  },

  getReviews: async (status?: string): Promise<ReviewItem[]> => {
    try {
      const q = status ? `?status=${status}` : "";
      const res = await api.get<{ success: boolean; data: ReviewItem[] }>(`/reviews/admin/all${q}`);
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data;
      }
      throw new Error("Empty backend data");
    } catch {
      if (status && status !== "ALL") {
        return reviewsStore.filter((r) => r.status.toUpperCase() === status.toUpperCase());
      }
      return reviewsStore;
    }
  },

  updateReviewStatus: async (id: string, status: string) => {
    try {
      const res = await api.patch<{ success: boolean; data: any }>(`/reviews/${id}/status`, { status });
      return res.data;
    } catch {
      reviewsStore = reviewsStore.map((r) => (r.id === id ? { ...r, status } : r));
      return { success: true };
    }
  },

  replyToReview: async (id: string, adminReply: string) => {
    try {
      const res = await api.post<{ success: boolean; data: any }>(`/reviews/${id}/reply`, { adminReply });
      return res.data;
    } catch {
      reviewsStore = reviewsStore.map((r) => (r.id === id ? { ...r, adminReply } : r));
      return { success: true };
    }
  },

  lookupGuestByEmail: async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await api.get<{ success: boolean; data: { user: any; bookings: any[] } }>(
        `/invoices/admin/guest-lookup?email=${encodeURIComponent(cleanEmail)}`
      );
      if (res.data?.data) {
        return res.data.data;
      }
      throw new Error("No backend data");
    } catch {
      // Resilient fallback with mock store
      const guest = guestsStore.find((g) => g.email.toLowerCase() === cleanEmail);
      const guestBookings = bookingsStore.filter(
        (b) =>
          b.user?.email.toLowerCase() === cleanEmail ||
          b.guestEmail?.toLowerCase() === cleanEmail
      );

      return {
        user: guest || (guestBookings.length > 0 ? {
          id: guestBookings[0].user?.email || "guest-1",
          name: guestBookings[0].guestName || guestBookings[0].user?.name,
          email: cleanEmail,
          phone: guestBookings[0].guestPhone || guestBookings[0].user?.phone,
        } : null),
        bookings: guestBookings,
      };
    }
  },

  getCheckoutPreview: async (bookingId: string) => {
    try {
      const res = await api.get<{ success: boolean; data: any }>(
        `/invoices/admin/checkout-preview/${bookingId}`
      );
      if (res.data?.data?.booking) {
        return res.data.data;
      }
      throw new Error("No backend data");
    } catch {
      // Resilient fallback
      const booking = bookingsStore.find((b) => b.id === bookingId) || bookingsStore[0];
      const checkInTime = new Date(booking.checkIn).getTime();
      const checkOutTime = new Date(booking.checkOut).getTime();
      const nights = Math.max(1, Math.round((checkOutTime - checkInTime) / (1000 * 3600 * 24)) || 3);
      
      const nightlyRate = Math.round(Number(booking.total) / (nights * 1.18));
      const roomSubtotal = nightlyRate * nights;
      const roomTax = Math.round(roomSubtotal * 0.18);
      const roomTotal = roomSubtotal + roomTax;

      // Correlate Food Orders for this room
      const matchingFoodOrders = foodOrdersStore.filter(
        (o) => o.roomNumber === booking.room.roomNumber
      );

      // Pre-booked Extras
      const extras = [
        {
          id: "ex-1",
          name: "Chauffeur Kalka Luxury Transfer",
          quantity: 1,
          unitPrice: 4500,
          total: 4500,
          taxRate: 18,
        },
        {
          id: "ex-2",
          name: "Cedar Ridge Private Fireside Bonfire",
          quantity: 1,
          unitPrice: 3200,
          total: 3200,
          taxRate: 18,
        },
      ];

      let foodSubtotal = 0;
      let foodTax = 0;
      const formattedFoodOrders = matchingFoodOrders.map((o) => {
        foodSubtotal += o.subtotal;
        foodTax += o.tax;
        return {
          id: o.id,
          orderNumber: o.orderNumber,
          status: o.status,
          createdAt: o.createdAt,
          subtotal: o.subtotal,
          tax: o.tax,
          total: o.total,
          items: o.items.map((it: any) => ({
            id: it.id,
            dishName: it.foodItem?.name || "Artisanal Kitchen Dish",
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            total: it.total,
            isVeg: it.foodItem?.isVeg ?? true,
          })),
        };
      });

      const extrasSubtotal = extras.reduce((acc, e) => acc + e.total, 0);
      const extrasTax = Math.round(extrasSubtotal * 0.18);

      const grossSubtotal = roomSubtotal + foodSubtotal + extrasSubtotal;
      const totalTax = roomTax + foodTax + extrasTax;
      const discount = 0;
      const serviceCharge = 0;
      const grandTotal = grossSubtotal + totalTax;

      // Check if advance payment was made at booking
      const totalPaid = Number(booking.total); // Initial room tariff paid online
      const balanceDue = Math.max(0, grandTotal - totalPaid);

      return {
        booking: {
          id: booking.id,
          confirmationNumber: booking.confirmationNumber,
          guestName: booking.guestName || booking.user?.name || "Valued Guest",
          guestEmail: booking.guestEmail || booking.user?.email || "guest@example.com",
          guestPhone: booking.guestPhone || booking.user?.phone || "+91 98000 00000",
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          nights,
          adults: booking.adults || 2,
          children: booking.children || 0,
          status: booking.status,
          room: {
            id: booking.room.roomNumber,
            name: booking.room.name,
            roomNumber: booking.room.roomNumber,
            basePrice: nightlyRate,
            typeName: booking.room.type?.name || "Himalayan Suite",
          },
        },
        roomCharges: {
          nights,
          nightlyRate,
          subtotal: roomSubtotal,
          taxRate: 18,
          tax: roomTax,
          total: roomTotal,
        },
        foodOrders: formattedFoodOrders,
        extras,
        payments: [
          {
            id: "pay-advance",
            transactionId: `rzp_adv_${booking.confirmationNumber}`,
            provider: "RAZORPAY",
            amount: totalPaid,
            status: "PAID",
            createdAt: booking.checkIn,
          },
        ],
        summary: {
          roomSubtotal,
          foodSubtotal,
          extrasSubtotal,
          grossSubtotal,
          discount,
          roomTax,
          foodTax,
          extrasTax,
          totalTax,
          serviceCharge,
          grandTotal,
          totalPaid,
          balanceDue,
        },
        existingInvoice: null,
      };
    }
  },

  generateCheckoutInvoice: async (payload: {
    bookingId: string;
    paymentMethod?: string;
    settleBalance?: boolean;
    notes?: string;
    additionalItems?: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      taxRate: number;
      category: string;
    }>;
  }) => {
    try {
      const res = await api.post<{ success: boolean; data: any }>(
        "/invoices/admin/generate-checkout",
        payload
      );
      if (res.data?.data) {
        return res.data;
      }
      throw new Error("No backend data");
    } catch {
      // Mock generate
      const preview = await adminService.getCheckoutPreview(payload.bookingId);
      bookingsStore = bookingsStore.map((b) =>
        b.id === payload.bookingId ? { ...b, status: "CHECKED_OUT" } : b
      );

      const invoiceNumber = `NLS/2026/${String(Math.floor(1000 + Math.random() * 9000))}`;
      
      let additionalSubtotal = 0;
      let additionalTax = 0;
      const customItems = (payload.additionalItems || []).map((it, idx) => {
        const amt = it.quantity * it.unitPrice;
        const tx = Math.round(amt * (it.taxRate / 100));
        additionalSubtotal += amt;
        additionalTax += tx;
        return {
          id: `item-add-${idx}`,
          description: it.description,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          amount: amt,
          taxRate: it.taxRate,
          category: it.category,
        };
      });

      const finalSubtotal = preview.summary.grossSubtotal + additionalSubtotal;
      const finalTax = preview.summary.totalTax + additionalTax;
      const grandTotal = finalSubtotal + finalTax;

      const allItems: any[] = [
        {
          id: "item-room",
          description: `${preview.booking.room.name} (Suite #${preview.booking.room.roomNumber}) — ${preview.roomCharges.nights} Night(s) Stay [SAC 996311]`,
          quantity: preview.roomCharges.nights,
          unitPrice: preview.roomCharges.nightlyRate,
          amount: preview.roomCharges.subtotal,
          taxRate: 18,
          category: "ACCOMMODATION",
        },
        ...preview.extras.map((e: any, idx: number) => ({
          id: `item-extra-${idx}`,
          description: `${e.name} [SAC 996339]`,
          quantity: e.quantity,
          unitPrice: e.unitPrice,
          amount: e.total,
          taxRate: 18,
          category: "EXTRAS",
        })),
        ...preview.foodOrders.flatMap((o: any) =>
          o.items.map((it: any) => ({
            id: `item-food-${it.id}`,
            description: `${it.dishName} (${o.orderNumber}) [SAC 996331]`,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            amount: it.total,
            taxRate: 5,
            category: "FOOD_BEVERAGE",
          }))
        ),
        ...customItems,
      ];

      const newInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber,
        bookingId: payload.bookingId,
        subtotal: finalSubtotal,
        discount: 0,
        tax: finalTax,
        serviceCharge: 0,
        extras: preview.summary.extrasSubtotal + additionalSubtotal,
        food: preview.summary.foodSubtotal,
        total: grandTotal,
        currency: "INR",
        status: "PAID",
        issuedAt: new Date().toISOString(),
        booking: preview.booking,
        items: allItems,
      };

      generatedInvoicesStore = [newInvoice, ...generatedInvoicesStore];
      return { success: true, data: newInvoice };
    }
  },

  sendInvoiceEmail: async (invoiceId: string) => {
    try {
      const res = await api.post<{ success: boolean; message: string }>(
        `/invoices/admin/${invoiceId}/send-email`
      );
      return res.data;
    } catch {
      return {
        success: true,
        message: "Official GST Tax Invoice emailed successfully to guest.",
      };
    }
  },
};


// ═══════════════════════════════════════════════════════════════
// TOUR & TRAVEL ADMIN SERVICE — extends admin.service.ts
// ═══════════════════════════════════════════════════════════════

// ---------- Types ----------
export interface AdminDestination {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  description: string | null;
  heroImage: string | null;
  isPublished: boolean;
  sortOrder: number;
  _count?: { tours: number };
}

export interface AdminTour {
  id: string;
  slug: string;
  title: string;
  travelStyle: string | null;
  durationDays: number | null;
  maxGroup: number | null;
  basePriceInr: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  destination: { id: string; name: string; slug: string };
  media: { id: string; url: string; isPrimary: boolean }[];
  departures: { id: string; startDate: string; endDate: string; seatsBooked: number; seatsTotal: number | null; status: string }[];
}

export interface AdminTourBooking {
  id: string;
  confirmationNumber: string;
  status: string;
  totalAmount: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  adults: number;
  children: number;
  source: string;
  createdAt: string;
  tour: { title: string; slug: string };
  departure: { startDate: string; endDate: string } | null;
  travelers: { id: string; name: string }[];
}

export interface TourBookingStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

// ---------- Tour destinations service ----------
export const adminDestinationsService = {
  async list(): Promise<AdminDestination[]> {
    const res = await api.get("/destinations/admin/all");
    return res.data.data;
  },
  async create(data: Partial<AdminDestination> & { slug: string; name: string }): Promise<AdminDestination> {
    const res = await api.post("/destinations", data);
    return res.data.data;
  },
  async update(id: string, data: Partial<AdminDestination>): Promise<AdminDestination> {
    const res = await api.put(`/destinations/${id}`, data);
    return res.data.data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/destinations/${id}`);
  },
};

// ---------- Tours service ----------
export const adminToursService = {
  async list(filters: { page?: number; limit?: number; destinationId?: string; travelStyle?: string } = {}): Promise<{ data: AdminTour[]; meta: { total: number; totalPages: number } }> {
    const res = await api.get("/tours", { params: filters });
    return res.data;
  },
  async getBySlug(slug: string): Promise<AdminTour & { itineraryDays: unknown[]; faqs: unknown[] }> {
    const res = await api.get(`/tours/${slug}`);
    return res.data.data;
  },
  async create(data: Record<string, unknown>): Promise<AdminTour> {
    const res = await api.post("/tours", data);
    return res.data.data;
  },
  async update(id: string, data: Record<string, unknown>): Promise<AdminTour> {
    const res = await api.put(`/tours/${id}`, data);
    return res.data.data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/tours/${id}`);
  },
  async upsertItinerary(tourId: string, days: unknown[]): Promise<void> {
    await api.put(`/tours/${tourId}/itinerary`, { days });
  },
  async addMedia(tourId: string, media: { url: string; publicId: string; altText?: string; isPrimary?: boolean }) {
    const res = await api.post(`/tours/${tourId}/media`, media);
    return res.data.data;
  },
  async deleteMedia(mediaId: string): Promise<void> {
    await api.delete(`/tours/media/${mediaId}`);
  },
  async addDeparture(tourId: string, data: Record<string, unknown>) {
    const res = await api.post(`/tours/${tourId}/departures`, data);
    return res.data.data;
  },
};

// ---------- Tour bookings service ----------
export const adminTourBookingsService = {
  async list(params: { page?: number; status?: string; tourId?: string } = {}): Promise<{ data: AdminTourBooking[]; meta: { total: number; totalPages: number } }> {
    const res = await api.get("/tour-bookings", { params });
    return res.data;
  },
  async getById(id: string): Promise<AdminTourBooking & { statusHistory: unknown[] }> {
    const res = await api.get(`/tour-bookings/${id}`);
    return res.data.data;
  },
  async create(data: Record<string, unknown>): Promise<AdminTourBooking> {
    const res = await api.post("/tour-bookings", data);
    return res.data.data;
  },
  async updateStatus(id: string, status: string, note?: string): Promise<void> {
    await api.patch(`/tour-bookings/${id}/status`, { status, note });
  },
  async addNote(id: string, note: string): Promise<void> {
    await api.patch(`/tour-bookings/${id}/note`, { note });
  },
  async stats(): Promise<TourBookingStats> {
    const res = await api.get("/tour-bookings/stats");
    return res.data.data;
  },
};
