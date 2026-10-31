'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  Package,
  ShieldCheck,
  Check,
  Save,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  getOrderById,
  updateOrderStatus,
  Order,
  OrderStatus,
  generateStatusReplyTemplate,
} from '@/lib/orderStore';

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>('Pending');
  const [carrier, setCarrier] = useState('BlueDart Luxury Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (id) {
      const found = getOrderById(id);
      if (found) {
        setOrder(found);
        setStatus(found.status);
        setCarrier(found.carrier || 'BlueDart Luxury Express');
        setTrackingNumber(found.trackingNumber || '');
      }
    }
  }, [id]);

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    updateOrderStatus(order.id, status, carrier, trackingNumber);
    setToast('Fulfillment & tracking details saved!');
    setTimeout(() => setToast(''), 2500);
  };

  if (!order) {
    return (
      <div className="p-12 text-center text-xs text-[#766D6D]">
        Loading order #{id}...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-[#E8DFD5] pb-4 flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-[11px] uppercase tracking-wider text-[#766D6D] hover:text-[#603A46] flex items-center gap-1 mb-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders List</span>
          </Link>
          <h1 className="font-serif text-3xl font-medium text-[#211B1C]">
            Fulfillment Management: #{order.id}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Left Column: Fulfillment & Status Editor */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white p-6 rounded border border-[#E8DFD5] shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
              Update Dispatch & Courier Status
            </h2>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Fulfillment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-semibold focus:outline-[#603A46]"
              >
                <option value="Pending">Pending Verification</option>
                <option value="Confirmed">Confirmed & Queued</option>
                <option value="In Production">In Production (Jaipur Atelier)</option>
                <option value="Shipped">Dispatched / Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Courier Service Partner
                </label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs focus:outline-[#603A46]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Airway Bill / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD-8839102-IN"
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono focus:outline-[#603A46]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4 text-[#C6A064]" />
                <span>Save Tracking Updates</span>
              </button>
            </div>
          </form>

          {/* Items In Order */}
          <div className="bg-white p-6 rounded border border-[#E8DFD5] shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
              Jewellery Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-[#E8DFD5] last:border-0">
                  <div>
                    <h4 className="font-medium text-[#211B1C]">{item.product.name}</h4>
                    <span className="text-[11px] text-[#766D6D]">{item.product.color} · Qty: {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-[#603A46]">
                    {money(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8DFD5] space-y-1 text-right text-[#766D6D]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-[#211B1C]">{money(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#852F3A]">
                  <span>Discount:</span>
                  <span>-{money(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-[#211B1C] pt-1">
                <span>Grand Total:</span>
                <span className="font-serif text-lg text-[#603A46]">{money(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery Info */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded border border-[#E8DFD5] shadow-xs space-y-3">
            <h3 className="font-serif text-lg font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
              Customer Profile
            </h3>
            <p className="font-bold text-[#211B1C]">{order.customerName}</p>
            <p className="text-[#766D6D]">{order.customerEmail}</p>
            <p className="text-[#766D6D]">{order.customerPhone}</p>
          </div>

          <div className="bg-white p-5 rounded border border-[#E8DFD5] shadow-xs space-y-3">
            <h3 className="font-serif text-lg font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
              Delivery Destination
            </h3>
            <p className="text-[#766D6D] leading-relaxed">
              {order.deliveryAddress}, {order.city}, {order.state || 'India'} - {order.pinCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
