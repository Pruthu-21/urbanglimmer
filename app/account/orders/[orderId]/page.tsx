'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
} from 'lucide-react';
import { getOrderById, Order, OrderStatus } from '@/lib/orderStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

const MILESTONES: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'Pending', label: 'Order Placed', desc: 'Received & logged at atelier' },
  { status: 'Confirmed', label: 'Verified & Queued', desc: 'Payment & purity inspection scheduled' },
  { status: 'In Production', label: 'Artisan Finishing', desc: 'Hand-polishing and hallmark sealing' },
  { status: 'Shipped', label: 'In Transit', desc: 'Handed to insured express courier' },
  { status: 'Delivered', label: 'Delivered', desc: 'Signed receipt at customer doorstep' },
];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || '';

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const found = getOrderById(orderId);
      if (found) setOrder(found);
    }
  }, [orderId]);

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="font-serif text-3xl text-[#603A46]">Order Not Found</h2>
          <p className="text-xs text-[#766D6D]">
            We could not locate order #{orderId}. Please verify your reference number.
          </p>
          <Link
            href="/account/orders"
            className="inline-block px-5 py-2.5 bg-[#603A46] text-white text-xs uppercase font-semibold rounded"
          >
            Back to Orders
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const currentIdx = MILESTONES.findIndex((m) => m.status === order.status);

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header navigation */}
        <div className="border-b border-[#E8DFD5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Link
              href="/account/orders"
              className="text-[11px] uppercase tracking-wider text-[#766D6D] hover:text-[#603A46] flex items-center gap-1 mb-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Orders</span>
            </Link>
            <h1 className="font-serif text-3xl text-[#603A46] font-medium tracking-tight">
              Order #{order.id}
            </h1>
            <span className="text-xs text-[#766D6D]">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' })}
            </span>
          </div>

          <a
            href={`https://wa.me/919820012345?text=Hello%20Urban%20Glimmer,%20query%20regarding%20order%20${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-xs font-semibold flex items-center gap-2 hover:bg-emerald-100 transition-colors self-start sm:self-auto"
          >
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            <span>Concierge WhatsApp Support</span>
          </a>
        </div>

        {/* Milestone Timeline */}
        <div className="bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] shadow-xs space-y-6">
          <h2 className="font-serif text-xl font-medium text-[#603A46]">
            Fulfillment Progression
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {MILESTONES.map((m, idx) => {
              const isPast = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={m.status} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 text-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isPast
                        ? 'bg-[#603A46] text-white'
                        : 'bg-[#F8F4EE] border border-[#E8DFD5] text-[#766D6D]'
                    } ${isCurrent ? 'ring-4 ring-[#C6A064]/40' : ''}`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5 text-[#C6A064]" /> : idx + 1}
                  </div>
                  <div className="text-left sm:text-center">
                    <span className="font-semibold text-xs block text-[#211B1C]">
                      {m.label}
                    </span>
                    <span className="text-[10px] text-[#766D6D]">{m.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {order.trackingNumber && (
            <div className="p-4 bg-[#F8F4EE] rounded border border-[#E8DFD5] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#603A46]" />
                <span>
                  Courier: <strong>{order.carrier}</strong> · Tracking ID: <strong>{order.trackingNumber}</strong>
                </span>
              </div>
              <span className="text-[11px] text-[#852F3A] font-semibold">
                Est. Delivery: {order.estimatedDelivery || 'In 2 days'}
              </span>
            </div>
          )}
        </div>

        {/* Order Details & Invoice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 bg-white p-6 rounded border border-[#E8DFD5] space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
              Jewellery Items
            </h3>
            <div className="space-y-3">
              {order.items.map((i, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-[#E8DFD5] last:border-0">
                  <div>
                    <h4 className="font-medium text-[#211B1C]">{i.product.name}</h4>
                    <span className="text-[11px] text-[#766D6D]">{i.product.color} · Qty: {i.quantity}</span>
                  </div>
                  <span className="font-semibold text-[#603A46]">
                    {money(i.product.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8DFD5] space-y-1.5 text-xs text-[#766D6D]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#211B1C]">{money(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#852F3A]">
                  <span>Discount ({order.couponCode || 'PROMO'})</span>
                  <span>-{money(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Complimentary' : money(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#211B1C] pt-2 border-t border-[#E8DFD5]">
                <span>Grand Total</span>
                <span className="font-serif text-xl text-[#603A46]">{money(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-3 text-xs">
              <h3 className="font-serif text-lg font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
                Shipping Destination
              </h3>
              <p className="font-semibold text-[#211B1C]">{order.customerName}</p>
              <p className="text-[#766D6D] leading-relaxed">
                {order.deliveryAddress}, {order.city}, {order.state} - {order.pinCode}
              </p>
              <p className="text-[#766D6D]">Phone: {order.customerPhone}</p>
            </div>

            <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-3 text-xs">
              <h3 className="font-serif text-lg font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
                Payment Information
              </h3>
              <p className="uppercase text-[#211B1C] font-semibold">
                Method: {order.paymentMethod}
              </p>
              <p className="text-[#766D6D]">
                Payment Status: <span className="font-semibold text-emerald-800">{order.paymentStatus || 'Verified'}</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
