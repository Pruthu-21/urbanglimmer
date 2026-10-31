'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Eye,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Truck,
  X,
  Layers,
  Flame,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Product,
  INITIAL_PRODUCTS,
  getStoredProducts,
} from '@/lib/productStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import CartDrawer, { CartItem } from '@/components/storefront/CartDrawer';
import SearchDrawer from '@/components/storefront/SearchDrawer';
import CookieConsentBanner from '@/components/storefront/CookieConsentBanner';
import FestiveModal from '@/components/storefront/FestiveModal';
import Footer from '@/components/storefront/Footer';

// Dynamically import 3D Studio to preserve initial page load performance
const VirtualStudioModal = dynamic(() => import('@/components/studio/VirtualStudioModal'), {
  ssr: false,
});

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewImage, setQuickViewImage] = useState<'main' | 'lifestyle'>('main');
  const [toast, setToast] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Filter state for catalogue section
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  useEffect(() => {
    setProducts(getStoredProducts());

    const handleCatalogUpdate = () => setProducts(getStoredProducts());
    window.addEventListener('urban_glimmer_catalog_updated', handleCatalogUpdate);
    return () => window.removeEventListener('urban_glimmer_catalog_updated', handleCatalogUpdate);
  }, []);

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

  const getImg = (id: string, width = 800) => {
    if (!id) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85';
    if (id.startsWith('http') || id.startsWith('/')) return id;
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity }];
    });
    setCartOpen(true);
    setQuickViewProduct(null);
    notify(`${product.name} added to your shopping bag.`);
  };

  const handleUpdateCartQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist Handler
  const handleToggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        notify('Removed from your wishlist');
        return prev.filter((x) => x !== id);
      } else {
        notify('Saved to your wishlist');
        return [...prev, id];
      }
    });
  };

  // Catalogue Filtering
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedCategory === 'All') return true;
      return p.category.toLowerCase() === selectedCategory.toLowerCase();
    });

    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));

    return list;
  }, [products, selectedCategory, sortBy]);

  const bestsellers = useMemo(() => {
    return products.filter((p) => p.isBestseller || p.badge === 'BESTSELLER');
  }, [products]);

  const categoriesList = [
    { name: 'Earrings', image: 'photo-1630019852942-f89202989a59', count: '14 Designs', slug: 'earrings' },
    { name: 'Necklaces', image: 'photo-1599643478518-a784e5dc4c8f', count: '12 Designs', slug: 'necklaces' },
    { name: 'Rings', image: 'photo-1605100804763-247f67b3557e', count: '18 Designs', slug: 'rings' },
    { name: 'Bracelets & Cuffs', image: 'photo-1611591437281-460bfbe1220a', count: '9 Designs', slug: 'bracelets' },
  ];

  const featuredCollections = [
    {
      title: 'Everyday Elegance',
      subtitle: 'Featherweight hoops, dainty chains, and micro signets designed to never take off.',
      image: 'photo-1611652022419-a9419f74343d',
      link: '/collections/everyday-elegance',
    },
    {
      title: 'Festive Radiance',
      subtitle: 'Sculptural warmth and triple-coated 18k gold for Diwali, Navratri, and royal receptions.',
      image: 'photo-1617038220319-276d3cfab638',
      link: '/collections/festive-radiance',
    },
    {
      title: 'Royal Wedding Trousseau',
      subtitle: 'Statement cuffs and natural baroque pearl drops handcrafted for the modern Indian bride.',
      image: 'photo-1573408301185-9146fe634ad0',
      link: '/collections/wedding-collection',
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    setNewsletterEmail('');
    notify('Thank you for subscribing to Urban Glimmer Journal.');
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans selection:bg-[#603A46] selection:text-white">
      {/* 1. Slim Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Premium Header & Mega Navigation */}
      <Header
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenStudio={() => setStudioOpen(true)}
      />

      <main className="flex-1">
        {/* 3. Editorial Dark Hero with Optional 3D Experience */}
        <section className="relative bg-[#151313] text-[#F8F4EE] overflow-hidden border-b border-[#C6A064]/20">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute inset-0 bg-radial from-[#603A46]/30 via-[#211C1D]/60 to-[#151313] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Editorial Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#603A46]/40 border border-[#C6A064]/40 text-[#C6A064] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AUTUMN & FESTIVE EDIT · JAIPUR ATELIER</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-[#F8F4EE] leading-[1.08]">
                  Jewellery That <br />
                  <span className="italic text-[#C6A064] font-normal">Becomes Your Story</span>
                </h1>

                <p className="text-sm sm:text-base text-[#E8DFD5]/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                  Discover timeless elegance, designed for your most meaningful moments. Hand-finished in thick 18k gold vermeil, recycled sterling silver, and organic baroque pearls.
                </p>

                {/* CTAs */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/shop"
                    className="w-full sm:w-auto px-8 py-4 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-widest font-bold rounded transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                  >
                    <span>Explore The Collection</span>
                    <ArrowRight className="w-4 h-4 text-[#C6A064]" />
                  </Link>

                  <button
                    onClick={() => setStudioOpen(true)}
                    className="w-full sm:w-auto px-7 py-4 bg-transparent hover:bg-white/5 text-[#C6A064] hover:text-white border border-[#C6A064]/60 text-xs uppercase tracking-widest font-bold rounded transition-all duration-300 flex items-center justify-center gap-2.5 backdrop-blur-xs"
                  >
                    <Layers className="w-4 h-4 text-[#C6A064]" />
                    <span>Experience 3D Studio</span>
                  </button>
                </div>

                {/* Sub-hero trust signals */}
                <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left text-xs text-[#E8DFD5]/70">
                  <div>
                    <span className="block font-serif text-lg text-[#C6A064] font-medium">BIS 916</span>
                    <span className="text-[10px] uppercase tracking-wider">Hallmark Certified</span>
                  </div>
                  <div>
                    <span className="block font-serif text-lg text-[#C6A064] font-medium">18k Vermeil</span>
                    <span className="text-[10px] uppercase tracking-wider">Anti-Tarnish Seal</span>
                  </div>
                  <div>
                    <span className="block font-serif text-lg text-[#C6A064] font-medium">₹1,999+</span>
                    <span className="text-[10px] uppercase tracking-wider">Complimentary Express</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Visual (Indian Luxury Model with Interactive 3D Callout) */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative Frame Border */}
                  <div className="absolute -inset-2 rounded border border-[#C6A064]/30 pointer-events-none transform rotate-1" />

                  <div className="relative rounded bg-[#211C1D] overflow-hidden aspect-4/5 shadow-2xl border border-[#C6A064]/20 group">
                    <img
                      src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=90"
                      alt="Indian Luxury Model wearing Urban Glimmer gold jewellery"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Gradient Overlay for Editorial Depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151313]/90 via-transparent to-black/30 pointer-events-none" />

                    {/* Interactive 3D Tag */}
                    <div className="absolute bottom-4 left-4 right-4 bg-[#151313]/90 backdrop-blur-md p-3.5 rounded border border-[#C6A064]/40 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-mono text-[#C6A064] block">
                          ATELIER SHOWCASE
                        </span>
                        <h4 className="font-serif text-sm text-white font-medium">
                          The Solara Sculpted Hoops
                        </h4>
                        <span className="text-xs font-semibold text-[#E8DFD5]">{money(1499)}</span>
                      </div>

                      <button
                        onClick={() => setStudioOpen(true)}
                        className="px-3.5 py-2 bg-[#603A46] hover:bg-[#852F3A] text-white text-[10px] uppercase tracking-wider font-bold rounded flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Sparkles className="w-3 h-3 text-[#C6A064]" />
                        <span>Try in 3D</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Shop by Category */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8DFD5]">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
                DISCOVERY ARCHIVE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
                Shop By Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-3 md:mt-0 text-xs uppercase tracking-wider font-semibold text-[#603A46] hover:text-[#852F3A] flex items-center gap-1"
            >
              <span>View All Pieces</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6A064]" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categoriesList.map((cat) => (
              <Link
                key={cat.name}
                href={`/shop/${cat.slug}`}
                className="group relative rounded overflow-hidden aspect-3/4 bg-[#EFE8DE] border border-[#E8DFD5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-end p-4 sm:p-5"
              >
                <img
                  src={getImg(cat.image, 600)}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="relative z-10 text-white">
                  <span className="text-[9px] uppercase tracking-widest text-[#C6A064] font-semibold block mb-0.5">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-medium tracking-tight group-hover:text-[#C6A064] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-[#F8F4EE]/70 font-semibold flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 text-[#C6A064]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. New Arrivals (Responsive Product Grid) */}
        <section id="shop" className="py-16 bg-white border-y border-[#E8DFD5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8DFD5]">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
                  NEW SEASON 2026
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
                  New Arrivals
                </h2>
              </div>

              {/* Category Pills & Sorting */}
              <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
                {['All', 'Earrings', 'Necklaces', 'Rings', 'Bracelets'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#603A46] text-[#F8F4EE] shadow-xs'
                        : 'bg-[#F8F4EE] text-[#766D6D] hover:text-[#211B1C] border border-[#E8DFD5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-[#F8F4EE] rounded border border-[#E8DFD5] overflow-hidden flex flex-col justify-between hover:border-[#603A46]/60 transition-all duration-300 hover:shadow-lg"
                >
                  {/* Image Container with Badges & Actions */}
                  <div className="relative aspect-square bg-[#EFE8DE] overflow-hidden">
                    <img
                      src={getImg(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Secondary Lifestyle Hover Image */}
                    {product.lifestyleImage && (
                      <img
                        src={getImg(product.lifestyleImage)}
                        alt={`${product.name} lifestyle`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}

                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      {product.badge && (
                        <span
                          className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-xs ${
                            product.badgeType === 'wine'
                              ? 'bg-[#852F3A] text-white'
                              : product.badgeType === 'bestseller'
                              ? 'bg-[#C6A064] text-[#151313]'
                              : 'bg-white/90 text-[#211B1C]'
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs transition-colors z-10 shadow-xs ${
                        wishlist.includes(product.id)
                          ? 'text-[#852F3A]'
                          : 'text-[#766D6D] hover:text-[#852F3A]'
                      }`}
                      aria-label="Save to wishlist"
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                      />
                    </button>

                    {/* Quick View Button */}
                    <button
                      onClick={() => {
                        setQuickViewProduct(product);
                        setQuickViewImage('main');
                      }}
                      className="absolute bottom-2.5 inset-x-2.5 py-2 bg-white/95 backdrop-blur-md text-[#211B1C] hover:bg-[#603A46] hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Info Container */}
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
                        className="font-serif text-base sm:text-lg text-[#211B1C] hover:text-[#852F3A] font-medium line-clamp-1 transition-colors"
                      >
                        {product.name}
                      </Link>

                      <p className="text-[11px] text-[#766D6D] line-clamp-1 mt-0.5">
                        {product.material}
                      </p>
                    </div>

                    <div className="pt-3 mt-2 border-t border-[#E8DFD5] flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm sm:text-base text-[#603A46]">
                          {money(product.price)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-[11px] text-[#766D6D] line-through">
                            {money(product.oldPrice)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-3 py-1.5 bg-[#603A46] hover:bg-[#852F3A] text-white rounded text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Bestsellers Showcase */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C6A064] font-semibold block mb-1">
              THE SIGNATURE SUITE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
              Most Adored Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-[#766D6D] mt-2 font-light">
              Pieces selected repeatedly by Indian brides, festival connoisseurs, and contemporary minimalists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bestsellers.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded border border-[#E8DFD5] shadow-xs flex flex-col justify-between group hover:border-[#603A46] transition-all"
              >
                <div className="relative aspect-4/5 rounded overflow-hidden bg-[#F8F4EE] mb-4">
                  <img
                    src={getImg(item.lifestyleImage || item.image, 800)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#603A46] text-[#F8F4EE] text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                    Signature Icon
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl text-[#211B1C] font-medium group-hover:text-[#852F3A] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#766D6D] mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#E8DFD5] flex items-center justify-between">
                  <span className="font-semibold text-base text-[#603A46]">
                    {money(item.price)}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${item.id}`}
                      className="px-3.5 py-2 border border-[#603A46] text-[#603A46] hover:bg-[#603A46] hover:text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="px-4 py-2 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                    >
                      Add To Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Featured Collections */}
        <section className="py-16 bg-[#211C1D] text-[#F8F4EE] border-y border-[#C6A064]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#C6A064] font-semibold block mb-1">
                  CURATED NARRATIVES
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F4EE] font-medium tracking-tight">
                  Featured Collections
                </h2>
              </div>
              <Link
                href="/collections"
                className="mt-3 md:mt-0 text-xs uppercase tracking-wider font-semibold text-[#C6A064] hover:text-white flex items-center gap-1"
              >
                <span>View All Collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCollections.map((col) => (
                <Link
                  key={col.title}
                  href={col.link}
                  className="group relative rounded overflow-hidden aspect-4/5 bg-[#151313] border border-[#C6A064]/20 p-6 flex flex-col justify-end shadow-xl hover:border-[#C6A064] transition-all"
                >
                  <img
                    src={getImg(col.image, 800)}
                    alt={col.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-80 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151313] via-[#151313]/40 to-transparent" />

                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#C6A064] font-semibold">
                      Curated Edit
                    </span>
                    <h3 className="font-serif text-2xl font-medium text-white group-hover:text-[#C6A064] transition-colors">
                      {col.title}
                    </h3>
                    <p className="text-xs text-[#E8DFD5]/80 line-clamp-2 font-light">
                      {col.subtitle}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#C6A064] pt-2">
                      <span>Explore Archive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 8 & 9. Festive & Wedding Edit + Campaign Banner */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded bg-linear-to-r from-[#603A46] via-[#852F3A] to-[#603A46] text-[#F8F4EE] p-8 sm:p-12 lg:p-16 overflow-hidden border border-[#C6A064]/30 shadow-2xl">
            {/* Ambient Background Accents */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#C6A064]/20 blur-3xl pointer-events-none" />

            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C6A064] text-[10px] uppercase tracking-widest font-semibold border border-[#C6A064]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Festival of Lights & Royal Receptions</span>
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
                Celebrate The Season <br />
                <span className="italic text-[#C6A064]">With Timeless Radiance</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#E8DFD5]/90 leading-relaxed font-light">
                Elevate family poojas, bridal sangeets, and cocktail soirées with our signature 18k gold vermeil and natural pearl collection. Packaged in custom velvet gift keepsakes.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="bg-[#151313]/80 border border-[#C6A064]/40 px-4 py-2.5 rounded text-xs flex items-center gap-3">
                  <span className="text-[#E8DFD5]">Privilege Code:</span>
                  <span className="font-mono text-sm font-bold text-[#C6A064]">FESTIVE15</span>
                  <span className="text-[10px] text-[#E8DFD5]/70">(15% OFF)</span>
                </div>

                <Link
                  href="/collections/festive-radiance"
                  className="px-6 py-3 bg-[#C6A064] hover:bg-white text-[#151313] hover:text-[#603A46] font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-md"
                >
                  <span>Shop Festive Edit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Shop by Occasion */}
        <section className="py-12 bg-[#EFE8DE] border-y border-[#E8DFD5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
                STYLED FOR YOUR MOMENTS
              </span>
              <h2 className="font-serif text-3xl text-[#603A46] font-medium tracking-tight">
                Shop By Occasion
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Bridal & Wedding', desc: 'Pearl drops & sculptural cuffs', slug: 'wedding-collection' },
                { title: 'Festive Celebrations', desc: 'Triple-layer chains & sunburst coins', slug: 'festive-radiance' },
                { title: 'Daily Minimal', desc: 'Featherweight hoops & signet bands', slug: 'everyday-elegance' },
                { title: 'Evening Soirée', desc: 'Micro-pavé stacking duo rings', slug: 'statement-pieces' },
              ].map((occ) => (
                <Link
                  key={occ.title}
                  href={`/collections/${occ.slug}`}
                  className="p-5 bg-white rounded border border-[#E8DFD5] hover:border-[#603A46] transition-all group"
                >
                  <h3 className="font-serif text-lg font-medium text-[#211B1C] group-hover:text-[#852F3A] transition-colors">
                    {occ.title}
                  </h3>
                  <p className="text-xs text-[#766D6D] mt-1">{occ.desc}</p>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#603A46] group-hover:translate-x-1 transition-transform flex items-center gap-1 mt-3">
                    <span>Explore Edit</span>
                    <ArrowRight className="w-3 h-3 text-[#C6A064]" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Curated Product Recommendations ("Complete The Look") */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8DFD5]">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#C6A064] font-semibold block mb-1">
                ATELIER STYLING
              </span>
              <h2 className="font-serif text-3xl text-[#603A46] font-medium tracking-tight">
                Complete The Look
              </h2>
            </div>
            <span className="text-xs text-[#766D6D]">
              Harmonious pairings crafted to stack seamlessly together
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 4).map((p) => (
              <div
                key={`rec-${p.id}`}
                className="bg-white p-3 sm:p-4 rounded border border-[#E8DFD5] flex flex-col justify-between group"
              >
                <Link href={`/products/${p.id}`} className="block aspect-square bg-[#F8F4EE] rounded overflow-hidden mb-3">
                  <img
                    src={getImg(p.image, 400)}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>

                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#766D6D] block">
                    {p.category}
                  </span>
                  <Link
                    href={`/products/${p.id}`}
                    className="font-serif text-sm font-medium text-[#211B1C] group-hover:text-[#852F3A] line-clamp-1"
                  >
                    {p.name}
                  </Link>
                  <span className="text-xs font-semibold text-[#603A46] block mt-1">
                    {money(p.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(p)}
                  className="w-full mt-3 py-2 bg-[#F8F4EE] hover:bg-[#603A46] text-[#211B1C] hover:text-white border border-[#E8DFD5] rounded text-[11px] uppercase tracking-wider font-semibold transition-colors"
                >
                  Quick Add
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 12. Brand Craftsmanship and Trust Section */}
        <section className="py-16 sm:py-20 bg-[#151313] text-[#F8F4EE] border-t border-[#C6A064]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#C6A064] font-semibold block">
                  JAIPUR & MUMBAI ATELIERS
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
                  Heirloom Integrity, <br />
                  <span className="italic text-[#C6A064]">Modern Precision</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#E8DFD5]/80 font-light leading-relaxed">
                  Every Urban Glimmer jewel begins with conscious sourcing. We utilize thick 18k yellow gold vermeil layered over recycled 925 sterling silver, ensuring that your treasured pieces remain anti-tarnish, water-resistant, and gentle on sensitive skin.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-serif text-xl text-[#C6A064]">2.5 Microns</span>
                    <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">
                      Gold Vermeil Depth
                    </h4>
                    <p className="text-[11px] text-[#766D6D]">
                      5x thicker than ordinary flash plating for years of radiant luster.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-serif text-xl text-[#C6A064]">100% Insured</span>
                    <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">
                      Secured Transit
                    </h4>
                    <p className="text-[11px] text-[#766D6D]">
                      Tamper-evident packaging delivered by BlueDart Luxury Express.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded overflow-hidden aspect-4/5 border border-[#C6A064]/20">
                  <img
                    src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
                    alt="Artisan crafting jewellery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded overflow-hidden aspect-4/5 border border-[#C6A064]/20 mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"
                    alt="Polished gold vermeil pieces"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 13. Jewellery Care or Styling Journal */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8DFD5]">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
                THE EDITORIAL JOURNAL
              </span>
              <h2 className="font-serif text-3xl text-[#603A46] font-medium tracking-tight">
                Styling & Care Notes
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <article className="bg-white p-5 rounded border border-[#E8DFD5] space-y-3">
              <span className="text-[10px] tracking-widest uppercase text-[#C6A064] font-bold block">
                CARE GUIDE
              </span>
              <h3 className="font-serif text-lg font-medium text-[#211B1C]">
                How to Preserve 18k Gold Vermeil Across Seasons
              </h3>
              <p className="text-[#766D6D] leading-relaxed">
                Simple rituals for gently wiping your earrings and necklaces with our complimentary microfiber cloth after festive celebrations.
              </p>
              <Link href="/faq" className="text-[#603A46] font-semibold inline-flex items-center gap-1 hover:text-[#852F3A]">
                <span>Read Care Ritual</span>
                <ArrowRight className="w-3 h-3 text-[#C6A064]" />
              </Link>
            </article>

            <article className="bg-white p-5 rounded border border-[#E8DFD5] space-y-3">
              <span className="text-[10px] tracking-widest uppercase text-[#C6A064] font-bold block">
                STYLING ESSAY
              </span>
              <h3 className="font-serif text-lg font-medium text-[#211B1C]">
                The Architectural Collar: Stacking Chains with Saree Blouses
              </h3>
              <p className="text-[#766D6D] leading-relaxed">
                Why pairing delicate sunburst medallions with deep neckline silks creates modern balance for wedding guest ensembles.
              </p>
              <Link href="/collections" className="text-[#603A46] font-semibold inline-flex items-center gap-1 hover:text-[#852F3A]">
                <span>View Styling Guide</span>
                <ArrowRight className="w-3 h-3 text-[#C6A064]" />
              </Link>
            </article>

            <article className="bg-white p-5 rounded border border-[#E8DFD5] space-y-3">
              <span className="text-[10px] tracking-widest uppercase text-[#C6A064] font-bold block">
                ATELIER NOTES
              </span>
              <h3 className="font-serif text-lg font-medium text-[#211B1C]">
                The Story Behind Jaipur&apos;s Hollow Casting Technology
              </h3>
              <p className="text-[#766D6D] leading-relaxed">
                How our master goldsmiths craft bold sculptural hoops that weigh under 3.5 grams for all-day festive comfort.
              </p>
              <Link href="/about" className="text-[#603A46] font-semibold inline-flex items-center gap-1 hover:text-[#852F3A]">
                <span>Discover Heritage</span>
                <ArrowRight className="w-3 h-3 text-[#C6A064]" />
              </Link>
            </article>
          </div>
        </section>

        {/* 14. Newsletter Subscription */}
        <section className="py-16 bg-[#F8F4EE] border-t border-[#E8DFD5] text-center">
          <div className="max-w-xl mx-auto px-4 space-y-4">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block">
              ATELIER DISPATCHES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
              A Little Sparkle In Your Inbox
            </h2>
            <p className="text-xs text-[#766D6D] leading-relaxed">
              Subscribe for private festive previews, styling journals, and secret archive access. Never spam; unsubscribe whenever you wish.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-white border border-[#E8DFD5] rounded px-4 py-3 text-xs placeholder:text-[#766D6D] focus:outline-[#603A46]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded transition-colors shadow-xs"
              >
                Join Archive
              </button>
            </form>

            {newsletterSubmitted && (
              <p className="text-xs text-emerald-700 font-semibold pt-1">
                ✓ Welcome to Urban Glimmer. Check your inbox for your welcome invitation.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* 15. Luxury Multi-Column Footer */}
      <Footer />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setQuickViewProduct(null)}
          />
          <div className="relative bg-white rounded shadow-2xl max-w-3xl w-full p-6 border border-[#E8DFD5] z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-[#766D6D] hover:text-[#211B1C]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square bg-[#F8F4EE] rounded overflow-hidden border border-[#E8DFD5]">
                <img
                  src={getImg(quickViewImage === 'main' ? quickViewProduct.image : quickViewProduct.lifestyleImage)}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C6A064] font-semibold block">
                    {quickViewProduct.category} · {quickViewProduct.sku || `UG-00${quickViewProduct.id}`}
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-[#211B1C] mt-1">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-serif text-2xl text-[#603A46] font-semibold">
                      {money(quickViewProduct.price)}
                    </span>
                    {quickViewProduct.oldPrice && (
                      <span className="text-xs text-[#766D6D] line-through">
                        {money(quickViewProduct.oldPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#766D6D] leading-relaxed mt-3">
                    {quickViewProduct.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#E8DFD5] space-y-1 text-xs text-[#766D6D]">
                    <p><strong>Material:</strong> {quickViewProduct.material}</p>
                    <p><strong>Finish:</strong> {quickViewProduct.color}</p>
                    <p><strong>Dimensions:</strong> {quickViewProduct.dimensions}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleAddToCart(quickViewProduct)}
                    className="w-full py-3 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded transition-colors shadow-xs"
                  >
                    Add To Shopping Bag
                  </button>
                  <Link
                    href={`/products/${quickViewProduct.id}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="w-full block text-center py-2 text-xs text-[#603A46] hover:underline font-semibold"
                  >
                    View Full Product Page & Reviews →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
      />

      {/* Search Drawer */}
      <SearchDrawer
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* 3D Virtual Studio Modal (Optional full viewport immersive experience) */}
      {studioOpen && (
        <VirtualStudioModal
          isOpen={studioOpen}
          onClose={() => setStudioOpen(false)}
          cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
          wishlistCount={wishlist.length}
          onAddToCart={handleAddToCart}
          onOpenCart={() => {
            setStudioOpen(false);
            setCartOpen(true);
          }}
        />
      )}

      {/* Festive Privilege Modal */}
      <FestiveModal />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211C1D] text-[#F8F4EE] border border-[#C6A064]/50 text-xs px-4 py-3 rounded shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#C6A064]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
