'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { getStoredOrders, Order, OrderStatus } from '@/lib/orderStore';
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

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderQuery, setOrderQuery] = useState(initialId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialId) {
      handleSearchId(initialId);
    }
  }, [initialId]);

  const handleSearchId = (id: string) => {
    const orders = getStoredOrders();
    const clean = id.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === clean ||
        o.trackingNumber?.toUpperCase() === clean ||
        o.customerEmail.toLowerCase() === id.trim().toLowerCase()
    );
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    handleSearchId(orderQuery);
  };

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const currentIdx = searchedOrder
    ? MILESTONES.findIndex((m) => m.status === searchedOrder.status)
    : -1;

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block">
            ATELIER LOGISTICS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
            Track Your Order In Real Time
          </h1>
          <p className="text-xs text-[#766D6D] leading-relaxed">
            Enter your Urban Glimmer Order Reference (e.g. <strong>UG-89412</strong>) or tracking number to observe artisan crafting and courier transit milestones.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#766D6D] absolute left-3 top-3.5" />
            <input
              type="text"
              required
              placeholder="e.g. UG-89412 or email address"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="w-full bg-white border border-[#E8DFD5] rounded pl-9 pr-3 py-2.5 text-xs font-mono uppercase placeholder:normal-case placeholder:font-sans focus:outline-[#603A46] shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded transition-colors shadow-xs"
          >
            Track
          </button>
        </form>

        {/* Search Sample Suggestions */}
        {!hasSearched && (
          <div className="text-center text-xs text-[#766D6D] space-y-2">
            <span>Try sample demonstration orders:</span>
            <div className="flex justify-center gap-2">
              {['UG-89412', 'UG-77290', 'UG-62914'].map((demoId) => (
                <button
                  key={demoId}
                  onClick={() => {
                    setOrderQuery(demoId);
                    handleSearchId(demoId);
                  }}
                  className="px-2.5 py-1 bg-white border border-[#E8DFD5] rounded text-[11px] font-mono text-[#603A46] hover:border-[#603A46]"
                >
                  {demoId}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {hasSearched && (
          <div>
            {!searchedOrder ? (
              <div className="bg-white p-12 text-center rounded border border-[#E8DFD5] space-y-3">
                <h3 className="font-serif text-2xl text-[#603A46]">No Matching Order Found</h3>
                <p className="text-xs text-[#766D6D] max-w-sm mx-auto">
                  We could not find an order matching &ldquo;{orderQuery}&rdquo;. Please verify your reference number from your confirmation email.
                </p>
              </div>
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] shadow-sm space-y-8 animate-in fade-in duration-300">
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#E8DFD5]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl font-bold text-[#603A46]">
                        #{searchedOrder.id}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded ${
                          searchedOrder.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : searchedOrder.status === 'In Production'
                            ? 'bg-amber-100 text-amber-900'
                            : searchedOrder.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {searchedOrder.status}
                      </span>
                    </div>
                    <span className="text-xs text-[#766D6D] block mt-1">
                      Recipient: <strong>{searchedOrder.customerName}</strong> ({searchedOrder.city})
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/919820012345?text=Hello%20Urban%20Glimmer,%20tracking%20update%20for%20${searchedOrder.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>

                {/* Milestone Progression */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-[#603A46] font-medium">
                    Delivery Progression
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    {MILESTONES.map((m, idx) => {
                      const isPast = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={m.status} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isPast
                                ? 'bg-[#603A46] text-white'
                                : 'bg-[#F8F4EE] border border-[#E8DFD5] text-[#766D6D]'
                            } ${isCurrent ? 'ring-4 ring-[#C6A064]/40' : ''}`}
                          >
                            {isPast ? <CheckCircle2 className="w-5 h-5 text-[#C6A064]" /> : idx + 1}
                          </div>
                          <div className="text-left sm:text-center">
                            <span className="font-bold text-xs block text-[#211B1C]">
                              {m.label}
                            </span>
                            <span className="text-[10px] text-[#766D6D]">{m.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Courier Details */}
                <div className="p-4 bg-[#F8F4EE] rounded border border-[#E8DFD5] text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[#766D6D]">Courier Partner:</span>
                    <strong className="text-[#211B1C]">{searchedOrder.carrier || 'BlueDart Luxury Express'}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#766D6D]">Tracking Number:</span>
                    <strong className="font-mono text-[#603A46]">{searchedOrder.trackingNumber || 'BD-8839102-IN'}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#766D6D]">Estimated Arrival:</span>
                    <strong className="text-emerald-800">{searchedOrder.estimatedDelivery || 'In 2 business days'}</strong>
                  </div>
                </div>

                {/* Items in order */}
                <div className="border-t border-[#E8DFD5] pt-4 space-y-2 text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#766D6D] block mb-2">
                    Jewellery In This Package:
                  </span>
                  {searchedOrder.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span>{i.quantity}x {i.product.name} ({i.product.color})</span>
                      <span className="font-semibold">{money(i.product.price * i.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#E8DFD5] flex justify-between font-bold text-sm text-[#603A46]">
                    <span>Total Paid:</span>
                    <span className="font-serif text-lg">{money(searchedOrder.grandTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
