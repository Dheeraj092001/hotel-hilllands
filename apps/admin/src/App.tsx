import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { useAdminAuthStore } from "./stores/authStore";
import { Loader2 } from "lucide-react";

// Lazy-load pages
const OverviewPage = lazy(() => import("./pages/OverviewPage"));
const BookingsPage = lazy(() => import("./pages/BookingsPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const RoomsPage = lazy(() => import("./pages/RoomsPage"));
const HousekeepingPage = lazy(() => import("./pages/HousekeepingPage"));
const GuestsCrmPage = lazy(() => import("./pages/GuestsCrmPage"));
const CouponsPage = lazy(() => import("./pages/CouponsPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAdminAuthStore();
  // Allow initial access or user presence
  return <>{children}</>;
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#D9C7A3]" />
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="housekeeping" element={<HousekeepingPage />} />
          <Route path="guests" element={<GuestsCrmPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
