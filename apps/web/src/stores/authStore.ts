import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: string;
  permissions: string[];
  isEmailVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isInitialized: false,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),

      logout: () => set({ user: null }),

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        return user.permissions.includes(permission);
      },
    }),
    {
      name: "hn-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
