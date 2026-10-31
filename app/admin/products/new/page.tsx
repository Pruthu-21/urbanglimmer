'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Sparkles,
  Save,
  Layers,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { addProductToStore } from '@/lib/productStore';

export default function AdminNewProductPage() {
  const router = useRouter();

  // Basic Information
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Earrings');
  const [price, setPrice] = useState(1499);
  const [oldPrice, setOldPrice] = useState<number | undefined>(1899);
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState(25);
  const [badge, setBadge] = useState('NEW ARRIVAL');
  const [badgeType, setBadgeType] = useState<'bestseller' | 'wine' | 'light'>('wine');

  // Specs & Narrative
  const [color, setColor] = useState('18k Gold Vermeil');
  const [material, setMaterial] = useState('Thick 18k gold over recycled 925 sterling silver');
  const [dimensions, setDimensions] = useState('24mm diameter');
  const [weight, setWeight] = useState('3.4g');
  const [hallmark, setHallmark] = useState('BIS 925 Hallmarked');
  const [description, setDescription] = useState('Hand-finished luxury piece designed for effortless daily radiance and festive celebration.');

  // Image and Model Assets
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('photo-1630019852942-f89202989a59');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [modelUrl, setModelUrl] = useState<string>('/models/jewelry/earrings.glb');
  const [modelType, setModelType] = useState<'procedural' | 'polycam'>('procedural');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);

    setIsUploadingImage(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.success && json.url) {
        setImagePreview(json.url);
      }
    } catch (err) {
      console.warn('Image upload error:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const created = addProductToStore({
      name,
      category,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      sku: sku || undefined,
      stock: Number(stock),
      badge: badge || undefined,
      badgeType,
      color,
      material,
      dimensions,
      weight,
      hallmark,
      description,
      image: imagePreview,
      lifestyleImage: imagePreview,
      modelUrl: modelUrl || undefined,
      modelType,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
    });

    setToast(`Product "${created.name}" created! Redirecting...`);
    setTimeout(() => {
      router.push('/admin/products');
    }, 1000);
  };

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
            Create New Jewellery Piece
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Details Card */}
        <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 shadow-xs">
          <h2 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
            1. Core Identity & Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Piece Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Chandani Baroque Pearl Drops"
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs focus:outline-[#603A46]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs focus:outline-[#603A46]"
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
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Selling Price (INR) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono focus:outline-[#603A46]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                MRP / Old Price (INR)
              </label>
              <input
                type="number"
                value={oldPrice || ''}
                onChange={(e) => setOldPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono focus:outline-[#603A46]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                SKU Identifier
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="UG-EAR-009"
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono focus:outline-[#603A46]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Inventory Units *
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono focus:outline-[#603A46]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="FESTIVE EDIT / BESTSELLER / NEW ARRIVAL"
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs focus:outline-[#603A46]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Badge Color Style
              </label>
              <select
                value={badgeType}
                onChange={(e: any) => setBadgeType(e.target.value)}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs focus:outline-[#603A46]"
              >
                <option value="wine">Festive Wine (#852F3A)</option>
                <option value="bestseller">Champagne Gold (#C6A064)</option>
                <option value="light">Warm Ivory (#F8F4EE)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Craftsmanship Specs */}
        <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 shadow-xs">
          <h2 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
            2. Craftsmanship & Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Gold Finish & Color
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Dimensions / Sizing
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Weight (grams)
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
              Material Composition
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
              Editorial Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
            />
          </div>
        </div>

        {/* Media & 3D Model Attachment */}
        <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 shadow-xs">
          <h2 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
            3. Media Assets & 3D Studio Association
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                Upload Product Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="text-xs text-[#766D6D]"
              />
              {isUploadingImage && <p className="text-[11px] text-[#C6A064] mt-1">Uploading...</p>}
              <div className="mt-2 w-24 h-28 bg-[#F8F4EE] rounded border border-[#E8DFD5] overflow-hidden">
                <img
                  src={imagePreview.startsWith('http') || imagePreview.startsWith('/') ? imagePreview : `https://images.unsplash.com/${imagePreview}?auto=format&fit=crop&w=200`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  Optional GLB / 3D Asset URL
                </label>
                <input
                  type="text"
                  value={modelUrl}
                  onChange={(e) => setModelUrl(e.target.value)}
                  placeholder="/models/jewelry/earrings.glb"
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                  3D Studio Rendering Pipeline
                </label>
                <select
                  value={modelType}
                  onChange={(e: any) => setModelType(e.target.value)}
                  className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2 text-xs"
                >
                  <option value="procedural">Procedural Jewelry Shading</option>
                  <option value="polycam">Polycam / Custom GLB Model</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DFD5]">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 bg-white border border-[#E8DFD5] text-[#766D6D] text-xs uppercase font-semibold rounded hover:bg-[#F8F4EE]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2 shadow-md transition-colors"
          >
            <Save className="w-4 h-4 text-[#C6A064]" />
            <span>Publish To Live Catalogue</span>
          </button>
        </div>
      </form>
    </div>
  );
}
