'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { Product } from '@/lib/productStore';
import { validateCoupon } from '@/lib/campaignStore';

export type CartItem = {
  product: Product;
  quantity: number;
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 1999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
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

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponFeedback(null);
    setCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#F8F4EE] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8DFD5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl text-[#603A46] font-medium tracking-tight">
              Your Shopping Bag
            </h2>
            <span className="text-xs bg-[#603A46]/10 text-[#603A46] px-2 py-0.5 rounded-full font-bold">
              {items.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#766D6D] hover:text-[#211B1C] transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-[#EFE8DE] border-b border-[#E8DFD5] text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-medium text-[#211B1C]">
              {amountNeeded === 0 ? (
                <span className="text-[#852F3A] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C6A064]" />
                  Complimentary Insured Shipping Unlocked!
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#852F3A]">{formatPrice(amountNeeded)}</strong> for Complimentary Express Shipping
                </span>
              )}
            </span>
            <span className="text-[10px] text-[#766D6D] font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E8DFD5] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#603A46] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EFE8DE] flex items-center justify-center text-[#766D6D]">
                <Tag className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif text-xl text-[#211B1C]">Your bag is currently empty</h3>
              <p className="text-xs text-[#766D6D] max-w-xs mx-auto">
                Explore our handcrafted 18k gold vermeil earrings, festive necklaces, and sculpted cuffs.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#603A46] text-[#F8F4EE] hover:bg-[#852F3A] rounded text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                <span>Discover Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3 bg-white border border-[#E8DFD5] rounded shadow-2xs"
              >
                <div className="w-20 h-24 bg-[#F8F4EE] rounded overflow-hidden shrink-0 border border-[#E8DFD5]">
                  <img
                    src={getImg(item.product.image)}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/products/${item.product.id}`}
                        onClick={onClose}
                        className="font-serif text-base text-[#211B1C] hover:text-[#852F3A] font-medium line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#766D6D] hover:text-[#852F3A] transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-[#766D6D] block">{item.product.color}</span>
                    <span className="text-[11px] text-[#C6A064] font-medium block">
                      {item.product.sku || `SKU-00${item.product.id}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#E8DFD5] rounded bg-[#F8F4EE]">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 hover:text-[#852F3A] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 hover:text-[#852F3A] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-[#211B1C]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout Actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#E8DFD5] space-y-3">
            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. FESTIVE15)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs uppercase placeholder:normal-case font-medium focus:outline-[#603A46]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#211B1C] text-[#F8F4EE] hover:bg-[#603A46] text-xs uppercase tracking-wider font-semibold rounded transition-colors"
              >
                Apply
              </button>
            </form>

            {couponFeedback && (
              <div
                className={`text-[11px] p-2 rounded flex items-center justify-between ${
                  couponFeedback.isError
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                <span>{couponFeedback.message}</span>
                {appliedCoupon && (
                  <button
                    onClick={handleRemoveCoupon}
                    className="underline text-[10px] font-bold text-red-600 ml-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#766D6D] border-t border-[#E8DFD5] pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#211B1C] font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#852F3A] font-medium">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-[10px]">Complimentary</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#211B1C] pt-2 border-t border-[#E8DFD5]">
                <span>Total (Incl. all taxes)</span>
                <span className="font-serif text-lg text-[#603A46]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout & View Cart CTAs */}
            <div className="pt-2 space-y-2">
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#603A46] text-[#F8F4EE] hover:bg-[#852F3A] rounded text-xs uppercase tracking-wider font-bold shadow-md transition-colors"
              >
                <span>Proceed To Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full block text-center py-2 text-xs text-[#766D6D] hover:text-[#211B1C] underline font-medium"
              >
                View Full Bag Details
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#766D6D] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A064]" />
              <span>100% Insured Delivery · BIS Hallmarked · 15-Day Exchange</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
