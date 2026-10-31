'use client';

import { useState, useEffect } from 'react';
import {
  Megaphone,
  Sparkles,
  Save,
  Check,
  Eye,
  Sliders,
  Layers,
} from 'lucide-react';
import {
  getStoredAnnouncement,
  saveStoredAnnouncement,
  getStoredHeroConfig,
  saveStoredHeroConfig,
  getStoredFestiveModal,
  saveStoredFestiveModal,
  AnnouncementConfig,
  HeroCampaignConfig,
  FestiveModalConfig,
} from '@/lib/campaignStore';

export default function AdminCampaignsPage() {
  const [announcement, setAnnouncement] = useState<AnnouncementConfig | null>(null);
  const [hero, setHero] = useState<HeroCampaignConfig | null>(null);
  const [modal, setModal] = useState<FestiveModalConfig | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setAnnouncement(getStoredAnnouncement());
    setHero(getStoredHeroConfig());
    setModal(getStoredFestiveModal());
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement) return;
    saveStoredAnnouncement(announcement);
    notify('Announcement bar settings published!');
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;
    saveStoredHeroConfig(hero);
    notify('Hero campaign copy published to homepage!');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    saveStoredFestiveModal(modal);
    notify('Festive privilege modal settings updated!');
  };

  if (!announcement || !hero || !modal) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-[#E8DFD5] pb-4">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#852F3A] block mb-0.5">
          SEASONAL MARKETING & PROMOTIONS
        </span>
        <h1 className="font-serif text-3xl font-medium text-[#211B1C] tracking-tight">
          Campaign & Banner Management
        </h1>
        <p className="text-xs text-[#766D6D] mt-1">
          Replace seasonal Diwali, Navratri, or Wedding campaigns instantly without altering source code.
        </p>
      </div>

      {/* 1. Announcement Bar Manager */}
      <form onSubmit={handleSaveAnnouncement} className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 shadow-xs text-xs">
        <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#603A46]">1. Top Announcement Bar</h2>
            <span className="text-[11px] text-[#766D6D]">Slim banner visible across all storefront pages</span>
          </div>
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={announcement.isEnabled}
              onChange={(e) => setAnnouncement({ ...announcement, isEnabled: e.target.checked })}
              className="accent-[#603A46]"
            />
            <span>Enabled</span>
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
              Primary Announcement Text
            </label>
            <input
              type="text"
              required
              value={announcement.text}
              onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Highlight Subtext
              </label>
              <input
                type="text"
                value={announcement.highlightText || ''}
                onChange={(e) => setAnnouncement({ ...announcement, highlightText: e.target.value })}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Link CTA Text
              </label>
              <input
                type="text"
                value={announcement.linkText || ''}
                onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Destination URL
              </label>
              <input
                type="text"
                value={announcement.linkUrl || ''}
                onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-[#603A46] hover:bg-[#852F3A] text-white uppercase tracking-wider font-bold rounded text-xs transition-colors"
          >
            Save Announcement Bar
          </button>
        </div>
      </form>

      {/* 2. Homepage Hero Editorial Copy Manager */}
      <form onSubmit={handleSaveHero} className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 shadow-xs text-xs">
        <div className="border-b border-[#E8DFD5] pb-3">
          <h2 className="font-serif text-xl font-medium text-[#603A46]">2. Editorial Hero Narrative</h2>
          <span className="text-[11px] text-[#766D6D]">Headlines and CTAs displayed in the dark luxury hero</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
              Campaign Eyebrow Badge
            </label>
            <input
              type="text"
              value={hero.eyebrow}
              onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
              Hero Major Headline
            </label>
            <input
              type="text"
              required
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-serif text-base"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
              Subordinate Description
            </label>
            <textarea
              rows={2}
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Primary CTA Text
              </label>
              <input
                type="text"
                value={hero.primaryCtaText}
                onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Secondary CTA Text (3D Studio)
              </label>
              <input
                type="text"
                value={hero.secondaryCtaText}
                onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-[#603A46] hover:bg-[#852F3A] text-white uppercase tracking-wider font-bold rounded text-xs transition-colors"
          >
            Save Hero Copy
          </button>
        </div>
      </form>

      {/* 3. Festive Privilege Modal Settings */}
      <form onSubmit={handleSaveModal} className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 shadow-xs text-xs">
        <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#603A46]">3. Festive Promotional Popup Modal</h2>
            <span className="text-[11px] text-[#766D6D]">Session popup offering seasonal discount codes</span>
          </div>
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={modal.isEnabled}
              onChange={(e) => setModal({ ...modal, isEnabled: e.target.checked })}
              className="accent-[#603A46]"
            />
            <span>Enabled</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
              Modal Heading
            </label>
            <input
              type="text"
              required
              value={modal.title}
              onChange={(e) => setModal({ ...modal, title: e.target.value })}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
              Discount Promo Code
            </label>
            <input
              type="text"
              required
              value={modal.discountCode}
              onChange={(e) => setModal({ ...modal, discountCode: e.target.value })}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
            Modal Subtitle
          </label>
          <input
            type="text"
            value={modal.subtitle}
            onChange={(e) => setModal({ ...modal, subtitle: e.target.value })}
            className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-[#603A46] hover:bg-[#852F3A] text-white uppercase tracking-wider font-bold rounded text-xs transition-colors"
          >
            Save Modal Settings
          </button>
        </div>
      </form>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211C1D] text-white border border-[#C6A064] text-xs px-4 py-2.5 rounded shadow-xl flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A064]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
