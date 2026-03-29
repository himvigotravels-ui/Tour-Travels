import Link from "next/link";
import { MountainSnow, MessageCircle, Globe, Send, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-forest-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-forest-800 pb-12 mb-8">
        {/* Brand & Intro */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm transition-colors text-white">
              <MountainSnow className="w-6 h-6" />
            </div>
            <span className="font-outfit font-bold text-xl tracking-wide text-white">
              Himachal<span className="font-light">Trek</span>
            </span>
          </Link>
          <p className="text-forest-200 text-sm leading-relaxed font-inter pr-4">
            Your premium travel partner for offbeat tours, secure taxi services, and unforgettable memories in the heart of the Himalayas.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-forest-200 hover:text-white">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-forest-200 hover:text-white">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-forest-200 hover:text-white">
              <Send className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-outfit font-semibold text-lg mb-6 text-white">Quick Links</h3>
          <ul className="space-y-4 text-sm font-inter text-forest-200">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/packages" className="hover:text-white transition-colors">Tour Packages</Link></li>
            <li><Link href="/taxi-services" className="hover:text-white transition-colors">Taxi Services</Link></li>
            <li><Link href="/destinations" className="hover:text-white transition-colors">Top Destinations</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Travel Blog</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-outfit font-semibold text-lg mb-6 text-white">Support</h3>
          <ul className="space-y-4 text-sm font-inter text-forest-200">
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-outfit font-semibold text-lg mb-6 text-white">Contact Info</h3>
          <ul className="space-y-6 text-sm font-inter text-forest-200">
            <li className="flex items-start gap-4">
              <MapPin className="w-5 h-5 shrink-0 text-amber-500" />
              <span>Mall Road, Manali, Himachal Pradesh 175131, India</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-5 h-5 shrink-0 text-amber-500" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="w-5 h-5 shrink-0 text-amber-500" />
              <span>hello@himachaltrek.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-sm text-forest-400 font-inter flex flex-col md:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} HimachalTrek. All rights reserved.</span>
        <span>Designed with passion for the Himalayas.</span>
      </div>
    </footer>
  );
};
