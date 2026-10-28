'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  Gift,
  Box,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Product,
  INITIAL_PRODUCTS,
  getStoredProducts,
} from '@/lib/productStore';
import { createNewOrder } from '@/lib/orderStore';
import ProductSuggestions from '@/components/studio/ProductSuggestions';

const VirtualStudioModal = dynamic(() => import('@/components/studio/VirtualStudioModal'), {
  ssr: false,
});

export default function ProductDetailPage() {
  const routeParams = useParams();
  const productId = Number(routeParams?.id);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [product, setProduct] = useState<Product | null>(() => {
    return INITIAL_PRODUCTS.find((p) => p.id === productId) || null;
  });
  const [activeImage, setActiveImage] = useState<'main' | 'lifestyle'>('main');
  const [qty, setQty] = useState(1);
  const [studioOpen, setStudioOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [toast, setToast] = useState('');

  // Checkout preview state
  const [checkout, setCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  useEffect(() => {
    const list = getStoredProducts();
    setProducts(list);
    const found = list.find((p) => p.id === productId);
    if (found) {
      setProduct(found);
    }
  }, [productId]);

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const getImgUrl = (src: string, width = 1200) => {
    if (!src) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85';
    if (src.startsWith('http') || src.startsWith('/') || src.startsWith('blob:')) return src;
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
    notify(`${prod.name} added to your bag`);
  };

  const toggleWish = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    notify(wishlist.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const customerName = formData.get('fullName') as string;
    const customerEmail = formData.get('email') as string;
    const deliveryAddress = formData.get('address') as string;
    const city = formData.get('city') as string;
    const pinCode = formData.get('pinCode') as string;
    const paymentMethod = formData.get('paymentMethod') as 'cod' | 'upi';

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal >= 1999 ? 0 : 99;
    const grandTotal = subtotal + shipping;

    const newOrder = createNewOrder({
      customerName,
      customerEmail,
      deliveryAddress,
      city,
      pinCode,
      paymentMethod,
      items: cart,
      subtotal,
      discount: 0,
      shipping,
      grandTotal,
    });

    setPlacedOrderId(newOrder.id);
    setOrderPlaced(true);
    setCart([]);
    notify(`Order #${newOrder.id} confirmed!`);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col items-center justify-center p-6">
        <Sparkles size={32} className="text-[var(--champagne-gold)] mb-4 animate-spin" />
        <h2 className="font-serif text-2xl text-[var(--deep-espresso)]">Loading Piece...</h2>
        <Link href="/" className="mt-4 text-xs font-semibold text-[var(--burgundy)] underline">
          Return to Storefront
        </Link>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const grandTotal = subtotal >= 1999 || subtotal === 0 ? subtotal : subtotal + 99;

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      {/* 1. Header Bar */}
      <header className="site-header">
        <div className="header-left">
          <Link href="/#shop" className="header-link flex items-center gap-1.5">
            <ArrowLeft size={14} /> THE ARCHIVE
          </Link>
          <button
            onClick={() => setStudioOpen(true)}
            className="header-link desktop-only flex items-center gap-1.5 text-[var(--champagne-gold)] font-semibold"
          >
            <Sparkles size={13} /> 3D TRY-ON STUDIO
          </button>
        </div>

        <Link href="/" className="wordmark">
          urban<span>glimmer</span>
          <i>®</i>
          <small>JEWELLERY FOR YOUR EVERYDAY</small>
        </Link>

        <div className="header-actions">
          <Link href="/admin" className="admin-nav-pill desktop-only">
            Admin
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="header-link flex items-center gap-1.5"
          >
            <ShoppingBag size={18} />
            <span className="font-semibold text-xs">BAG ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </button>
        </div>
      </header>

      {/* 2. Main Product Content */}
      <main className="pdp-wrapper">
        {/* Breadcrumb */}
        <nav className="pdp-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/#shop">Jewellery</Link>
          <span>/</span>
          <Link href="/#shop">{product.category}</Link>
          <span>/</span>
          <span className="text-[var(--burgundy)] font-bold">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="pdp-grid">
          {/* Left: Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-main-image">
              <img
                src={getImgUrl(activeImage === 'main' ? product.image : product.lifestyleImage)}
                alt={product.name}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="pdp-thumbs">
                <button
                  type="button"
                  onClick={() => setActiveImage('main')}
                  className={`pdp-thumb-btn ${activeImage === 'main' ? 'active' : ''}`}
                >
                  <img src={getImgUrl(product.image, 200)} alt="Product angle" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage('lifestyle')}
                  className={`pdp-thumb-btn ${activeImage === 'lifestyle' ? 'active' : ''}`}
                >
                  <img src={getImgUrl(product.lifestyleImage, 200)} alt="Lifestyle angle" />
                </button>
              </div>

              {/* 3D Virtual Try-On CTA */}
              <button
                type="button"
                onClick={() => setStudioOpen(true)}
                className="px-4 py-2.5 bg-[#1F171A] hover:bg-[#302326] text-[#F4E9C9] border border-[#C6A064] text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 shadow-md transition-all"
              >
                <Box size={15} className="text-[#C6A064]" />
                Try on in 3D Studio
              </button>
            </div>
          </div>

          {/* Right: Product Details & Buying */}
          <div className="pdp-info">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--champagne-gold)]">
                URBAN GLIMMER / OBJECT #{String(product.id).padStart(3, '0')}
              </span>
              <div className="flex items-center gap-1 text-[var(--champagne-gold)] text-xs font-semibold">
                <Star size={13} fill="currentColor" /> {product.rating} ({product.reviewsCount} reviews)
              </div>
            </div>

            <h1 className="pdp-title">{product.name}</h1>

            <div className="pdp-price">
              {money(product.price)}
              {product.oldPrice && <del>{money(product.oldPrice)}</del>}
              {product.badge && (
                <span className="text-[9px] uppercase tracking-widest font-bold bg-[var(--festive-wine)] text-white px-2 py-0.5 rounded">
                  {product.badge}
                </span>
              )}
            </div>

            <p className="pdp-desc">{product.description}</p>

            {/* Specifications Box */}
            <div className="modal-specs mb-6">
              <div className="modal-spec-row">
                <span>FINISH</span>
                <strong>{product.color}</strong>
              </div>
              <div className="modal-spec-row">
                <span>MATERIAL</span>
                <strong>{product.material}</strong>
              </div>
              <div className="modal-spec-row">
                <span>DIMENSIONS</span>
                <strong>{product.dimensions}</strong>
              </div>
            </div>

            {/* Add to Bag Actions */}
            <div className="flex items-center gap-3 w-full mb-4">
              <div className="qty-control h-12 px-2">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)}>
                  <Plus size={14} />
                </button>
              </div>

              <Button
                className="ug-button-dark flex-1 h-12 font-bold tracking-wider"
                onClick={() => addToBag(product, qty)}
              >
                ADD TO BAG — {money(product.price * qty)}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => toggleWish(product.id)}
              className={`modal-wishlist ${wishlist.includes(product.id) ? 'is-saved' : ''}`}
            >
              <Heart
                size={16}
                fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
              />
              {wishlist.includes(product.id) ? 'SAVED TO WISHLIST' : 'SAVE TO WISHLIST'}
            </button>

            {/* Trust Perks */}
            <div className="modal-perks-premium">
              <span>
                <ShieldCheck size={16} /> Certified Quality
              </span>
              <span>
                <Truck size={16} /> Complimentary Delivery
              </span>
              <span>
                <Gift size={16} /> Signature Velvet Box
              </span>
            </div>
          </div>
        </div>

        {/* 3. SUGGESTIONS ENGINE: 3-4 Same Category & 3-4 Different Category */}
        <ProductSuggestions
          currentProduct={product}
          allProducts={products}
          onSelectProduct={(selected) => {
            setProduct(selected);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={(prod) => addToBag(prod, 1)}
        />
      </main>

      {/* 4. Virtual 3D Studio Modal */}
      {studioOpen && (
        <VirtualStudioModal
          isOpen={studioOpen}
          onClose={() => setStudioOpen(false)}
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
          wishlistCount={wishlist.length}
          onAddToCart={(prod) => addToBag(prod, 1)}
          onOpenCart={() => setCartOpen(true)}
        />
      )}

      {/* 5. Cart Drawer */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
          onClick={() => {
            setCartOpen(false);
            setCheckout(false);
            setOrderPlaced(false);
          }}
        >
          <aside
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-head">
              <div>
                <span className="eyebrow">YOUR SHOPPING BAG</span>
                <h2>{orderPlaced ? "It's a date." : 'Your bag'}</h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setCartOpen(false)}
              >
                ✕
              </button>
            </div>

            {orderPlaced ? (
              <div className="order-success p-6 text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--deep-espresso)]">
                  Order <em>Confirmed!</em>
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Order <strong>#{placedOrderId}</strong> has been received and logged to the Studio Admin Panel.
                </p>
                <Button
                  onClick={() => {
                    setCartOpen(false);
                    setOrderPlaced(false);
                    setCheckout(false);
                  }}
                  className="mt-6 ug-button-dark"
                >
                  Continue Browsing
                </Button>
              </div>
            ) : checkout ? (
              <div className="p-6 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setCheckout(false)}
                  className="text-xs font-bold text-[var(--burgundy)] flex items-center gap-1 mb-4"
                >
                  <ArrowLeft size={13} /> Back to Bag
                </button>
                <h3 className="font-serif text-xl font-bold mb-4">Shipping Information</h3>
                <form onSubmit={handlePlaceOrder} className="checkout-form space-y-3">
                  <label>
                    Full Name
                    <input name="fullName" required defaultValue="Meera Sharma" />
                  </label>
                  <label>
                    Email Address
                    <input name="email" required type="email" defaultValue="meera.s@example.com" />
                  </label>
                  <label>
                    Delivery Address
                    <input name="address" required defaultValue="Flat 402, Lotus Residency" />
                  </label>
                  <div className="checkout-two">
                    <label>
                      City
                      <input name="city" required defaultValue="Mumbai" />
                    </label>
                    <label>
                      PIN Code
                      <input name="pinCode" required defaultValue="400018" />
                    </label>
                  </div>
                  <label>
                    Payment Preference
                    <select name="paymentMethod" defaultValue="upi">
                      <option value="upi">Instant UPI (Simulated)</option>
                      <option value="cod">Cash on Delivery</option>
                    </select>
                  </label>
                  <div className="checkout-summary pt-2">
                    <span>Total Amount</span>
                    <strong>{money(grandTotal)}</strong>
                  </div>
                  <Button type="submit" className="checkout-submit w-full mt-4">
                    Confirm Order <ArrowRight size={14} />
                  </Button>
                </form>
              </div>
            ) : cart.length === 0 ? (
              <div className="empty-cart p-12 text-center">
                <ShoppingBag size={32} className="mx-auto text-[var(--muted)] mb-3" />
                <h3 className="font-serif text-xl font-bold">Your bag is empty</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Discover handcrafted pieces for your everyday.</p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="cart-items flex-1 p-6 space-y-4 overflow-y-auto">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 pb-3 border-b border-[var(--line)]">
                      <img
                        src={getImgUrl(item.product.image, 160)}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover rounded bg-[var(--blush-beige)]"
                      />
                      <div className="flex-1">
                        <span className="text-[9px] uppercase tracking-wider text-[var(--muted)] font-bold">
                          {item.product.category}
                        </span>
                        <h4 className="font-serif text-sm font-semibold">{item.product.name}</h4>
                        <span className="text-xs text-[var(--burgundy)] font-bold">
                          {money(item.product.price)}
                        </span>
                        <div className="text-[11px] text-[var(--muted)] mt-1">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-[var(--line)] bg-[var(--warm-ivory)]">
                  <div className="flex justify-between text-sm font-bold mb-4">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <Button
                    onClick={() => setCheckout(true)}
                    className="w-full ug-button-dark h-11 font-bold"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Floating Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F171A] text-[#F4E9C9] px-4 py-2.5 rounded shadow-2xl font-semibold text-xs tracking-wide flex items-center gap-2 border border-[#C6A064]">
          <Sparkles size={14} className="text-[#C6A064]" /> {toast}
        </div>
      )}
    </div>
  );
}
