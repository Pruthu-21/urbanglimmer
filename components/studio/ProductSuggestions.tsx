'use client';

import React from 'react';
import {
  Product,
  getSameCategorySuggestions,
  getDifferentCategorySuggestions,
} from '@/lib/productStore';
import { Sparkles, ArrowRight, Plus } from 'lucide-react';

interface ProductSuggestionsProps {
  currentProduct: Product;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductSuggestions({
  currentProduct,
  allProducts,
  onSelectProduct,
  onAddToCart,
}: ProductSuggestionsProps) {
  const sameCategory = getSameCategorySuggestions(currentProduct, allProducts, 4);
  const differentCategory = getDifferentCategorySuggestions(currentProduct, allProducts, 4);

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const getImgUrl = (src: string) => {
    if (!src) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80';
    if (src.startsWith('http') || src.startsWith('/') || src.startsWith('blob:')) return src;
    return `https://images.unsplash.com/${src}?auto=format&fit=crop&w=400&q=80`;
  };

  return (
    <div className="suggestions-container">
      {/* 1. SAME CATEGORY SUGGESTIONS (3-4 items) */}
      {sameCategory.length > 0 && (
        <section className="mb-8">
          <div className="suggestions-header">
            <span className="text-[10px] uppercase tracking-widest text-[#C6A064] font-bold flex items-center gap-1.5">
              <Sparkles size={12} /> EXPLORE THE EDIT
            </span>
            <h3>
              More From The <em>{currentProduct.category}</em> Collection
            </h3>
            <p>Complementary silhouettes handcrafted in matching finishes.</p>
          </div>

          <div className="suggestions-scroll">
            {sameCategory.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="suggestion-card group"
              >
                <div className="suggestion-thumb">
                  <img src={getImgUrl(prod.image)} alt={prod.name} />
                  {prod.badge && (
                    <span className="absolute top-2 left-2 text-[8px] uppercase tracking-wider font-bold bg-[#852F3A] text-white px-1.5 py-0.5 rounded">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <div className="suggestion-info">
                  <span className="suggestion-cat">{prod.category}</span>
                  <h4 className="suggestion-name group-hover:text-[#603A46] transition-colors">
                    {prod.name}
                  </h4>
                  <div className="suggestion-bottom">
                    <span className="suggestion-price">{money(prod.price)}</span>
                    <span className="text-[10px] text-[#C6A064] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      View <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. DIFFERENT CATEGORY SUGGESTIONS (3-4 items to complete the look) */}
      {differentCategory.length > 0 && (
        <section>
          <div className="suggestions-header">
            <span className="text-[10px] uppercase tracking-widest text-[#852F3A] font-bold flex items-center gap-1.5">
              <Sparkles size={12} /> COMPLETE THE LOOK
            </span>
            <h3>
              Curated <em>Pairings</em>
            </h3>
            <p>Designed to be stacked, layered, and worn together effortlessly.</p>
          </div>

          <div className="suggestions-scroll">
            {differentCategory.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="suggestion-card group"
              >
                <div className="suggestion-thumb">
                  <img src={getImgUrl(prod.image)} alt={prod.name} />
                  <span className="absolute top-2 left-2 text-[8px] uppercase tracking-wider font-bold bg-[#603A46] text-[#F7F0E6] px-1.5 py-0.5 rounded">
                    {prod.category}
                  </span>
                </div>
                <div className="suggestion-info">
                  <span className="suggestion-cat">{prod.color}</span>
                  <h4 className="suggestion-name group-hover:text-[#603A46] transition-colors">
                    {prod.name}
                  </h4>
                  <div className="suggestion-bottom">
                    <span className="suggestion-price">{money(prod.price)}</span>
                    {onAddToCart ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(prod);
                        }}
                        className="suggestion-add-btn flex items-center gap-1"
                        title="Quick add to bag"
                      >
                        <Plus size={11} /> Bag
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#603A46] font-semibold flex items-center gap-0.5">
                        View <ArrowRight size={10} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
