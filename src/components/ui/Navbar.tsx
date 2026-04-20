"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, MountainSnow } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { 
      name: "Packages", 
      href: "/packages",
      dropdown: [
        { name: "Honeymoon Packages", href: "/packages/honeymoon" },
        { name: "Family Packages", href: "/packages/family" },
        { name: "Adventure Tours", href: "/packages/adventure" },
        { name: "Offbeat Himachal", href: "/packages/offbeat" },
      ]
    },
    { 
      name: "Destinations", 
      href: "/destinations",
      dropdown: [
        { name: "Shimla", href: "/destinations/shimla" },
        { name: "Manali", href: "/destinations/manali" },
        { name: "Dharamshala", href: "/destinations/dharamshala" },
        { name: "Spiti Valley", href: "/destinations/spiti-valley" },
        { name: "Kinnaur", href: "/destinations/kinnaur" },
      ]
    },
    { name: "Cab Services", href: "/cab" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 pt-4 md:pt-6 px-4 md:px-8`}
    >
      <div className={`max-w-7xl mx-auto w-full flex items-center justify-between transition-all duration-500 rounded-full px-5 md:px-8 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] border border-slate-200/50 py-3 md:py-4"
          : "bg-transparent border border-transparent py-2 md:py-3"
      }`}>
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group whitespace-nowrap">
            <div className={`p-2 rounded-xl transition-all duration-500 ${isScrolled ? 'bg-forest-600 text-white shadow-md bg-amber-500 group-hover:text-slate-900' : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 group-hover:bg-white/20'}`}>
              <MountainSnow className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className={`font-outfit font-bold text-lg md:text-xl tracking-wide transition-colors duration-500 whitespace-nowrap ${isScrolled ? 'text-slate-900 group-hover:text-forest-700' : 'text-white'}`}>
              Himvigo
            </span>
          </Link>
        </div>
 
        {/* Desktop Links */}
        <div className="hidden md:flex justify-center items-center gap-8 whitespace-nowrap">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group/item">
              <Link
                href={link.href}
                className={`flex items-center gap-1 font-semibold text-[13px] uppercase tracking-wider transition-colors font-outfit py-4 whitespace-nowrap ${
                  isScrolled ? "text-slate-600 hover:text-amber-500" : "text-white/80 hover:text-white drop-shadow-sm"
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
                      className="block px-6 py-2.5 text-[13px] font-medium text-slate-600 hover:text-amber-600 hover:bg-slate-50 transition-colors"
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
                ? "bg-slate-900 text-white hover:bg-forest-700 hover:shadow-forest-700/20"
                : "bg-amber-500 text-slate-900 hover:bg-amber-400 hover:shadow-amber-500/30"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-100 py-8 px-6 md:hidden flex flex-col gap-6 overflow-y-auto max-h-[80vh] scrollbar-hide z-50"
          >
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    className="text-slate-900 font-extrabold font-outfit text-xl tracking-tight"
                    onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </div>
                
                {link.dropdown && (
                  <div className="grid grid-cols-1 gap-2 pl-4 border-l-2 border-slate-100 ml-1">
                    {link.dropdown.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="text-slate-500 font-medium font-inter text-sm py-2 hover:text-amber-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-6 bg-slate-900 text-white text-center py-4 rounded-2xl font-bold font-outfit shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
            >
              Get a Quote
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
