'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';

const VirtualStudioModal = dynamic(() => import('@/components/studio/VirtualStudioModal'), {
  ssr: false,
});
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  X,
  SlidersHorizontal,
  Trash2,
  Instagram,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gift,
  Tag,
  Box,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Product,
  INITIAL_PRODUCTS,
  getStoredProducts,
} from '@/lib/productStore';
import { createNewOrder } from '@/lib/orderStore';
import ProductSuggestions from '@/components/studio/ProductSuggestions';

type CartItem = {
  product: Product;
  quantity: number;
};

const products: Product[] = INITIAL_PRODUCTS;

const categories = ['All pieces', 'Necklaces', 'Earrings', 'Rings', 'Bracelets'];

const chaptersData = [
  { id: '01', title: 'Earrings & Drops', desc: 'Sculptural forms and delicate drops designed to catch the light from every angle. Engineered for comfort, worn for impact.', category: 'Earrings' },
  { id: '02', title: 'Necklaces & Pendants', desc: 'Layered or singular. Warm gold chains and pendants that rest effortlessly against the collarbone.', category: 'Necklaces' },
  { id: '03', title: 'Rings & Bands', desc: 'Fluid bands and confident signets. Stack them high or wear them as solo statements for everyday glow.', category: 'Rings' },
  { id: '04', title: 'Bracelets & Cuffs', desc: 'Architectural cuffs and micro-geometric chains that move elegantly with the natural motion of the wrist.', category: 'Bracelets' },
];

const money = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

const img = (id: string, width = 800) => {
  if (!id) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85';
  if (id.startsWith('http') || id.startsWith('/') || id.startsWith('blob:')) return id;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
};


