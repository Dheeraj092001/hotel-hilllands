import { useSeo } from "@/components/seo/useSeo";

export default function LegalPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  useSeo({
    title,
    description: subtitle,
  });

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-editorial mx-auto">
      <p className="eyebrow mb-2">Legal & Policies</p>
      <h1 className="text-display-md font-serif text-ink mb-4">{title}</h1>
      <p className="text-stone text-sm mb-10 leading-relaxed border-b border-stone/20 pb-6">
        {subtitle}
      </p>

      <div className="prose prose-stone max-w-none text-ink/80 text-sm leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="Last updated: September 2026. How Fayul Retreat / Himalayas Tour & Travel protects and respects your personal information."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-semibold text-ink">1. Information We Collect</h2>
        <p>
          When you submit an enquiry, request a custom itinerary, or book a Himalayan tour with us, we collect personal information including your full name, email address, phone number / WhatsApp contact, travel dates, party size, and specific travel preferences or dietary/medical requirements necessary for high-altitude trekking and touring.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-semibold text-ink">2. How We Use Your Information</h2>
        <p>
          We use your data strictly to curate personalized travel itineraries, coordinate mountain stays, arrange transport logistics across Himachal Pradesh, Kinnaur, Spiti, and Ladakh, issue statutory permits, and contact you regarding your reservation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-semibold text-ink">3. Data Security & Third Parties</h2>
        <p>
          We do not sell, rent, or trade your personal data. Information is shared only with verified local drivers, certified high-altitude guides, and government permit authorities where mandated by regional regulations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-semibold text-ink">4. Contact Us</h2>
        <p>
          For questions or data deletion requests, contact our privacy desk at: <strong>privacy@fayulretreat.com</strong> or call our Shimla desk at <strong>+91 98160 00000</strong>.
        </p>
      </section>
    </LegalPage>
  );
}

export function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      subtitle="Guidelines and operating agreements governing bookings, excursions, and travel operations with Fayul Retreat."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-semibold text-ink">1. Booking & Confirmations</h2>
        <p>
          All tour reservations are subject to written confirmation from Fayul Retreat / Himalayas Tour & Travel. A non-refundable advance deposit is required to secure vehicles, certified guides, and boutique heritage homestays.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-semibold text-ink">2. High-Altitude & Mountain Hazards</h2>
        <p>
          Travel in Spiti Valley, Kinnaur, and high Himalayan passes involves inherent risks including sudden weather shifts, road closures, landslides, and acute mountain sickness (AMS). Guests agree to comply with guide safety instructions and medical advisories at all times.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-semibold text-ink">3. Itinerary Alterations</h2>
        <p>
          We prioritize guest safety above all else. In the event of road blockages (e.g., Rohtang / Kunzum Pass closures), our certified expedition leaders reserve the right to alter the route or schedule without prior notice.
        </p>
      </section>
    </LegalPage>
  );
}

export function CancellationPage() {
  return (
    <LegalPage
      title="Cancellation & Refund Policy"
      subtitle="Clear and fair terms regarding expedition cancellations, postponements, and weather disruptions."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-semibold text-ink">1. Standard Cancellation Schedule</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>30+ days prior to departure:</strong> 85% refund of total tour cost (15% service & permit fee retained).</li>
          <li><strong>15 to 29 days prior:</strong> 50% refund of total tour cost.</li>
          <li><strong>Less than 14 days prior:</strong> Non-refundable due to non-recoverable accommodation and vehicle blockages.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-semibold text-ink">2. Weather & Natural Calamity Disruptions</h2>
        <p>
          If a tour cannot commence due to natural disasters or district administration travel advisories, guests receive a 100% trip credit voucher valid for 18 months towards any future Himalayan itinerary.
        </p>
      </section>
    </LegalPage>
  );
}
