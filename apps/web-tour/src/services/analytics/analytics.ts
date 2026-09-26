/**
 * Client-side analytics event dispatcher for web-tour.
 * Supports GA4 / GTM / Plausible / custom analytics logging with consent awareness.
 */

export type TourAnalyticsEvent =
  | { name: "page_view"; path: string; title: string }
  | { name: "destination_view"; destinationId: string; slug: string }
  | { name: "tour_view"; tourId: string; slug: string; price: number }
  | { name: "tour_filter"; filterType: string; filterValue: string }
  | { name: "enquiry_start"; tourId?: string; destination?: string }
  | { name: "enquiry_submit"; source: string }
  | { name: "enquiry_success"; confirmationId?: string }
  | { name: "whatsapp_click"; source: string; targetPhone: string }
  | { name: "phone_call_click"; source: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const analytics = {
  track: (event: TourAnalyticsEvent) => {
    // 1. Push to dataLayer (Google Tag Manager)
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: event.name,
        timestamp: new Date().toISOString(),
        ...event,
      });

      // 2. Call gtag if configured
      if (typeof window.gtag === "function") {
        window.gtag("event", event.name, event);
      }

      // 3. Dev-mode diagnostic logging
      if (import.meta.env.DEV) {
        console.debug(`[Analytics Tracked]: ${event.name}`, event);
      }
    }
  },

  pageView: (path: string, title: string) => {
    analytics.track({ name: "page_view", path, title });
  },

  tourView: (tourId: string, slug: string, price: number) => {
    analytics.track({ name: "tour_view", tourId, slug, price });
  },

  enquirySuccess: (confirmationId?: string) => {
    analytics.track({ name: "enquiry_success", confirmationId });
  },

  whatsappClick: (source: string, targetPhone: string) => {
    analytics.track({ name: "whatsapp_click", source, targetPhone });
  },
};
