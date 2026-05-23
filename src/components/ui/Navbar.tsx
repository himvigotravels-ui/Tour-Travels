"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Home, Briefcase, MapPin, Mountain, Car, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InternalPage {
  title: string;
  slug: string;
  type: string;
}

interface NavDestination {
  name: string;
  slug: string;
}

export const Navbar = ({
  internalPages = [],
  destinations = [],
}: {
  internalPages?: InternalPage[];
  destinations?: NavDestination[];
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

  if (isAdminRoute) return null;

  const packageDropdown = internalPages
    .filter((p) => p.type === "package")
    .map((p) => ({ name: p.title, href: `/packages/${p.slug}` }));

  const trekDropdown = internalPages
    .filter((p) => p.type === "trek")
    .map((p) => ({ name: p.title, href: `/treks/${p.slug}` }));

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

  const navLinks = [
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-100 md:hidden z-50 max-h-[85vh] flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-32 scrollbar-hide">
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
                      className={`flex items-center gap-3 py-3.5 px-2 rounded-xl active:bg-slate-100 transition-colors ${
                        isActive ? "text-brand-orange" : "text-slate-900"
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
                  <div key={link.name} className="border-b border-slate-100 last:border-b-0">
                    <div className="flex items-stretch">
                      {/* Tapping the title navigates to the section parent page */}
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex-1 flex items-center gap-3 py-3.5 px-2 active:bg-slate-50 transition-colors rounded-l-xl ${
                          isActive ? "text-brand-orange" : "text-slate-900"
                        }`}
                      >
                        <Icon className="w-5 h-5 opacity-70" />
                        <span className="font-bold font-outfit text-base tracking-tight">
                          {link.name}
                        </span>
                      </Link>
                      {/* Separate tap target for expand/collapse */}
                      <button
                        type="button"
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${link.name}`}
                        onClick={() =>
                          setOpenSection(isOpen ? null : link.name)
                        }
                        className="px-4 flex items-center justify-center active:bg-slate-100 transition-colors rounded-r-xl"
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
                          <div className="pl-10 pr-2 pb-3 grid grid-cols-1 gap-0.5">
                            {link.dropdown.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-slate-500 font-medium font-inter text-[15px] py-2.5 px-2 rounded-lg hover:text-brand-orange active:bg-slate-50 transition-colors"
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
            </div>

            {/* Sticky CTA pinned above any floating widgets (e.g. WhatsApp) */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-5 bg-gradient-to-t from-white via-white to-white/85 backdrop-blur-sm border-t border-slate-100">
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full bg-brand-orange text-white text-center py-3.5 rounded-2xl font-bold font-outfit shadow-lg shadow-brand-orange/20 active:scale-[0.98] transition-all"
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
