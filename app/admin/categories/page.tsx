'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FolderTree, Plus, Edit2, Trash2, Sparkles, Check } from 'lucide-react';

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Earrings', slug: 'earrings', description: 'Sculpted hoops, baroque drops, and minimalist studs.', count: 14, image: 'photo-1630019852942-f89202989a59' },
  { id: 2, name: 'Necklaces', slug: 'necklaces', description: 'Layered chains, radial sunburst medallions, and chokers.', count: 12, image: 'photo-1599643478518-a784e5dc4c8f' },
  { id: 3, name: 'Rings', slug: 'rings', description: 'Signet bands, pavé stacking duos, and cocktail statement pieces.', count: 18, image: 'photo-1605100804763-247f67b3557e' },
  { id: 4, name: 'Bracelets & Bangles', slug: 'bracelets', description: 'Architectural ribbed cuffs and Italian micro box chains.', count: 9, image: 'photo-1611591437281-460bfbe1220a' },
  { id: 5, name: 'Pendants', slug: 'pendants', description: 'Heirloom talisman charms in 18k gold vermeil.', count: 7, image: 'photo-1611652022419-a9419f74343d' },
  { id: 6, name: 'Jewellery Sets', slug: 'sets', description: 'Curated earring and necklace pairings for festive gifting.', count: 5, image: 'photo-1573408301185-9146fe634ad0' },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat = {
      id: Date.now(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || 'New curated category.',
      count: 0,
      image: 'photo-1605100804763-247f67b3557e',
    };

    setCategories((prev) => [...prev, newCat]);
    setShowAddModal(false);
    setName('');
    setDescription('');
    setToast(`Category "${newCat.name}" added successfully!`);
    setTimeout(() => setToast(''), 2500);
  };

  const handleDelete = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setToast('Category removed.');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#852F3A] block mb-0.5">
            TAXONOMY ARCHITECTURE
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#211B1C] tracking-tight">
            Categories Management ({categories.length})
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C6A064]" />
          <span>Create New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-5 rounded border border-[#E8DFD5] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C6A064] font-bold">
                  Slug: /{cat.slug}
                </span>
                <span className="text-[10px] bg-[#F8F4EE] px-2 py-0.5 rounded font-semibold text-[#766D6D]">
                  {cat.count} Pieces
                </span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#211B1C]">{cat.name}</h3>
              <p className="text-xs text-[#766D6D] mt-1 leading-relaxed">{cat.description}</p>
            </div>

            <div className="pt-3 border-t border-[#E8DFD5] flex items-center justify-between text-xs">
              <Link
                href={`/shop/${cat.slug}`}
                target="_blank"
                className="text-[#603A46] hover:underline font-semibold"
              >
                View on Storefront →
              </Link>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-700 hover:text-red-900 p-1"
                aria-label="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white p-6 rounded shadow-xl max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif text-xl font-medium text-[#603A46]">Add New Category</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bangles & Kadas"
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Editorial brief for this category..."
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 text-[#211B1C] rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#603A46] text-white rounded font-semibold uppercase tracking-wider"
                >
                  Create Category
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
