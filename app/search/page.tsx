'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, getStoredProducts } from '@/lib/productStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import CartDrawer, { CartItem } from '@/components/storefront/CartDrawer';
import Footer from '@/components/storefront/Footer';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

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

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchesCat =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        (p.collections && p.collections.some((c) => c.toLowerCase().includes(q)));
      return matchesCat && matchesQuery;
    });
  }, [products, query, selectedCategory]);

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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Search Header Input */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold">
            DISCOVERY ENGINE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
            Search The Jewellery Archive
          </h1>

          <div className="relative mt-4">
            <Search className="w-5 h-5 text-[#603A46] absolute left-4 top-3.5" />
            <input
              type="text"
              autoFocus
              placeholder="Search by piece, metal finish, pearl, or festive occasion..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border-2 border-[#E8DFD5] focus:border-[#603A46] rounded-full pl-12 pr-12 py-3 text-sm focus:outline-none shadow-xs"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-3.5 text-xs text-[#766D6D] hover:text-[#211B1C] uppercase font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center justify-center gap-2 pt-2 flex-wrap text-xs">
            {['All', 'Earrings', 'Necklaces', 'Rings', 'Bracelets'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#603A46] text-[#F8F4EE]'
                    : 'bg-white border border-[#E8DFD5] text-[#766D6D] hover:text-[#211B1C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-[#766D6D] border-b border-[#E8DFD5] pb-3">
          <span>
            Found <strong>{filtered.length}</strong> matching piece{filtered.length === 1 ? '' : 's'}
            {query && <span> for &ldquo;{query}&rdquo;</span>}
          </span>
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('All');
              }}
              className="text-[#852F3A] hover:underline font-semibold"
            >
              Reset search
            </button>
          )}
        </div>

        {/* Results Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded border border-[#E8DFD5]">
            <h3 className="font-serif text-2xl text-[#603A46]">No matching pieces discovered</h3>
            <p className="text-xs text-[#766D6D] max-w-sm mx-auto">
              Try searching for &ldquo;gold&rdquo;, &ldquo;hoops&rdquo;, &ldquo;chain&rdquo;, or &ldquo;festive&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center font-sans">
          <div className="w-8 h-8 border-2 border-[#603A46] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
