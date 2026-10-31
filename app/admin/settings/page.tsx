'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Check,
  Building2,
  Mail,
  Phone,
  Truck,
  ShieldCheck,
  CreditCard,
  Cookie,
  AlertCircle,
} from 'lucide-react';
import {
  StoreSettings,
  getStoreSettings,
  saveStoreSettings,
  logAdminAction,
} from '@/lib/settingsStore';
import { getAdminSession } from '@/lib/customerStore';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(getStoreSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(getStoreSettings());
  }, []);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(settings);
    const admin = getAdminSession();
    logAdminAction(
      admin?.name || 'Admin',
      'SETTINGS_UPDATE',
      'Store Configuration',
      'Updated store parameters, GSTIN, and shipping thresholds'
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Notification */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211C1D] text-[#C6A064] border border-[#C6A064]/30 px-4 py-3 rounded-md shadow-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Atelier settings saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#211B1C] font-normal">Store Settings & Configuration</h1>
          <p className="text-xs text-[#766D6D] mt-1">
            Manage enterprise brand parameters, tax identification (GSTIN), concierge details, and logistics thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#603A46] hover:bg-[#852F3A] text-white px-5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
        >
          <Save className="w-4 h-4 text-[#C6A064]" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Store & Legal Identity */}
        <div className="bg-white p-6 rounded-lg border border-[#E8DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8DFD5]">
            <Building2 className="w-4 h-4 text-[#603A46]" />
            <h2 className="font-serif text-base font-semibold text-[#211B1C]">
              Brand & Legal Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40"
              />
            </div>

            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40"
              />
            </div>

            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                GSTIN (Indian Goods & Services Tax Number)
              </label>
              <input
                type="text"
                value={settings.gstin}
                onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                Operating Currency
              </label>
              <input
                type="text"
                disabled
                value="INR (Indian Rupee ₹)"
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md bg-stone-100 text-stone-500 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-[#211B1C] block mb-1">
                Registered Atelier & Head Office Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Concierge & Customer Contact */}
        <div className="bg-white p-6 rounded-lg border border-[#E8DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8DFD5]">
            <Mail className="w-4 h-4 text-[#603A46]" />
            <h2 className="font-serif text-base font-semibold text-[#211B1C]">
              Client Concierge & Contact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                Concierge Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40"
              />
            </div>

            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                Concierge Desk Phone
              </label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40"
              />
            </div>

            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                WhatsApp Direct Concierge
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Shipping & Logistics Rules */}
        <div className="bg-white p-6 rounded-lg border border-[#E8DFD5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8DFD5]">
            <Truck className="w-4 h-4 text-[#603A46]" />
            <h2 className="font-serif text-base font-semibold text-[#211B1C]">
              Shipping & Returns Policy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => handleChange('standardShippingFee', Number(e.target.value))}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                Express Air Transit Fee (₹)
              </label>
              <input
                type="number"
                value={settings.expressShippingFee}
                onChange={(e) => handleChange('expressShippingFee', Number(e.target.value))}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">
                Hassle-Free Return Window (Days)
              </label>
              <input
                type="number"
                value={settings.returnWindowDays}
                onChange={(e) => handleChange('returnWindowDays', Number(e.target.value))}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Privacy & Payments Environment Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[#E8DFD5] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8DFD5]">
              <Cookie className="w-4 h-4 text-[#603A46]" />
              <h3 className="font-serif text-sm font-semibold text-[#211B1C]">
                DPDP 2023 Cookie Consent
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="font-semibold text-[#211B1C] block">Display Privacy & Cookie Banner</span>
                <span className="text-[10px] text-[#766D6D]">Required for Indian DPDP & international compliance</span>
              </div>
              <input
                type="checkbox"
                checked={settings.cookieConsentEnabled}
                onChange={(e) => handleChange('cookieConsentEnabled', e.target.checked)}
                className="w-4 h-4 accent-[#603A46] cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#E8DFD5] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8DFD5]">
              <CreditCard className="w-4 h-4 text-[#603A46]" />
              <h3 className="font-serif text-sm font-semibold text-[#211B1C]">
                Payment Gateway Mode
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="font-semibold text-[#211B1C] block">Production Payment Gateway</span>
                <span className="text-[10px] text-amber-700 font-medium">Sandbox / Development Simulator Active</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                SANDBOX
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
