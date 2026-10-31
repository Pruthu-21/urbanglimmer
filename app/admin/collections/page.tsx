'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layers, Plus, Trash2, ExternalLink, Sparkles } from 'lucide-react';

const INITIAL_COLLECTIONS = [
  { id: 1, title: 'Festive Radiance', slug: 'festive-radiance', count: 6, status: 'Active', season: 'Autumn / Diwali 2026' },
  { id: 2, title: 'Everyday Elegance', slug: 'everyday-elegance', count: 8, status: 'Active', season: 'Permanent Core' },
  { id: 3, title: 'Royal Wedding Trousseau', slug: 'wedding-collection', count: 5, status: 'Active', season: 'Winter 2026 / Bridal' },
  { id: 4, title: 'Statement Pieces', slug: 'statement-pieces', count: 4, status: 'Active', season: 'High Glamour' },
  { id: 5, title: 'Modern Gold', slug: 'modern-gold', count: 6, status: 'Active', season: 'Architectural Minimal' },
  { id: 6, title: 'Gifts That Sparkle', slug: 'gifts-that-sparkle', count: 4, status: 'Active', season: 'All Seasons' },
];

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [season, setSeason] = useState('Festive 2026');
  const [toast, setToast] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCol = {
      id: Date.now(),
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      count: 0,
      status: 'Active',
      season,
    };

    setCollections((prev) => [...prev, newCol]);
    setShowAdd(false);
    setTitle('');
    setToast(`Collection "${newCol.title}" created.`);
    setTimeout(() => setToast(''), 2500);
  };

  const handleDelete = (id: number) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    setToast('Collection removed.');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#852F3A] block mb-0.5">
            EDITORIAL CURATIONS
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#211B1C] tracking-tight">
            Curated Collections ({collections.length})
          </h1>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C6A064]" />
          <span>New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white p-5 rounded border border-[#E8DFD5] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-[#C6A064] tracking-wider">
                  {col.season}
                </span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  {col.status}
                </span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#211B1C]">{col.title}</h3>
              <p className="text-xs text-[#766D6D] mt-0.5">Slug: /{col.slug}</p>
            </div>

            <div className="pt-3 border-t border-[#E8DFD5] flex items-center justify-between text-xs">
              <Link
                href={`/collections/${col.slug}`}
                target="_blank"
                className="text-[#603A46] hover:underline font-semibold flex items-center gap-1"
              >
                <span>View Live</span>
                <ExternalLink className="w-3 h-3 text-[#766D6D]" />
              </Link>
              <button
                onClick={() => handleDelete(col.id)}
                className="text-red-700 hover:text-red-900 p-1"
                aria-label="Delete collection"
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
            <h3 className="font-serif text-xl font-medium text-[#603A46]">Add New Collection</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Collection Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Navratri Solara Set"
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Season / Campaign Tag
                </label>
                <input
                  type="text"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
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
                  Create Collection
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
