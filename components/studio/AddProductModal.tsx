'use client';

import { useState, useRef } from 'react';
import { X, Plus, Sparkles, Image as ImageIcon, Box, Check, Upload, Smartphone, Loader2 } from 'lucide-react';
import { JewelryCategory, StudioProduct } from './types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: JewelryCategory;
  onAddProduct: (product: StudioProduct) => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  activeCategory,
  onAddProduct,
}: AddProductModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Earrings' | 'Necklaces' | 'Rings' | 'Bracelets'>(
    activeCategory === 'Full Model' ? 'Rings' : activeCategory
  );
  const [price, setPrice] = useState('2499');
  const [finish, setFinish] = useState('18k Gold Vermeil');
  const [description, setDescription] = useState('Polycam 3D scan digital twin handcrafted with high-polish luster.');

  // Image handling
  const [imageType, setImageType] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImageData, setUploadedImageData] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3D Model handling
  const [modelMode, setModelMode] = useState<'polycam' | 'procedural' | 'custom_url'>('polycam');
  const [proceduralMesh, setProceduralMesh] = useState('solstice_signet');
  const [customGlbUrl, setCustomGlbUrl] = useState('');
  const [uploadingGlb, setUploadingGlb] = useState(false);
  const [glbFileName, setGlbFileName] = useState<string | null>(null);
  const glbInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local data URL preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImageData(dataUrl);
    };
    reader.readAsDataURL(file);

    // Also attempt server upload to /public/images/products/
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
      }
    } catch {
      // Keep local dataUrl as fallback
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGlbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGlbFileName(file.name);
    setUploadingGlb(true);

    try {
      // 1. Upload to Next.js API route to save directly into /public/models/jewelry/
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-model', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        setCustomGlbUrl(data.url);
      } else {
        // Fallback: create object URL so it loads live in memory
        const blobUrl = URL.createObjectURL(file);
        setCustomGlbUrl(blobUrl);
      }
    } catch (err) {
      // Fallback: create object URL so it loads live in memory
      const blobUrl = URL.createObjectURL(file);
      setCustomGlbUrl(blobUrl);
    } finally {
      setUploadingGlb(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const chosenImage =
      imageUrl.trim() ||
      uploadedImageData ||
      'photo-1605100804763-247f67b3557e';

    const chosenModelUrl =
      modelMode === 'polycam' || modelMode === 'custom_url'
        ? customGlbUrl.trim() || undefined
        : undefined;

    const newProd: StudioProduct = {
      id: Date.now(),
      name: name.trim(),
      category,
      price: parseInt(price, 10) || 1999,
      image: chosenImage,
      finish: finish.trim() || '18k Yellow Gold',
      material: 'Handcrafted luxury materials',
      description: description.trim(),
      meshType: modelMode === 'procedural' ? proceduralMesh : 'custom',
      modelUrl: chosenModelUrl,
      badge: modelMode === 'polycam' ? 'POLYCAM 3D' : 'CUSTOM PIECE',
    };

    onAddProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl bg-[#120E11] border border-[#C6A064]/50 shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-[#F7F0E6] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2A2326] flex items-center justify-between bg-[#171215]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C6A064]/20 border border-[#C6A064]/50 flex items-center justify-center text-[#C6A064]">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider font-mono uppercase text-[#F7F0E6] flex items-center gap-1.5">
                <span>Add Product</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C6A064]/20 text-[#C6A064] font-sans font-bold">
                  POLYCAM READY
                </span>
              </h3>
              <p className="text-[11px] text-[#A3999B]">
                Upload your Polycam 3D scan (.glb) and try it on instantly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#2A2326] text-[#A3999B] hover:text-[#F7F0E6] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-[#A3999B]">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Polycam Scanned Heritage Ring"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A080A] border border-[#2D2427] focus:border-[#C6A064] text-xs font-mono text-[#F7F0E6] outline-none transition"
            />
          </div>

          {/* Category & Price Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-[#A3999B]">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as any;
                  setCategory(cat);
                  if (cat === 'Rings') setProceduralMesh('solstice_signet');
                  if (cat === 'Necklaces') setProceduralMesh('amara_layered');
                  if (cat === 'Earrings') setProceduralMesh('solara_hoops');
                  if (cat === 'Bracelets') setProceduralMesh('aurelia_cuff');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A080A] border border-[#2D2427] focus:border-[#C6A064] text-xs font-mono text-[#F7F0E6] outline-none transition"
              >
                <option value="Rings">Rings</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Earrings">Earrings</option>
                <option value="Bracelets">Wrist & Bracelets</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-[#A3999B]">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2499"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A080A] border border-[#2D2427] focus:border-[#C6A064] text-xs font-mono text-[#F7F0E6] outline-none transition"
              />
            </div>
          </div>

          {/* Section: 3D Model Source */}
          <div className="space-y-2 pt-2 border-t border-[#241D20]">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase text-[#C6A064] font-semibold flex items-center gap-1.5">
                <Box size={13} />
                <span>3D Representation</span>
              </label>

              <div className="flex gap-1 bg-[#1A1417] p-0.5 rounded-lg border border-[#2D2427]">
                <button
                  type="button"
                  onClick={() => setModelMode('polycam')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition flex items-center gap-1 ${
                    modelMode === 'polycam' ? 'bg-[#603A46] text-[#F7F0E6]' : 'text-[#8E8084]'
                  }`}
                >
                  <Smartphone size={11} />
                  <span>Polycam (.GLB)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModelMode('procedural')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition ${
                    modelMode === 'procedural' ? 'bg-[#603A46] text-[#F7F0E6]' : 'text-[#8E8084]'
                  }`}
                >
                  Built-in 3D
                </button>
                <button
                  type="button"
                  onClick={() => setModelMode('custom_url')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition ${
                    modelMode === 'custom_url' ? 'bg-[#603A46] text-[#F7F0E6]' : 'text-[#8E8084]'
                  }`}
                >
                  URL Path
                </button>
              </div>
            </div>

            {/* TAB: Polycam .GLB Upload */}
            {modelMode === 'polycam' && (
              <div className="space-y-2">
                <input
                  ref={glbInputRef}
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleGlbUpload}
                  className="hidden"
                />

                <div
                  onClick={() => glbInputRef.current?.click()}
                  className="w-full py-5 rounded-xl border border-dashed border-[#C6A064]/60 hover:border-[#C6A064] bg-[#0A080A] text-[#A3999B] hover:text-[#F7F0E6] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition group"
                >
                  {uploadingGlb ? (
                    <>
                      <Loader2 size={20} className="text-[#C6A064] animate-spin" />
                      <span className="text-xs font-mono text-[#C6A064]">
                        Uploading Polycam 3D scan to server...
                      </span>
                    </>
                  ) : customGlbUrl ? (
                    <>
                      <div className="w-7 h-7 rounded-full bg-[#1B3624] text-[#48BB78] flex items-center justify-center">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-mono text-[#9AE6B4] font-semibold">
                        {glbFileName || 'Polycam Scan Ready (.GLB)'}
                      </span>
                      <span className="text-[10px] text-[#A3999B]">Click to change 3D file</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} className="text-[#C6A064] group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-mono font-semibold text-[#F7F0E6]">
                        Upload Polycam Scan (.GLB / .GLTF)
                      </span>
                      <span className="text-[10px] text-[#A3999B]">
                        Exports from Polycam phone app load automatically
                      </span>
                    </>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-[#171215] border border-[#261E22] text-[10px] text-[#A3999B] flex items-start gap-2">
                  <Smartphone size={13} className="text-[#C6A064] shrink-0 mt-0.5" />
                  <span>
                    <strong>How to get .glb from Polycam:</strong> In Polycam, open your jewelry scan, tap <strong>Export</strong>, select <strong>glTF / GLB</strong>, and upload the saved file here.
                  </span>
                </div>
              </div>
            )}

            {/* TAB: Built-in Procedural 3D */}
            {modelMode === 'procedural' && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#A3999B]">Select 3D Mesh Template:</label>
                <select
                  value={proceduralMesh}
                  onChange={(e) => setProceduralMesh(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A080A] border border-[#2D2427] focus:border-[#C6A064] text-xs font-mono text-[#F7F0E6] outline-none transition"
                >
                  {category === 'Rings' && (
                    <>
                      <option value="solstice_signet">Sculpted Signet Face Ring (Gold)</option>
                      <option value="solitaire_diamond">Celestial Solitaire Diamond Ring</option>
                      <option value="elysia_stack">Elysia Stacking Duo Rings (Gold & Diamond)</option>
                    </>
                  )}
                  {category === 'Necklaces' && (
                    <>
                      <option value="amara_layered">Dual-Layered Chain with Pendant</option>
                      <option value="mira_sunburst">Fine Chain with Sunburst Coin</option>
                      <option value="tennis_choker">Pavé Diamond Tennis Choker</option>
                    </>
                  )}
                  {category === 'Earrings' && (
                    <>
                      <option value="solara_hoops">Sculpted Gold Hoops</option>
                      <option value="luna_pearls">Organic Baroque Pearl Drops</option>
                      <option value="kundan_jhumkas">Royal Filigree Dome Jhumkas</option>
                      <option value="emerald_studs">Emerald & Diamond Halo Studs</option>
                    </>
                  )}
                  {category === 'Bracelets' && (
                    <>
                      <option value="aurelia_cuff">Polished Ribbed Open Cuff</option>
                      <option value="afterglow_chain">Dainty Box Chain Bracelet with Tag</option>
                      <option value="verona_bangle">Twisted Rope Solid Bangle</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* TAB: Custom URL */}
            {modelMode === 'custom_url' && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#A3999B]">
                  Path to .GLB file (e.g. /models/jewelry/my_ring.glb):
                </label>
                <input
                  type="text"
                  value={customGlbUrl}
                  onChange={(e) => setCustomGlbUrl(e.target.value)}
                  placeholder="/models/jewelry/my_ring.glb"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A080A] border border-[#2D2427] focus:border-[#C6A064] text-xs font-mono text-[#F7F0E6] outline-none transition"
                />
              </div>
            )}
          </div>

          {/* Section: Product Photo */}
          <div className="space-y-2 pt-2 border-t border-[#241D20]">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase text-[#C6A064] font-semibold flex items-center gap-1.5">
                <ImageIcon size={13} />
                <span>Product Photo</span>
              </label>

              <div className="flex gap-1 bg-[#1A1417] p-0.5 rounded-lg border border-[#2D2427]">
                <button
                  type="button"
                  onClick={() => setImageType('upload')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition ${
                    imageType === 'upload' ? 'bg-[#603A46] text-[#F7F0E6]' : 'text-[#8E8084]'
                  }`}
                >
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => setImageType('url')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition ${
                    imageType === 'url' ? 'bg-[#603A46] text-[#F7F0E6]' : 'text-[#8E8084]'
                  }`}
                >
                  Photo URL
                </button>
              </div>
            </div>

            {imageType === 'upload' ? (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 rounded-xl border border-dashed border-[#C6A064]/50 hover:border-[#C6A064] bg-[#0A080A] text-[#A3999B] hover:text-[#F7F0E6] flex flex-col items-center justify-center gap-1 transition"
                >
                  <Upload size={18} className="text-[#C6A064]" />
                  <span className="text-xs font-mono">
                    {uploadingImage
                      ? 'Saving image...'
                      : uploadedImageData
                      ? 'Photo Selected (Click to change)'
                      : 'Select Photo from Computer'}
                  </span>
                </button>
                {uploadedImageData && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#C6A064]/60 mx-auto">
                    <img src={uploadedImageData} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ) : (
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/my_photo.jpg or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A080A] border border-[#2D2427] focus:border-[#C6A064] text-xs font-mono text-[#F7F0E6] outline-none transition"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-[#241D20] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1C1619] text-[#A3999B] hover:text-[#F7F0E6] text-xs font-mono transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#603A46] hover:bg-[#852F3A] text-[#F7F0E6] border border-[#C6A064]/60 text-xs font-mono font-bold tracking-wider flex items-center gap-2 shadow-lg transition"
            >
              <Check size={14} />
              <span>SAVE & TRY ON IN 3D</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
