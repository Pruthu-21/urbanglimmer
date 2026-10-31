'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Box,
  Upload,
  Copy,
  Check,
  Trash2,
  Search,
  Filter,
  ExternalLink,
  Sparkles,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { getAdminSession } from '@/lib/customerStore';
import { logAdminAction } from '@/lib/settingsStore';

type MediaItem = {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'model' | 'banner';
  size: string;
  dimensions?: string;
  uploadedAt: string;
};

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'MED-1',
    name: 'hero_indian_model_festive.png',
    url: '/images/hero_indian_model_festive.png',
    type: 'banner',
    size: '1.4 MB',
    dimensions: '1920 x 1080',
    uploadedAt: '2026-10-25',
  },
  {
    id: 'MED-2',
    name: 'festive_diwali_banner.png',
    url: '/images/festive_diwali_banner.png',
    type: 'banner',
    size: '1.1 MB',
    dimensions: '1800 x 700',
    uploadedAt: '2026-10-24',
  },
  {
    id: 'MED-3',
    name: 'editorial_campaign_banner.png',
    url: '/images/editorial_campaign_banner.png',
    type: 'banner',
    size: '1.2 MB',
    dimensions: '1920 x 800',
    uploadedAt: '2026-10-22',
  },
  {
    id: 'MED-4',
    name: 'rp_posed_00178_29.glb',
    url: '/models/rp_posed_00178_29.glb',
    type: 'model',
    size: '4.8 MB',
    uploadedAt: '2026-10-18',
  },
  {
    id: 'MED-5',
    name: 'solara_earrings_detail.png',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    size: '420 KB',
    dimensions: '800 x 1000',
    uploadedAt: '2026-10-20',
  },
  {
    id: 'MED-6',
    name: 'amara_necklace_shot.png',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    size: '510 KB',
    dimensions: '800 x 1000',
    uploadedAt: '2026-10-20',
  },
  {
    id: 'MED-7',
    name: 'aurelia_cuff_wrist.png',
    url: 'https://images.unsplash.com/photo-1611591475155-42a98f411bcf?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    size: '480 KB',
    dimensions: '800 x 1000',
    uploadedAt: '2026-10-21',
  },
  {
    id: 'MED-8',
    name: 'luna_pearl_drops.png',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    size: '390 KB',
    dimensions: '800 x 1000',
    uploadedAt: '2026-10-23',
  },
];

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'model' | 'banner'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const is3D = file.name.endsWith('.glb') || file.name.endsWith('.gltf');
      const endpoint = is3D ? '/api/upload-model' : '/api/upload-image';

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      const newItem: MediaItem = {
        id: `MED-${Date.now()}`,
        name: data.filename || file.name,
        url: data.url,
        type: is3D ? 'model' : 'image',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().split('T')[0],
      };

      setMediaList([newItem, ...mediaList]);
      const admin = getAdminSession();
      logAdminAction(admin?.name || 'Admin', 'MEDIA_UPLOAD', newItem.name, `Uploaded to ${newItem.url}`);
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the media catalogue?`)) return;
    setMediaList(mediaList.filter((m) => m.id !== id));
    const admin = getAdminSession();
    logAdminAction(admin?.name || 'Admin', 'MEDIA_DELETE', name, `Removed from library`);
  };

  const filtered = mediaList.filter((m) => {
    const matchesType = filterType === 'all' || m.type === filterType;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#211B1C] font-normal">Media & Asset Library</h1>
          <p className="text-xs text-[#766D6D] mt-1">
            Central repository for luxury product imagery, campaign editorial assets, and 3D GLB/GLTF studio models.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".png,.jpg,.jpeg,.webp,.glb,.gltf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-[#603A46] hover:bg-[#852F3A] text-white px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs disabled:opacity-50"
          >
            <Upload className="w-4 h-4 text-[#C6A064]" />
            <span>{isUploading ? 'Uploading Asset...' : 'Upload Media or 3D Model'}</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg border border-[#E8DFD5] flex flex-col sm:flex-row items-center gap-4 justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#766D6D]" />
          <input
            type="text"
            placeholder="Search by asset filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#766D6D]" />
          <div className="flex items-center gap-1 border border-[#E8DFD5] rounded-md p-1 bg-[#F8F4EE]/40 text-xs">
            {(['all', 'image', 'banner', 'model'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded text-[11px] font-medium capitalize transition-colors ${
                  filterType === t
                    ? 'bg-[#603A46] text-white shadow-xs'
                    : 'text-[#766D6D] hover:text-[#211B1C]'
                }`}
              >
                {t === 'model' ? '3D Models' : t === 'banner' ? 'Banners' : t === 'image' ? 'Photos' : 'All Media'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-[#E8DFD5] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Visual Preview */}
            <div className="relative aspect-4/3 bg-[#211C1D] flex items-center justify-center overflow-hidden">
              {item.type === 'model' ? (
                <div className="text-center p-4">
                  <Box className="w-12 h-12 mx-auto text-[#C6A064] mb-2 animate-pulse" />
                  <span className="text-[11px] font-mono text-[#F8F4EE] block font-bold">3D GLB/GLTF ASSET</span>
                  <span className="text-[9px] text-[#766D6D]">Compatible with Studio View</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback visual if external image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}

              {/* Type Badge */}
              <span
                className={`absolute top-2 left-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm ${
                  item.type === 'model'
                    ? 'bg-[#C6A064] text-[#151313]'
                    : item.type === 'banner'
                    ? 'bg-[#603A46] text-[#F8F4EE]'
                    : 'bg-[#211C1D]/80 text-[#F8F4EE]'
                }`}
              >
                {item.type}
              </span>
            </div>

            {/* Asset Details */}
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <p className="font-semibold text-xs text-[#211B1C] truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#766D6D] mt-0.5">
                  <span>{item.size}</span>
                  {item.dimensions && <span>· {item.dimensions}</span>}
                  <span>· {item.uploadedAt}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-[#E8DFD5] flex items-center justify-between gap-1">
                <button
                  onClick={() => copyUrl(item.id, item.url)}
                  className="flex items-center gap-1 text-[11px] text-[#603A46] hover:text-[#852F3A] font-medium p-1 rounded hover:bg-[#F8F4EE]"
                  title="Copy URL to clipboard"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-[#766D6D] hover:text-[#211B1C] rounded hover:bg-[#F8F4EE]"
                    title="View asset in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1 text-[#766D6D] hover:text-red-600 rounded hover:bg-[#F8F4EE]"
                    title="Delete asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
