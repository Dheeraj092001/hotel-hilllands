import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Copy, Calendar, MapPin, Phone, ArrowRight, Download } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { toast } from "sonner";

export default function BookingConfirmationPage() {
  const [searchParams] = useSearchParams();

  const confirmationNumber = searchParams.get("confirmation") || "NLS-837492";
  const roomName = searchParams.get("room") || "The Governor's Heritage Suite";
  const nights = searchParams.get("nights") || "2";
  const total = searchParams.get("total") || "34,220";

  useEffect(() => {
    document.title = `Reservation Confirmed (${confirmationNumber}) — Hotel Newlands`;
  }, [confirmationNumber]);

  const copyConfirmation = () => {
    navigator.clipboard.writeText(confirmationNumber);
    toast.success("Confirmation number copied to clipboard");
  };

  return (
    <div className="pt-32 pb-24 bg-warm-ivory min-h-screen text-charcoal flex items-center">
      <Container size="md">
        <div className="bg-white p-8 sm:p-14 rounded-sm border border-black/8 shadow-2xl text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-himalayan-green block mb-2">
            Reservation Guaranteed
          </span>

          <h1 className="font-display text-3xl sm:text-5xl font-normal text-charcoal mb-4">
            We Await Your Arrival in the Hills
          </h1>

          <p className="text-sm sm:text-base text-muted-stone max-w-lg mx-auto font-light leading-relaxed mb-8">
            Your stay at Hotel Newlands Shimla has been confirmed. A formal reservation voucher has been
            dispatched to your registered email address.
          </p>

          {/* Confirmation Number Badge */}
          <div className="inline-flex items-center gap-3 bg-warm-ivory px-6 py-3 rounded-sm border border-black/10 mb-10">
            <span className="text-xs uppercase tracking-wider text-muted-stone">Confirmation Code:</span>
            <span className="font-mono text-xl font-bold text-deep-forest tracking-wider">
              {confirmationNumber}
            </span>
            <button
              onClick={copyConfirmation}
              aria-label="Copy code"
              className="p-1 hover:bg-black/5 rounded text-muted-stone hover:text-charcoal transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left p-6 bg-warm-ivory/50 rounded-sm border border-black/8 mb-10">
            <div>
              <span className="text-[11px] text-muted-stone uppercase tracking-wider block mb-1">
                Sanctuary Suite
              </span>
              <span className="font-display text-lg font-medium text-charcoal">{roomName}</span>
            </div>
            <div>
              <span className="text-[11px] text-muted-stone uppercase tracking-wider block mb-1">
                Stay Length
              </span>
              <span className="font-display text-lg font-medium text-charcoal">{nights} Nights</span>
            </div>
            <div>
              <span className="text-[11px] text-muted-stone uppercase tracking-wider block mb-1">
                Settled Total
              </span>
              <span className="font-display text-lg font-bold text-deep-forest">
                ₹{Number(total).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Next Steps / Helpful Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs text-muted-stone border-t border-black/8 pt-8 mb-10">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-himalayan-green shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal block mb-0.5">Arrival Directions</strong>
                Located on Upper Chotta Shimla Ridge. Valet staff will greet you at the lower entrance gate.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-himalayan-green shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal block mb-0.5">Duty Manager Hotline</strong>
                Reach out anytime at +91 00000 00000 for early check-in, luggage assistance or dining requests.
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard/bookings">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View in Guest Dashboard
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
