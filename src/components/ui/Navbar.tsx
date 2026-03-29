"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, MountainSnow } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Packages", href: "/packages" },
    { name: "Destinations", href: "/destinations" },
    { name: "Taxi Services", href: "/taxi" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 top-0 pt-4 md:pt-6 px-4 md:px-8`}
    >
      <div className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 rounded-full px-5 md:px-8 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] border border-slate-200/50 py-3 md:py-4"
          : "bg-transparent border border-transparent py-2 md:py-3"
      }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className={`p-2 rounded-xl transition-all duration-500 ${isScrolled ? 'bg-forest-600 text-white shadow-md group-hover:bg-amber-500 group-hover:text-slate-900' : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 group-hover:bg-white/20'}`}>
            <MountainSnow className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className={`font-outfit font-bold text-lg md:text-xl tracking-wide transition-colors duration-500 ${isScrolled ? 'text-slate-900 group-hover:text-forest-700' : 'text-white'}`}>
            Himachal<span className="font-light">Trek</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`font-semibold text-[13px] uppercase tracking-wider transition-colors font-outfit ${
                isScrolled ? "text-slate-600 hover:text-amber-500" : "text-white/80 hover:text-white drop-shadow-sm"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-block ${
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 py-6 px-4 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-700 font-medium font-inter text-lg px-4 py-2 hover:bg-forest-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 mx-4 bg-forest-700 text-white text-center py-3 rounded-xl font-medium"
            >
              Get a Quote
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
