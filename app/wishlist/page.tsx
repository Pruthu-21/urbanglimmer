'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product, getStoredProducts } from '@/lib/productStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import CartDrawer, { CartItem } from '@/components/storefront/CartDrawer';
import Footer from '@/components/storefront/Footer';

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([1, 2]); // default sample saved pieces
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setProducts(getStoredProducts());
    const saved = localStorage.getItem('ug_wishlist_ids');
    if (saved) {
      try {
        setWishlistIds(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveWishlist = (ids: number[]) => {
    setWishlistIds(ids);
    localStorage.setItem('ug_wishlist_ids', JSON.stringify(ids));
  };

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const getImg = (id: string) => {
    if (!id) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80';
    if (id.startsWith('http') || id.startsWith('/')) return id;
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleRemove = (id: number) => {
    const updated = wishlistIds.filter((x) => x !== id);
    saveWishlist(updated);
    notify('Piece removed from wishlist');
  };

  const handleMoveToBag = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { product, quantity: 1 }];
    });
    handleRemove(product.id);
    setCartOpen(true);
    notify(`${product.name} moved to your shopping bag`);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="border-b border-[#E8DFD5] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
              SAVED TREASURES
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
              Your Personal Wishlist
            </h1>
            <p className="text-xs text-[#766D6D] mt-1">
              {wishlistProducts.length} piece{wishlistProducts.length === 1 ? '' : 's'} saved for upcoming occasions
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider font-semibold text-[#603A46] hover:text-[#852F3A] flex items-center gap-1"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded border border-[#E8DFD5] max-w-lg mx-auto p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F8F4EE] flex items-center justify-center text-[#852F3A]">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl text-[#211B1C]">Your wishlist is currently empty</h2>
            <p className="text-xs text-[#766D6D] leading-relaxed">
              Explore our festive necklaces, sculpted hoops, and statement cuffs. Click the heart icon on any piece to save it here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#603A46] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#852F3A] transition-colors"
            >
              <span>Explore Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded border border-[#E8DFD5] overflow-hidden flex flex-col justify-between hover:border-[#603A46] transition-all"
              >
                <div className="relative aspect-square bg-[#F8F4EE] overflow-hidden">
                  <img
                    src={getImg(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-[#766D6D] hover:text-red-600 transition-colors shadow-xs"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
                    <span className="text-sm font-semibold text-[#603A46] block mt-1">
                      {money(product.price)}
                    </span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#E8DFD5] space-y-2">
                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="w-full py-2 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move To Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
