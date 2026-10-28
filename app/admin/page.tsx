'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Plus,
  Package,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  Edit2,
  Check,
  Copy,
  ExternalLink,
  Upload,
  ArrowUpDown,
  Search,
  MessageCircle,
  Mail,
  Truck,
  RotateCcw,
  Eye,
  Box,
  Layers,
  TrendingUp,
} from 'lucide-react';
import {
  Product,
  getStoredProducts,
  saveStoredProducts,
  addProductToStore,
  updateProductInStore,
  deleteProductFromStore,
  resetProductsStore,
} from '@/lib/productStore';
import {
  Order,
  OrderStatus,
  getStoredOrders,
  saveStoredOrders,
  updateOrderStatus,
  deleteOrder,
  generateStatusReplyTemplate,
} from '@/lib/orderStore';

const CATEGORIES = ['All', 'Necklaces', 'Earrings', 'Rings', 'Bracelets'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name' | 'newest'>('newest');
  const [toast, setToast] = useState('');

  // Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Quick reply modal
  const [activeOrderForReply, setActiveOrderForReply] = useState<Order | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // New product form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Rings');
  const [formPrice, setFormPrice] = useState(1499);
  const [formOldPrice, setFormOldPrice] = useState<number | undefined>(1899);
  const [formColor, setFormColor] = useState('18k Gold Vermeil');
  const [formMaterial, setFormMaterial] = useState('Thick 18k gold over recycled sterling silver');
  const [formDimensions, setFormDimensions] = useState('Standard Size US 7');
  const [formDescription, setFormDescription] = useState('Handcrafted luxury piece designed for effortless daily elegance.');
  const [formBadge, setFormBadge] = useState('NEW ARRIVAL');
  const [formBadgeType, setFormBadgeType] = useState<'bestseller' | 'wine' | 'light'>('wine');
  
  // Image and model uploads
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelUrl, setModelUrl] = useState<string>('');
  const [isUploadingModel, setIsUploadingModel] = useState(false);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadData = () => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    loadData();

    const handleCatalogUpdate = () => setProducts(getStoredProducts());
    const handleOrdersUpdate = () => setOrders(getStoredOrders());

    window.addEventListener('urban_glimmer_catalog_updated', handleCatalogUpdate);
    window.addEventListener('urban_glimmer_orders_updated', handleOrdersUpdate);

    return () => {
      window.removeEventListener('urban_glimmer_catalog_updated', handleCatalogUpdate);
      window.removeEventListener('urban_glimmer_orders_updated', handleOrdersUpdate);
    };
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchQuery = `${p.name} ${p.category} ${p.color} ${p.material}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      list = [...list].sort((a, b) => b.id - a.id);
    }

    return list;
  }, [products, categoryFilter, searchQuery, sortBy]);

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImagePreview(data.url);
        notify('Image uploaded successfully');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      notify('Failed to save image to server; local preview active');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle Polycam 3D Model Upload
  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setModelFile(file);
    setIsUploadingModel(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-model', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setModelUrl(data.url);
        notify('Polycam 3D model uploaded successfully');
      }
    } catch (err) {
      console.error('Model upload failed:', err);
      notify('Failed to upload 3D model');
    } finally {
      setIsUploadingModel(false);
    }
  };

  // Handle Create Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      notify('Please enter a product title');
      return;
    }

    const defaultImg =
      formCategory === 'Rings'
        ? 'photo-1605100804763-247f67b3557e'
        : formCategory === 'Necklaces'
        ? 'photo-1599643478518-a784e5dc4c8f'
        : formCategory === 'Earrings'
        ? 'photo-1630019852942-f89202989a59'
        : 'photo-1611591437281-460bfbe1220a';

    const chosenImg = imagePreview || defaultImg;

    const newProd = addProductToStore({
      name: formName.trim(),
      category: formCategory,
      price: Number(formPrice),
      oldPrice: formOldPrice ? Number(formOldPrice) : undefined,
      image: chosenImg,
      lifestyleImage: chosenImg,
      badge: formBadge || undefined,
      badgeType: formBadgeType,
      color: formColor,
      material: formMaterial,
      dimensions: formDimensions,
      description: formDescription,
      modelUrl: modelUrl || (modelFile ? `/models/jewelry/${modelFile.name}` : undefined),
      modelType: modelUrl || modelFile ? 'polycam' : 'procedural',
    });

    notify(`Created "${newProd.name}" successfully!`);
    loadData();
    setActiveTab('products');

    // Reset form
    setFormName('');
    setImagePreview('');
    setImageFile(null);
    setModelFile(null);
    setModelUrl('');
  };

  // In-line price update
  const handleUpdatePrice = (id: number, currentPrice: number) => {
    const input = window.prompt(`Enter new price for this piece (in ₹):`, String(currentPrice));
    if (!input) return;
    const val = Number(input.replace(/[^0-9]/g, ''));
    if (!isNaN(val) && val > 0) {
      updateProductInStore(id, { price: val });
      loadData();
      notify(`Price updated to ₹${val.toLocaleString('en-IN')}`);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProductFromStore(id);
      loadData();
      notify(`Deleted "${name}"`);
    }
  };

  // Handle Status Update
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    loadData();
    notify(`Order #${orderId} marked as ${status}`);
  };

  // Total stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.grandTotal : 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const getImgUrl = (src: string) => {
    if (!src) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80';
    if (src.startsWith('http') || src.startsWith('/') || src.startsWith('blob:')) return src;
    return `https://images.unsplash.com/${src}?auto=format&fit=crop&w=300&q=80`;
  };

  return (
    <div className="min-h-screen bg-[#130E10] text-[#F7F0E6] font-sans">
      {/* Top Bar */}
      <header className="border-b border-[#2C1F24] bg-[#1A1417] px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A064] hover:text-[#F4E9C9] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Storefront
          </Link>
          <span className="text-[#3F2E35]">|</span>
          <div className="flex items-center gap-2">
            <span className="text-[#C6A064] font-serif text-lg italic">urban</span>
            <span className="font-serif text-lg font-bold tracking-wider">glimmer</span>
            <span className="text-[10px] tracking-widest uppercase bg-[#852F3A] text-white px-2 py-0.5 rounded font-mono font-bold">
              Studio Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/?studio=open"
            className="flex items-center gap-2 text-xs uppercase tracking-wider px-3 py-1.5 border border-[#C6A064]/40 hover:border-[#C6A064] text-[#C6A064] rounded transition-all"
          >
            <Box size={14} /> Open 3D Studio
          </Link>
          <button
            onClick={() => setActiveTab('add')}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider px-3.5 py-1.5 bg-[#C6A064] hover:bg-[#D5B278] text-[#1A1417] font-bold rounded transition-all shadow-md"
          >
            <Plus size={15} /> Add Product
          </button>
        </div>
      </header>

      {/* Metrics Banner */}
      <section className="px-6 py-6 border-b border-[#2C1F24] bg-[#171114]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1F171A] p-4 rounded border border-[#2D2226]">
            <span className="text-[10px] uppercase tracking-widest text-[#A8929A] flex items-center gap-1.5">
              <Package size={13} className="text-[#C6A064]" /> Catalog Pieces
            </span>
            <p className="font-serif text-2xl font-bold text-[#F4E9C9] mt-1">{products.length}</p>
            <span className="text-[11px] text-[#A8929A]">Across {CATEGORIES.length - 1} categories</span>
          </div>

          <div className="bg-[#1F171A] p-4 rounded border border-[#2D2226]">
            <span className="text-[10px] uppercase tracking-widest text-[#A8929A] flex items-center gap-1.5">
              <ShoppingBag size={13} className="text-[#852F3A]" /> Active Orders
            </span>
            <p className="font-serif text-2xl font-bold text-[#F4E9C9] mt-1">{activeOrdersCount}</p>
            <span className="text-[11px] text-[#C6A064]">Awaiting packing / delivery</span>
          </div>

          <div className="bg-[#1F171A] p-4 rounded border border-[#2D2226]">
            <span className="text-[10px] uppercase tracking-widest text-[#A8929A] flex items-center gap-1.5">
              <Truck size={13} className="text-emerald-400" /> Total Orders
            </span>
            <p className="font-serif text-2xl font-bold text-[#F4E9C9] mt-1">{orders.length}</p>
            <span className="text-[11px] text-emerald-400">Lifetime orders placed</span>
          </div>

          <div className="bg-[#1F171A] p-4 rounded border border-[#2D2226]">
            <span className="text-[10px] uppercase tracking-widest text-[#A8929A] flex items-center gap-1.5">
              <TrendingUp size={13} className="text-[#C6A064]" /> Total Revenue
            </span>
            <p className="font-serif text-2xl font-bold text-[#F4E9C9] mt-1">{money(totalRevenue)}</p>
            <span className="text-[11px] text-[#A8929A]">Gross sales volume</span>
          </div>
        </div>
      </section>

      {/* Tabs Bar */}
      <div className="px-6 border-b border-[#2C1F24] bg-[#140F12]">
        <div className="max-w-7xl mx-auto flex gap-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-[#C6A064] text-[#C6A064]'
                : 'border-transparent text-[#A8929A] hover:text-[#F7F0E6]'
            }`}
          >
            <Layers size={14} /> Product Catalog & Pricing ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`py-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'add'
                ? 'border-[#C6A064] text-[#C6A064]'
                : 'border-transparent text-[#A8929A] hover:text-[#F7F0E6]'
            }`}
          >
            <Plus size={14} /> Add New Piece / Polycam Scan
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#C6A064] text-[#C6A064]'
                : 'border-transparent text-[#A8929A] hover:text-[#F7F0E6]'
            }`}
          >
            <ShoppingBag size={14} /> Orders & Status Reply ({orders.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* TAB 1: PRODUCT CATALOG & PRICING */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filter and Sort Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1B1417] p-4 rounded border border-[#2D2226]">
              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs rounded transition-all ${
                      categoryFilter === cat
                        ? 'bg-[#C6A064] text-[#171114] font-bold shadow'
                        : 'bg-[#251B20] text-[#A8929A] hover:text-[#F7F0E6]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8929A]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pieces..."
                    className="pl-8 pr-3 py-1.5 bg-[#251B20] border border-[#382B32] rounded text-xs text-[#F7F0E6] focus:outline-none focus:border-[#C6A064] w-48"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-[#251B20] border border-[#382B32] rounded px-2.5 py-1">
                  <ArrowUpDown size={13} className="text-[#C6A064]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs text-[#F7F0E6] outline-none cursor-pointer"
                  >
                    <option value="newest" className="bg-[#1A1417]">Newest First</option>
                    <option value="price-asc" className="bg-[#1A1417]">Price: Low to High</option>
                    <option value="price-desc" className="bg-[#1A1417]">Price: High to Low</option>
                    <option value="name" className="bg-[#1A1417]">Alphabetical (A-Z)</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Reset catalog to factory demo items?')) {
                      resetProductsStore();
                      loadData();
                      notify('Catalog reset to defaults');
                    }
                  }}
                  title="Reset to default items"
                  className="p-1.5 text-[#A8929A] hover:text-[#F4E9C9] border border-[#382B32] rounded bg-[#251B20]"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#1A1417] rounded border border-[#2D2226] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#2C1F24] bg-[#22181C] text-[10px] uppercase tracking-wider text-[#A8929A]">
                      <th className="py-3 px-4">Piece</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Finish & Material</th>
                      <th className="py-3 px-4">3D Model</th>
                      <th className="py-3 px-4">Price (INR)</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#261B20] text-xs">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#20171B] transition-colors">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={getImgUrl(p.image)}
                            alt={p.name}
                            className="w-12 h-14 object-cover rounded bg-[#2A1D23] border border-[#382B32]"
                          />
                          <div>
                            <div className="font-serif text-sm font-semibold text-[#F4E9C9] flex items-center gap-2">
                              {p.name}
                              {p.badge && (
                                <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#852F3A] text-[#F7F0E6] font-mono">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#A8929A] font-mono">ID: #{p.id}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-[#281C22] text-[#C6A064] font-medium border border-[#3E2C34]">
                            {p.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[#CFC2C7]">
                          <p className="font-medium">{p.color}</p>
                          <p className="text-[11px] text-[#8E7B83] truncate max-w-xs">{p.material}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          {p.modelType === 'polycam' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                              <Box size={11} /> Polycam Scan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#261C20] text-[#A8929A] border border-[#36272E]">
                              Procedural 3D
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#F4E9C9] text-sm">{money(p.price)}</span>
                            {p.oldPrice && (
                              <del className="text-[11px] text-[#8E7B83]">{money(p.oldPrice)}</del>
                            )}
                            <button
                              onClick={() => handleUpdatePrice(p.id, p.price)}
                              title="Edit price"
                              className="text-[#C6A064] hover:text-[#F4E9C9] p-1 rounded hover:bg-[#2C1F24] transition-colors"
                            >
                              <Edit2 size={12} />
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href="/?studio=open"
                              className="p-1.5 text-[#A8929A] hover:text-[#C6A064] hover:bg-[#2D2026] rounded transition-colors"
                              title="Preview in 3D Studio"
                            >
                              <Eye size={15} />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-[#A8929A] hover:text-rose-400 hover:bg-[#2D2026] rounded transition-colors"
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16 text-[#A8929A]">
                  <Sparkles size={28} className="mx-auto text-[#C6A064] mb-3" />
                  <p className="font-serif text-lg text-[#F4E9C9]">No pieces match your filter</p>
                  <p className="text-xs text-[#8E7B83] mt-1">Try clearing the search query or category filter</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADD NEW PRODUCT & POLYCAM UPLOAD */}
        {activeTab === 'add' && (
          <div className="max-w-3xl mx-auto bg-[#1A1417] p-8 rounded-lg border border-[#2D2226] shadow-2xl">
            <div className="mb-6 border-b border-[#2C1F24] pb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#C6A064] font-mono font-semibold">
                Catalog & 3D Integration
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#F4E9C9] mt-1">
                Add New Jewellery Piece
              </h2>
              <p className="text-xs text-[#A8929A] mt-1">
                Supports direct 2D image uploads and raw 3D scans (.GLB) exported from Polycam.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-6">
              {/* Product Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8929A] mb-1.5">
                    Piece Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Royal Florentine Signet"
                    className="w-full px-3.5 py-2.5 bg-[#251B20] border border-[#382B32] rounded text-sm text-[#F7F0E6] focus:outline-none focus:border-[#C6A064]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8929A] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#251B20] border border-[#382B32] rounded text-sm text-[#F7F0E6] focus:outline-none focus:border-[#C6A064]"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Earrings">Earrings</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Badge */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8929A] mb-1.5">
                    Selling Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#251B20] border border-[#382B32] rounded text-sm text-[#F7F0E6] focus:outline-none focus:border-[#C6A064]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8929A] mb-1.5">
                    Original / MRP Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formOldPrice || ''}
                    onChange={(e) => setFormOldPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 1999"
                    className="w-full px-3.5 py-2.5 bg-[#251B20] border border-[#382B32] rounded text-sm text-[#F7F0E6] focus:outline-none focus:border-[#C6A064]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8929A] mb-1.5">
                    Badge Tag
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#251B20] border border-[#382B32] rounded text-sm text-[#F7F0E6] focus:outline-none focus:border-[#C6A064]"
                  >
                    <option value="">No Badge</option>
                    <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="FESTIVE EDIT">FESTIVE EDIT</option>
                    <option value="LOW STOCK">LOW STOCK</option>
                    <option value="TRENDING">TRENDING</option>
                  </select>
                </div>
              </div>

              {/* Finish & Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8929A] mb-1.5">
                    Finish / Color
                  </label>
                  <input
                    type="text"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    placeholder="e.g. 18k Gold Vermeil / White Gold"
                    className="w-full px-3.5 py-2.5 bg-[#251B20] border border-[#382B32] rounded text-sm text-[#F7F0E6] focus:outline-none focus:border-[#C6A064]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8929A] mb-1.5">
                    Dimensions / Sizing
                  </label>
                  <input
                    type="text"
                    value={formDimensions}
                    onChange={(e) => setFormDimensions(e.target.value)}
                    placeholder="e.g. 40cm + 5cm extension / Size US 7"
                    className="w-full px-3.5 py-2.5 bg-[#251B20] border border-[#382B32] rounded text-sm text-[#F7F0E6] focus:outline-none focus:border-[#C6A064]"
                  />
                </div>
              </div>

              {/* Material & Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A8929A] mb-1.5">
                  Material Details
                </label>
                <input
                  type="text"
                  value={formMaterial}
                  onChange={(e) => setFormMaterial(e.target.value)}
                  placeholder="e.g. Thick 18k yellow gold over 925 sterling silver"
                  className="w-full px-3.5 py-2.5 bg-[#251B20] border border-[#382B32] rounded text-sm text-[#F7F0E6] focus:outline-none focus:border-[#C6A064]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A8929A] mb-1.5">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#251B20] border border-[#382B32] rounded text-sm text-[#F7F0E6] focus:outline-none focus:border-[#C6A064]"
                />
              </div>

              {/* Media Uploads Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#2C1F24]">
                {/* 1. Image Upload */}
                <div className="bg-[#1F171A] p-4 rounded border border-[#2D2226]">
                  <label className="block text-xs uppercase tracking-wider text-[#C6A064] font-bold mb-2 flex items-center gap-1.5">
                    <Upload size={14} /> Product Photo (.JPG / .PNG / .WEBP)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-xs text-[#A8929A] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#C6A064] file:text-[#171114] hover:file:bg-[#D5B278] cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border border-[#3E2C34]"
                      />
                      <span className="text-[11px] text-emerald-400 font-mono">
                        {isUploadingImage ? 'Uploading...' : '✓ Image attached'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Polycam 3D Scan Upload */}
                <div className="bg-[#1F171A] p-4 rounded border border-[#2D2226]">
                  <label className="block text-xs uppercase tracking-wider text-[#C6A064] font-bold mb-2 flex items-center gap-1.5">
                    <Box size={14} /> Polycam 3D Scan (.GLB / .GLTF)
                  </label>
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    onChange={handleModelUpload}
                    className="w-full text-xs text-[#A8929A] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#852F3A] file:text-white hover:file:bg-[#9E3A47] cursor-pointer"
                  />
                  <p className="text-[11px] text-[#8E7B83] mt-2">
                    In Polycam, export as <strong>glTF / GLB</strong>. We auto-center and calibrate the scale!
                  </p>
                  {modelUrl && (
                    <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check size={13} /> Polycam scan linked: {modelUrl.split('/').pop()}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2C1F24]">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-5 py-2.5 border border-[#382B32] text-[#A8929A] hover:text-[#F7F0E6] rounded text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C6A064] hover:bg-[#D5B278] text-[#171114] rounded text-xs uppercase tracking-wider font-bold shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Publish to Store
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ORDERS & CUSTOMER STATUS REPLY */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#F4E9C9]">Customer Orders & Dispatch</h3>
                <p className="text-xs text-[#A8929A] mt-0.5">
                  Manage fulfillment status and generate ready-to-send reply updates for customers on WhatsApp, SMS, or Email.
                </p>
              </div>
            </div>

            <div className="bg-[#1A1417] rounded border border-[#2D2226] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#2C1F24] bg-[#22181C] text-[10px] uppercase tracking-wider text-[#A8929A]">
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer & City</th>
                      <th className="py-3 px-4">Items Ordered</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#261B20] text-xs">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#20171B] transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-[#F4E9C9] text-sm">{o.id}</span>
                          <p className="text-[11px] text-[#8E7B83] mt-0.5">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-medium text-[#F7F0E6]">{o.customerName}</p>
                          <p className="text-[11px] text-[#A8929A]">{o.customerEmail}</p>
                          <p className="text-[11px] text-[#C6A064]">{o.city}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="font-mono text-[#C6A064] text-[11px] font-bold">
                                  {item.quantity}x
                                </span>
                                <span className="text-[#CFC2C7] truncate max-w-xs">{item.product.name}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#F4E9C9] text-sm">{money(o.grandTotal)}</span>
                          <p className="text-[10px] uppercase tracking-wider text-[#8E7B83] mt-0.5 font-mono">
                            {o.paymentMethod.toUpperCase()}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold outline-none border cursor-pointer ${
                              o.status === 'Delivered'
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                                : o.status === 'Shipped'
                                ? 'bg-indigo-950/60 text-indigo-400 border-indigo-800'
                                : o.status === 'In Production'
                                ? 'bg-purple-950/60 text-purple-400 border-purple-800'
                                : o.status === 'Confirmed'
                                ? 'bg-blue-950/60 text-blue-400 border-blue-800'
                                : o.status === 'Pending'
                                ? 'bg-amber-950/60 text-amber-400 border-amber-800'
                                : 'bg-rose-950/60 text-rose-400 border-rose-800'
                            }`}
                          >
                            <option value="Pending" className="bg-[#1A1417]">Pending</option>
                            <option value="Confirmed" className="bg-[#1A1417]">Confirmed</option>
                            <option value="In Production" className="bg-[#1A1417]">In Production</option>
                            <option value="Shipped" className="bg-[#1A1417]">Shipped</option>
                            <option value="Delivered" className="bg-[#1A1417]">Delivered</option>
                            <option value="Cancelled" className="bg-[#1A1417]">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setActiveOrderForReply(o);
                                setCopiedText(false);
                              }}
                              className="px-2.5 py-1 bg-[#852F3A] hover:bg-[#9E3A47] text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              title="Generate status reply for customer"
                            >
                              <MessageCircle size={13} /> Reply Status
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete order ${o.id}?`)) {
                                  deleteOrder(o.id);
                                  loadData();
                                  notify(`Deleted order ${o.id}`);
                                }
                              }}
                              className="p-1.5 text-[#A8929A] hover:text-rose-400 hover:bg-[#2D2026] rounded transition-colors"
                              title="Delete order"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {orders.length === 0 && (
                <div className="text-center py-16 text-[#A8929A]">
                  <ShoppingBag size={28} className="mx-auto text-[#C6A064] mb-3" />
                  <p className="font-serif text-lg text-[#F4E9C9]">No orders placed yet</p>
                  <p className="text-xs text-[#8E7B83] mt-1">Orders placed by customers will appear here automatically.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* QUICK REPLY / STATUS UPDATE MODAL */}
      {activeOrderForReply && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1417] border border-[#3E2C34] rounded-lg max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C1F24]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C6A064] font-mono">
                  Order Status Notification
                </span>
                <h4 className="font-serif text-xl font-bold text-[#F4E9C9] mt-0.5">
                  Reply to {activeOrderForReply.customerName}
                </h4>
              </div>
              <button
                onClick={() => setActiveOrderForReply(null)}
                className="text-[#A8929A] hover:text-[#F7F0E6] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#A8929A] block mb-1">
                  Generated Status Message:
                </label>
                <div className="bg-[#251B20] border border-[#382B32] p-3.5 rounded text-xs text-[#F7F0E6] leading-relaxed select-all">
                  {generateStatusReplyTemplate(activeOrderForReply)}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateStatusReplyTemplate(activeOrderForReply));
                    setCopiedText(true);
                    notify('Copied message to clipboard');
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="flex-1 py-2 bg-[#C6A064] hover:bg-[#D5B278] text-[#171114] text-xs uppercase tracking-wider font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedText ? <Check size={14} /> : <Copy size={14} />}
                  {copiedText ? 'Copied!' : 'Copy Message'}
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    generateStatusReplyTemplate(activeOrderForReply)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>

                <a
                  href={`mailto:${activeOrderForReply.customerEmail}?subject=Urban%20Glimmer%20Order%20Update%20%23${
                    activeOrderForReply.id
                  }&body=${encodeURIComponent(generateStatusReplyTemplate(activeOrderForReply))}`}
                  className="px-4 py-2 bg-[#852F3A] hover:bg-[#9E3A47] text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-1.5 transition-colors"
                >
                  <Mail size={14} /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C6A064] text-[#171114] px-4 py-2.5 rounded shadow-2xl font-semibold text-xs tracking-wide flex items-center gap-2 border border-[#F4E9C9]">
          <Sparkles size={14} /> {toast}
        </div>
      )}
    </div>
  );
}
