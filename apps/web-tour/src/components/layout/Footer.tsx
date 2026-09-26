import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, Facebook, Youtube } from "lucide-react";
import { APP_NAME, BRAND_EMAIL, BRAND_PHONE } from "@/lib/constants";

const footerLinks = {
  explore: [
    { href: "/tours",        label: "All Tours" },
    { href: "/destinations", label: "Destinations" },
    { href: "/journal",      label: "Journal" },
    { href: "/enquire",      label: "Custom Trips" },
  ],
  legal: [
    { href: "/privacy",   label: "Privacy Policy" },
    { href: "/terms",     label: "Terms & Conditions" },
    { href: "/refunds",   label: "Refund Policy" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cloud/80" aria-label="Site footer">
      {/* Top CTA band */}
      <div className="bg-pine py-12 px-6 text-center">
        <p className="eyebrow text-alpine-sun mb-3">Ready to explore?</p>
        <h2 className="text-display-md font-serif text-cloud mb-6">
          Your Himalayan adventure<br />starts with a conversation.
        </h2>
        <Link
          to="/enquire"
          className="inline-flex items-center gap-2 rounded-brand bg-alpine-sun px-8 py-3.5 text-sm font-semibold text-ink hover:opacity-90 transition-opacity"
        >
          Plan My Trip
        </Link>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-wide px-6 lg:px-12 py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-serif text-xl text-cloud mb-4 block hover:text-alpine-sun transition-colors">
              {APP_NAME}
            </Link>
            <p className="text-sm text-cloud/60 leading-relaxed mb-6">
              Crafting authentic Himalayan experiences since 2010. Based in Shimla, Himachal Pradesh.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-cloud/50 hover:text-alpine-sun transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-cloud/50 hover:text-alpine-sun transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-cloud/50 hover:text-alpine-sun transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="text-eyebrow text-cloud/40 mb-5">Explore</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.explore.map(({ href, label }) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-cloud/70 hover:text-cloud transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-eyebrow text-cloud/40 mb-5">Legal</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.legal.map(({ href, label }) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-cloud/70 hover:text-cloud transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-eyebrow text-cloud/40 mb-5">Contact</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a href={`mailto:${BRAND_EMAIL}`} className="flex items-center gap-3 text-sm text-cloud/70 hover:text-cloud transition-colors">
                  <Mail size={15} className="text-alpine-sun shrink-0" />
                  {BRAND_EMAIL}
                </a>
              </li>
              <li>
                <a href={`tel:${BRAND_PHONE.replace(/\s/g,"")}`} className="flex items-center gap-3 text-sm text-cloud/70 hover:text-cloud transition-colors">
                  <Phone size={15} className="text-alpine-sun shrink-0" />
                  {BRAND_PHONE}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-16 border-t border-cloud/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cloud/40">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-cloud/30">
            Designed with ♥ for the mountains.
          </p>
        </div>
      </div>
    </footer>
  );
}