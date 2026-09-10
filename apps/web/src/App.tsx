import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuthInit } from "./hooks/useAuthInit";
import { AuthProvider } from "./components/AuthProvider";
import PublicLayout from "./layouts/PublicLayout";
import PageLoader from "./components/ui/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages — lazy loaded
const HomePage = lazy(() => import("./pages/HomePage"));
const RoomsPage = lazy(() => import("./pages/RoomsPage"));
const RoomDetailPage = lazy(() => import("./pages/RoomDetailPage"));
const DiningPage = lazy(() => import("./pages/DiningPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const ExperiencesPage = lazy(() => import("./pages/ExperiencesPage"));
const OffersPage = lazy(() => import("./pages/OffersPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LocationPage = lazy(() => import("./pages/LocationPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Booking pages
const BookingSearchPage = lazy(() => import("./pages/BookingSearchPage"));
const BookingCheckoutPage = lazy(() => import("./pages/BookingCheckoutPage"));
const BookingConfirmationPage = lazy(() => import("./pages/BookingConfirmationPage"));

// Guest dashboard
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const ProfilePage = lazy(() => import("./pages/dashboard/ProfilePage"));
const MyBookingsPage = lazy(() => import("./pages/dashboard/MyBookingsPage"));
const BookingDetailPage = lazy(() => import("./pages/dashboard/BookingDetailPage"));
const MyInvoicesPage = lazy(() => import("./pages/dashboard/MyInvoicesPage"));
const MyReviewsPage = lazy(() => import("./pages/dashboard/MyReviewsPage"));
const NotificationsPage = lazy(() => import("./pages/dashboard/NotificationsPage"));

export default function App() {
  useAuthInit();

  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="rooms/:slug" element={<RoomDetailPage />} />
            <Route path="dining" element={<DiningPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="experiences" element={<ExperiencesPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="location" element={<LocationPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="book" element={<BookingSearchPage />} />
            <Route path="book/checkout" element={<BookingCheckoutPage />} />
            <Route path="book/confirmation/:id" element={<BookingConfirmationPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Guest Dashboard — Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ProfilePage />} />
            <Route path="bookings" element={<MyBookingsPage />} />
            <Route path="bookings/:id" element={<BookingDetailPage />} />
            <Route path="invoices" element={<MyInvoicesPage />} />
            <Route path="reviews" element={<MyReviewsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