// Interactive Editorial Chapter Component
function ChapterScene({
  chapter,
  allProducts,
  onAddToCart,
  onViewDetails,
}: {
  chapter: typeof chaptersData[0];
  allProducts: Product[];
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}) {
  const chapProducts = allProducts.filter((p) => p.category === chapter.category);
  const [activePId, setActivePId] = useState(chapProducts[0]?.id);
  const activeP = chapProducts.find((p) => p.id === activePId) || chapProducts[0];

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  
  return (
    <section ref={ref} className="chapter-scene" id={`chapter-${chapter.id}`}>
      <div className="chapter-sticky">
        {/* Left/Background Image Panel */}
        <div className="chapter-visual">
          <motion.img
            key={activeP.id} // Forces crossfade on product change
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            src={img(activeP.lifestyleImage, 1400)}
            style={{ y: imgY }}
            className="chapter-img"
            alt={activeP.name}
          />
          <div className="chapter-visual-overlay" />
        </div>

        {/* Right Foreground UI */}
        <div className="chapter-content">
          <div className="chapter-content-inner">
            <span className="chapter-num">CHAPTER {chapter.id}</span>
            <h2 className="chapter-title">
              <em>{chapter.title.split('&')[0]}</em> & {chapter.title.split('&')[1]}
            </h2>
            <p className="chapter-desc">{chapter.desc}</p>

            {/* Product Explorer Selector */}
            <div className="chapter-explorer">
              <span className="explorer-label">EXPLORE THE EDIT</span>
              <div className="chapter-product-selector">
                {chapProducts.map((p) => (
                  <button
                    key={p.id}
                    className={`selector-btn ${p.id === activePId ? 'active' : ''}`}
                    onClick={() => setActivePId(p.id)}
                    aria-label={`View ${p.name}`}
                  >
                    <img src={img(p.image, 150)} alt={p.name} />
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={`info-${activeP.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="chapter-product-info"
            >
              <h3>{activeP.name}</h3>
              <p className="finish">Finish: <strong>{activeP.color}</strong></p>
              <div className="price-row">{money(activeP.price)}</div>

              <div className="chapter-actions">
                <Button onClick={() => onAddToCart(activeP)} className="ug-button-dark">
                  ADD TO BAG
                </Button>
                <button className="text-link" onClick={() => onViewDetails(activeP)}>
                  VIEW DETAILS <ArrowUpRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [category, setCategory] = useState('All pieces');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeModalImage, setActiveModalImage] = useState<'main' | 'lifestyle'>('main');
  const [modalQty, setModalQty] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sort, setSort] = useState('Featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [mobileFilter, setMobileFilter] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [studioOpen, setStudioOpen] = useState(false);

  // Live Catalog State synced with localStorage & Admin Panel
  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    setAllProducts(getStoredProducts());
    const handleCatalogUpdate = () => setAllProducts(getStoredProducts());
    window.addEventListener('urban_glimmer_catalog_updated', handleCatalogUpdate);
    return () => window.removeEventListener('urban_glimmer_catalog_updated', handleCatalogUpdate);
  }, []);

  // Hero Cinematic Scroll Effects
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  // Close search and modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setActiveProduct(null);
        setCartOpen(false);
        setMobileMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (showWishlistOnly) return wishlist.includes(p.id);
      const matchesCategory = category === 'All pieces' || p.category.toLowerCase() === category.toLowerCase();
      const matchesSearch = `${p.name} ${p.category} ${p.color} ${p.description}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sort === 'Price: low to high') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'Price: high to low') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'Top rated') list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
    if (sort === 'Newest') list = [...list].sort((a, b) => b.id - a.id);
    return list;
  }, [allProducts, category, query, sort, showWishlistOnly, wishlist]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const effectiveSubtotal = Math.max(0, subtotal - discountAmount);
  const shipping = effectiveSubtotal >= 1999 || effectiveSubtotal === 0 ? 0 : 99;
  const grandTotal = effectiveSubtotal + shipping;

  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2600);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((old) => {
      const found = old.find((i) => i.product.id === product.id);
      return found
        ? old.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [...old, { product, quantity }];
    });
    setActiveProduct(null);
    setCartOpen(true);
    setCheckout(false);
    setOrderPlaced(false);
    notify(`${product.name} added to your bag`);
  };

  const updateQty = (id: number, amount: number) => {
    setCart((old) =>
      old
        .map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + amount } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const toggleWish = (id: number) => {
    const has = wishlist.includes(id);
    setWishlist((old) => (has ? old.filter((x) => x !== id) : [...old, id]));
    notify(has ? 'Removed from your wishlist' : 'Saved to your wishlist');
  };

  const jumpToShop = (targetCategory?: string) => {
    if (targetCategory) {
      setCategory(targetCategory);
      setShowWishlistOnly(false);
    }
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'GLIMMER10') {
      setAppliedDiscount(0.1);
      setCouponError('');
      notify('Code GLIMMER10 applied: 10% off your order');
    } else if (code === 'FESTIVE15') {
      setAppliedDiscount(0.15);
      setCouponError('');
      notify('Code FESTIVE15 applied: 15% festive discount');
    } else {
      setCouponError('Invalid code. Try GLIMMER10 or FESTIVE15');
      notify('Invalid code. Try GLIMMER10');
    }
  };

  return (
    <main>
      {/* 1. Announcement Bar */}
      <aside className="announcement" aria-label="Store announcement">
        <span>COMPLIMENTARY SHIPPING ON ORDERS OVER ₹1,999</span>
        <span className="announcement-right">
          USE CODE <strong className="text-[var(--champagne-light)] mx-1">GLIMMER10</strong> FOR 10% OFF
          <ArrowUpRight size={13} className="inline ml-1 text-[var(--champagne-gold)]" />
        </span>
      </aside>

      {/* 2. Site Header */}
      <header className="site-header">
        <div className="header-left">
          <button
            className="icon-btn mobile-only"
            aria-label="Open mobile navigation menu"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={22} />
          </button>
          <button
            className="header-link desktop-only"
            onClick={() => {
              setShowWishlistOnly(false);
              setCategory('All pieces');
              jumpToShop();
            }}
          >
            THE ARCHIVE <ArrowDownRight size={13} />
          </button>
          <button
            className="header-link desktop-only flex items-center gap-1.5 text-[var(--champagne-gold)] font-semibold"
            onClick={() => setStudioOpen(true)}
          >
            <Sparkles size={13} className="text-[var(--champagne-gold)]" />
            3D TRY-ON STUDIO
          </button>
          <button
            className="header-link desktop-only"
            onClick={() => document.getElementById('chapter-01')?.scrollIntoView({ behavior: 'smooth' })}
          >
            CAMPAIGN
          </button>
          <a href="#story" className="header-link desktop-only">
            OUR STORY
          </a>
        </div>

        <a className="wordmark" href="#top" aria-label="Urban Glimmer home">
          urban<span>glimmer</span>
          <i>®</i>
          <small>JEWELLERY FOR YOUR EVERYDAY</small>
        </a>

        <div className="header-actions">
          <button
            className="icon-btn search-trigger"
            aria-label="Search jewelry catalogue"
            onClick={() => {
              setSearchOpen((v) => !v);
              setTimeout(() => document.getElementById('search-input')?.focus(), 60);
            }}
          >
            <Search size={20} />
            <span className="desktop-only text-[11px] font-semibold tracking-wider">SEARCH</span>
          </button>

          <button
            className="icon-btn"
            aria-label={`View wishlist (${wishlist.length} saved)`}
            onClick={() => {
              setShowWishlistOnly((prev) => !prev);
              setCategory('All pieces');
              jumpToShop();
              notify(
                wishlist.length === 0
                  ? 'Your wishlist is currently empty. Tap the heart on any piece to save.'
                  : `Showing ${wishlist.length} saved pieces`
              );
            }}
          >
            <Heart
              size={20}
              className={wishlist.length > 0 ? 'fill-[var(--festive-wine)] text-[var(--festive-wine)]' : ''}
            />
            {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
          </button>

          <button
            className="icon-btn bag-trigger"
            aria-label={`Open shopping bag`}
            onClick={() => {
              setCartOpen(true);
              setCheckout(false);
              setOrderPlaced(false);
            }}
          >
            <ShoppingBag size={20} />
            <span className="desktop-only text-[11px] font-semibold tracking-wider">
              BAG ({cartCount})
            </span>
            {cartCount > 0 && <span className="badge-count mobile-only">{cartCount}</span>}
          </button>

          <Link href="/admin" className="admin-nav-pill desktop-only ml-2" title="Studio Admin Panel (No Password)">
            Admin
          </Link>
        </div>
      </header>

      {/* Expandable Search Drawer */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="search-panel"
          >
            <Search size={18} className="text-[var(--burgundy)]" />
            <input
              id="search-input"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowWishlistOnly(false);
                if (e.target.value) {
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              placeholder="Search necklaces, hoops, signet rings, cuffs..."
            />
            <span className="search-hint">PRESS ESC TO CLOSE</span>
            <button className="icon-btn" onClick={() => { setSearchOpen(false); setQuery(''); }}>
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div className="mobile-menu-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenu(false)}>
            <motion.div className="mobile-menu" initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-head">
                <a className="wordmark" href="#top">urban<span>glimmer</span><i>®</i></a>
                <button className="icon-btn" onClick={() => setMobileMenu(false)}><X size={22} /></button>
              </div>
              <div className="flex flex-col mt-4">
                {categories.map((c) => (
                  <button key={c} className="mobile-nav-link" onClick={() => jumpToShop(c)}>
                    <span>{c}</span>
                    <span className="mobile-nav-badge">{c === 'All pieces' ? allProducts.length : allProducts.filter(p => p.category.toLowerCase() === c.toLowerCase()).length}</span>
                  </button>
                ))}
                <button
                  className="mobile-nav-link text-[var(--champagne-gold)] font-semibold"
                  onClick={() => {
                    setMobileMenu(false);
                    setStudioOpen(true);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={18} className="text-[var(--champagne-gold)]" />
                    3D Virtual Try-On Studio
                  </span>
                  <span className="mobile-nav-badge text-[var(--champagne-gold)]">LIVE</span>
                </button>
                <button className="mobile-nav-link" onClick={() => { setShowWishlistOnly(true); jumpToShop(); }}>
                  <span className="flex items-center gap-2"><Heart size={18} className="text-[var(--festive-wine)]" /> Saved Wishlist</span>
                  <span className="mobile-nav-badge">{wishlist.length}</span>
                </button>
                <Link
                  href="/admin"
                  className="mobile-nav-link text-[var(--festive-wine)] font-bold mt-2 pt-2 border-t border-[var(--line)]"
                  onClick={() => setMobileMenu(false)}
                >
                  <span className="flex items-center gap-2">
                    <Tag size={18} />
                    Studio Admin Panel (No Password)
                  </span>
                  <span className="mobile-nav-badge bg-[var(--festive-wine)] text-white">ADMIN</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Immersive Cinematic Hero */}
      <section ref={heroRef} id="top" className="hero-cinematic">
        <div className="hero-sticky-frame">
          <motion.img
            src={img('photo-1599643478518-a784e5dc4c8f', 2400)}
            style={{ scale: heroScale, y: heroY }}
            className="hero-cinematic-bg"
            alt="Editorial Campaign Hero"
          />
          <div className="hero-cinematic-overlay" />
          
          <motion.div style={{ opacity: heroOpacity }} className="hero-cinematic-content">
            <div className="hero-cinematic-eyebrow">THE NEW STANDARD</div>
            <h1 className="hero-cinematic-title">
              Everyday<br />
              <em>Adornment</em>
            </h1>
            <p className="hero-cinematic-desc">
              Considered gold-tone jewellery and everyday accessories. Thoughtfully chosen, beautifully crafted, and relentlessly worn.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setStudioOpen(true)}
                className="px-6 py-3.5 rounded-full bg-[#C6A064] hover:bg-[#D4B07B] text-[#141013] font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(198,160,100,0.4)] flex items-center gap-2 hover:scale-105 duration-300"
              >
                <Sparkles size={15} />
                <span>ENTER 3D TRY-ON STUDIO</span>
              </button>
              <button
                onClick={() => jumpToShop()}
                className="px-6 py-3.5 rounded-full bg-black/40 hover:bg-black/65 text-[#F7F0E6] font-semibold text-xs tracking-widest uppercase transition border border-white/20 backdrop-blur-sm"
              >
                <span>EXPLORE ARCHIVE</span>
              </button>
            </div>
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="hero-scroll-indicator">
            <span>SCROLL TO EXPLORE</span>
            <div className="scroll-line">
              <motion.div
                animate={{ y: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="scroll-line-progress"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="trust-strip" aria-label="Customer assurances">
        <div><Truck size={19} /><span>COMPLIMENTARY SHIPPING OVER ₹1,999</span></div>
        <div><ShieldCheck size={19} /><span>18K GOLD VERMEIL & ANTI-TARNISH</span></div>
        <div><RotateCcw size={19} /><span>HASSLE-FREE 7-DAY RETURNS</span></div>
        <div><Gift size={19} /><span>SIGNATURE GIFT BOX INCLUDED</span></div>
      </section>

      {/* 4 & 5. Scroll-Driven Jewellery Chapters with Interactive Exploration */}
      <div className="chapters-container">
        {chaptersData.map((chap) => (
          <ChapterScene
            key={chap.id}
            chapter={chap}
            allProducts={allProducts}
            onAddToCart={(p) => addToCart(p, 1)}
            onViewDetails={(p) => {
              setActiveProduct(p);
              setActiveModalImage('main');
              setModalQty(1);
            }}
          />
        ))}
      </div>

      {/* 6. Full Product Catalogue Section ("The Archive") */}
      <section className="shop-section section-pad" id="shop">
        <div className="section-topline">
          <span className="eyebrow">THE ARCHIVE</span>
          <span className="section-note">FULL COLLECTION & FILTERS</span>
        </div>

        <div className="shop-heading-row">
          <div>
            <h2>
              {showWishlistOnly ? (
                <>Your saved <em>wishlist.</em></>
              ) : (
                <>Explore <em>everything.</em></>
              )}
            </h2>
            <p className="section-subtitle">
              {showWishlistOnly
                ? `You have saved ${wishlist.length} pieces to your personal edit.`
                : "The pieces you'll reach for before you even think about it."}
            </p>
          </div>
        </div>

        {/* Category & Filter Tabs */}
        <div className="shop-controls">
          <div className="category-tabs">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setShowWishlistOnly(false); }}
                className={`category-tab ${!showWishlistOnly && category === c ? 'active' : ''}`}
              >
                {c}
                <span>
                  {c === 'All pieces' ? allProducts.length : allProducts.filter((p) => p.category.toLowerCase() === c.toLowerCase()).length}
                </span>
              </button>
            ))}
            {wishlist.length > 0 && (
              <button
                onClick={() => setShowWishlistOnly(true)}
                className={`category-tab ${showWishlistOnly ? 'active' : ''}`}
              >
                Wishlist
                <span className="bg-[var(--festive-wine)] text-[var(--warm-ivory)]">{wishlist.length}</span>
              </button>
            )}
          </div>

          <div className="sort-area">
            <button className="filter-mobile" onClick={() => setMobileFilter((v) => !v)}>
              <SlidersHorizontal size={15} /> FILTER
            </button>
            <button className="sort-button" onClick={() => setSortOpen((v) => !v)}>
              {sort.toUpperCase()} <ChevronDown size={14} />
            </button>
            {sortOpen && (
              <div className="sort-menu">
                {['Featured', 'Price: low to high', 'Price: high to low', 'Top rated', 'Newest'].map((s) => (
                    <button key={s} onClick={() => { setSort(s); setSortOpen(false); }}>
                      {s} {sort === s && <Check size={14} className="text-[var(--festive-wine)]" />}
                    </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter */}
        <AnimatePresence>
          {mobileFilter && (
            <motion.div className="mobile-filter-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {categories.map((c) => (
                <button key={c} onClick={() => { setCategory(c); setShowWishlistOnly(false); setMobileFilter(false); }} className={!showWishlistOnly && category === c ? 'selected' : ''}>
                  {c}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {query && (
          <div className="results-note">
            Showing results for <strong>“{query}”</strong>
            <button onClick={() => setQuery('')}>Clear search <X size={13} /></button>
          </div>
        )}

        {/* Product Cards Grid */}
        <motion.div layout className="product-grid">
          {filtered.map((p, i) => (
            <motion.article
              layout
              key={p.id}
              className="product-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.035 }}
            >
              <div className="product-image-wrap" onClick={() => { setActiveProduct(p); setActiveModalImage('main'); setModalQty(1); }}>
                <img src={img(p.image, 650)} alt={p.name} loading={i > 3 ? 'lazy' : 'eager'} />
                {p.badge && <span className={`product-badge ${p.badgeType === 'wine' ? 'badge-wine' : p.badgeType === 'light' ? 'badge-light' : ''}`}>{p.badge}</span>}
                <button className={`wishlist-btn ${wishlist.includes(p.id) ? 'is-saved' : ''}`} onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}>
                  <Heart size={17} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} />
                </button>
                <button className="quick-add" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>
                  QUICK ADD <Plus size={14} />
                </button>
                <span className="product-index">UG.0{p.id}</span>
              </div>
              <div className="product-info">
                <div className="product-name-row">
                  <button className="product-name" onClick={() => { setActiveProduct(p); setActiveModalImage('main'); setModalQty(1); }}>{p.name}</button>
                  <span className="product-rating"><Star size={12} fill="currentColor" /> {p.rating}</span>
                </div>
                <div className="product-meta">
                  <span>{p.color}</span>
                  <span className="product-price">{money(p.price)} {p.oldPrice && <del>{money(p.oldPrice)}</del>}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="empty-results">
            <Sparkles size={28} className="mx-auto text-[var(--champagne-gold)] mb-3" />
            <h3>No pieces found.</h3>
            <Button variant="outline" onClick={() => { setQuery(''); setShowWishlistOnly(false); setCategory('All pieces'); }}>
              VIEW ALL PIECES
            </Button>
          </div>
        )}
      </section>

      {/* 7. Brand Story / Manifesto Section */}
      <section className="manifesto" id="story">
        <div className="manifesto-image">
          <img src={img('photo-1534528741775-53994a69daeb', 1100)} alt="Warm editorial portrait wearing gold jewelry" />
          <span className="manifesto-image-caption">A STUDY IN THE LITTLE THINGS / 001</span>
        </div>
        <div className="manifesto-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> OUR POINT OF VIEW</div>
          <span className="manifesto-asterisk">✳</span>
          <h2>Not saved<br />for <em>best.</em></h2>
          <p>
            We believe the good stuff shouldn't wait for a special occasion. The hoops you sleep in.
            The chain that becomes an extension of you. The ring that gives you that subtle everyday glow.
          </p>
          <button onClick={() => jumpToShop('All pieces')} className="text-link">
            FIND YOUR EVERYDAY PIECE <ArrowUpRight size={15} />
          </button>
          <div className="manifesto-signoff">WITH LOVE, <strong>THE URBAN GLIMMER STUDIO</strong></div>
        </div>
      </section>

      {/* 8. Quote Section */}
      <section className="quote-section">
        <span className="quote-mark">“</span>
        <p>It's never just an accessory.<br />It's the <em>feeling</em> you put on.</p>
        <div className="quote-footer">
          <span>THE URBAN GLIMMER WAY</span><span>✳</span><span>MADE FOR YOUR EVERYDAY</span>
        </div>
      </section>

      {/* 9. Instagram Community Gallery */}
      <section className="community-section" id="community">
        <div className="community-header">
          <div>
            <span className="eyebrow"><span className="eyebrow-line" /> AS SEEN ON YOU</span>
            <h3>Follow the glow. <em>@urbanglimmer</em></h3>
          </div>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-link desktop-only">
            JOIN US ON INSTAGRAM <Instagram size={14} />
          </a>
        </div>
        <div className="community-grid">
          {[
            { imgId: 'photo-1515562141207-7a88fb7ce338', title: 'Layered gold chains' },
            { imgId: 'photo-1635767798638-3e25273a8236', title: 'Sculptural huggies & hoops' },
            { imgId: 'photo-1492707892479-7bc8d5a4ee93', title: 'Everyday ring stack' },
            { imgId: 'photo-1598560917505-59a3ad559071', title: 'Dainty wrist accents' },
          ].map((item, idx) => (
            <div key={idx} className="community-card">
              <img src={img(item.imgId, 500)} alt={item.title} />
              <div className="community-card-overlay">
                <Instagram size={22} className="text-[var(--champagne-light)]" />
                <span>{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Newsletter Section */}
      <section className="newsletter" id="newsletter">
        <div className="newsletter-icon">✳</div>
        <div className="newsletter-copy">
          <div className="eyebrow">A NOTE FROM US</div>
          <h2>A little glow<br /><em>in your inbox.</em></h2>
          <p>First look at new drops, private seasonal edits, and styling inspiration. Never noise, promise.</p>
        </div>
        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); setSubscribed(true); setEmail(''); notify('You’re on the list. Welcome to Urban Glimmer.'); }}>
          <label htmlFor="email">YOUR EMAIL ADDRESS</label>
          <div className="email-input-wrap">
            <Mail size={18} className="text-[var(--burgundy)]" />
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@somewhere.com" required />
            <button aria-label="Subscribe to newsletter" type="submit"><ArrowRight size={20} /></button>
          </div>
          <span className="newsletter-privacy">{subscribed ? 'YOU’RE ON THE LIST — SEE YOU IN YOUR INBOX.' : 'ENJOY 10% OFF YOUR FIRST ORDER WHEN YOU SUBSCRIBE.'}</span>
        </form>
        <div className="newsletter-decoration">UG<br />✳</div>
      </section>

      {/* 11. Site Footer */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="wordmark footer-wordmark" href="#top">urban<span>glimmer</span><i>®</i><small>JEWELLERY FOR YOUR EVERYDAY</small></a>
            <p>Little details.<br />Lasting impressions.</p>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link"><Instagram size={17} /> FOLLOW THE GLOW</a>
          </div>
          <div className="footer-column">
            <h4>COLLECTIONS</h4>
            <button onClick={() => jumpToShop('All pieces')}>Shop all</button>
            <button onClick={() => jumpToShop('Necklaces')}>Necklaces & Pendants</button>
            <button onClick={() => jumpToShop('Earrings')}>Earrings & Hoops</button>
            <button onClick={() => jumpToShop('Rings')}>Rings & Bands</button>
            <button onClick={() => jumpToShop('Bracelets')}>Bracelets & Cuffs</button>
          </div>
          <div className="footer-column">
            <h4>CUSTOMER CARE</h4>
            <button onClick={() => notify('Shipping: Complimentary over ₹1,999.')}>Shipping & Delivery</button>
            <button onClick={() => notify('Returns: 7-day returns on unworn pieces.')}>Returns & Exchanges</button>
            <button onClick={() => notify('Care: Polish gently, store dry.')}>Jewellery Care Guide</button>
            <button onClick={() => notify('Contact: hello@urbanglimmer.com')}>Contact Studio</button>
          </div>
          <div className="footer-note">
            <span className="tiny-star">✳</span>
            <p>GOOD THINGS<br />COME IN<br /><em>SMALL DETAILS.</em></p>
            <span>DESIGNED FOR YOUR EVERYDAY.</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} URBAN GLIMMER STUDIO. ALL RIGHTS RESERVED.</span>
          <div>
            <button onClick={() => notify('Privacy Policy')}>PRIVACY</button>
            <button onClick={() => notify('Terms of Service')}>TERMS</button>
            <span>INDIA · ₹ INR</span>
          </div>
          <a href="#top" className="back-top">BACK TO TOP <ArrowUpRight size={13} /></a>
        </div>
      </footer>

      {/* 12. Upgraded Premium Split-Screen Product Modal */}
      <AnimatePresence>
        {activeProduct && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setActiveProduct(null); }}>
            <motion.div className="product-modal-premium" initial={{ y: 30, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <button className="modal-close icon-btn" onClick={() => setActiveProduct(null)} aria-label="Close product details"><X size={20} /></button>
              
              <div className="modal-gallery-premium">
                <motion.img 
                  key={activeModalImage}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                  src={img(activeModalImage === 'main' ? activeProduct.image : activeProduct.lifestyleImage, 1200)} 
                  alt={activeProduct.name} 
                  className="modal-premium-image" 
                />
                <div className="modal-gallery-thumbs-overlay">
                  <button className={`modal-thumb-premium ${activeModalImage === 'main' ? 'active' : ''}`} onClick={() => setActiveModalImage('main')}>
                    <img src={img(activeProduct.image, 160)} alt="Product angle" />
                  </button>
                  <button className={`modal-thumb-premium ${activeModalImage === 'lifestyle' ? 'active' : ''}`} onClick={() => setActiveModalImage('lifestyle')}>
                    <img src={img(activeProduct.lifestyleImage, 160)} alt="Lifestyle angle" />
                  </button>
                </div>
              </div>

              <div className="modal-info-premium">
                <div className="modal-info-inner">
                  <div className="eyebrow">URBAN GLIMMER / OBJECT {String(activeProduct.id).padStart(3, '0')}</div>
                  <h2>{activeProduct.name}</h2>
                  <div className="modal-price-premium">
                    {money(activeProduct.price)} {activeProduct.oldPrice && <del>{money(activeProduct.oldPrice)}</del>}
                  </div>
                  <p className="modal-desc-premium">{activeProduct.description}</p>
                  
                  <div className="modal-specs">
                    <div className="modal-spec-row"><span>FINISH</span><strong>{activeProduct.color}</strong></div>
                    <div className="modal-spec-row"><span>MATERIAL</span><strong>{activeProduct.material}</strong></div>
                    <div className="modal-spec-row"><span>DIMENSIONS</span><strong>{activeProduct.dimensions}</strong></div>
                  </div>

                  <div className="flex items-center gap-3 w-full mb-4 mt-6">
                    <div className="qty-control h-12 px-2">
                      <button onClick={() => setModalQty((q) => Math.max(1, q - 1))}><Minus size={14} /></button>
                      <span className="text-sm font-semibold">{modalQty}</span>
                      <button onClick={() => setModalQty((q) => q + 1)}><Plus size={14} /></button>
                    </div>
                    <Button className="ug-button-dark flex-1 h-12" onClick={() => addToCart(activeProduct, modalQty)}>
                      ADD TO BAG — {money(activeProduct.price * modalQty)}
                    </Button>
                  </div>

                  <button className={`modal-wishlist ${wishlist.includes(activeProduct.id) ? 'is-saved' : ''}`} onClick={() => toggleWish(activeProduct.id)}>
                    <Heart size={16} fill={wishlist.includes(activeProduct.id) ? 'currentColor' : 'none'} />
                    {wishlist.includes(activeProduct.id) ? 'SAVED TO WISHLIST' : 'SAVE TO WISHLIST'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveProduct(null);
                      setStudioOpen(true);
                    }}
                    className="w-full mt-4 py-2.5 bg-[#1F171A] hover:bg-[#302326] text-[#F4E9C9] border border-[#C6A064] text-xs uppercase tracking-wider font-bold rounded flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Box size={14} className="text-[#C6A064]" />
                    Try on in 3D Virtual Studio
                  </button>

                  <Link
                    href={`/products/${activeProduct.id}`}
                    className="text-[11px] text-[var(--muted)] hover:text-[var(--burgundy)] underline block text-center mt-2.5 font-semibold"
                  >
                    View Full Product Details Page ↗
                  </Link>

                  <div className="modal-perks-premium">
                    <span><ShieldCheck size={16} /> Certified</span>
                    <span><Truck size={16} /> Ships fast</span>
                    <span><Gift size={16} /> Gift boxed</span>
                  </div>

                  {/* 3-4 Same Category & 3-4 Different Category Suggestions */}
                  <ProductSuggestions
                    currentProduct={activeProduct}
                    allProducts={allProducts}
                    onSelectProduct={(prod) => {
                      setActiveProduct(prod);
                      setActiveModalImage('main');
                      setModalQty(1);
                    }}
                    onAddToCart={(prod) => addToCart(prod, 1)}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 13. Cart Drawer & Demo Checkout Modal */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div className="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setCartOpen(false); setCheckout(false); setOrderPlaced(false); }}>
            <motion.aside className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 280 }} onClick={(e) => e.stopPropagation()}>
              <div className="cart-head">
                <div>
                  <span className="eyebrow">YOUR LITTLE TREASURES</span>
                  <h2>{orderPlaced ? "It's a date." : 'Your bag'} <span>({cartCount} pieces)</span></h2>
                </div>
                <button className="icon-btn" onClick={() => setCartOpen(false)}><X size={20} /></button>
              </div>

              {orderPlaced ? (
                <div className="order-success">
                  <div className="success-icon"><Check size={32} /></div>
                  <span className="eyebrow">ORDER CONFIRMATION</span>
                  <h3>Consider it <em>yours.</em></h3>
                  <p>Order <strong>#{placedOrderId || 'UG-98210'}</strong> confirmed and logged to the <strong>Studio Admin Panel</strong>.</p>
                  <div className="success-detail"><span>FINAL AMOUNT</span><strong>{money(grandTotal)}</strong></div>
                  <Button onClick={() => { setCart([]); setCartOpen(false); setCheckout(false); setOrderPlaced(false); }}>CONTINUE EXPLORING</Button>
                </div>
              ) : checkout ? (
                <div className="checkout-content">
                  <button className="back-link" onClick={() => setCheckout(false)}><ArrowLeft size={14} /> BACK TO BAG</button>
                  <h3>Shipping <em>details.</em></h3>
                  <p className="checkout-intro">Experience the checkout flow preview.</p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const name = (formData.get('fullName') as string) || 'Meera Sharma';
                      const emailVal = (formData.get('email') as string) || 'meera@example.com';
                      const addr = (formData.get('address') as string) || 'Flat 402, Lotus Residency';
                      const cityVal = (formData.get('city') as string) || 'Mumbai';
                      const pin = (formData.get('pinCode') as string) || '400018';
                      const pay = (formData.get('paymentMethod') as 'cod' | 'upi') || 'cod';

                      const newOrder = createNewOrder({
                        customerName: name,
                        customerEmail: emailVal,
                        deliveryAddress: addr,
                        city: cityVal,
                        pinCode: pin,
                        paymentMethod: pay,
                        items: cart,
                        subtotal: effectiveSubtotal,
                        discount: discountAmount,
                        shipping,
                        grandTotal,
                      });

                      setPlacedOrderId(newOrder.id);
                      setOrderPlaced(true);
                      notify(`Order #${newOrder.id} logged to Studio Admin`);
                    }}
                    className="checkout-form"
                  >
                    <label>FULL NAME <input name="fullName" required defaultValue="Meera Sharma" /></label>
                    <label>EMAIL ADDRESS <input name="email" required type="email" defaultValue="meera@example.com" /></label>
                    <label>DELIVERY ADDRESS <input name="address" required defaultValue="Flat 402, Lotus Residency" /></label>
                    <div className="checkout-two">
                      <label>CITY <input name="city" required defaultValue="Mumbai" /></label>
                      <label>PIN CODE <input name="pinCode" required pattern="[0-9]{6}" defaultValue="400001" /></label>
                    </div>
                    <label>PAYMENT PREFERENCE <select name="paymentMethod" defaultValue="cod"><option value="cod">Cash on Delivery</option><option value="upi">Instant UPI (Sandbox)</option></select></label>
                    <div className="checkout-summary"><span>TOTAL PAYABLE</span><strong>{money(grandTotal)}</strong></div>
                    <Button type="submit" className="checkout-submit">PLACE DEMO ORDER <ArrowRight size={16} /></Button>
                  </form>
                </div>
              ) : cart.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-bag-icon"><ShoppingBag size={30} /></div>
                  <h3>Your bag is feeling <em>lonely.</em></h3>
                  <p>Find something special made to be worn on repeat.</p>
                  <Button onClick={() => { setCartOpen(false); jumpToShop('All pieces'); }}>DISCOVER THE PIECES</Button>
                </div>
              ) : (
                <>
                  <div className="cart-progress">
                    <span>{effectiveSubtotal >= 1999 ? <>YOU UNLOCKED FREE SHIPPING ✳</> : <>YOU’RE {money(1999 - effectiveSubtotal)} AWAY FROM FREE SHIPPING</>}</span>
                    <div><i style={{ width: `${Math.min(100, (effectiveSubtotal / 1999) * 100)}%` }} /></div>
                  </div>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div className="cart-item" key={item.product.id}>
                        <img src={img(item.product.image, 260)} alt={item.product.name} />
                        <div className="cart-item-details">
                          <span className="cart-item-category">{item.product.category.toUpperCase()}</span>
                          <h4>{item.product.name}</h4>
                          <span className="cart-item-color">{item.product.color}</span>
                          <strong>{money(item.product.price * item.quantity)}</strong>
                          <div className="qty-control">
                            <button onClick={() => updateQty(item.product.id, -1)}><Minus size={12} /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQty(item.product.id, 1)}><Plus size={12} /></button>
                          </div>
                        </div>
                        <button className="remove-item" onClick={() => setCart((old) => old.filter((i) => i.product.id !== item.product.id))}><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-footer">
                    <form onSubmit={handleApplyCoupon} className="coupon-box">
                      <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="PROMO CODE (GLIMMER10)" />
                      <button type="submit">APPLY</button>
                    </form>
                    {appliedDiscount > 0 && (
                      <div className="coupon-applied">
                        <span className="flex items-center gap-1"><Tag size={13} /> {appliedDiscount * 100}% Discount Applied</span>
                        <button type="button" className="text-[10px] underline ml-2" onClick={() => { setAppliedDiscount(0); setCouponCode(''); }}>Remove</button>
                      </div>
                    )}
                    <div className="cart-total-row mt-3"><span>SUBTOTAL</span><strong>{money(subtotal)}</strong></div>
                    {appliedDiscount > 0 && <div className="cart-total-row text-[var(--festive-wine)]"><span>DISCOUNT</span><strong>-{money(discountAmount)}</strong></div>}
                    <div className="cart-total-row"><span>SHIPPING</span><span>{shipping === 0 ? 'COMPLIMENTARY' : money(shipping)}</span></div>
                    <div className="cart-total-row cart-grand-total"><span>ESTIMATED TOTAL</span><strong>{money(grandTotal)}</strong></div>
                    <Button className="checkout-button" onClick={() => setCheckout(true)}>CONTINUE TO CHECKOUT <ArrowRight size={16} /></Button>
                  </div>
                </>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 14. Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <span className="toast-star">✳</span><span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 15. Floating 3D Virtual Try-On Studio Pill */}
      {!studioOpen && (
        <button
          onClick={() => setStudioOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-[#161214]/95 hover:bg-[#251D22] text-[#F7F0E6] border border-[#C6A064]/70 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-2.5 transition-all hover:scale-105 duration-300 group ring-1 ring-[#C6A064]/30"
          aria-label="Open 3D Virtual Try-On Studio"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A064] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C6A064]" />
          </span>
          <Sparkles size={16} className="text-[#C6A064] group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold tracking-wider font-['Manrope',sans-serif]">
            3D TRY-ON <span className="text-[#C6A064]">STUDIO</span>
          </span>
        </button>
      )}

      {/* 16. Interactive 3D Virtual Try-On Studio Modal */}
      <VirtualStudioModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onAddToCart={addToCart}
        onOpenCart={() => {
          setStudioOpen(false);
          setCartOpen(true);
        }}
      />
    </main>
  );
}

