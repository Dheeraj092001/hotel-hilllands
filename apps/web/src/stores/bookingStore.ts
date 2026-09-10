import { create } from "zustand";

interface BookingSearch {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

interface BookingState {
  search: BookingSearch;
  setSearch: (search: Partial<BookingSearch>) => void;
  resetSearch: () => void;
}

const defaultSearch: BookingSearch = {
  checkIn: "",
  checkOut: "",
  adults: 1,
  children: 0,
  rooms: 1,
};

export const useBookingStore = create<BookingState>()((set) => ({
  search: defaultSearch,
  setSearch: (search) =>
    set((state) => ({ search: { ...state.search, ...search } })),
  resetSearch: () => set({ search: defaultSearch }),
}));
