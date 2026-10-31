'use client';

import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Settings,
  Heart,
} from 'lucide-react';

export default function Footer() {
  const openCookiePreferences = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ug_open_cookie_preferences'));
    }
  };

  return (
    <footer className="bg-[#151313] text-[#F8F4EE] border-t border-[#C6A064]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-[#211C1D] text-[#C6A064] border border-[#C6A064]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold uppercase tracking-wider text-xs block text-[#F8F4EE]">
                BIS Hallmarked
              </span>
              <span className="text-[11px] text-[#766D6D]">Certified 18k & 925 purity</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-[#211C1D] text-[#C6A064] border border-[#C6A064]/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold uppercase tracking-wider text-xs block text-[#F8F4EE]">
                Insured Express Shipping
              </span>
              <span className="text-[11px] text-[#766D6D]">Complimentary above ₹1,999</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-[#211C1D] text-[#C6A064] border border-[#C6A064]/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold uppercase tracking-wider text-xs block text-[#F8F4EE]">
                15-Day Exchange
              </span>
              <span className="text-[11px] text-[#766D6D]">Hassle-free doorstep pickup</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-[#211C1D] text-[#C6A064] border border-[#C6A064]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold uppercase tracking-wider text-xs block text-[#F8F4EE]">
                Lifetime Anti-Tarnish
              </span>
              <span className="text-[11px] text-[#766D6D]">Protective atomic seal</span>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-white/10 text-xs">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-tight text-[#F8F4EE] font-medium">
                URBAN GLIMMER
                <span className="text-[#C6A064] ml-1 text-sm">✦</span>
              </span>
              <span className="block text-[9px] tracking-[0.25em] uppercase text-[#C6A064] mt-0.5 font-semibold">
                Haute Joaillerie · Jaipur & Mumbai
              </span>
            </Link>
            <p className="text-[#E8DFD5]/70 text-xs leading-relaxed max-w-sm">
              Contemporary Indian jewellery celebrating everyday radiance and heirloom festive glamour. Hand-finished with conscious metals, certified baroque pearls, and sculptural warmth.
            </p>
            <div className="space-y-1 text-[11px] text-[#766D6D] pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C6A064]" />
                <span>Atelier: Goldsmiths Quarter, Jaipur 302001 & Bandra, Mumbai 400050</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C6A064]" />
                <span>Concierge & WhatsApp: +91 98200 12345 (Mon–Sat, 10am–7pm IST)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C6A064]" />
                <span>Email: concierge@urbanglimmer.com</span>
              </p>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-widest text-[#C6A064] font-bold">
              The Collections
            </h4>
            <ul className="space-y-2 text-[#E8DFD5]/80">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop All Jewellery
                </Link>
              </li>
              <li>
                <Link href="/shop/earrings" className="hover:text-white transition-colors">
                  Sculpted Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop/necklaces" className="hover:text-white transition-colors">
                  Layered Chains & Pendants
                </Link>
              </li>
              <li>
                <Link href="/shop/rings" className="hover:text-white transition-colors">
                  Signets & Stacking Rings
                </Link>
              </li>
              <li>
                <Link href="/shop/bracelets" className="hover:text-white transition-colors">
                  Cuffs & Box Bracelets
                </Link>
              </li>
              <li>
                <Link href="/collections/festive-radiance" className="text-[#C6A064] hover:text-white font-medium">
                  The Festive Edit ✦
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Concierge */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-widest text-[#C6A064] font-bold">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-[#E8DFD5]/80">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Customer Account
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-white transition-colors">
                  15-Day Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/virtual-studio" className="text-[#C6A064] hover:text-white font-medium">
                  Virtual 3D Studio
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Heritage & Legal */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-widest text-[#C6A064] font-bold">
              Heritage & Legal
            </h4>
            <ul className="space-y-2 text-[#E8DFD5]/80">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Story & Craftsmanship
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Ateliers
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy (DPDP)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white transition-colors">
                  Cookie Disclosure
                </Link>
              </li>
              <li>
                <button
                  onClick={openCookiePreferences}
                  className="text-left text-[#C6A064] hover:text-white flex items-center gap-1.5 transition-colors font-medium"
                >
                  <Settings className="w-3 h-3" />
                  <span>Cookie Settings</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#766D6D]">
          <div>
            © 2026 Urban Glimmer Lifestyle Pvt. Ltd. All rights reserved. GSTIN: 08AAFCU1234F1Z8.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-wider text-[#C6A064]/80">
              Curated with 18k Vermeil & Heirloom Integrity
            </span>
            <Link href="/admin" className="text-[#766D6D] hover:text-[#C6A064] transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
