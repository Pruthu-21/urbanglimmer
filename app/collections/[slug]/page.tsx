'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Heart, Sparkles, Star } from 'lucide-react';
import { Product, getStoredProducts } from '@/lib/productStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import CartDrawer, { CartItem } from '@/components/storefront/CartDrawer';
import Footer from '@/components/storefront/Footer';

const collectionMetadata: Record<string, { title: string; subtitle: string; heroImg: string }> = {
  'festive-radiance': {
    title: 'Festive Radiance',
    subtitle: 'The seasonal edit crafted for Diwali, Navratri, poojas, and celebratory dinner parties.',
    heroImg: 'photo-1617038220319-276d3cfab638',
  },
  'everyday-elegance': {
    title: 'Everyday Elegance',
    subtitle: 'Featherweight hoops, dainty Italian box chains, and understated signet rings for daily wear.',
    heroImg: 'photo-1611652022419-a9419f74343d',
  },
  'wedding-collection': {
    title: 'Royal Wedding Trousseau',
    subtitle: 'Heirloom baroque pearls and mirror-sculpted cuffs designed for the modern bride and wedding guests.',
    heroImg: 'photo-1573408301185-9146fe634ad0',
  },
  'statement-pieces': {
    title: 'Statement Pieces',
    subtitle: 'Architectural ribbons of gold and pavé bands engineered to make an impression.',
    heroImg: 'photo-1611591437281-460bfbe1220a',
  },
  'modern-gold': {
    title: 'Modern Gold',
    subtitle: 'Clean geometric lines crafted in certified 18k yellow gold vermeil over 925 silver.',
    heroImg: 'photo-1605100804763-247f67b3557e',
  },
  'gifts-that-sparkle': {
    title: 'Gifts That Sparkle',
    subtitle: 'Cherished gifts packaged in signature velvet keepsake boxes with personalized gift messaging.',
    heroImg: 'photo-1599643478518-a784e5dc4c8f',
  },
};

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'festive-radiance';

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');

  const meta = collectionMetadata[slug] || {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    subtitle: 'Curated selection of handcrafted luxury jewellery.',
    heroImg: 'photo-1611652022419-a9419f74343d',
  };

  useEffect(() => {
    const all = getStoredProducts();
    // Filter matching collection or provide sample products
    const matching = all.filter((p) =>
      p.collections?.some((c) => c.toLowerCase().includes(meta.title.toLowerCase().split(' ')[0]))
    );
    setProducts(matching.length > 0 ? matching : all.slice(0, 4));
  }, [meta.title]);

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const getImg = (id: string) => {
    if (!id) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
    if (id.startsWith('http') || id.startsWith('/')) return id;
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
    setToast(`${product.name} added to your bag`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="flex-1 w-full">
        {/* Collection Hero Banner */}
        <section className="relative bg-[#151313] text-[#F8F4EE] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C6A064]/20 overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img
              src={getImg(meta.heroImg)}
              alt={meta.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#151313] via-[#151313]/90 to-transparent" />

          <div className="max-w-7xl mx-auto relative z-10 space-y-4">
            <Link
              href="/collections"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C6A064] hover:text-white font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all collections</span>
            </Link>

            <h1 className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-white leading-tight">
              {meta.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#E8DFD5]/90 max-w-xl font-light leading-relaxed">
              {meta.subtitle}
            </p>
          </div>
        </section>

        {/* Collection Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="mb-6 flex justify-between items-center text-xs text-[#766D6D]">
            <span>Showing {products.length} pieces in this curation</span>
            <Link href="/shop" className="text-[#603A46] hover:underline font-semibold">
              Browse full catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded border border-[#E8DFD5] overflow-hidden flex flex-col justify-between hover:border-[#603A46] transition-all hover:shadow-lg"
              >
                <div className="relative aspect-square bg-[#F8F4EE] overflow-hidden">
                  <img
                    src={getImg(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[#852F3A] text-white">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#766D6D] uppercase tracking-wider block mb-1">
                      {product.category}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-serif text-base text-[#211B1C] hover:text-[#852F3A] font-medium line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-[11px] text-[#766D6D] line-clamp-1 mt-0.5">
                      {product.material}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#E8DFD5] flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#603A46]">
                      {money(product.price)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-3 py-1.5 bg-[#603A46] hover:bg-[#852F3A] text-white rounded text-[10px] uppercase tracking-wider font-bold transition-colors"
                    >
                      Add To Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={(id, d) =>
          setCart((p) =>
            p
              .map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + d } : i))
              .filter((i) => i.quantity > 0)
          )
        }
        onRemoveItem={(id) => setCart((p) => p.filter((i) => i.product.id !== id))}
      />

      <Footer />
    </div>
  );
}
