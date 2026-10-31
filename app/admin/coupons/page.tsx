'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { getStoredCoupons, saveStoredCoupons, Coupon } from '@/lib/campaignStore';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  // New coupon form
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [value, setValue] = useState(15);
  const [minOrderValue, setMinOrderValue] = useState(1999);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(1000);
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState('');

  const loadData = () => {
    setCoupons(getStoredCoupons());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ug_coupons_updated', loadData);
    return () => window.removeEventListener('ug_coupons_updated', loadData);
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleToggle = (couponCode: string) => {
    const updated = coupons.map((c) =>
      c.code === couponCode ? { ...c, isActive: !c.isActive } : c
    );
    saveStoredCoupons(updated);
    notify(`Coupon ${couponCode} status toggled`);
  };

  const handleDelete = (couponCode: string) => {
    const updated = coupons.filter((c) => c.code !== couponCode);
    saveStoredCoupons(updated);
    notify(`Coupon ${couponCode} deleted`);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      code: code.trim().toUpperCase(),
      discountType,
      value: Number(value),
      minOrderValue: Number(minOrderValue),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      description: description || `${value}${discountType === 'percent' ? '%' : '₹'} off privilege`,
      isActive: true,
      usageCount: 0,
    };

    const updated = [newCoupon, ...coupons];
    saveStoredCoupons(updated);
    setShowAdd(false);
    setCode('');
    notify(`Coupon "${newCoupon.code}" created!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#852F3A] block mb-0.5">
            PROMOTIONAL PRIVILEGES
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#211B1C] tracking-tight">
            Coupons & Discounts Engine
          </h1>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C6A064]" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white p-5 rounded border border-[#E8DFD5] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-base font-bold text-[#603A46]">
                  {coupon.code}
                </span>
                <button
                  onClick={() => handleToggle(coupon.code)}
                  className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded cursor-pointer ${
                    coupon.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <strong className="text-sm font-serif text-[#211B1C]">
                  {coupon.discountType === 'percent' ? `${coupon.value}% Off` : `Flat ₹${coupon.value} Off`}
                </strong>
                <p className="text-[#766D6D]">{coupon.description}</p>
                <div className="text-[11px] text-[#766D6D] pt-2 space-y-0.5 border-t border-[#E8DFD5]">
                  <div>Min Order: ₹{coupon.minOrderValue.toLocaleString('en-IN')}</div>
                  {coupon.maxDiscount && <div>Max Cap: ₹{coupon.maxDiscount.toLocaleString('en-IN')}</div>}
                  <div>Times Used: <strong>{coupon.usageCount}</strong></div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DFD5] flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#766D6D]">Backend validated</span>
              <button
                onClick={() => handleDelete(coupon.code)}
                className="text-red-700 hover:text-red-900 p-1"
                aria-label="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white p-6 rounded shadow-xl max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif text-xl font-medium text-[#603A46]">Create New Coupon</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-semibold"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (INR)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Min Order (INR)
                  </label>
                  <input
                    type="number"
                    required
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Max Cap (INR)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount || ''}
                    onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20% off on all festive orders above ₹1,999"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 bg-gray-100 text-[#211B1C] rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#603A46] text-white rounded font-semibold uppercase tracking-wider"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
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
