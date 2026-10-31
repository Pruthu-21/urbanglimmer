'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, ShieldCheck, Mail, Phone, Award, LogOut } from 'lucide-react';
import { getActiveCustomer, Customer } from '@/lib/customerStore';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function AccountProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const cust = getActiveCustomer();
    if (cust) {
      setCustomer(cust);
      setName(cust.name);
      setEmail(cust.email);
      setPhone(cust.phone);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast('Profile details updated successfully');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="border-b border-[#E8DFD5] pb-4">
          <Link
            href="/account"
            className="text-[11px] uppercase tracking-wider text-[#766D6D] hover:text-[#603A46] flex items-center gap-1 mb-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#603A46] font-medium tracking-tight">
            Personal Profile & Preferences
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Membership summary */}
          <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 text-xs">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#603A46] text-[#C6A064] flex items-center justify-center font-serif text-3xl font-bold">
                {name.charAt(0) || 'M'}
              </div>
              <h3 className="font-serif text-xl font-medium text-[#211B1C]">{name}</h3>
              <span className="inline-block text-[10px] bg-[#C6A064]/20 text-[#603A46] font-bold px-2.5 py-0.5 rounded uppercase">
                {customer?.tier || 'Royal Gold'} Patron
              </span>
            </div>

            <div className="pt-4 border-t border-[#E8DFD5] space-y-2 text-[#766D6D]">
              <div className="flex justify-between">
                <span>Total Orders:</span>
                <strong className="text-[#211B1C]">{customer?.ordersCount || 4}</strong>
              </div>
              <div className="flex justify-between">
                <span>Lifetime Value:</span>
                <strong className="text-[#211B1C]">₹12,450</strong>
              </div>
              <div className="flex justify-between">
                <span>Member Since:</span>
                <strong className="text-[#211B1C]">Nov 2025</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] space-y-6 text-xs">
            <h2 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-3">
              Account Credentials
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Email Address
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
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                />
              </div>

              {toast && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold text-[11px]">
                  {toast}
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3 bg-[#603A46] hover:bg-[#852F3A] text-white font-semibold uppercase tracking-wider rounded transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
