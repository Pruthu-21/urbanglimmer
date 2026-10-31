'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

const FAQ_SECTIONS = [
  {
    category: 'Purity & Craftsmanship',
    items: [
      {
        q: 'What is 18k Gold Vermeil and how is it different from ordinary gold plating?',
        a: 'Gold Vermeil (pronounced ver-may) is a regulated legal standard. It requires a solid base of 925 sterling silver coated with at least 2.5 microns of real 18k yellow gold — 5 times thicker than standard fashion jewelry flash plating. It does not peel or turn green, making it hypoallergenic and heirloom quality.',
      },
      {
        q: 'Are Urban Glimmer pieces BIS Hallmarked?',
        a: 'Yes. All silver and gold vermeil jewelry undergoes precious metal purity assay testing and bears the laser hallmark certifying 925 purity and authentic 18k micron depth.',
      },
      {
        q: 'Are your pearls natural?',
        a: 'Yes. We work exclusively with certified organic freshwater baroque pearls hand-selected for unique natural luster and iridescence. Because they are natural, no two pearls are strictly identical.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery in India',
    items: [
      {
        q: 'What are the delivery timelines and shipping charges?',
        a: 'We offer complimentary express shipping on all domestic Indian orders above ₹1,999. For orders under ₹1,999, a flat insured courier fee of ₹99 applies. Metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai) receive delivery in 2–3 business days via BlueDart Luxury Express.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes, Cash on Delivery is available across 19,000+ Indian PIN codes. You can pay cash or scan the courier UPI QR code upon doorstep delivery.',
      },
      {
        q: 'Is my shipment insured against transit loss or damage?',
        a: '100% of Urban Glimmer packages are fully insured against transit loss or theft with tamper-evident security sealing.',
      },
    ],
  },
  {
    category: 'Returns & 15-Day Exchanges',
    items: [
      {
        q: 'What is your exchange and return policy?',
        a: 'We offer a complimentary 15-day exchange policy from the date of delivery. If a piece does not suit you or if you need an alternate ring size, our courier will collect the package directly from your doorstep.',
      },
      {
        q: 'How do I initiate an exchange?',
        a: 'Simply visit your /account/orders page or message our WhatsApp concierge at +91 98200 12345 with your order reference (e.g. UG-89412).',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'Purity & Craftsmanship-0': true,
    'Shipping & Delivery in India-0': true,
  });

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block">
            CLIENT ASSISTANCE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#603A46] font-medium tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#766D6D] leading-relaxed font-light">
            Everything you need to know regarding hallmarking, insured transit across India, ring sizing, and our 15-day exchange policy.
          </p>
        </div>

        <div className="space-y-10">
          {FAQ_SECTIONS.map((sec) => (
            <div key={sec.category} className="space-y-4">
              <h2 className="font-serif text-2xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
                {sec.category}
              </h2>

              <div className="space-y-3">
                {sec.items.map((item, idx) => {
                  const key = `${sec.category}-${idx}`;
                  const isOpen = !!openItems[key];

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded border border-[#E8DFD5] overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif text-base sm:text-lg text-[#211B1C] hover:text-[#852F3A] transition-colors"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#C6A064] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 text-xs text-[#766D6D] leading-relaxed border-t border-[#E8DFD5]/60 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white rounded border border-[#E8DFD5] text-center space-y-2 text-xs">
          <h3 className="font-serif text-xl text-[#603A46] font-medium">Still have questions?</h3>
          <p className="text-[#766D6D]">
            Our concierge team is available Monday through Saturday on WhatsApp and phone.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-2 px-5 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white uppercase tracking-wider font-semibold rounded text-xs transition-colors"
          >
            Contact Advisor
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
