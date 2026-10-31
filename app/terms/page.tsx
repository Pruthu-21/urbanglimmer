'use client';

import Link from 'next/link';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-10">
        <div className="border-b border-[#E8DFD5] pb-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
            LEGAL AGREEMENT
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#603A46] font-medium tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-[#766D6D] mt-1">
            Governing the use of Urban Glimmer ecommerce storefront and atelier services in India
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] space-y-6 text-xs text-[#766D6D] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">1. Storefront Ownership</h2>
            <p>
              This website is owned and operated by Urban Glimmer Lifestyle Pvt. Ltd., having its registered atelier in Jaipur, Rajasthan, and administrative studio in Mumbai, Maharashtra.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">2. Product Authenticity & Pricing</h2>
            <p>
              All prices are displayed in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST). Product weights, metal purities, and stone attributes are described accurately according to BIS Hallmark standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">3. Order Acceptance & Inventory Validation</h2>
            <p>
              Receipt of an order confirmation does not signify our final acceptance of your order. Urban Glimmer reserves the right to accept or decline your order in case of pricing errors or inventory stock unavailability, with a full immediate refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">4. Governing Jurisdiction</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising in connection with orders shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
