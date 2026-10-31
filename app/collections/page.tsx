'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

const collections = [
  {
    title: 'Festive Radiance',
    slug: 'festive-radiance',
    description: 'Sculptural warmth and heirloom 18k yellow gold designed for Diwali, Navratri, and royal receptions.',
    image: 'photo-1617038220319-276d3cfab638',
    itemCount: '6 Signature Pieces',
    badge: 'Seasonal Edit',
  },
  {
    title: 'Everyday Elegance',
    slug: 'everyday-elegance',
    description: 'Featherweight hoops, dainty Italian box chains, and micro signets that you will never need to take off.',
    image: 'photo-1611652022419-a9419f74343d',
    itemCount: '8 Pieces',
  },
  {
    title: 'Royal Wedding Trousseau',
    slug: 'wedding-collection',
    description: 'Natural baroque pearl drops and mirror-cut cuffs handcrafted to complement bridal silks and evening blazers.',
    image: 'photo-1573408301185-9146fe634ad0',
    itemCount: '5 Pieces',
  },
  {
    title: 'Statement Pieces',
    slug: 'statement-pieces',
    description: 'Architectural ribbons of gold and pavé bands engineered to anchor bold, unforgettable silhouettes.',
    image: 'photo-1611591437281-460bfbe1220a',
    itemCount: '4 Pieces',
  },
  {
    title: 'Modern Gold',
    slug: 'modern-gold',
    description: 'Minimalist geometry meets traditional Indian goldsmithing in pure 18k gold vermeil over 925 silver.',
    image: 'photo-1605100804763-247f67b3557e',
    itemCount: '6 Pieces',
  },
  {
    title: 'Gifts That Sparkle',
    slug: 'gifts-that-sparkle',
    description: 'Curated gift sets packaged in velvet keepsake boxes with personalized calligraphy gift notes.',
    image: 'photo-1599643478518-a784e5dc4c8f',
    itemCount: 'Gift Ready',
  },
];

export default function CollectionsPage() {
  const getImg = (id: string) => {
    if (!id) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
    if (id.startsWith('http') || id.startsWith('/')) return id;
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#C6A064] font-semibold block">
            ATELIER CURATIONS
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#603A46]">
            The Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#766D6D] font-light leading-relaxed">
            Every collection explores an emotional aesthetic chapter — from morning rituals to grand festival celebrations.
          </p>
        </div>

        {/* Collections Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group relative rounded overflow-hidden aspect-4/5 bg-[#151313] border border-[#E8DFD5] p-6 flex flex-col justify-end shadow-md hover:border-[#603A46] transition-all"
            >
              <img
                src={getImg(col.image)}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151313] via-[#151313]/35 to-transparent" />

              <div className="relative z-10 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-[#C6A064] font-semibold">
                    {col.itemCount}
                  </span>
                  {col.badge && (
                    <span className="bg-[#852F3A] text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                      {col.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-medium group-hover:text-[#C6A064] transition-colors">
                  {col.title}
                </h3>

                <p className="text-xs text-[#E8DFD5]/80 line-clamp-2 font-light">
                  {col.description}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#C6A064]">
                  <span>Discover Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
