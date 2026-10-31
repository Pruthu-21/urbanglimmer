'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { Product, getStoredProducts } from '@/lib/productStore';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      setProducts(getStoredProducts());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = ['All', 'Earrings', 'Necklaces', 'Rings', 'Bracelets'];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, selectedCategory]);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const getImg = (id: string) => {
    if (!id) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80';
    if (id.startsWith('http') || id.startsWith('/')) return id;
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=300&q=80`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Search Sheet */}
      <div className="relative w-full max-w-4xl mx-auto bg-[#F8F4EE] shadow-2xl rounded-b-lg z-10 p-5 sm:p-8 animate-in slide-in-from-top-4 duration-300 max-h-[85vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b-2 border-[#603A46] pb-3">
          <Search className="w-6 h-6 text-[#603A46]" />
          <input
            type="text"
            autoFocus
            placeholder="Search by jewellery piece, gemstone, metal, or festive occasion..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-lg sm:text-xl font-serif text-[#211B1C] placeholder:font-sans placeholder:text-sm placeholder:text-[#766D6D] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#766D6D] hover:text-[#211B1C] uppercase font-bold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-[#766D6D] hover:text-[#211B1C] ml-2"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 pt-4 pb-3 overflow-x-auto text-xs">
          <span className="text-[#766D6D] font-medium mr-1 uppercase text-[10px] tracking-wider">
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full uppercase text-[10px] tracking-wider font-semibold transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#603A46] text-[#F8F4EE]'
                  : 'bg-white border border-[#E8DFD5] text-[#766D6D] hover:text-[#211B1C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-[11px] text-[#766D6D] py-1">
          Found {filtered.length} piece{filtered.length === 1 ? '' : 's'}
        </div>

        {/* Results List / Grid */}
        <div className="flex-1 overflow-y-auto mt-2 space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#766D6D]">
              No pieces match your search query &ldquo;{query}&rdquo;.
              <div className="mt-3 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory('All');
                  }}
                  className="text-[#852F3A] underline font-semibold"
                >
                  Reset search filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="flex gap-3 p-3 bg-white border border-[#E8DFD5] rounded hover:border-[#603A46] transition-all group"
                >
                  <div className="w-16 h-20 bg-[#F8F4EE] rounded overflow-hidden shrink-0 border border-[#E8DFD5]">
                    <img
                      src={getImg(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C6A064] font-semibold block">
                        {product.category}
                      </span>
                      <h4 className="font-serif text-sm text-[#211B1C] group-hover:text-[#852F3A] font-medium truncate">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-[#766D6D] line-clamp-1">{product.material}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-[#603A46]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-[10px] text-[#852F3A] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        View <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
