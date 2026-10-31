'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Filter,
  Heart,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { Product, INITIAL_PRODUCTS, getStoredProducts } from '@/lib/productStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import CartDrawer, { CartItem } from '@/components/storefront/CartDrawer';
import SearchDrawer from '@/components/storefront/SearchDrawer';
import Footer from '@/components/storefront/Footer';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const filterQuery = searchParams.get('filter');
  const catQuery = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(catQuery || 'All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [selectedFinish, setSelectedFinish] = useState('All');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setProducts(getStoredProducts());
    if (catQuery) {
      setSelectedCategory(catQuery);
    }
  }, [catQuery]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
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
    notify(`${product.name} added to your bag`);
  };

  const handleToggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedOccasion('All');
    setSelectedFinish('All');
    setMaxPrice(3000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (filterQuery === 'new' && !p.badge?.toLowerCase().includes('new') && !p.badge?.toLowerCase().includes('just')) {
        return false;
      }
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (selectedOccasion !== 'All' && p.occasion?.toLowerCase() !== selectedOccasion.toLowerCase()) {
        return false;
      }
      if (selectedFinish !== 'All' && !p.color.toLowerCase().includes(selectedFinish.toLowerCase())) {
        return false;
      }
      if (p.price > maxPrice) {
        return false;
      }
      if (inStockOnly && p.stock !== undefined && p.stock <= 0) {
        return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') list = [...list].sort((a, b) => b.id - a.id);
    if (sortBy === 'rating') list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));

    return list;
  }, [products, selectedCategory, selectedOccasion, selectedFinish, maxPrice, inStockOnly, sortBy, filterQuery]);

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb & Title */}
        <div className="mb-8 border-b border-[#E8DFD5] pb-6">
          <nav className="text-[11px] text-[#766D6D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#603A46]">Home</Link>
            <span>/</span>
            <span className="text-[#603A46] font-semibold">Catalogue Archive</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#852F3A] font-semibold">{selectedCategory}</span>
              </>
            )}
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
                {selectedCategory === 'All' ? 'All Handcrafted Jewellery' : selectedCategory}
              </h1>
              <p className="text-xs text-[#766D6D] mt-1">
                Showing {filteredProducts.length} certified pieces handcrafted in Jaipur & Mumbai
              </p>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E8DFD5] rounded text-xs uppercase font-semibold text-[#603A46]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters & Sort</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-white p-6 rounded border border-[#E8DFD5] self-start">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
              <span className="font-serif text-lg font-medium text-[#603A46]">Refine Archive</span>
              <button
                onClick={clearAllFilters}
                className="text-[10px] uppercase tracking-wider text-[#852F3A] hover:underline font-bold"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#211B1C] block">
                Category
              </span>
              {['All', 'Earrings', 'Necklaces', 'Rings', 'Bracelets'].map((cat) => (
                <label key={cat} className="flex items-center gap-2.5 text-xs text-[#766D6D] cursor-pointer hover:text-[#211B1C]">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="accent-[#603A46]"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>

            {/* Occasion Filter */}
            <div className="space-y-2 pt-3 border-t border-[#E8DFD5]">
              <span className="text-xs uppercase tracking-wider font-bold text-[#211B1C] block">
                Occasion
              </span>
              {['All', 'Daily Minimal', 'Festive Celebrations', 'Bridal & Wedding', 'Evening Soirée'].map((occ) => (
                <label key={occ} className="flex items-center gap-2.5 text-xs text-[#766D6D] cursor-pointer hover:text-[#211B1C]">
                  <input
                    type="radio"
                    name="occasion"
                    checked={selectedOccasion === occ}
                    onChange={() => setSelectedOccasion(occ)}
                    className="accent-[#603A46]"
                  />
                  <span>{occ}</span>
                </label>
              ))}
            </div>

            {/* Finish Filter */}
            <div className="space-y-2 pt-3 border-t border-[#E8DFD5]">
              <span className="text-xs uppercase tracking-wider font-bold text-[#211B1C] block">
                Finish & Gold Tone
              </span>
              {['All', 'Gold Vermeil', 'Gold Plated', 'Pearl', 'Pavé'].map((fin) => (
                <label key={fin} className="flex items-center gap-2.5 text-xs text-[#766D6D] cursor-pointer hover:text-[#211B1C]">
                  <input
                    type="radio"
                    name="finish"
                    checked={selectedFinish === fin}
                    onChange={() => setSelectedFinish(fin)}
                    className="accent-[#603A46]"
                  />
                  <span>{fin}</span>
                </label>
              ))}
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2 pt-3 border-t border-[#E8DFD5]">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase tracking-wider font-bold text-[#211B1C]">Max Price</span>
                <span className="font-semibold text-[#603A46]">{money(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#603A46]"
              />
            </div>

            {/* In Stock Toggle */}
            <div className="pt-3 border-t border-[#E8DFD5]">
              <label className="flex items-center gap-2 text-xs text-[#211B1C] cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#603A46] rounded"
                />
                <span>In Stock & Ready To Dispatch</span>
              </label>
            </div>
          </aside>

          {/* Product Listing Grid & Top Sorting Bar */}
          <section className="lg:col-span-3 space-y-6">
            <div className="bg-white p-3.5 rounded border border-[#E8DFD5] flex items-center justify-between text-xs">
              <span className="text-[#766D6D]">
                Showing <strong>{filteredProducts.length}</strong> items
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[#766D6D] uppercase tracking-wider text-[10px] font-bold">
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-1.5 text-xs font-medium focus:outline-[#603A46]"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded border border-[#E8DFD5] p-16 text-center space-y-4">
                <h3 className="font-serif text-2xl text-[#603A46]">No matching pieces discovered</h3>
                <p className="text-xs text-[#766D6D] max-w-sm mx-auto">
                  Try broadening your price range or adjusting your occasion filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-[#603A46] text-white text-xs uppercase tracking-wider font-semibold rounded"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
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
                        <span className="absolute top-2.5 left-2.5 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[#852F3A] text-white shadow-xs">
                          {product.badge}
                        </span>
                      )}

                      <button
                        onClick={() => handleToggleWishlist(product.id)}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs transition-colors shadow-xs ${
                          wishlist.includes(product.id)
                            ? 'text-[#852F3A]'
                            : 'text-[#766D6D] hover:text-[#852F3A]'
                        }`}
                        aria-label="Toggle wishlist"
                      >
                        <Heart
                          className="w-4 h-4"
                          fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#766D6D] uppercase tracking-wider mb-1">
                          <span>{product.category}</span>
                          <span className="flex items-center gap-0.5 text-[#C6A064] font-semibold">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{product.rating}</span>
                          </span>
                        </div>

                        <Link
                          href={`/products/${product.id}`}
                          className="font-serif text-base text-[#211B1C] hover:text-[#852F3A] font-medium line-clamp-1 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-[11px] text-[#766D6D] line-clamp-1 mt-0.5">
                          {product.material}
                        </p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-[#E8DFD5] flex items-center justify-between">
                        <span className="font-semibold text-sm sm:text-base text-[#603A46]">
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
          </section>
        </div>
      </main>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-lg sm:rounded-lg p-6 z-10 max-h-[80vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
              <h3 className="font-serif text-xl font-medium text-[#603A46]">Filter Catalogue</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#766D6D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider block mb-2">Category</span>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Earrings', 'Necklaces', 'Rings', 'Bracelets'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded text-xs ${
                        selectedCategory === cat
                          ? 'bg-[#603A46] text-white font-bold'
                          : 'bg-[#F8F4EE] border border-[#E8DFD5] text-[#766D6D]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider block mb-2">Occasion</span>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Daily Minimal', 'Festive Celebrations', 'Bridal & Wedding', 'Evening Soirée'].map((occ) => (
                    <button
                      key={occ}
                      onClick={() => setSelectedOccasion(occ)}
                      className={`px-3 py-1.5 rounded text-xs ${
                        selectedOccasion === occ
                          ? 'bg-[#603A46] text-white font-bold'
                          : 'bg-[#F8F4EE] border border-[#E8DFD5] text-[#766D6D]'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold uppercase tracking-wider">Max Price</span>
                  <span className="font-semibold text-[#603A46]">{money(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#603A46]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DFD5] flex gap-3">
              <button
                onClick={clearAllFilters}
                className="w-1/2 py-2.5 border border-[#E8DFD5] text-xs uppercase tracking-wider font-semibold rounded text-[#766D6D]"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-[#603A46] text-white text-xs uppercase tracking-wider font-bold rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Cart */}
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

      <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <Footer />
    </div>
  );
}
