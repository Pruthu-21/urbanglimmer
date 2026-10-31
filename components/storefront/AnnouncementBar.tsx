'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { getStoredAnnouncement, AnnouncementConfig } from '@/lib/campaignStore';

export default function AnnouncementBar() {
  const [config, setConfig] = useState<AnnouncementConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const load = () => {
      const data = getStoredAnnouncement();
      setConfig(data);
    };
    load();

    const handleUpdate = () => load();
    window.addEventListener('ug_campaigns_updated', handleUpdate);
    return () => window.removeEventListener('ug_campaigns_updated', handleUpdate);
  }, []);

  if (!config || !config.isEnabled || dismissed) {
    return null;
  }

  return (
    <aside aria-label="Store announcement" className="relative z-50 bg-[#603A46] text-[#F8F4EE] border-b border-[#852F3A]/40 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left spacer for balance on desktop */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#C6A064] font-medium">
          <Sparkles className="w-3 h-3 text-[#C6A064]" />
          <span>Atelier Jaipure & Mumbai</span>
        </div>

        {/* Center message */}
        <div className="flex-1 text-center flex items-center justify-center flex-wrap gap-x-3 gap-y-1 text-xs">
          <span className="font-medium tracking-wide">{config.text}</span>
          {config.highlightText && (
            <span className="hidden sm:inline-block text-[#C6A064] font-semibold text-[11px] tracking-wider uppercase">
              · {config.highlightText}
            </span>
          )}
          {config.linkText && config.linkUrl && (
            <Link
              href={config.linkUrl}
              className="inline-flex items-center gap-1 text-[#C6A064] hover:text-white underline underline-offset-4 font-medium transition-colors ml-1"
            >
              <span>{config.linkText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Right close button */}
        <button
          onClick={() => setDismissed(true)}
          className="text-[#F8F4EE]/70 hover:text-white transition-colors p-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
