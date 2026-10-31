'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Check, Settings, X, Lock } from 'lucide-react';
import {
  getCookiePreferences,
  saveCookiePreferences,
  CookiePreferences,
} from '@/lib/settingsStore';

export default function CookieConsentBanner() {
  const [prefs, setPrefs] = useState<CookiePreferences | null>(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = getCookiePreferences();
    setPrefs(initial);
    setAnalyticsOptIn(initial.analytics);
    setMarketingOptIn(initial.marketing);

    const handleUpdate = () => {
      const updated = getCookiePreferences();
      setPrefs(updated);
      setAnalyticsOptIn(updated.analytics);
      setMarketingOptIn(updated.marketing);
    };

    window.addEventListener('ug_cookie_consent_updated', handleUpdate);
    return () => window.removeEventListener('ug_cookie_consent_updated', handleUpdate);
  }, []);

  // Listen for custom trigger to open preferences modal from footer
  useEffect(() => {
    const handleOpenModal = () => {
      setShowPreferencesModal(true);
    };
    window.addEventListener('ug_open_cookie_preferences', handleOpenModal);
    return () => window.removeEventListener('ug_open_cookie_preferences', handleOpenModal);
  }, []);

  if (!mounted || !prefs) return null;

  // If user has already responded and modal is not explicitly triggered, do not render banner
  if (prefs.responded && !showPreferencesModal) {
    return null;
  }

  const handleAcceptAll = () => {
    saveCookiePreferences({
      analytics: true,
      marketing: true,
    });
    setShowPreferencesModal(false);
  };

  const handleRejectOptional = () => {
    saveCookiePreferences({
      analytics: false,
      marketing: false,
    });
    setShowPreferencesModal(false);
  };

  const handleSaveCustom = () => {
    saveCookiePreferences({
      analytics: analyticsOptIn,
      marketing: marketingOptIn,
    });
    setShowPreferencesModal(false);
  };

  return (
    <>
      {/* Compact Initial Banner */}
      {!prefs.responded && !showPreferencesModal && (
        <aside aria-label="Cookie consent banner" className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-[#211C1D] text-[#F8F4EE] border border-[#C6A064]/30 rounded shadow-2xl p-5 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#603A46] text-[#C6A064] shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h3 className="font-serif text-base text-[#F8F4EE] font-medium tracking-tight">
                Your experience, thoughtfully curated.
              </h3>
              <p className="text-xs text-[#E8DFD5]/80 leading-relaxed">
                We use essential cookies to operate the store and optional cookies to understand how our website is used and improve your experience.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={() => setShowPreferencesModal(true)}
              className="text-[11px] text-[#C6A064] hover:text-white px-2.5 py-1.5 font-semibold uppercase tracking-wider transition-colors"
            >
              Customize
            </button>
            <button
              onClick={handleRejectOptional}
              className="text-[11px] bg-white/10 hover:bg-white/20 text-[#F8F4EE] px-3 py-1.5 rounded uppercase tracking-wider font-semibold transition-colors"
            >
              Reject Optional
            </button>
            <button
              onClick={handleAcceptAll}
              className="text-[11px] bg-[#603A46] hover:bg-[#852F3A] text-white px-3.5 py-1.5 rounded uppercase tracking-wider font-semibold transition-colors shadow-xs"
            >
              Accept All
            </button>
          </div>
        </aside>
      )}

      {/* Detailed Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] text-[#211B1C] rounded shadow-2xl max-w-lg w-full p-6 border border-[#E8DFD5] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#603A46]" />
                <h3 className="font-serif text-xl font-medium text-[#603A46]">
                  Cookie & Privacy Preferences
                </h3>
              </div>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="text-[#766D6D] hover:text-[#211B1C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#766D6D] mt-3 leading-relaxed">
              Urban Glimmer respects your privacy rights under applicable Indian regulations. You can choose which cookies to enable below. Essential cookies are necessary for catalogue browsing, bag storage, and checkout integrity.
            </p>

            <div className="mt-5 space-y-4">
              {/* Essential Cookies */}
              <div className="p-3.5 bg-[#F8F4EE] rounded border border-[#E8DFD5] flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#603A46]" />
                    <span className="text-xs font-semibold text-[#211B1C] uppercase tracking-wider">
                      Essential Cookies
                    </span>
                    <span className="text-[10px] bg-[#603A46]/10 text-[#603A46] px-1.5 py-0.5 rounded font-bold uppercase">
                      Always Active
                    </span>
                  </div>
                  <p className="text-[11px] text-[#766D6D]">
                    Required for core security, session management, shopping bag persistence, and checkout.
                  </p>
                </div>
                <div className="shrink-0 text-emerald-600 font-bold text-xs pt-0.5">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="p-3.5 bg-[#F8F4EE] rounded border border-[#E8DFD5] flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <span className="text-xs font-semibold text-[#211B1C] uppercase tracking-wider">
                    Analytics Cookies
                  </span>
                  <p className="text-[11px] text-[#766D6D]">
                    Helps us understand how customers navigate our jewellery catalogue to optimize load times and experience.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={analyticsOptIn}
                    onChange={(e) => setAnalyticsOptIn(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#603A46]"></div>
                </label>
              </div>

              {/* Marketing Cookies */}
              <div className="p-3.5 bg-[#F8F4EE] rounded border border-[#E8DFD5] flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <span className="text-xs font-semibold text-[#211B1C] uppercase tracking-wider">
                    Marketing & Personalization
                  </span>
                  <p className="text-[11px] text-[#766D6D]">
                    Allows tailored recommendations for matching jewellery sets and festive campaign previews.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#603A46]"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8DFD5] flex items-center justify-between gap-2">
              <button
                onClick={handleRejectOptional}
                className="text-xs text-[#766D6D] hover:text-[#211B1C] font-semibold uppercase tracking-wider"
              >
                Reject All Optional
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveCustom}
                  className="px-4 py-2 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors shadow-xs"
                >
                  Save My Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
