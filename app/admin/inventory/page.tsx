'use client';

import { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react';
import {
  Product,
  getStoredProducts,
  adjustProductStock,
  updateProductInStore,
} from '@/lib/productStore';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out'>('all');
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

  const handleAdjust = (productId: number, delta: number) => {
    adjustProductStock(productId, delta);
    notify(`Inventory adjusted by ${delta > 0 ? `+${delta}` : delta} units`);
  };

  const filtered = products.filter((p) => {
    const stock = p.stock ?? 20;
    if (filterStatus === 'low' && (stock > 5 || stock === 0)) return false;
    if (filterStatus === 'out' && stock > 0) return false;
    const q = search.toLowerCase().trim();
    return !q || p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#852F3A] block mb-0.5">
            STOCK CONTROL & INVENTORY TRACKING
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#211B1C] tracking-tight">
            Inventory Management
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded uppercase font-bold text-[10px] tracking-wider ${
              filterStatus === 'all' ? 'bg-[#603A46] text-white' : 'bg-white border border-[#E8DFD5] text-[#766D6D]'
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setFilterStatus('low')}
            className={`px-3 py-1.5 rounded uppercase font-bold text-[10px] tracking-wider ${
              filterStatus === 'low' ? 'bg-amber-600 text-white' : 'bg-white border border-[#E8DFD5] text-[#766D6D]'
            }`}
          >
            Low Stock (&le;5)
          </button>
          <button
            onClick={() => setFilterStatus('out')}
            className={`px-3 py-1.5 rounded uppercase font-bold text-[10px] tracking-wider ${
              filterStatus === 'out' ? 'bg-red-700 text-white' : 'bg-white border border-[#E8DFD5] text-[#766D6D]'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded border border-[#E8DFD5] flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-[#766D6D] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search SKU or jewellery title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded pl-9 pr-3 py-2 text-xs focus:outline-[#603A46]"
          />
        </div>
        <span className="text-xs text-[#766D6D]">
          {filtered.length} SKUs listed
        </span>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded border border-[#E8DFD5] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#F8F4EE] border-b border-[#E8DFD5] text-[#766D6D] uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">SKU / Piece</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD5]">
            {filtered.map((product) => {
              const currentStock = product.stock ?? 20;
              const isLow = currentStock > 0 && currentStock <= 5;
              const isOut = currentStock === 0;

              return (
                <tr key={product.id} className="hover:bg-[#F8F4EE]/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] font-bold text-[#603A46] block">
                      {product.sku || `UG-00${product.id}`}
                    </span>
                    <strong className="font-serif text-sm text-[#211B1C]">{product.name}</strong>
                  </td>
                  <td className="py-3 px-4 text-[#766D6D]">{product.category}</td>
                  <td className="py-3 px-4 font-mono font-bold text-sm text-[#211B1C]">
                    {currentStock} units
                  </td>
                  <td className="py-3 px-4">
                    {isOut ? (
                      <span className="text-[10px] uppercase font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Healthy Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAdjust(product.id, -5)}
                        className="px-2 py-1 bg-[#F8F4EE] hover:bg-[#603A46] hover:text-white border border-[#E8DFD5] rounded text-[10px] font-mono font-bold"
                        title="Deduct 5 units"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleAdjust(product.id, -1)}
                        className="px-2 py-1 bg-[#F8F4EE] hover:bg-[#603A46] hover:text-white border border-[#E8DFD5] rounded text-[10px] font-mono font-bold"
                        title="Deduct 1 unit"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleAdjust(product.id, 1)}
                        className="px-2 py-1 bg-[#F8F4EE] hover:bg-[#603A46] hover:text-white border border-[#E8DFD5] rounded text-[10px] font-mono font-bold"
                        title="Add 1 unit"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleAdjust(product.id, 5)}
                        className="px-2 py-1 bg-[#F8F4EE] hover:bg-[#603A46] hover:text-white border border-[#E8DFD5] rounded text-[10px] font-mono font-bold"
                        title="Add 5 units"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211C1D] text-white border border-[#C6A064] text-xs px-4 py-2.5 rounded shadow-xl flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A064]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
