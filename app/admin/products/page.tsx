'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  Product,
  getStoredProducts,
  deleteProductFromStore,
  updateProductInStore,
} from '@/lib/productStore';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const loadData = () => {
    setProducts(getStoredProducts());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('urban_glimmer_catalog_updated', loadData);
    return () => window.removeEventListener('urban_glimmer_catalog_updated', loadData);
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const getImg = (id: string) => {
    if (!id) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80';
    if (id.startsWith('http') || id.startsWith('/')) return id;
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=150&q=80`;
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, search, categoryFilter]);

  const handleDelete = (id: number) => {
    deleteProductFromStore(id);
    setDeleteConfirmId(null);
    notify('Product removed from catalog');
  };

  const toggleFeatured = (p: Product) => {
    updateProductInStore(p.id, { isFeatured: !p.isFeatured });
    notify(`Updated featured status for ${p.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#852F3A] block mb-0.5">
            PRODUCT CATALOGUE REPOSITORY
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#211B1C] tracking-tight">
            Jewellery Products ({products.length})
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C6A064]" />
          <span>Add New Jewellery Piece</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded border border-[#E8DFD5] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#766D6D] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, SKU, or metal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded pl-9 pr-3 py-2 text-xs focus:outline-[#603A46]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[#766D6D] font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-semibold focus:outline-[#603A46]"
          >
            <option value="All">All Categories</option>
            <option value="Earrings">Earrings</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Rings">Rings</option>
            <option value="Bracelets">Bracelets</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded border border-[#E8DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8F4EE] border-b border-[#E8DFD5] text-[#766D6D] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Piece Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">SKU / Stock</th>
                <th className="py-3 px-4">3D Asset</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD5]">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-[#F8F4EE]/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImg(product.image)}
                        alt={product.name}
                        className="w-12 h-14 object-cover rounded border border-[#E8DFD5] bg-[#F8F4EE]"
                      />
                      <div>
                        <Link
                          href={`/products/${product.id}`}
                          target="_blank"
                          className="font-serif font-medium text-sm text-[#211B1C] hover:text-[#852F3A] flex items-center gap-1"
                        >
                          <span>{product.name}</span>
                          <ExternalLink className="w-3 h-3 text-[#766D6D]" />
                        </Link>
                        <span className="text-[11px] text-[#766D6D] block">{product.color}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#211B1C]">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 font-serif font-bold text-sm text-[#603A46]">
                    {money(product.price)}
                    {product.oldPrice && (
                      <span className="block text-[10px] text-[#766D6D] line-through font-sans">
                        {money(product.oldPrice)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] font-bold text-[#603A46] block">
                      {product.sku || `UG-00${product.id}`}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        (product.stock ?? 20) <= 5 ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {product.stock ?? 20} units in stock
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {product.modelUrl ? (
                      <span className="text-[10px] bg-[#603A46]/10 text-[#603A46] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                        <Layers className="w-3 h-3 text-[#C6A064]" />
                        <span>3D Enabled</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#766D6D]">Photo Only</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded transition-colors ${
                        product.isFeatured
                          ? 'bg-[#C6A064]/20 text-[#603A46] border border-[#C6A064]'
                          : 'bg-gray-100 text-[#766D6D]'
                      }`}
                    >
                      {product.isFeatured ? '★ Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 text-[#603A46] hover:bg-[#F8F4EE] rounded transition-colors"
                        title="Edit piece"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="p-1.5 text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete piece"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full space-y-4 text-xs">
            <h3 className="font-serif text-lg font-medium text-[#603A46]">Delete Product?</h3>
            <p className="text-[#766D6D]">
              Are you sure you want to delete this piece from the catalog? This will remove it from storefront discovery and 3D studio.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-gray-100 text-[#211B1C] rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-700 text-white rounded font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211B1C] text-white border border-[#C6A064] text-xs px-4 py-2.5 rounded shadow-xl flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A064]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
