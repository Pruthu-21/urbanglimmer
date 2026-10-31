'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Sparkles, MessageCircle, Mail } from 'lucide-react';
import { getStoredCustomers, Customer } from '@/lib/customerStore';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setCustomers(getStoredCustomers());
  }, []);

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase().trim();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#852F3A] block mb-0.5">
            CLIENT DIRECTORY & PATRON TIERS
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#211B1C] tracking-tight">
            Patron Management ({customers.length})
          </h1>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#766D6D] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by patron name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E8DFD5] rounded pl-9 pr-3 py-2 text-xs focus:outline-[#603A46]"
          />
        </div>
      </div>

      <div className="bg-white rounded border border-[#E8DFD5] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#F8F4EE] border-b border-[#E8DFD5] text-[#766D6D] uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Patron Name</th>
              <th className="py-3 px-4">Contact Info</th>
              <th className="py-3 px-4">Patron Tier</th>
              <th className="py-3 px-4">Orders</th>
              <th className="py-3 px-4">Lifetime Spend</th>
              <th className="py-3 px-4">Private Styling Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD5]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#F8F4EE]/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#603A46] text-[#C6A064] flex items-center justify-center font-bold text-xs">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-[#211B1C] block">{c.name}</strong>
                      <span className="text-[10px] text-[#766D6D]">ID: {c.id}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="block text-[#211B1C]">{c.email}</span>
                  <span className="text-[11px] text-[#766D6D] font-mono">{c.phone}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C6A064]/20 text-[#603A46] border border-[#C6A064]/30 uppercase">
                    {c.tier}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-semibold">
                  {c.ordersCount} orders
                </td>
                <td className="py-3 px-4 font-serif font-bold text-sm text-[#603A46]">
                  {money(c.totalSpent)}
                </td>
                <td className="py-3 px-4 text-[#766D6D] max-w-xs truncate">
                  {c.notes || 'No notes logged.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
