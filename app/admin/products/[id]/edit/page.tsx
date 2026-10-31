'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sparkles, Layers } from 'lucide-react';
import { getStoredProducts, updateProductInStore, Product } from '@/lib/productStore';

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [product, setProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Earrings');
  const [price, setPrice] = useState(0);
  const [oldPrice, setOldPrice] = useState<number | undefined>();
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState(0);
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const list = getStoredProducts();
    const found = list.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setName(found.name);
      setCategory(found.category);
      setPrice(found.price);
      setOldPrice(found.oldPrice);
      setSku(found.sku || '');
      setStock(found.stock ?? 20);
      setColor(found.color);
      setMaterial(found.material);
      setDimensions(found.dimensions);
      setDescription(found.description);
      setBadge(found.badge || '');
    }
  }, [id]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    updateProductInStore(product.id, {
      name,
      category,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      sku: sku || undefined,
      stock: Number(stock),
      color,
      material,
      dimensions,
      description,
      badge: badge || undefined,
    });

    setToast('Product updated successfully!');
    setTimeout(() => {
      router.push('/admin/products');
    }, 1000);
  };

  if (!product) {
    return (
      <div className="p-12 text-center text-xs text-[#766D6D]">
        Loading product #{id}...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-[#E8DFD5] pb-4 flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="text-[11px] uppercase tracking-wider text-[#766D6D] hover:text-[#603A46] flex items-center gap-1 mb-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="font-serif text-3xl font-medium text-[#211B1C]">
            Edit Piece: {product.name}
          </h1>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="bg-white p-6 rounded border border-[#E8DFD5] space-y-6 text-xs shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Piece Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            >
              <option value="Earrings">Earrings</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Rings">Rings</option>
              <option value="Bracelets">Bracelets</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Selling Price (INR)</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Old Price (INR)</label>
            <input
              type="number"
              value={oldPrice || ''}
              onChange={(e) => setOldPrice(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Stock Level</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Color / Finish</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Dimensions</label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Badge</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Material</label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DFD5]">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 bg-white border border-[#E8DFD5] text-[#766D6D] uppercase font-semibold rounded text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white uppercase tracking-wider font-bold rounded text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#C6A064]" />
            <span>Save Product Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
