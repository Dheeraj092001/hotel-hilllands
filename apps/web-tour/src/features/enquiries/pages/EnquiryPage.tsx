import { EnquiryForm } from "@/components/forms/EnquiryForm";

export default function EnquiryPage() {
  return (
    <div className="pt-24 section-pad">
      <div className="mx-auto max-w-editorial px-6 lg:px-12">
        <p className="eyebrow mb-3">Get in touch</p>
        <h1 className="text-display-lg font-serif text-ink mb-4">Plan your trip</h1>
        <p className="text-lead text-stone mb-12 max-w-lg">Tell us your dream and our Himalayan experts will design a personalised itinerary within 24 hours — no obligation.</p>
        <div className="bg-glacier/40 rounded-brand p-8 lg:p-12">
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}