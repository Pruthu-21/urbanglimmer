'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  RotateCcw,
  Box,
  ArrowRight,
  Check,
  MapPin,
  Layers,
  Award,
} from 'lucide-react';
import {
  Product,
  INITIAL_PRODUCTS,
  getStoredProducts,
} from '@/lib/productStore';
import { getProductReviews, addReview, Review } from '@/lib/reviewStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import CartDrawer, { CartItem } from '@/components/storefront/CartDrawer';
import SearchDrawer from '@/components/storefront/SearchDrawer';
import Footer from '@/components/storefront/Footer';
import ProductSuggestions from '@/components/studio/ProductSuggestions';

const VirtualStudioModal = dynamic(() => import('@/components/studio/VirtualStudioModal'), {
  ssr: false,
});

export default function ProductDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const productId = Number(routeParams?.id);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [studioOpen, setStudioOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState('');

  // Pincode delivery checker state
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<{
    checked: boolean;
    valid: boolean;
    message: string;
    dateText?: string;
  } | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');

  useEffect(() => {
    const list = getStoredProducts();
    setProducts(list);
    const found = list.find((p) => p.id === productId);
    if (found) {
      setProduct(found);
    } else if (list.length > 0) {
      setProduct(list[0]);
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      setReviews(getProductReviews(product.id));
    }
  }, [product]);

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

  const getImgUrl = (src?: string, width = 1200) => {
    if (!src) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85';
    if (src.startsWith('http') || src.startsWith('/')) return src;
    return `https://images.unsplash.com/${src}?auto=format&fit=crop&w=${width}&q=85`;
  };

  const addToBag = (prod: Product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === prod.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [...prev, { product: prod, quantity }];
    });
    setCartOpen(true);
    notify(`${prod.name} added to your shopping bag.`);
  };

  const handleBuyNow = (prod: Product, quantity = 1) => {
    addToBag(prod, quantity);
    router.push('/checkout');
  };

  const toggleWish = (id: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      notify(exists ? 'Removed from your wishlist' : 'Saved to your wishlist');
      return exists ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setDeliveryResult({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code (e.g. 400001, 110001).',
      });
      return;
    }

    // Estimated delivery in 2-3 business days
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 3);
    const dateStr = estimatedDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setDeliveryResult({
      checked: true,
      valid: true,
      message: 'Complimentary Insured Delivery Available',
      dateText: `Delivery expected by ${dateStr} via BlueDart Luxury Express. COD Eligible.`,
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newReviewAuthor || !newReviewTitle || !newReviewComment) return;

    const created = addReview({
      productId: product.id,
      productName: product.name,
      author: newReviewAuthor,
      rating: newReviewRating,
      title: newReviewTitle,
      comment: newReviewComment,
      verifiedPurchase: true,
    });

    setReviews((prev) => [created, ...prev]);
    setShowReviewForm(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    notify('Thank you! Your verified review has been published.');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F4EE] flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-8 h-8 text-[#C6A064] animate-spin mb-4" />
        <h2 className="font-serif text-2xl text-[#603A46]">Discovering Piece...</h2>
        <Link href="/shop" className="mt-3 text-xs uppercase font-semibold text-[#852F3A] underline">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const galleryImages = [
    product.image,
    product.lifestyleImage,
    ...(product.images || []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="text-[11px] text-[#766D6D] uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#603A46]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#603A46]">Catalogue</Link>
          <span>/</span>
          <Link href={`/shop/${product.category.toLowerCase()}`} className="hover:text-[#603A46]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#603A46] font-semibold">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/5 sm:aspect-square bg-white rounded border border-[#E8DFD5] overflow-hidden shadow-xs">
              <img
                src={getImgUrl(galleryImages[activeImageIdx])}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#852F3A] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded shadow-md">
                  {product.badge}
                </span>
              )}

              {/* View in 3D Button Overlay */}
              <button
                type="button"
                onClick={() => setStudioOpen(true)}
                className="absolute bottom-4 right-4 px-4 py-2.5 bg-[#151313]/90 hover:bg-[#603A46] text-[#F8F4EE] border border-[#C6A064]/60 text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 shadow-lg backdrop-blur-md transition-all"
              >
                <Layers className="w-4 h-4 text-[#C6A064]" />
                <span>View in 3D Studio</span>
              </button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-20 rounded bg-white overflow-hidden border shrink-0 transition-all ${
                    activeImageIdx === idx
                      ? 'border-[#603A46] ring-2 ring-[#603A46]/30'
                      : 'border-[#E8DFD5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getImgUrl(imgSrc, 200)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing, Specs, Pincode & Purchase */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-[#766D6D] uppercase tracking-wider mb-1">
                <span>{product.category} · SKU: {product.sku || `UG-00${product.id}`}</span>
                <span className="flex items-center gap-1 text-[#C6A064] font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating} ({reviews.length} reviews)</span>
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#211B1C] tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="font-serif text-3xl font-semibold text-[#603A46]">
                  {money(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-[#766D6D] line-through">
                    {money(product.oldPrice)}
                  </span>
                )}
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Inclusive of all taxes
                </span>
              </div>

              <p className="text-xs text-[#766D6D] leading-relaxed mt-4 font-light">
                {product.description}
              </p>
            </div>

            {/* Product Specifications Table */}
            <div className="bg-white p-4 rounded border border-[#E8DFD5] space-y-2 text-xs">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#603A46] border-b border-[#E8DFD5] pb-1.5 mb-2">
                Atelier Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[#766D6D]">
                <div>
                  <span className="block text-[10px] uppercase text-[#766D6D]">Material</span>
                  <strong className="text-[#211B1C]">{product.material}</strong>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#766D6D]">Finish</span>
                  <strong className="text-[#211B1C]">{product.color}</strong>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#766D6D]">Dimensions</span>
                  <strong className="text-[#211B1C]">{product.dimensions}</strong>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#766D6D]">Hallmark</span>
                  <strong className="text-[#211B1C]">{product.hallmark || 'BIS Certified'}</strong>
                </div>
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#E8DFD5] rounded bg-white h-12 px-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-1 hover:text-[#852F3A]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-xs">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="p-1 hover:text-[#852F3A]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => addToBag(product, qty)}
                  className="flex-1 h-12 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag — {money(product.price * qty)}</span>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleBuyNow(product, qty)}
                  className="w-full py-3.5 bg-[#211B1C] hover:bg-[#151313] text-[#F8F4EE] text-xs uppercase tracking-wider font-bold rounded transition-colors shadow-xs"
                >
                  Buy Now With 1-Click
                </button>

                <button
                  onClick={() => toggleWish(product.id)}
                  className={`p-3.5 rounded border border-[#E8DFD5] bg-white transition-colors flex items-center justify-center shrink-0 ${
                    wishlist.includes(product.id)
                      ? 'text-[#852F3A] border-[#852F3A]'
                      : 'text-[#766D6D] hover:text-[#852F3A]'
                  }`}
                  aria-label="Save to wishlist"
                >
                  <Heart
                    className="w-5 h-5"
                    fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            </div>

            {/* Indian Pincode Delivery Checker */}
            <div className="bg-white p-4 rounded border border-[#E8DFD5] space-y-3">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#603A46] block">
                Delivery & Pincode Checker
              </span>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-[#766D6D] absolute left-3 top-3" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN Code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded pl-9 pr-3 py-2 text-xs font-mono focus:outline-[#603A46]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded transition-colors"
                >
                  Check
                </button>
              </form>

              {deliveryResult && (
                <div
                  className={`text-[11px] p-2.5 rounded ${
                    deliveryResult.valid
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <strong>{deliveryResult.message}</strong>
                  {deliveryResult.dateText && (
                    <p className="mt-0.5 text-[10px] text-emerald-800">{deliveryResult.dateText}</p>
                  )}
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-[#766D6D]">
              <div className="p-2.5 bg-white rounded border border-[#E8DFD5] text-center">
                <ShieldCheck className="w-4 h-4 text-[#C6A064] mx-auto mb-1" />
                <span className="font-semibold block text-[#211B1C]">BIS Hallmarked</span>
                <span>Authentic Purity</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-[#E8DFD5] text-center">
                <Truck className="w-4 h-4 text-[#C6A064] mx-auto mb-1" />
                <span className="font-semibold block text-[#211B1C]">Insured Express</span>
                <span>Complimentary ₹1,999+</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-[#E8DFD5] text-center">
                <RotateCcw className="w-4 h-4 text-[#C6A064] mx-auto mb-1" />
                <span className="font-semibold block text-[#211B1C]">15-Day Exchange</span>
                <span>Doorstep Pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8DFD5] gap-4">
            <div>
              <h2 className="font-serif text-2xl text-[#603A46] font-medium tracking-tight">
                Customer Reviews & Verified Feedback
              </h2>
              <span className="text-xs text-[#766D6D]">
                Showing authentic reviews from verified Urban Glimmer patrons
              </span>
            </div>

            <button
              onClick={() => setShowReviewForm((v) => !v)}
              className="px-4 py-2 border border-[#603A46] text-[#603A46] hover:bg-[#603A46] hover:text-white rounded text-xs uppercase tracking-wider font-semibold transition-colors self-start sm:self-auto"
            >
              {showReviewForm ? 'Cancel Review' : 'Write A Review'}
            </button>
          </div>

          {/* Write a Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="bg-[#F8F4EE] p-5 rounded border border-[#E8DFD5] space-y-4 max-w-xl">
              <h3 className="font-serif text-lg text-[#603A46] font-medium">Share Your Experience</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="w-full bg-white border border-[#E8DFD5] rounded px-3 py-2 text-xs"
                    placeholder="e.g. Radhika Kapoor"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Rating
                  </label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full bg-white border border-[#E8DFD5] rounded px-3 py-2 text-xs"
                  >
                    <option value={5}>5 Stars - Exquisite</option>
                    <option value={4}>4 Stars - Very Pleased</option>
                    <option value={3}>3 Stars - Good</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  className="w-full bg-white border border-[#E8DFD5] rounded px-3 py-2 text-xs"
                  placeholder="e.g. Magnificent weight and sunlit polish"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Detailed Review
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-white border border-[#E8DFD5] rounded px-3 py-2 text-xs"
                  placeholder="Tell others how the piece fits, feels, and looks in person..."
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded"
              >
                Submit Verified Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-[#766D6D] py-4">
                Be the first to leave a review for {product.name}.
              </p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-[#F8F4EE] rounded border border-[#E8DFD5] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#211B1C]">{rev.author}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Verified Patron
                        </span>
                      )}
                    </div>
                    <span className="text-[#766D6D] text-[10px]">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-0.5 text-[#C6A064]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>

                  <h4 className="font-semibold text-[#603A46] text-xs pt-0.5">{rev.title}</h4>
                  <p className="text-[#766D6D] leading-relaxed">{rev.comment}</p>

                  {rev.adminReply && (
                    <div className="mt-2 p-2.5 bg-white rounded border border-[#E8DFD5] text-[11px] text-[#603A46]">
                      <strong>Atelier Response:</strong> {rev.adminReply}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Complete The Look Suggestions */}
        <section className="pt-6">
          <ProductSuggestions
            currentProduct={product}
            allProducts={products}
            onSelectProduct={(p) => {
              setProduct(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={(p) => addToBag(p, 1)}
          />
        </section>
      </main>

      {/* Cart Drawer */}
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

      {/* 3D Virtual Studio Modal */}
      {studioOpen && (
        <VirtualStudioModal
          isOpen={studioOpen}
          onClose={() => setStudioOpen(false)}
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
          wishlistCount={wishlist.length}
          onAddToCart={(p) => addToBag(p, 1)}
          onOpenCart={() => {
            setStudioOpen(false);
            setCartOpen(true);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
