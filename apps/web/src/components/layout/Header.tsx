import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const NAV_LINKS = [
  { to: "/rooms", label: "Rooms & Suites" },
  { to: "/dining", label: "Dining" },
  { to: "/experiences", label: "Experiences" },
  { to: "/gallery", label: "Gallery" },
  { to: "/offers", label: "Offers" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      scrolled ? "bg-[#183C32] shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-serif text-xl text-[#F7F3EA] tracking-wide">Hotel Newlands</span>
          <span className="text-[10px] tracking-[0.3em] text-[#D9C7A3] uppercase">Shimla</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${isActive ? "text-[#D9C7A3]" : "text-[#F7F3EA]/80 hover:text-[#F7F3EA]"}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="text-sm text-[#F7F3EA]/80 hover:text-[#F7F3EA] transition-colors">
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link to="/login" className="text-sm text-[#F7F3EA]/80 hover:text-[#F7F3EA] transition-colors">
              Sign In
            </Link>
          )}
          <Link to="/book"
            className="bg-[#D9C7A3] text-[#1C1C1A] text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-[#F7F3EA] transition-colors">
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-[#F7F3EA] p-2" aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#183C32] border-t border-[#315C4A]">
            <nav className="flex flex-col px-6 py-4 gap-4">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                  className="text-[#F7F3EA]/80 hover:text-[#F7F3EA] py-2 border-b border-[#315C4A]/50 transition-colors">
                  {label}
                </NavLink>
              ))}
              <Link to="/book" onClick={() => setMenuOpen(false)}
                className="mt-2 bg-[#D9C7A3] text-[#1C1C1A] text-center py-3 font-medium">
                Book Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
