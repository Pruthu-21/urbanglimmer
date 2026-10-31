'use client';

import { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Users,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Layers,
  Tag,
} from 'lucide-react';
import { getStoredOrders, Order } from '@/lib/orderStore';
import { getAllProducts, Product } from '@/lib/productStore';
import { getStoredCoupons } from '@/lib/campaignStore';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'ytd' | 'all'>('30d');

  const orders = useMemo(() => getStoredOrders(), []);
  const products: Product[] = useMemo(() => getAllProducts(), []);
  const coupons = useMemo(() => getStoredCoupons(), []);

  // Filter orders by time range
  const filteredOrders = useMemo(() => {
    const now = new Date().getTime();
    return orders.filter((o) => {
      const orderDate = new Date(o.createdAt).getTime();
      const diffDays = (now - orderDate) / (1000 * 3600 * 24);
      if (timeRange === '7d') return diffDays <= 7;
      if (timeRange === '30d') return diffDays <= 30;
      if (timeRange === 'ytd') return diffDays <= 365;
      return true;
    });
  }, [orders, timeRange]);

  // Key KPI metrics
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? (o.grandTotal || 0) : 0), 0);
  }, [filteredOrders]);

  const paidOrdersCount = useMemo(() => {
    return filteredOrders.filter((o) => o.paymentStatus === 'paid').length;
  }, [filteredOrders]);

  const aov = useMemo(() => {
    return paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0;
  }, [totalRevenue, paidOrdersCount]);

  // Category breakdown
  const categoryRevenue = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    filteredOrders.forEach((o) => {
      if (o.paymentStatus !== 'paid') return;
      o.items.forEach((item) => {
        const cat = item.product?.category || 'Fine Jewellery';
        if (!map[cat]) map[cat] = { count: 0, revenue: 0 };
        map[cat].count += item.quantity;
        map[cat].revenue += (item.product?.price || 0) * item.quantity;
      });
    });
    return Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue);
  }, [filteredOrders]);

  // Top products
  const topProducts = useMemo(() => {
    const map: Record<number, { name: string; quantity: number; revenue: number }> = {};
    filteredOrders.forEach((o) => {
      if (o.paymentStatus !== 'paid') return;
      o.items.forEach((item) => {
        const pid = item.product?.id || 0;
        if (!map[pid]) {
          map[pid] = { name: item.product?.name || 'Jewellery Piece', quantity: 0, revenue: 0 };
        }
        map[pid].quantity += item.quantity;
        map[pid].revenue += (item.product?.price || 0) * item.quantity;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // Inventory health
  const inventoryStats = useMemo(() => {
    const lowStock = products.filter((p: Product) => (p.stock || 0) > 0 && (p.stock || 0) <= 5);
    const outOfStock = products.filter((p: Product) => (p.stock || 0) === 0);
    const healthy = products.filter((p: Product) => (p.stock || 0) > 5);
    return {
      healthy: healthy.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      total: products.length,
    };
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#211B1C] font-normal">Analytics & Atelier Performance</h1>
          <p className="text-xs text-[#766D6D] mt-1">
            Real sales indicators, average order values, category distribution, and inventory health metrics.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 border border-[#E8DFD5] rounded-md p-1 bg-white text-xs">
          {(
            [
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: 'ytd', label: 'Year to Date' },
              { id: 'all', label: 'All Records' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1.5 rounded text-[11px] font-medium transition-colors ${
                timeRange === t.id
                  ? 'bg-[#603A46] text-white shadow-xs'
                  : 'text-[#766D6D] hover:text-[#211B1C]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#766D6D]">
              Gross Realized Revenue
            </span>
            <div className="w-8 h-8 rounded-full bg-[#603A46]/10 text-[#603A46] flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-semibold text-[#211B1C] mt-2">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Based on {paidOrdersCount} completed transactions
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#766D6D]">
              Average Order Value (AOV)
            </span>
            <div className="w-8 h-8 rounded-full bg-[#C6A064]/20 text-[#852F3A] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-semibold text-[#211B1C] mt-2">
            ₹{aov.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-[#766D6D] mt-1 block">
            Consistent with luxury vermeil positioning
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#766D6D]">
              Fulfillment Orders
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-semibold text-[#211B1C] mt-2">
            {filteredOrders.length}
          </p>
          <span className="text-[10px] text-[#766D6D] mt-1 block">
            {filteredOrders.filter((o) => o.status === 'Delivered').length} delivered successfully
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#766D6D]">
              Catalogue SKUs
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-semibold text-[#211B1C] mt-2">
            {products.length}
          </p>
          <span className="text-[10px] text-amber-700 mt-1 block font-medium">
            {inventoryStats.lowStock} pieces below low-stock threshold
          </span>
        </div>
      </div>

      {/* Grid: Category Distribution & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white p-5 rounded-lg border border-[#E8DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
            <h2 className="font-serif text-base font-semibold text-[#211B1C]">
              Revenue by Jewellery Category
            </h2>
            <Layers className="w-4 h-4 text-[#766D6D]" />
          </div>

          <div className="space-y-3">
            {categoryRevenue.map(([cat, stat]) => {
              const pct = totalRevenue > 0 ? Math.round((stat.revenue / totalRevenue) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#211B1C] capitalize">{cat}</span>
                    <span className="text-[#766D6D]">
                      ₹{stat.revenue.toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F8F4EE] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#603A46] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Pieces */}
        <div className="bg-white p-5 rounded-lg border border-[#E8DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
            <h2 className="font-serif text-base font-semibold text-[#211B1C]">
              Best-Selling Atelier Creations
            </h2>
            <TrendingUp className="w-4 h-4 text-[#C6A064]" />
          </div>

          <div className="space-y-2">
            {topProducts.length === 0 ? (
              <p className="text-xs text-[#766D6D] py-4 text-center">No transactions in selected period.</p>
            ) : (
              topProducts.slice(0, 5).map((tp, idx) => (
                <div
                  key={tp.name}
                  className="flex items-center justify-between p-2.5 rounded bg-[#F8F4EE]/50 border border-[#E8DFD5]/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#603A46] text-[#C6A064] text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-[#211B1C]">{tp.name}</p>
                      <span className="text-[10px] text-[#766D6D]">{tp.quantity} units ordered</span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-[#603A46]">
                    ₹{tp.revenue.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row: Active Campaign Coupons & Inventory Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Coupon Health */}
        <div className="bg-white p-5 rounded-lg border border-[#E8DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
            <h2 className="font-serif text-base font-semibold text-[#211B1C]">
              Promotional Voucher Utilization
            </h2>
            <Tag className="w-4 h-4 text-[#766D6D]" />
          </div>

          <div className="space-y-3">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="flex items-center justify-between p-3 rounded-lg border border-[#E8DFD5] bg-[#F8F4EE]/30"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#603A46] bg-white px-2 py-0.5 rounded border border-[#E8DFD5]">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {c.discountType === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#766D6D] mt-1">{c.description}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#211B1C]">{c.usageCount}</span>
                  <span className="text-[10px] text-[#766D6D] block">redemptions</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Stock Breakdown */}
        <div className="bg-white p-5 rounded-lg border border-[#E8DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
            <h2 className="font-serif text-base font-semibold text-[#211B1C]">
              Inventory Health Breakdown
            </h2>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-2xl font-serif font-bold text-emerald-800">{inventoryStats.healthy}</span>
              <span className="text-[10px] uppercase font-bold text-emerald-700 block mt-1">Healthy Stock</span>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-2xl font-serif font-bold text-amber-800">{inventoryStats.lowStock}</span>
              <span className="text-[10px] uppercase font-bold text-amber-700 block mt-1">Low (≤ 5 units)</span>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <span className="text-2xl font-serif font-bold text-red-800">{inventoryStats.outOfStock}</span>
              <span className="text-[10px] uppercase font-bold text-red-700 block mt-1">Depleted (0 units)</span>
            </div>
          </div>

          <p className="text-[11px] text-[#766D6D] leading-relaxed pt-2">
            Stock quantities automatically synchronize with checkout transactions. For restocking, navigate to the SKU Inventory Management panel.
          </p>
        </div>
      </div>
    </div>
  );
}
