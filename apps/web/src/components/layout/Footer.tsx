import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1A] text-[#F7F3EA]/70">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl text-[#F7F3EA] mb-3">Hotel Newlands Shimla</h3>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              A luxury mountain retreat where Himalayan grandeur meets curated hospitality.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="hover:text-[#D9C7A3] transition-colors"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-[#D9C7A3] transition-colors"><Facebook size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-[#D9C7A3] mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[["Rooms & Suites", "/rooms"], ["Dining", "/dining"], ["Experiences", "/experiences"],
                ["Gallery", "/gallery"], ["Offers", "/offers"], ["About", "/about"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-[#F7F3EA] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-[#D9C7A3] mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#D9C7A3]" />
                <span>Shimla, Himachal Pradesh, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#D9C7A3]" />
                <a href="tel:+910000000000" className="hover:text-[#F7F3EA] transition-colors">+91 00000 00000</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#D9C7A3]" />
                <a href="mailto:info@hotelnewlandsshimla.com" className="hover:text-[#F7F3EA] transition-colors text-xs">
                  info@hotelnewlandsshimla.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#F7F3EA]/10 mt-12 pt-6 flex flex-col md:flex-row justify-between gap-4 text-xs text-[#F7F3EA]/40">
          <p>© {new Date().getFullYear()} Hotel Newlands Shimla. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-[#F7F3EA]/70 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#F7F3EA]/70 transition-colors">Terms of Service</Link>
            <Link to="/cancellation-policy" className="hover:text-[#F7F3EA]/70 transition-colors">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
