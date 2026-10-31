'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { getStoredCoupons, Coupon } from '@/lib/campaignStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function OffersPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setCoupons(getStoredCoupons());
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block">
            PATRON PRIVILEGES
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#603A46] font-medium tracking-tight">
            Exclusive Offers & Privileges
          </h1>
          <p className="text-xs sm:text-sm text-[#766D6D] leading-relaxed font-light">
            Genuine promotional savings applicable at checkout on our 18k gold vermeil and festive heirloom jewellery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white p-6 rounded border border-[#E8DFD5] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#603A46] transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#C6A064] tracking-wider">
                    {coupon.discountType === 'percent' ? `${coupon.value}% Savings` : `Flat ₹${coupon.value} Off`}
                  </span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="bg-[#F8F4EE] p-3 rounded border border-[#E8DFD5] flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-[#603A46]">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-1.5 text-xs text-[#603A46] hover:text-[#852F3A] font-bold uppercase flex items-center gap-1"
                  >
                    {copiedCode === coupon.code ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[10px]">
                        <Check className="w-3.5 h-3.5" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px]">
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </span>
                    )}
                  </button>
                </div>

                <p className="text-xs text-[#766D6D] leading-relaxed pt-1">
                  {coupon.description}
                </p>
                <span className="text-[10px] text-[#766D6D] block">
                  Min order: ₹{coupon.minOrderValue.toLocaleString('en-IN')}
                </span>
              </div>

              <Link
                href="/shop"
                className="w-full py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Shop Eligible Pieces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
