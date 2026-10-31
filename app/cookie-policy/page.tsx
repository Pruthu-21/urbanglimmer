'use client';

import Link from 'next/link';
import { Settings, ShieldCheck, Check, Lock } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function CookiePolicyPage() {
  const openPreferences = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ug_open_cookie_preferences'));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-10">
        <div className="border-b border-[#E8DFD5] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
              PRIVACY TRANSPARENCY
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#603A46] font-medium tracking-tight">
              Cookie Consent & Disclosures
            </h1>
            <p className="text-xs text-[#766D6D] mt-1">
              Your choices, respected across your entire shopping journey
            </p>
          </div>

          <button
            onClick={openPreferences}
            className="px-4 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-2 self-start sm:self-auto transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#C6A064]" />
            <span>Open Cookie Settings</span>
          </button>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] space-y-6 text-xs text-[#766D6D] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">What Are Cookies?</h2>
            <p>
              Cookies are compact text files stored on your device that enable websites to remember your browsing session, shopping bag items, and preference settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">Categories of Cookies We Use</h2>

            <div className="p-4 bg-[#F8F4EE] rounded border border-[#E8DFD5] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#211B1C]">
                <Lock className="w-4 h-4 text-[#603A46]" />
                <span>1. Essential & Operational Cookies (Always Active)</span>
              </div>
              <p>
                Required for core functionalities such as retaining items in your shopping bag as you browse, securing checkout operations, and verifying administrative access.
              </p>
            </div>

            <div className="p-4 bg-[#F8F4EE] rounded border border-[#E8DFD5] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#211B1C]">
                <ShieldCheck className="w-4 h-4 text-[#603A46]" />
                <span>2. Performance & Analytics Cookies (Optional)</span>
              </div>
              <p>
                Provide aggregated, anonymized insights into catalogue performance and page loading times to help our engineers optimize your browsing experience.
              </p>
            </div>

            <div className="p-4 bg-[#F8F4EE] rounded border border-[#E8DFD5] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#211B1C]">
                <Settings className="w-4 h-4 text-[#603A46]" />
                <span>3. Marketing & Personalization Cookies (Optional)</span>
              </div>
              <p>
                Used to tailor festive campaign promotions and matching jewellery recommendations according to your aesthetic interests.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">Changing Your Preferences</h2>
            <p>
              You may modify or withdraw your cookie consent at any time by clicking the &ldquo;Cookie Settings&rdquo; link available in the footer of every page or the button above.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
