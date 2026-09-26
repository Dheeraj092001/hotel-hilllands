import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { RootLayout } from "./RootLayout";
import { PageLoader } from "@/components/ui/PageLoader";

// Lazy-loaded pages
const HomePage         = lazy(() => import("@/features/tours/pages/HomePage"));
const ToursPage        = lazy(() => import("@/features/tours/pages/ToursPage"));
const TourDetailPage   = lazy(() => import("@/features/tours/pages/TourDetailPage"));
const DestinationsPage  = lazy(() => import("@/features/destinations/pages/DestinationsPage"));
const DestinationPage   = lazy(() => import("@/features/destinations/pages/DestinationPage"));
const EnquiryPage      = lazy(() => import("@/features/enquiries/pages/EnquiryPage"));
const JournalPage      = lazy(() => import("@/features/journal/pages/JournalPage"));
const NotFoundPage     = lazy(() => import("./NotFoundPage"));

// Legal pages
const PrivacyPage      = lazy(() => import("@/features/legal/LegalPages").then((m) => ({ default: m.PrivacyPage })));
const TermsPage        = lazy(() => import("@/features/legal/LegalPages").then((m) => ({ default: m.TermsPage })));
const CancellationPage = lazy(() => import("@/features/legal/LegalPages").then((m) => ({ default: m.CancellationPage })));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true,                 element: <HomePage /> },
      { path: "tours",               element: <ToursPage /> },
      { path: "tours/:slug",         element: <TourDetailPage /> },
      { path: "destinations",        element: <DestinationsPage /> },
      { path: "destinations/:slug",  element: <DestinationPage /> },
      { path: "enquire",             element: <EnquiryPage /> },
      { path: "plan-your-trip",      element: <EnquiryPage /> },
      { path: "contact",             element: <EnquiryPage /> },
      { path: "journal",             element: <JournalPage /> },
      { path: "privacy",             element: <PrivacyPage /> },
      { path: "terms",               element: <TermsPage /> },
      { path: "refunds",             element: <CancellationPage /> },
      { path: "cancellation-policy", element: <CancellationPage /> },
      { path: "*",                   element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}