import { useEffect } from "react";

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  schema?: Record<string, unknown>;
}

const SITE_NAME = "Fayul Retreat — Himalayas Tour & Travel";
const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://fayulretreat.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;

export function useSeo({
  title,
  description = "Discover handcrafted Himalayan tours — Spiti Valley, Kinnaur, Manali & beyond. Expert-guided, small-group journeys from Shimla.",
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  noIndex = false,
  schema,
}: SeoHeadProps = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = url ? `${SITE_URL}${url}` : undefined;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    // Primary meta
    setMeta("description", description);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");
    if (canonical) setLink("canonical", canonical);

    // Open Graph
    setMeta("og:type", type, "property");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", image, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    if (canonical) setMeta("og:url", canonical, "property");

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    // JSON-LD Schema
    if (schema) {
      const id = "tour-schema-ld";
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement("script");
        el.id = id;
        el.type = "application/ld+json";
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(schema);
    }
  }, [fullTitle, description, image, canonical, type, noIndex, schema]);
}

// ─── Schema builders ──────────────────────────────────────────
export function buildTourSchema(tour: {
  title: string;
  summary: string;
  basePriceInr: string | null;
  durationDays: number | null;
  slug: string;
  destination: { name: string };
  media?: { url: string; isPrimary?: boolean }[];
}): Record<string, unknown> {
  const primaryImage = tour.media?.find((m) => m.isPrimary)?.url ?? tour.media?.[0]?.url;

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.summary,
    url: `${SITE_URL}/tours/${tour.slug}`,
    touristType: "AdventureTravel",
    itinerary: {
      "@type": "ItemList",
      name: `${tour.durationDays}-day itinerary`,
    },
    ...(primaryImage && { image: primaryImage }),
    ...(tour.basePriceInr && {
      offers: {
        "@type": "Offer",
        price: tour.basePriceInr,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString().split("T")[0],
      },
    }),
    organizer: {
      "@type": "TravelAgency",
      name: "Fayul Retreat",
      url: SITE_URL,
    },
    location: {
      "@type": "Place",
      name: tour.destination.name,
      address: { "@type": "PostalAddress", addressRegion: "Himachal Pradesh", addressCountry: "IN" },
    },
  };
}

export function buildDestinationSchema(dest: {
  name: string;
  description: string | null;
  slug: string;
  region: string | null;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: dest.name,
    description: dest.description ?? "",
    url: `${SITE_URL}/destinations/${dest.slug}`,
    touristType: ["AdventureTravel", "Cultural"],
    geo: { "@type": "GeoCoordinates", addressCountry: "IN", addressRegion: dest.region ?? "Himachal Pradesh" },
  };
}

export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Fayul Retreat",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: "Handcrafted small-group Himalayan tours from Shimla — Spiti, Kinnaur, Manali, Dharamshala and beyond.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Hotel Hilllands, New Shimla",
      addressLocality: "Shimla",
      addressRegion: "Himachal Pradesh",
      postalCode: "171009",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: ["https://www.instagram.com/fayulretreat", "https://www.facebook.com/fayulretreat"],
  };
}