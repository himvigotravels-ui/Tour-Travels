"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  RiMailLine, 
  RiPhoneLine, 
  RiMapPinLine, 
  RiInstagramLine, 
  RiFacebookCircleLine, 
  RiYoutubeLine,
  RiWhatsappLine,
  RiArrowRightSLine
} from "react-icons/ri";

interface FooterProps {
  settings: Record<string, string>;
}

export const Footer = ({ settings }: FooterProps) => {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const siteName = settings.site_name || "Himvigo";
  const siteEmail = settings.site_email || "himvigotours@gmail.com";
  const sitePhone = settings.site_phone || "+91 98055 14018";
  const siteAddress = settings.site_address || "VPO - Prini, Tehsil - Manali, District - Kullu, HP 175131";
  
  const socialLinks = [
    { icon: RiInstagramLine, url: settings.site_instagram || "https://instagram.com/himvigo", label: "Instagram" },
    { icon: RiFacebookCircleLine, url: settings.site_facebook || "https://facebook.com/himvigo", label: "Facebook" },
    { icon: RiYoutubeLine, url: settings.site_youtube || "https://youtube.com/@himvigo", label: "YouTube" },
    { icon: RiWhatsappLine, url: `https://wa.me/${(settings.site_whatsapp || "919805514018").replace(/\+/g, '')}`, label: "WhatsApp" },
  ];

  return (
    <footer className="bg-brand-blue text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
        {/* Brand & Intro */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center group">
            <img src="/logo-white.svg" alt={`${siteName} Logo`} className="h-10 w-auto object-contain" />
          </Link>
          <p className="text-slate-300 text-sm leading-relaxed font-inter pr-4">
            Your premium travel partner for offbeat tours, secure cab services, and unforgettable memories in the heart of the Himalayas.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link, idx) => (
              <a 
                key={idx}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-white/5 rounded-xl hover:bg-brand-orange hover:text-white transition-all duration-300 text-slate-300"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-outfit font-semibold text-lg mb-6 text-white">Quick Links</h3>
          <ul className="space-y-3 text-sm font-inter text-slate-300">
            {[
              { label: "About Us", href: "/about" },
              { label: "Tour Packages", href: "/packages" },
              { label: "Cab Services", href: "/cab" },
              { label: "Top Destinations", href: "/destinations" },
              { label: "Travel Blog", href: "/blog" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-orange transition-colors flex items-center gap-2 group">
                  <RiArrowRightSLine className="w-4 h-4 text-white/20 group-hover:text-brand-orange" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-outfit font-semibold text-lg mb-6 text-white">Support</h3>
          <ul className="space-y-3 text-sm font-inter text-slate-300">
            {[
              { label: "Contact Us", href: "/contact" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Cancellation Policy", href: "/cancellation" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-orange transition-colors flex items-center gap-2 group">
                  <RiArrowRightSLine className="w-4 h-4 text-white/20 group-hover:text-brand-orange" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-outfit font-semibold text-lg mb-6 text-white">Contact Info</h3>
          <ul className="space-y-5 text-sm font-inter text-slate-300">
            <li className="flex items-start gap-4 group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-brand-orange group-hover:text-white transition-colors">
                <RiMapPinLine className="w-5 h-5 shrink-0" />
              </div>
              <span className="pt-1">{siteAddress}</span>
            </li>
            <li className="flex items-center gap-4 group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-brand-orange group-hover:text-white transition-colors">
                <RiPhoneLine className="w-5 h-5 shrink-0" />
              </div>
              <span>{sitePhone}</span>
            </li>
            <li className="flex items-center gap-4 group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-brand-orange group-hover:text-white transition-colors">
                <RiMailLine className="w-5 h-5 shrink-0" />
              </div>
              <span>{siteEmail}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-400 font-inter">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-500 font-inter">
          <span>Himachal Government Registered</span>
          <span className="w-1 h-1 bg-white/20 rounded-full"></span>
          <span>Certified Travel Partner</span>
        </div>
      </div>
    </footer>
  );
};
