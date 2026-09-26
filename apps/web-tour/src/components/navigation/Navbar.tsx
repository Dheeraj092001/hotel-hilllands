import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { APP_NAME } from "@/lib/constants";
import { scrollTo } from "@/hooks/useLenis";

const NAV_LINKS = [
  { href: "/",            label: "Home" },
  { href: "/destinations",label: "Destinations" },
  { href: "/tours",       label: "Tours" },
  { href: "/journal",     label: "Journal" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Detect scroll for sticky header glass effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      ref={navRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-400 ease-brand",
        scrolled
          ? "glass-card shadow-sm shadow-pine/10 border-b border-pine/10"
          : "bg-transparent"
      )}
      role="banner"
    >
      <nav
        className="mx-auto flex max-w-wide items-center justify-between px-6 py-4 lg:px-12"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 focus-visible:outline-forest"
          aria-label={`${APP_NAME} — Home`}
        >
          <span className="h-8 w-8 rounded-full bg-pine flex items-center justify-center text-cloud text-xs font-bold">H</span>
          <span
            className={cn(
              "font-serif text-lg leading-none transition-colors",
              scrolled ? "text-ink" : "text-cloud"
            )}
          >
            Himalaya&apos;s
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <NavLink
                to={href}
                end={href === "/"}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-alpine-sun",
                    scrolled ? "text-ink" : "text-cloud/90",
                    isActive && (scrolled ? "text-forest" : "text-cloud")
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={() => scrollTo("#enquire")}
            className="rounded-brand bg-alpine-sun px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-alpine-sun"
          >
            Plan Your Trip
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={cn("md:hidden p-2 rounded-brand", scrolled ? "text-ink" : "text-cloud")}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden overflow-hidden transition-all duration-400 ease-brand glass-card border-t border-pine/10",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-1 px-6 py-4" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <NavLink
                to={href}
                end={href === "/"}
                className={({ isActive }) =>
                  cn(
                    "block py-2.5 text-sm font-medium text-ink hover:text-forest",
                    isActive && "text-forest"
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className="pt-2">
            <Link
              to="/enquire"
              className="block rounded-brand bg-pine px-4 py-3 text-center text-sm font-semibold text-cloud"
            >
              Plan Your Trip
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}