'use client';

import Link from 'next/link';
import { Truck, ShieldCheck, MapPin, Clock } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-10">
        <div className="border-b border-[#E8DFD5] pb-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
            DELIVERY CHARTER
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#603A46] font-medium tracking-tight">
            Shipping & Insured Transit Policy
          </h1>
          <p className="text-xs text-[#766D6D] mt-1">
            Last updated: October 2026 · Compliant with Consumer Protection (E-Commerce) Rules, India
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] space-y-6 text-xs text-[#766D6D] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">1. Complimentary Shipping Threshold</h2>
            <p>
              Urban Glimmer provides complimentary insured express shipping across all serviceable Indian PIN codes on orders valued at <strong>₹1,999 or above</strong>. For orders below ₹1,999, a flat packaging and insured courier charge of ₹99 is applicable at checkout.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">2. Dispatch & Transit Timelines</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dispatch from Jaipur Atelier:</strong> Orders placed before 1:00 PM IST are verified, hallmarked, and dispatched within 24 to 48 business hours.</li>
              <li><strong>Metro Deliveries:</strong> Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, and Kolkata typically receive delivery within 2 to 3 business days via BlueDart Luxury Express.</li>
              <li><strong>Rest of India & Tier II/III:</strong> 3 to 5 business days via Delhivery Luxe or BlueDart Surface.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">3. Tamper-Evident Velvet Packaging & Transit Insurance</h2>
            <p>
              Every parcel is protected by our signature tamper-evident security seal and insured for 100% of the invoice value against theft or loss in transit. If you notice any outer seal damage upon delivery, please refuse the parcel and immediately notify our concierge.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">4. Cash on Delivery (COD)</h2>
            <p>
              Cash on Delivery is supported for orders up to ₹15,000 across eligible Indian PIN codes. To ensure smooth fulfillment, our concierge may place a brief verification phone call or WhatsApp message prior to dispatch.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
