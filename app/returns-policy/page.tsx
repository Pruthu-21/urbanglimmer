'use client';

import Link from 'next/link';
import { RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-10">
        <div className="border-b border-[#E8DFD5] pb-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
            CLIENT PRIVILEGE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#603A46] font-medium tracking-tight">
            15-Day Exchange & Returns Policy
          </h1>
          <p className="text-xs text-[#766D6D] mt-1">
            Designed to ensure complete peace of mind with doorstep reverse pickup across India
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] space-y-6 text-xs text-[#766D6D] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">1. 15-Day Exchange Window</h2>
            <p>
              We want you to love your Urban Glimmer pieces. You may request an exchange or return within <strong>15 calendar days</strong> from the date your shipment was delivered by the courier partner.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">2. Condition Requirements</h2>
            <p>
              To be eligible for an exchange or return:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The piece must be unworn, free from perfume, lotions, or scratches.</li>
              <li>Must be returned in its original velvet keepsake box with the intact Urban Glimmer hallmark authenticity certificate.</li>
              <li>Custom engraved or personalized pieces cannot be returned unless received with a manufacturing defect.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">3. Complimentary Doorstep Reverse Pickup</h2>
            <p>
              Once your exchange request is logged, we schedule an insured reverse courier pickup from your address at zero cost to you.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">4. Refund Processing</h2>
            <p>
              Upon receiving and inspecting the piece at our Jaipur atelier, refunds are initiated within 48 business hours to your original payment method (Bank account for UPI/Cards, or store credit/NEFT for Cash on Delivery orders).
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
