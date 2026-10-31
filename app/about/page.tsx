'use client';

import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Editorial Story Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block">
            OUR HERITAGE & VISION
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#603A46] font-medium tracking-tight">
            The Urban Glimmer Atelier
          </h1>
          <p className="text-sm text-[#766D6D] font-light leading-relaxed">
            Bridging Rajasthan&apos;s centuries-old jewellery artistry with contemporary Indian lifestyles. Crafted with conscious metals, certified hallmarks, and radiant poise.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="rounded overflow-hidden aspect-4/5 border border-[#E8DFD5] shadow-md">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
              alt="Jaipur Goldsmith Crafting Jewellery"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-5 text-xs text-[#766D6D] leading-relaxed">
            <span className="text-[10px] tracking-widest uppercase text-[#C6A064] font-bold block">
              BORN IN JAIPUR & MUMBAI
            </span>
            <h2 className="font-serif text-3xl text-[#211B1C] font-medium">
              Jewellery Made To Be Lived In
            </h2>
            <p>
              Traditional Indian fine jewellery has long been stored inside safe-deposit vaults, brought out only for auspicious family weddings. We founded Urban Glimmer with a rebellious yet deeply respectful question: <em>Why shouldn&apos;t everyday moments carry that same luminous grace?</em>
            </p>
            <p>
              Collaborating with third-generation artisanal smiths in Jaipur&apos;s historic Johari Bazaar, we developed our proprietary 2.5-micron 18k Gold Vermeil layering technique over hypoallergenic 925 sterling silver. The result is lightweight, anti-tarnish, water-resistant elegance that moves effortlessly with your modern rhythm.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 text-[#211B1C] font-serif text-base border-t border-[#E8DFD5]">
              <div>
                <span className="text-2xl text-[#603A46] block font-bold">100%</span>
                <span className="text-[10px] font-sans text-[#766D6D] uppercase">Recycled Silver</span>
              </div>
              <div>
                <span className="text-2xl text-[#852F3A] block font-bold">BIS 916</span>
                <span className="text-[10px] font-sans text-[#766D6D] uppercase">Hallmarked Purity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-3 text-xs">
            <ShieldCheck className="w-6 h-6 text-[#C6A064]" />
            <h3 className="font-serif text-lg font-medium text-[#211B1C]">Authenticity & Hallmarking</h3>
            <p className="text-[#766D6D] leading-relaxed">
              Every creation carries the Urban Glimmer laser hallmark and comes with a certified authenticity card guaranteeing metal purity and natural stone integrity.
            </p>
          </div>

          <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-3 text-xs">
            <Sparkles className="w-6 h-6 text-[#C6A064]" />
            <h3 className="font-serif text-lg font-medium text-[#211B1C]">Engineered Featherweight Comfort</h3>
            <p className="text-[#766D6D] leading-relaxed">
              Our hollow interior hoop architecture and balanced pendant geometry ensure you can wear our boldest sculptural earrings from morning meetings to midnight celebrations without earlobe fatigue.
            </p>
          </div>

          <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-3 text-xs">
            <Heart className="w-6 h-6 text-[#C6A064]" />
            <h3 className="font-serif text-lg font-medium text-[#211B1C]">Conscious Luxury</h3>
            <p className="text-[#766D6D] leading-relaxed">
              Zero plastic packaging. Each piece arrives nested in our signature plush velvet keepsake boxes, designed to sit on your vanity for a lifetime.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
