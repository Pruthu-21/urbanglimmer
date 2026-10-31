'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Check,
  ArrowRight,
  Truck,
  Sparkles,
  CreditCard,
  QrCode,
  Banknote,
  Lock,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { Product, INITIAL_PRODUCTS } from '@/lib/productStore';
import { createNewOrder, Order } from '@/lib/orderStore';
import { validateCoupon } from '@/lib/campaignStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export default function CheckoutPage() {
  const router = useRouter();

  // Cart state
  const [items, setItems] = useState<{ product: Product; quantity: number }[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 1 },
    { product: INITIAL_PRODUCTS[1], quantity: 1 },
  ]);

  // Form inputs
  const [fullName, setFullName] = useState('Meera Sharma');
  const [email, setEmail] = useState('meera.s@example.com');
  const [phone, setPhone] = useState('+91 98201 44821');
  const [street, setStreet] = useState('Flat 402, Lotus Residency, Worli Sea Face');
  const [landmark, setLandmark] = useState('Opp. Sea View Club');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('400018');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('meera.sharma@okhdfcbank');

  // Coupon state
  const [couponCode, setCouponCode] = useState('FESTIVE15');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('FESTIVE15');
  const [discountAmount, setDiscountAmount] = useState(509);
  const [couponMessage, setCouponMessage] = useState('Festive 15% discount applied');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

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

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateCoupon(couponCode, subtotal);
    if (res.isValid) {
      setAppliedCoupon(couponCode.toUpperCase().trim());
      setDiscountAmount(res.discount);
      setCouponMessage(res.message);
    } else {
      setCouponMessage(res.message);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || items.length === 0) return;

    // PIN code validation
    if (!/^\d{6}$/.test(pinCode.trim())) {
      alert('Please enter a valid 6-digit Indian PIN Code.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = createNewOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        deliveryAddress: `${street}${landmark ? `, ${landmark}` : ''}`,
        city,
        state,
        pinCode,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        items,
        subtotal,
        discount: discountAmount,
        couponCode: appliedCoupon || undefined,
        shipping: shippingFee,
        grandTotal,
        carrier: 'BlueDart Luxury Express',
        trackingNumber: `BD-${Math.floor(1000000 + Math.random() * 9000000)}-IN`,
        estimatedDelivery: 'Oct 31, 2026',
      });

      setCompletedOrder(order);
      setIsSubmitting(false);
    }, 1200);
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
        <AnnouncementBar />
        <Header />

        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-14 w-full">
          <div className="bg-white p-8 sm:p-10 rounded border border-[#E8DFD5] shadow-lg text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#C6A064] font-bold block mb-1">
                ORDER CONFIRMED & QUEUED AT ATELIER
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
                Thank You, {completedOrder.customerName}
              </h1>
              <p className="text-xs text-[#766D6D] mt-2 max-w-md mx-auto leading-relaxed">
                Your bespoke jewellery pieces are being prepared and polished at our Jaipur goldsmith studio. An order confirmation invoice has been sent to <strong>{completedOrder.customerEmail}</strong>.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="bg-[#F8F4EE] p-5 rounded border border-[#E8DFD5] text-left max-w-lg mx-auto space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-[#E8DFD5] pb-2">
                <span className="text-[#766D6D]">Order Reference:</span>
                <span className="font-mono text-sm font-bold text-[#603A46]">
                  #{completedOrder.id}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E8DFD5] pb-2">
                <span className="text-[#766D6D]">Courier Partner:</span>
                <span className="font-semibold text-[#211B1C]">
                  {completedOrder.carrier} ({completedOrder.trackingNumber})
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E8DFD5] pb-2">
                <span className="text-[#766D6D]">Delivery Address:</span>
                <span className="font-medium text-[#211B1C] text-right">
                  {completedOrder.deliveryAddress}, {completedOrder.city}, {completedOrder.state} - {completedOrder.pinCode}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 font-bold text-sm text-[#211B1C]">
                <span>Total Paid:</span>
                <span className="font-serif text-lg text-[#603A46]">
                  {formatPrice(completedOrder.grandTotal)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href={`/track-order?id=${completedOrder.id}`}
                className="px-6 py-3 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded transition-colors flex items-center justify-center gap-2"
              >
                <span>Track Order Live</span>
                <ArrowRight className="w-4 h-4 text-[#C6A064]" />
              </Link>
              <Link
                href="/shop"
                className="px-6 py-3 bg-white border border-[#E8DFD5] hover:bg-[#F8F4EE] text-[#211B1C] text-xs uppercase tracking-wider font-semibold rounded transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="border-b border-[#E8DFD5] pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block mb-0.5">
              ENCRYPTED 256-BIT ATELIER CHECKOUT
            </span>
            <h1 className="font-serif text-3xl text-[#603A46] font-medium tracking-tight">
              Secure Checkout
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#766D6D]">
            <Lock className="w-4 h-4 text-[#C6A064]" />
            <span className="font-medium">Bank Grade Security</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Customer, Address & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4">
              <h2 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
                1. Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Email Address (for invoice & tracking updates)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Phone Number (for courier SMS)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Indian Shipping Address */}
            <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4">
              <h2 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
                2. Shipping Address
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Full Recipient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Street Address / Flat / Building
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                      State / UT
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                      6-Digit PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 font-mono focus:outline-[#603A46]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4">
              <h2 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
                3. Payment Method
              </h2>

              <div className="space-y-3 text-xs">
                {/* UPI Option */}
                <label className={`p-4 rounded border flex items-start gap-3 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#603A46] bg-[#F8F4EE]' : 'border-[#E8DFD5] bg-white'}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-[#603A46] mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#211B1C]">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                      <QrCode className="w-4 h-4 text-[#603A46]" />
                    </div>
                    <p className="text-[11px] text-[#766D6D] mt-0.5">Instant zero-fee transfer with verified bank receipt</p>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pt-3 border-t border-[#E8DFD5]">
                        <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                          Enter UPI Virtual ID
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-white border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono"
                          placeholder="yourname@okhdfcbank"
                        />
                      </div>
                    )}
                  </div>
                </label>

                {/* Cards / NetBanking Option */}
                <label className={`p-4 rounded border flex items-start gap-3 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#603A46] bg-[#F8F4EE]' : 'border-[#E8DFD5] bg-white'}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[#603A46] mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#211B1C]">Debit & Credit Cards / NetBanking</span>
                      <CreditCard className="w-4 h-4 text-[#603A46]" />
                    </div>
                    <p className="text-[11px] text-[#766D6D] mt-0.5">Visa, Mastercard, RuPay, Amex & Indian NetBanking</p>

                    {paymentMethod === 'card' && (
                      <div className="mt-3 p-3 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900">
                        <strong>Sandbox Payment Simulator:</strong> Development test mode is active. Submitting will process a verified test transaction.
                      </div>
                    )}
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label className={`p-4 rounded border flex items-start gap-3 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#603A46] bg-[#F8F4EE]' : 'border-[#E8DFD5] bg-white'}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#603A46] mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#211B1C]">Cash On Delivery (COD)</span>
                      <Banknote className="w-4 h-4 text-[#603A46]" />
                    </div>
                    <p className="text-[11px] text-[#766D6D] mt-0.5">Pay in cash or UPI QR to BlueDart courier at doorstep</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 shadow-xs sticky top-28">
              <h3 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-3">
                Order Review
              </h3>

              {/* Items summary */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 text-xs">
                    <img
                      src={item.product.image.startsWith('http') ? item.product.image : `https://images.unsplash.com/${item.product.image}?auto=format&fit=crop&w=150&q=80`}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded border border-[#E8DFD5]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-medium text-[#211B1C] truncate">{item.product.name}</h4>
                      <span className="text-[10px] text-[#766D6D]">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-[#603A46]">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
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
                  <span>Insured Express Shipping</span>
                  <span className="text-emerald-700 font-bold uppercase text-[10px]">
                    {shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#211B1C] pt-2 border-t border-[#E8DFD5]">
                  <span>Total Amount</span>
                  <span className="font-serif text-2xl text-[#603A46]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <span>Processing Secure Order...</span>
                ) : (
                  <>
                    <span>Place Order · {formatPrice(grandTotal)}</span>
                    <ArrowRight className="w-4 h-4 text-[#C6A064]" />
                  </>
                )}
              </button>

              <div className="text-[10px] text-[#766D6D] text-center pt-2">
                By placing your order, you agree to Urban Glimmer&apos;s Terms of Service and 15-Day Exchange Policy.
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
