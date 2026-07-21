"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu, X, ChevronDown,
  Home, Briefcase, MapPin, Mountain, Car, Info,
  Phone, MessageCircle, Mail, MapPinned, Landmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InternalPage {
  title: string;
  slug: string;
  type: string;
}

type DropdownItem = { name: string; href: string };
type NavLink = {
  name: string;
  href: string;
  icon: React.ElementType;
  dropdown?: DropdownItem[];
};

interface NavDestination {
  name: string;
  slug: string;
}

interface NavContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
}

export const Navbar = ({
  internalPages = [],
  destinations = [],
  contact = {},
}: {
  internalPages?: InternalPage[];
  destinations?: NavDestination[];
  contact?: NavContact;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;
  // Drawer is reset via onClick handlers on each Link — no effect needed.

  useEffect(() => {
    if (isAdminRoute) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdminRoute]);

  // Lock body scroll while the slide-in drawer is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  if (isAdminRoute) return null;

  const packageDropdown = internalPages
    .filter((p) => p.type === "package")
    .map((p) => ({ name: p.title, href: `/packages/${p.slug}` }));

  const trekDropdown = internalPages
    .filter((p) => p.type === "trek")
    .map((p) => ({ name: p.title, href: `/treks/${p.slug}` }));

  // Yatras: a flat dropdown of yatra nav-groups (the category landing
  // pages, e.g. "Major Pilgrimages"), mirroring the Treks dropdown.
  const yatraDropdown = internalPages
    .filter((p) => p.type === "yatra")
    .map((p) => ({ name: p.title, href: `/yatras/${p.slug}` }));

  // Destinations dropdown = curated nav-groups first, then real
  // destinations from the destinations table (so admins see all actual
  // destinations they create — not just hand-picked groups).
  const navGroupDestinations = internalPages
    .filter((p) => p.type === "destination")
    .map((p) => ({ name: p.title, href: `/destinations/${p.slug}` }));

  const realDestinations = destinations.map((d) => ({
    name: d.name,
    href: `/destinations/${d.slug}`,
  }));

  // Merge, dedupe by href, cap to a sensible nav size
  const seen = new Set<string>();
  const destinationDropdown = [
    ...navGroupDestinations,
    ...realDestinations,
  ]
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .slice(0, 12);

  const navLinks: NavLink[] = [
    { name: "Home", href: "/", icon: Home },
    {
      name: "Packages",
      href: "/packages",
      icon: Briefcase,
      dropdown: packageDropdown.length > 0 ? packageDropdown : [
        { name: "Honeymoon Packages", href: "/packages/honeymoon" },
        { name: "Family Packages", href: "/packages/family" },
        { name: "Adventure Tours", href: "/packages/adventure" },
        { name: "Offbeat Himachal", href: "/packages/offbeat" },
      ]
    },
    {
      name: "Destinations",
      href: "/destinations",
      icon: MapPin,
      dropdown:
        destinationDropdown.length > 0
          ? destinationDropdown
          : [{ name: "All Destinations", href: "/destinations" }],
    },
    {
      name: "Treks",
      href: "/treks",
      icon: Mountain,
      dropdown:
        trekDropdown.length > 0
          ? trekDropdown
          : [{ name: "All Treks", href: "/treks" }],
    },
    {
      name: "Yatras",
      href: "/yatras",
      icon: Landmark,
      dropdown:
        yatraDropdown.length > 0
          ? yatraDropdown
          : [{ name: "All Yatras", href: "/yatras" }],
    },
    { name: "Cab Services", href: "/cab", icon: Car },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 pt-4 md:pt-6 px-4 md:px-8`}
    >
      <div className={`max-w-7xl mx-auto w-full flex items-center justify-between transition-all duration-500 rounded-full px-5 md:px-8 ${
        isScrolled
          ? "bg-white shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] border border-slate-200/50 py-3 md:py-4"
          : "bg-transparent border border-transparent py-2 md:py-3"
      }`}>
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group whitespace-nowrap">
            <img 
              src={isScrolled ? "/logo.svg" : "/logo-white.svg"} 
              alt="Himvigo Logo" 
              className="h-8 md:h-10 w-auto object-contain transition-opacity duration-300"
            />
          </Link>
        </div>
 
        {/* Desktop Links */}
        <div className="hidden md:flex justify-center items-center gap-8 whitespace-nowrap">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group/item">
              <Link
                href={link.href}
                className={`flex items-center gap-1 font-semibold text-[13px] uppercase tracking-wider transition-colors font-outfit py-4 whitespace-nowrap ${
                  isScrolled ? "text-slate-600 hover:text-brand-orange" : "text-white/80 hover:text-white drop-shadow-sm"
                }`}
              >
                {link.name}
                {link.dropdown && (
                  <svg className="w-3.5 h-3.5 opacity-60 group-hover/item:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>

              {link.dropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-white shadow-2xl rounded-2xl py-3 border border-slate-100 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 translate-y-2 group-hover/item:translate-y-0 z-[60]">
                  {link.dropdown.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block px-6 py-2.5 text-[13px] font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50 transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex justify-end">
          <Link
            href="/contact"
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-block whitespace-nowrap ${
              isScrolled
                ? "bg-brand-blue text-white hover:bg-brand-blue/90 hover:shadow-brand-blue/20"
                : "bg-brand-orange text-white hover:bg-brand-orange/90 hover:shadow-brand-orange/30"
            }`}
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 rounded-full transition-colors ${isScrolled ? "bg-slate-100/50 hover:bg-slate-100 text-slate-900" : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile slide-in sidebar (fixed full-height drawer + backdrop) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop — tap to close */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/55 backdrop-blur-[2px] z-[105] md:hidden"
              aria-hidden="true"
            />

            {/* Drawer — slides in from the right */}
            <motion.aside
              key="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
              className="fixed top-0 right-0 h-screen w-full sm:max-w-sm bg-white shadow-2xl z-[110] md:hidden flex flex-col"
              role="dialog"
              aria-label="Site navigation"
            >
              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center"
                >
                  <img src="/logo.svg" alt="Himvigo" className="h-8 w-auto" />
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              {/* Scrollable nav links — scrolls ONLY when content overflows */}
              <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-3 scrollbar-hide">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isOpen = openSection === link.name;
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname?.startsWith(link.href));

                  if (!link.dropdown) {
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 py-3 px-3 rounded-xl active:bg-slate-100 transition-colors ${
                          isActive ? "text-brand-orange bg-brand-orange/5" : "text-slate-900"
                        }`}
                      >
                        <Icon className="w-5 h-5 opacity-70" />
                        <span className="font-bold font-outfit text-base tracking-tight">
                          {link.name}
                        </span>
                      </Link>
                    );
                  }

                  return (
                    <div key={link.name} className="rounded-xl overflow-hidden">
                      <div className="flex items-stretch">
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex-1 flex items-center gap-3 py-3 px-3 active:bg-slate-50 transition-colors ${
                            isActive ? "text-brand-orange" : "text-slate-900"
                          }`}
                        >
                          <Icon className="w-5 h-5 opacity-70" />
                          <span className="font-bold font-outfit text-base tracking-tight">
                            {link.name}
                          </span>
                        </Link>
                        <button
                          type="button"
                          aria-label={`${isOpen ? "Collapse" : "Expand"} ${link.name}`}
                          onClick={() => setOpenSection(isOpen ? null : link.name)}
                          className="px-3 flex items-center justify-center active:bg-slate-100 transition-colors"
                        >
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key={`${link.name}-sub`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-11 pr-2 pb-2 grid grid-cols-1 gap-0.5">
                              {link.dropdown?.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="text-slate-500 font-medium font-inter text-[15px] py-2 px-2 rounded-lg hover:text-brand-orange active:bg-slate-50 transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              {/* Footer — contact + Get in Touch (always visible) */}
              <div className="flex-shrink-0 border-t border-slate-100 bg-slate-50/60 px-5 pt-4 pb-5 space-y-3">
                {(contact.phone || contact.whatsapp || contact.email || contact.address) && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-2">
                      Reach us
                    </p>
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                        className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-brand-orange transition-colors"
                      >
                        <Phone className="w-4 h-4 text-brand-blue" />
                        <span className="font-medium">{contact.phone}</span>
                      </a>
                    )}
                    {contact.whatsapp && (
                      <a
                        href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-brand-orange transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">WhatsApp chat</span>
                      </a>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-brand-orange transition-colors break-all"
                      >
                        <Mail className="w-4 h-4 text-brand-blue" />
                        <span className="font-medium">{contact.email}</span>
                      </a>
                    )}
                    {contact.address && (
                      <div className="flex items-start gap-2.5 text-[12px] text-slate-500 leading-snug pt-0.5">
                        <MapPinned className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                        <span>{contact.address}</span>
                      </div>
                    )}
                  </div>
                )}

                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-brand-orange text-white text-center py-3.5 rounded-2xl font-bold font-outfit shadow-lg shadow-brand-orange/25 active:scale-[0.98] transition-all"
                >
                  Get in Touch
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
