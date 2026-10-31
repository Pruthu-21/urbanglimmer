'use client';

import Link from 'next/link';
import { Lock, ShieldCheck } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-10">
        <div className="border-b border-[#E8DFD5] pb-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
            PRIVACY & DATA PROTECTION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#603A46] font-medium tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#766D6D] mt-1">
            Compliant with Digital Personal Data Protection (DPDP) Act 2023, India & Information Technology Act 2000
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] space-y-6 text-xs text-[#766D6D] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">1. Data Fiduciary Commitment</h2>
            <p>
              Urban Glimmer Lifestyle Pvt. Ltd. acts as the Data Fiduciary regarding the personal information you entrust to us. We collect, store, and process personal data solely for legitimate purposes related to order fulfillment, customer support, and statutory compliance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contact & Identity Data:</strong> Name, delivery address, contact telephone number, and email address.</li>
              <li><strong>Transaction Data:</strong> Ordered jewelry items, order amounts, payment method selected, and invoice references. (Note: We do not store raw credit/debit card numbers or CVVs on our servers).</li>
              <li><strong>Technical & Cookie Data:</strong> Browser session information, anonymized IP addresses, and cookie consent preferences.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">3. Your Rights as a Data Principal</h2>
            <p>
              Under the Indian DPDP Act, you have the right to access your stored personal information, request corrections, withdraw marketing consent, or request data erasure by writing to our designated Grievance Officer at <a href="mailto:privacy@urbanglimmer.com" className="text-[#603A46] underline">privacy@urbanglimmer.com</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">4. Third-Party Disclosures</h2>
            <p>
              We disclose delivery addresses strictly to authorized logistics providers (e.g. BlueDart Express, Delhivery) solely for doorstep delivery and transit insurance verification. We do not sell or monetize customer data.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
