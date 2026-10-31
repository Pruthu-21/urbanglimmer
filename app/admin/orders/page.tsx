'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Download,
  Copy,
  Check,
  MessageCircle,
  Truck,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  getStoredOrders,
  Order,
  OrderStatus,
  updateOrderStatus,
  deleteOrder,
  generateStatusReplyTemplate,
} from '@/lib/orderStore';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeReplyOrder, setActiveReplyOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');

  const loadData = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('urban_glimmer_orders_updated', loadData);
    return () => window.removeEventListener('urban_glimmer_orders_updated', loadData);
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

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    notify(`Order #${orderId} marked as ${newStatus}`);
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'City', 'Grand Total', 'Status', 'Payment Method', 'Date'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      o.customerEmail,
      o.city,
      o.grandTotal,
      o.status,
      o.paymentMethod,
      o.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UrbanGlimmer_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Orders exported to CSV');
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'All' || o.status.toLowerCase() === statusFilter.toLowerCase();
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  const copyReply = (order: Order) => {
    const text = generateStatusReplyTemplate(order);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#852F3A] block mb-0.5">
            FULFILLMENT & DISPATCH LOGISTICS
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#211B1C] tracking-tight">
            Customer Orders ({orders.length})
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-white border border-[#E8DFD5] hover:bg-[#F8F4EE] text-[#603A46] text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#C6A064]" />
          <span>Export Authorized CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded border border-[#E8DFD5] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#766D6D] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by order #, customer, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded pl-9 pr-3 py-2 text-xs focus:outline-[#603A46]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'Confirmed', 'In Production', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded uppercase font-bold text-[10px] tracking-wider shrink-0 ${
                statusFilter === st
                  ? 'bg-[#603A46] text-white'
                  : 'bg-[#F8F4EE] border border-[#E8DFD5] text-[#766D6D]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded border border-[#E8DFD5] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#F8F4EE] border-b border-[#E8DFD5] text-[#766D6D] uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Order ID & Date</th>
              <th className="py-3 px-4">Customer Details</th>
              <th className="py-3 px-4">Items / Details</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD5]">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-[#F8F4EE]/60 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-mono text-sm font-bold text-[#603A46] block">
                    #{order.id}
                  </span>
                  <span className="text-[10px] text-[#766D6D]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <strong className="text-[#211B1C] block">{order.customerName}</strong>
                  <span className="text-[11px] text-[#766D6D]">{order.city}, {order.state || 'India'}</span>
                  <span className="text-[10px] text-[#766D6D] block">{order.customerEmail}</span>
                </td>
                <td className="py-3 px-4 text-[#766D6D]">
                  <span className="block text-[#211B1C] font-medium">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} pieces
                  </span>
                  <span className="text-[11px] line-clamp-1">
                    {order.items.map((i) => i.product.name).join(', ')}
                  </span>
                </td>
                <td className="py-3 px-4 font-serif font-bold text-sm text-[#211B1C]">
                  {money(order.grandTotal)}
                  <span className="block text-[10px] uppercase font-mono text-[#766D6D]">
                    {order.paymentMethod} · {order.paymentStatus || 'paid'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
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
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActiveReplyOrder(order)}
                      className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                      title="Generate WhatsApp message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-3 py-1 bg-[#F8F4EE] hover:bg-[#603A46] hover:text-white border border-[#E8DFD5] rounded text-[11px] font-semibold transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Reply Modal */}
      {activeReplyOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white p-6 rounded shadow-xl max-w-lg w-full space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#E8DFD5] pb-2">
              <h3 className="font-serif text-lg font-medium text-[#603A46]">
                WhatsApp / SMS Status Message
              </h3>
              <button onClick={() => setActiveReplyOrder(null)} className="text-[#766D6D]">
                ✕
              </button>
            </div>

            <p className="text-[11px] text-[#766D6D]">
              Copy this curated update message to send directly to <strong>{activeReplyOrder.customerName}</strong>:
            </p>

            <div className="p-4 bg-[#F8F4EE] rounded border border-[#E8DFD5] font-sans leading-relaxed text-xs">
              {generateStatusReplyTemplate(activeReplyOrder)}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => copyReply(activeReplyOrder)}
                className="px-4 py-2 bg-[#603A46] text-white font-semibold uppercase tracking-wider rounded text-xs flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211C1D] text-white border border-[#C6A064] text-xs px-4 py-2.5 rounded shadow-xl flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A064]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
