'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, Copy, Check, ArrowRight, Gift } from 'lucide-react';
import { getStoredFestiveModal, FestiveModalConfig } from '@/lib/campaignStore';

export default function FestiveModal() {
  const [config, setConfig] = useState<FestiveModalConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('ug_festive_modal_dismissed');
    if (isDismissed) return;

    const data = getStoredFestiveModal();
    setConfig(data);

    if (data && data.isEnabled) {
      // Show after 3 seconds of browsing
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('ug_festive_modal_dismissed', 'true');
  };

  const handleCopyCode = () => {
    if (!config?.discountCode) return;
    navigator.clipboard.writeText(config.discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !config || !config.isEnabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#211C1D] text-[#F8F4EE] rounded-sm border border-[#C6A064]/40 shadow-2xl p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-300 text-center">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-[#F8F4EE]/60 hover:text-white transition-colors"
          aria-label="Close festive offer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-full bg-[#603A46] text-[#C6A064] flex items-center justify-center mb-4 border border-[#C6A064]/30">
          <Sparkles className="w-6 h-6" />
        </div>

        <span className="text-[10px] tracking-[0.25em] uppercase text-[#C6A064] font-semibold block mb-1">
          Autumn & Festive Privilege
        </span>

        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#F8F4EE] leading-tight mb-2">
          {config.title}
        </h3>

        <p className="text-xs text-[#E8DFD5]/80 leading-relaxed mb-6 max-w-sm mx-auto">
          {config.subtitle}
        </p>

        {/* Promo code badge with copy */}
        <div className="bg-[#151313] border border-[#C6A064]/30 rounded p-3 mb-4 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-wider text-[#766D6D] block">
              Exclusive Privilege Code
            </span>
            <span className="font-mono text-base font-bold text-[#C6A064] tracking-wider">
              {config.discountCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs rounded transition-colors uppercase font-semibold text-[11px]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-[#C6A064] font-medium mb-6">
          {config.minOrderText}
        </p>

        <Link
          href={config.ctaLink || '/shop'}
          onClick={handleClose}
          className="w-full py-3.5 px-6 bg-[#603A46] hover:bg-[#852F3A] text-white font-semibold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <span>{config.ctaText || 'Explore Festive Catalogue'}</span>
          <ArrowRight className="w-4 h-4 text-[#C6A064]" />
        </Link>
      </div>
    </div>
  );
}
