'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck, Sparkles, Tag, Gift } from 'lucide-react';
import { Product, INITIAL_PRODUCTS } from '@/lib/productStore';
import { validateCoupon } from '@/lib/campaignStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function CartPage() {
  const [items, setItems] = useState<{ product: Product; quantity: number }[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 1 },
    { product: INITIAL_PRODUCTS[1], quantity: 1 },
  ]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 1999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const getImg = (id: string) => {
    if (!id) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80';
    if (id.startsWith('http') || id.startsWith('/')) return id;
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=300&q=80`;
  };

  const updateQuantity = (productId: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = validateCoupon(couponCode, subtotal);
    if (res.isValid) {
      setAppliedCoupon(couponCode.toUpperCase().trim());
      setDiscountAmount(res.discount);
      setCouponFeedback({ message: res.message, isError: false });
    } else {
      setCouponFeedback({ message: res.message, isError: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header cartCount={items.reduce((s, i) => s + i.quantity, 0)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="border-b border-[#E8DFD5] pb-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-1">
            BAG REVIEW
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
            Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)} pieces)
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded border border-[#E8DFD5] max-w-md mx-auto p-8">
            <h2 className="font-serif text-2xl text-[#211B1C]">Your bag is currently empty</h2>
            <p className="text-xs text-[#766D6D]">
              Explore our festive necklaces, sculpted earrings, and modern cuffs.
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Items list */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-white rounded border border-[#E8DFD5] shadow-xs"
                >
                  <div className="w-24 h-28 bg-[#F8F4EE] rounded overflow-hidden shrink-0 border border-[#E8DFD5]">
                    <img
                      src={getImg(item.product.image)}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#C6A064] font-semibold block">
                          {item.product.category} · {item.product.sku || `UG-00${item.product.id}`}
                        </span>
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-serif text-lg text-[#211B1C] hover:text-[#852F3A] font-medium"
                        >
                          {item.product.name}
                        </Link>
                        <span className="text-xs text-[#766D6D] block mt-0.5">{item.product.color}</span>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-[#766D6D] hover:text-red-700 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E8DFD5] mt-2">
                      <div className="flex items-center border border-[#E8DFD5] rounded bg-[#F8F4EE]">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1.5 hover:text-[#852F3A]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1.5 hover:text-[#852F3A]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif text-lg font-semibold text-[#603A46]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 shadow-xs">
                <h3 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-3">
                  Order Summary
                </h3>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs uppercase font-medium focus:outline-[#603A46]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#211B1C] hover:bg-[#603A46] text-white text-xs uppercase font-semibold rounded"
                  >
                    Apply
                  </button>
                </form>

                {couponFeedback && (
                  <div
                    className={`text-[11px] p-2.5 rounded ${
                      couponFeedback.isError
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {couponFeedback.message}
                  </div>
                )}

                {/* Totals Breakdown */}
                <div className="space-y-2 text-xs text-[#766D6D] border-t border-[#E8DFD5] pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#211B1C] font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#852F3A] font-semibold">
                      <span>Discount ({appliedCoupon})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Insured Delivery</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase text-[10px]">
                          Complimentary
                        </span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#211B1C] pt-2 border-t border-[#E8DFD5]">
                    <span>Grand Total</span>
                    <span className="font-serif text-2xl text-[#603A46]">{formatPrice(grandTotal)}</span>
                  </div>
                  <span className="text-[10px] text-[#766D6D] block">All taxes and GST included</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <span>Proceed To Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-4 bg-white rounded border border-[#E8DFD5] space-y-2 text-xs text-[#766D6D]">
                <div className="flex items-center gap-2 text-[#211B1C] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#C6A064]" />
                  <span>Urban Glimmer Authenticity Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every order includes individual hallmark authenticity cards, velvet keepsake storage boxes, and 15-day complimentary exchange privileges.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
