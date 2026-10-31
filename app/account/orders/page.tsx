'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Package, Truck, ExternalLink } from 'lucide-react';
import { getStoredOrders, Order } from '@/lib/orderStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    return o.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="border-b border-[#E8DFD5] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Link
              href="/account"
              className="text-[11px] uppercase tracking-wider text-[#766D6D] hover:text-[#603A46] flex items-center gap-1 mb-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Account Overview</span>
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
              Order History & Tracking
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {['All', 'In Production', 'Shipped', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-[#603A46] text-white'
                    : 'bg-white border border-[#E8DFD5] text-[#766D6D]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded border border-[#E8DFD5] text-xs text-[#766D6D]">
              No orders found matching the filter &ldquo;{statusFilter}&rdquo;.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded border border-[#E8DFD5] shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[#E8DFD5] pb-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-[#603A46]">
                      #{order.id}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'In Production'
                          ? 'bg-amber-100 text-amber-900'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-[#766D6D] text-[11px]">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <Package className="w-4 h-4 text-[#C6A064]" />
                        <span className="font-medium text-[#211B1C]">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="text-[#766D6D]">({item.product.color})</span>
                      </div>
                    ))}
                    {order.carrier && (
                      <div className="text-[11px] text-[#766D6D] flex items-center gap-1.5 pt-1">
                        <Truck className="w-3.5 h-3.5 text-[#603A46]" />
                        <span>Dispatched via <strong>{order.carrier}</strong> · Tracking: {order.trackingNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0">
                    <span className="font-serif text-2xl font-bold text-[#603A46]">
                      {money(order.grandTotal)}
                    </span>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="px-4 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors flex items-center gap-1.5"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
