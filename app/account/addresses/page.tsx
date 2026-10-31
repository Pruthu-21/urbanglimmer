'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus, Check, Trash2, Edit2 } from 'lucide-react';
import { getActiveCustomer, Address } from '@/lib/customerStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('');

  useEffect(() => {
    const cust = getActiveCustomer();
    if (cust && cust.addresses) {
      setAddresses(cust.addresses);
    }
  }, []);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !street || !city || !pinCode) return;

    const newAddr: Address = {
      id: `ADDR-${Date.now()}`,
      fullName,
      phone,
      street,
      city,
      state,
      pinCode,
      isDefault: addresses.length === 0,
    };

    setAddresses((prev) => [newAddr, ...prev]);
    setShowAddForm(false);
    setFullName('');
    setPhone('');
    setStreet('');
    setCity('');
    setPinCode('');
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="border-b border-[#E8DFD5] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Link
              href="/account"
              className="text-[11px] uppercase tracking-wider text-[#766D6D] hover:text-[#603A46] flex items-center gap-1 mb-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Account</span>
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
              Saved Shipping Destinations
            </h1>
          </div>

          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="px-4 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Add New Address'}</span>
          </button>
        </div>

        {/* Add Address Form */}
        {showAddForm && (
          <form onSubmit={handleAddAddress} className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 max-w-xl text-xs">
            <h3 className="font-serif text-xl font-medium text-[#603A46]">Add Shipping Destination</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Street Address</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">PIN Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#603A46] text-white font-semibold uppercase tracking-wider rounded"
            >
              Save Address
            </button>
          </form>
        )}

        {/* Addresses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-6 rounded border bg-white flex flex-col justify-between space-y-4 ${
                addr.isDefault ? 'border-[#603A46] ring-2 ring-[#603A46]/20' : 'border-[#E8DFD5]'
              }`}
            >
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-medium text-[#211B1C]">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-[#603A46]/10 text-[#603A46] font-bold px-2 py-0.5 rounded">
                      Default Destination
                    </span>
                  )}
                </div>
                <p className="text-[#766D6D] leading-relaxed">
                  {addr.street}, {addr.city}, {addr.state} - {addr.pinCode}
                </p>
                <p className="text-[#766D6D]">Contact: {addr.phone}</p>
              </div>

              <div className="pt-3 border-t border-[#E8DFD5] flex items-center justify-between text-xs">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[#603A46] hover:underline font-semibold"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Primary Address
                  </span>
                )}

                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-red-700 hover:text-red-900 p-1"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
