'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { getStoredOrders, Order } from '@/lib/orderStore';
import { getActiveCustomer, Customer } from '@/lib/customerStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function AccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setCustomer(getActiveCustomer());
    setOrders(getStoredOrders());
  }, []);

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Account Header */}
        <div className="bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#603A46] text-[#C6A064] flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#C6A064]/40">
              {customer?.name.charAt(0) || 'M'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#211B1C]">
                  {customer?.name || 'Meera Sharma'}
                </h1>
                <span className="text-[10px] bg-[#C6A064]/20 text-[#603A46] font-bold px-2 py-0.5 rounded border border-[#C6A064]/40 uppercase tracking-wider">
                  {customer?.tier || 'Royal Gold'} Patron
                </span>
              </div>
              <p className="text-xs text-[#766D6D] mt-0.5">
                {customer?.email || 'meera.s@example.com'} · {customer?.phone || '+91 98201 44821'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/track-order"
              className="px-4 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-[#C6A064]" />
              <span>Track An Order</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-[#E8DFD5] pb-2 text-xs uppercase font-bold tracking-wider overflow-x-auto">
          <Link href="/account" className="px-3 py-2 text-[#603A46] border-b-2 border-[#603A46]">
            Overview
          </Link>
          <Link href="/account/orders" className="px-3 py-2 text-[#766D6D] hover:text-[#211B1C]">
            Orders ({orders.length})
          </Link>
          <Link href="/account/addresses" className="px-3 py-2 text-[#766D6D] hover:text-[#211B1C]">
            Saved Addresses
          </Link>
          <Link href="/account/profile" className="px-3 py-2 text-[#766D6D] hover:text-[#211B1C]">
            Personal Profile
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded border border-[#E8DFD5]">
            <span className="text-[10px] uppercase font-bold text-[#766D6D] tracking-wider block">
              Total Lifetime Orders
            </span>
            <span className="font-serif text-3xl font-medium text-[#603A46] mt-1 block">
              {orders.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded border border-[#E8DFD5]">
            <span className="text-[10px] uppercase font-bold text-[#766D6D] tracking-wider block">
              Patron Privilege Tier
            </span>
            <span className="font-serif text-3xl font-medium text-[#852F3A] mt-1 block">
              {customer?.tier || 'Royal Gold'}
            </span>
          </div>

          <div className="bg-white p-5 rounded border border-[#E8DFD5]">
            <span className="text-[10px] uppercase font-bold text-[#766D6D] tracking-wider block">
              Lifetime Atelier Spend
            </span>
            <span className="font-serif text-3xl font-medium text-[#211B1C] mt-1 block">
              {money(orders.reduce((sum, o) => sum + o.grandTotal, 0))}
            </span>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
            <h2 className="font-serif text-2xl font-medium text-[#603A46]">Recent Orders</h2>
            <Link href="/account/orders" className="text-xs uppercase font-bold text-[#852F3A] hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="space-y-4">
            {orders.slice(0, 2).map((order) => (
              <div
                key={order.id}
                className="p-4 rounded border border-[#E8DFD5] bg-[#F8F4EE] flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#603A46]">#{order.id}</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'In Production'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[#766D6D] mt-1">
                    {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                  </p>
                  <span className="text-[10px] text-[#766D6D] mt-1 block">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-serif text-lg font-bold text-[#211B1C]">
                    {money(order.grandTotal)}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="px-4 py-2 bg-white border border-[#E8DFD5] hover:border-[#603A46] text-[#603A46] font-semibold text-xs uppercase tracking-wider rounded transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
