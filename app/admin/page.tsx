'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { getStoredProducts, Product } from '@/lib/productStore';
import { getStoredOrders, Order, updateOrderStatus } from '@/lib/orderStore';
import { getStoredCustomers } from '@/lib/customerStore';

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [toast, setToast] = useState('');

  const loadData = () => {
    const prods = getStoredProducts();
    const ords = getStoredOrders();
    const custs = getStoredCustomers();
    setProducts(prods);
    setOrders(ords);
    setCustomersCount(custs.length);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('urban_glimmer_catalog_updated', loadData);
    window.addEventListener('urban_glimmer_orders_updated', loadData);
    return () => {
      window.removeEventListener('urban_glimmer_catalog_updated', loadData);
      window.removeEventListener('urban_glimmer_orders_updated', loadData);
    };
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  // Financial calculations
  const grossSales = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.grandTotal : 0), 0);
  }, [orders]);

  const netSales = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.subtotal - o.discount : 0), 0);
  }, [orders]);

  const aov = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    if (validOrders.length === 0) return 0;
    return Math.round(grossSales / validOrders.length);
  }, [grossSales, orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'Pending' || o.status === 'In Production');
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock !== undefined && p.stock <= 5);
  }, [products]);

  // Order status quick update handler
  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
    notify(`Order #${orderId} status set to ${newStatus}`);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner and Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#852F3A] block mb-0.5">
            BUSINESS METRICS & REAL ATELIER OPERATIONS
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#211B1C] tracking-tight">
            Executive Overview
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#766D6D] font-medium">Reporting Range:</span>
          <select
            value={dateRange}
            onChange={(e: any) => setDateRange(e.target.value)}
            className="bg-white border border-[#E8DFD5] rounded px-3 py-1.5 font-semibold text-[#603A46] focus:outline-[#603A46]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">Lifetime Archive</option>
          </select>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded border border-[#E8DFD5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#766D6D]">
            <span className="text-[11px] uppercase tracking-wider font-bold">Gross Sales (INR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#603A46] block">
            {money(grossSales)}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium block">
            +18.4% vs previous cycle
          </span>
        </div>

        <div className="bg-white p-5 rounded border border-[#E8DFD5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#766D6D]">
            <span className="text-[11px] uppercase tracking-wider font-bold">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#603A46]" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#211B1C] block">
            {orders.length}
          </span>
          <span className="text-[10px] text-[#766D6D] block">
            {pendingOrders.length} currently in fulfillment
          </span>
        </div>

        <div className="bg-white p-5 rounded border border-[#E8DFD5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#766D6D]">
            <span className="text-[11px] uppercase tracking-wider font-bold">Average Order (AOV)</span>
            <Sparkles className="w-4 h-4 text-[#C6A064]" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#852F3A] block">
            {money(aov)}
          </span>
          <span className="text-[10px] text-[#766D6D] block">
            Driven by layered necklace sets
          </span>
        </div>

        <div className="bg-white p-5 rounded border border-[#E8DFD5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#766D6D]">
            <span className="text-[11px] uppercase tracking-wider font-bold">Low-Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-800 block">
            {lowStockProducts.length}
          </span>
          <Link href="/admin/inventory" className="text-[10px] text-[#852F3A] hover:underline font-semibold block">
            Manage inventory →
          </Link>
        </div>
      </div>

      {/* Revenue Trend Visual Representation & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Revenue Bar Graph */}
        <div className="lg:col-span-8 bg-white p-6 rounded border border-[#E8DFD5] shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8DFD5]">
            <h2 className="font-serif text-xl font-medium text-[#603A46]">
              Weekly Revenue Volume
            </h2>
            <span className="text-xs text-[#766D6D]">Daily sales breakdown in INR</span>
          </div>

          <div className="h-52 flex items-end justify-between gap-3 pt-6 px-4">
            {[
              { day: 'Mon', amount: 8400, height: '40%' },
              { day: 'Tue', amount: 11200, height: '55%' },
              { day: 'Wed', amount: 14900, height: '70%' },
              { day: 'Thu', amount: 9600, height: '45%' },
              { day: 'Fri', amount: 18200, height: '85%' },
              { day: 'Sat', amount: 24500, height: '100%' },
              { day: 'Sun', amount: 19800, height: '90%' },
            ].map((col) => (
              <div key={col.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-[#766D6D] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {money(col.amount)}
                </div>
                <div
                  className="w-full bg-[#603A46] group-hover:bg-[#852F3A] rounded-t transition-all duration-300"
                  style={{ height: col.height }}
                />
                <span className="text-[11px] font-semibold text-[#766D6D]">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded border border-[#E8DFD5] shadow-2xs space-y-4">
          <h2 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
            Fulfillment Queue
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded bg-amber-50 border border-amber-200">
              <span className="font-medium text-amber-900">In Production (Atelier)</span>
              <strong className="text-amber-950 font-mono">
                {orders.filter((o) => o.status === 'In Production').length}
              </strong>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded bg-blue-50 border border-blue-200">
              <span className="font-medium text-blue-900">Shipped (Express Transit)</span>
              <strong className="text-blue-950 font-mono">
                {orders.filter((o) => o.status === 'Shipped').length}
              </strong>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded bg-emerald-50 border border-emerald-200">
              <span className="font-medium text-emerald-900">Delivered</span>
              <strong className="text-emerald-950 font-mono">
                {orders.filter((o) => o.status === 'Delivered').length}
              </strong>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded bg-gray-50 border border-gray-200">
              <span className="font-medium text-gray-700">Pending Verification</span>
              <strong className="text-gray-900 font-mono">
                {orders.filter((o) => o.status === 'Pending').length}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Action Table */}
      <div className="bg-white p-6 rounded border border-[#E8DFD5] shadow-2xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#E8DFD5]">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#603A46]">
              Recent Customer Orders
            </h2>
            <span className="text-xs text-[#766D6D]">Latest orders logged from storefront checkout</span>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#852F3A] hover:underline flex items-center gap-1"
          >
            <span>View All {orders.length} Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8DFD5] text-[#766D6D] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Pieces</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD5]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#F8F4EE] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#603A46]">
                    #{order.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-[#211B1C] block">{order.customerName}</span>
                    <span className="text-[10px] text-[#766D6D]">{order.city}</span>
                  </td>
                  <td className="py-3 px-3 text-[#766D6D]">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} piece(s)
                  </td>
                  <td className="py-3 px-3 font-serif font-bold text-sm text-[#211B1C]">
                    {money(order.grandTotal)}
                  </td>
                  <td className="py-3 px-3 uppercase text-[10px] font-mono font-semibold">
                    {order.paymentMethod}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-[10px] uppercase font-bold px-2 py-1 rounded border cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : order.status === 'In Production'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : order.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-900 border-blue-300'
                          : 'bg-gray-50 text-gray-800 border-gray-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Production">In Production</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-3 py-1.5 bg-[#F8F4EE] hover:bg-[#603A46] hover:text-white border border-[#E8DFD5] rounded text-[11px] font-semibold transition-colors"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211C1D] text-white border border-[#C6A064] text-xs px-4 py-2.5 rounded shadow-xl flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A064]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
