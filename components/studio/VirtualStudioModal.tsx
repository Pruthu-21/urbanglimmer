'use client';

import { useState, useRef } from 'react';
import {
  X,
  RotateCcw,
  ShoppingBag,
  Heart,
  Sparkles,
  CircleDot,
  Check,
  Eye,
  Layers,
  Play,
  Pause,
  ChevronRight,
  Info,
  Maximize2,
  Sliders,
  Camera,
  RotateCw,
  FileCode,
  ClipboardPaste,
  Plus,
} from 'lucide-react';
import JewelryStudio3D, { JewelryStudio3DHandle } from './JewelryStudio3D';
import PovTunerModal from './PovTunerModal';
import JewelryFitTuner from './JewelryFitTuner';
import StudioConfigModal from './StudioConfigModal';
import AddProductModal from './AddProductModal';
import { JewelryCategory, StudioProduct, TryOnSelection, CameraPreset, ProductTransform } from './types';
import {
  STUDIO_PRODUCTS,
  CAMERA_PRESETS,
  DEFAULT_PRODUCT_TRANSFORMS,
  getStoredCameraPresets,
  saveStoredCameraPresets,
  getStoredProductTransforms,
  saveStoredProductTransforms,
  resetStoredProductTransform,
  getStoredCustomProducts,
  saveStoredCustomProducts,
} from './studioConfig';

interface VirtualStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
  wishlistCount?: number;
  onAddToCart?: (product: any, quantity?: number) => void;
  onOpenCart?: () => void;
}

export default function VirtualStudioModal({
  isOpen,
  onClose,
  cartCount = 0,
  wishlistCount = 0,
  onAddToCart,
  onOpenCart,
}: VirtualStudioModalProps) {
  const [activeCategory, setActiveCategory] = useState<JewelryCategory>('Earrings');
  const [autoRotate, setAutoRotate] = useState(false);
  const [panelTab, setPanelTab] = useState<'all' | 'sets'>('all');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // POV Tuner State
  const studio3DRef = useRef<JewelryStudio3DHandle>(null);
  const [tunerOpen, setTunerOpen] = useState(false);
  const [previewPreset, setPreviewPreset] = useState<CameraPreset | null>(null);
  const [cameraPresets, setCameraPresets] = useState<Record<JewelryCategory, CameraPreset>>(() =>
    getStoredCameraPresets()
  );

  // Jewelry Piece Fitter State (Per-product dynamic position, rotation, scale)
  const [fitTunerOpen, setFitTunerOpen] = useState(false);
  const [productTransforms, setProductTransforms] = useState<Record<number, ProductTransform>>(() =>
    getStoredProductTransforms()
  );
  const [activeTransformPreview, setActiveTransformPreview] = useState<{
    productId: number;
    transform: ProductTransform;
  } | null>(null);

  const handleSaveProductTransform = (prodId: number, transform: ProductTransform) => {
    const updated = {
      ...productTransforms,
      [prodId]: transform,
    };
    setProductTransforms(updated);
    saveStoredProductTransforms(updated);
    setActiveTransformPreview(null);
  };

  const handleResetProductTransform = (prodId: number) => {
    const def = resetStoredProductTransform(prodId);
    const updated = {
      ...productTransforms,
      [prodId]: def,
    };
    setProductTransforms(updated);
    setActiveTransformPreview(null);
  };

  const handleSavePreset = (cat: JewelryCategory, preset: CameraPreset) => {
    const updated = {
      ...cameraPresets,
      [cat]: preset,
    };
    setCameraPresets(updated);
    saveStoredCameraPresets(updated);
  };

  const handleResetCategory = (cat: JewelryCategory) => {
    const def = CAMERA_PRESETS[cat];
    if (def) {
      const updated = {
        ...cameraPresets,
        [cat]: def,
      };
      setCameraPresets(updated);
      saveStoredCameraPresets(updated);
    }
  };

  // Batch Studio Configuration Hub (Copy All / Paste / Import / Export)
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const handleApplyBatchTransforms = (
    newTransforms: Record<number, ProductTransform>,
    merge: boolean
  ) => {
    const updated = merge ? { ...productTransforms, ...newTransforms } : { ...newTransforms };
    setProductTransforms(updated);
    saveStoredProductTransforms(updated);
  };

  const handleApplyBatchCameraPresets = (
    newPresets: Record<JewelryCategory, CameraPreset>,
    merge: boolean
  ) => {
    const updated = merge ? { ...cameraPresets, ...newPresets } : { ...newPresets };
    setCameraPresets(updated);
    saveStoredCameraPresets(updated);
  };

  const handleResetAllTransforms = () => {
    setProductTransforms({ ...DEFAULT_PRODUCT_TRANSFORMS });
    saveStoredProductTransforms({ ...DEFAULT_PRODUCT_TRANSFORMS });
  };

  const handleResetAllCameraPresets = () => {
    setCameraPresets({ ...CAMERA_PRESETS });
    saveStoredCameraPresets({ ...CAMERA_PRESETS });
  };

  // Custom Personal Products State
  const [customProducts, setCustomProducts] = useState<StudioProduct[]>(() =>
    getStoredCustomProducts()
  );
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const allProducts = [...STUDIO_PRODUCTS, ...customProducts];

  const handleAddCustomProduct = (newProd: StudioProduct) => {
    const updated = [...customProducts, newProd];
    setCustomProducts(updated);
    saveStoredCustomProducts(updated);

    setSelections((prev) => ({
      ...prev,
      [newProd.category]: newProd.id,
    }));
    setActiveCategory(newProd.category);

    const defTf: ProductTransform = {
      position:
        newProd.category === 'Rings'
          ? [-0.09, 1.63, -0.052]
          : newProd.category === 'Bracelets'
          ? [-0.13, 0.89, 0.11]
          : newProd.category === 'Earrings'
          ? [0.035, 1.58, -0.055]
          : [0, 1.52, -0.05],
      rotation: newProd.category === 'Rings' ? [1.57, 0.4, 0] : [0, 0, 0],
      scale: 1.0,
    };
    handleSaveProductTransform(newProd.id, defTf);
  };

  // Active try-on selections across categories
  const [selections, setSelections] = useState<TryOnSelection>({
    Earrings: 1, // Solara Hoops
    Necklaces: 2, // Amara Layered
    Rings: 5, // Solstice Signet
    Bracelets: 3, // Aurelia Cuff
  });

  if (!isOpen) return null;

  // Filter products for the active category
  const categoryProducts = allProducts.filter(
    (p) => activeCategory === 'Full Model' || p.category === activeCategory
  );

  // Get currently selected product for the active category
  const activeProductId =
    activeCategory !== 'Full Model' ? selections[activeCategory] : undefined;
  const activeProduct =
    allProducts.find((p) => p.id === activeProductId) || categoryProducts[0];

  const handleSelectProduct = (prod: StudioProduct) => {
    setSelections((prev) => ({
      ...prev,
      [prod.category]: prod.id,
    }));
  };

  const handleAddAllSelectedToBag = () => {
    Object.values(selections).forEach((id) => {
      const p = allProducts.find((item) => item.id === id);
      if (p && onAddToCart) {
        onAddToCart(
          {
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            oldPrice: p.oldPrice,
            image: p.image,
            lifestyleImage: p.image,
            color: p.finish,
            material: p.material,
            dimensions: p.dimensions || '',
            description: p.description,
            rating: '4.9',
            reviewsCount: 50,
          },
          1
        );
      }
    });
  };

  const money = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="fixed inset-0 z-50 bg-[#0C0A0C] text-[#F7F0E6] flex flex-col font-['Manrope',sans-serif] overflow-hidden animate-in fade-in duration-300">
      {/* 1. STUDIO TOP NAVIGATION BAR */}
      <header className="h-16 px-6 border-b border-[#2A2326] flex items-center justify-between shrink-0 bg-[#0F0C0E]/95 backdrop-blur-md z-30">
        {/* Left Branding */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-['Cormorant_Garamond',serif] text-2xl tracking-[0.08em] font-semibold text-[#F7F0E6]">
              URBAN <span className="text-[#C6A064] italic">glimmer</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] tracking-widest font-mono bg-[#603A46]/60 text-[#C6A064] border border-[#C6A064]/30">
              3D STUDIO
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 text-[11px] font-semibold tracking-wider text-[#A3999B]">
            <span>HOME</span>
            <ChevronRight size={12} className="text-[#603A46]" />
            <span className="text-[#C6A064]">VIRTUAL TRY-ON</span>
          </nav>
        </div>

        {/* Center Active Focus Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1618] border border-[#2D2427] text-xs">
          <div className="w-2 h-2 rounded-full bg-[#C6A064] animate-pulse" />
          <span className="text-[#A3999B]">VIEWPORT:</span>
          <span className="text-[#F7F0E6] font-medium tracking-wide">
            {activeCategory === 'Full Model'
              ? 'Full Upper Body Portrait'
              : `${activeCategory} Macro Focus`}
          </span>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all border ${
              autoRotate
                ? 'bg-[#C6A064]/20 border-[#C6A064] text-[#C6A064]'
                : 'bg-[#1A1618] border-[#2D2427] text-[#A3999B] hover:text-[#F7F0E6]'
            }`}
            title="Auto-rotate model"
          >
            {autoRotate ? <Pause size={12} /> : <Play size={12} />}
            <span>360° ORBIT</span>
          </button>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1618] hover:bg-[#251F22] border border-[#2D2427] text-xs transition"
          >
            <ShoppingBag size={14} className="text-[#C6A064]" />
            <span className="font-medium tracking-wider">BAG ({cartCount})</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#251F22] text-[#A3999B] hover:text-[#F7F0E6] transition"
            aria-label="Close 3D Studio"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* 2. THREE-COLUMN MAIN WORKSPACE */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* COLUMN A: LEFT TOOLBAR (Category Switcher & Camera Rigs) */}
        <aside className="w-18 md:w-20 shrink-0 bg-[#0F0C0E] border-r border-[#2A2326] flex flex-col items-center py-5 justify-between z-20">
          <div className="flex flex-col items-center gap-3 w-full px-2">
            <span className="text-[9px] font-mono tracking-widest text-[#73666A] uppercase mb-1">
              FOCUS
            </span>

            {/* Category Buttons */}
            {(
              [
                { label: 'Full Model', short: 'FULL', icon: Eye, cat: 'Full Model' },
                { label: 'Earrings', short: 'EARS', icon: Sparkles, cat: 'Earrings' },
                { label: 'Necklaces', short: 'NECK', icon: CircleDot, cat: 'Necklaces' },
                { label: 'Rings', short: 'RINGS', icon: Maximize2, cat: 'Rings' },
                { label: 'Wrist & Bracelets', short: 'WRIST', icon: Layers, cat: 'Bracelets' },
              ] as const
            ).map((item) => {
              const isActive = activeCategory === item.cat;
              const Icon = item.icon;
              return (
                <button
                  key={item.cat}
                  onClick={() => {
                    setPreviewPreset(null);
                    setActiveCategory(item.cat);
                  }}
                  className={`w-full py-3 px-1 rounded-xl flex flex-col items-center gap-1.5 transition-all text-center group ${
                    isActive
                      ? 'bg-[#1F171A] text-[#C6A064] shadow-[0_0_15px_rgba(198,160,100,0.15)] border border-[#C6A064]/50'
                      : 'text-[#8E8084] hover:text-[#F7F0E6] hover:bg-[#161214]'
                  }`}
                  aria-label={`Focus camera on ${item.label}`}
                >
                  <Icon
                    size={18}
                    className={isActive ? 'text-[#C6A064]' : 'group-hover:scale-110 transition'}
                  />
                  <span className="text-[10px] font-semibold tracking-wider">{item.short}</span>
                </button>
              );
            })}

            {/* Direct Adjust POV & Fit Piece buttons in the left sidebar */}
            <div className="w-full pt-2 border-t border-[#2A2326] flex flex-col items-center gap-2">
              <button
                onClick={() => setTunerOpen((prev) => !prev)}
                className={`w-full py-2.5 px-1 rounded-xl flex flex-col items-center gap-1 transition-all text-center group ${
                  tunerOpen
                    ? 'bg-[#603A46]/40 text-[#C6A064] border border-[#C6A064] shadow-[0_0_15px_rgba(198,160,100,0.25)]'
                    : 'text-[#C6A064] hover:text-[#F7F0E6] bg-[#161214] hover:bg-[#1F171A] border border-[#C6A064]/40'
                }`}
                title="Adjust Camera POV (Position, Target, Zoom)"
              >
                <Sliders size={16} className="text-[#C6A064] group-hover:rotate-45 transition-transform" />
                <span className="text-[8px] font-bold tracking-wider font-mono">ADJUST POV</span>
              </button>

              <button
                onClick={() => setFitTunerOpen((prev) => !prev)}
                className={`w-full py-2.5 px-1 rounded-xl flex flex-col items-center gap-1 transition-all text-center group ${
                  fitTunerOpen
                    ? 'bg-[#603A46]/40 text-[#C6A064] border border-[#C6A064] shadow-[0_0_15px_rgba(198,160,100,0.25)]'
                    : 'text-[#E2D2B0] hover:text-[#F7F0E6] bg-[#161214] hover:bg-[#1F171A] border border-[#C6A064]/30'
                }`}
                title="Fit Jewelry Piece (Position, 3-Axis Rotation, Scale)"
              >
                <RotateCw size={15} className="text-[#C6A064] group-hover:rotate-90 transition-transform" />
                <span className="text-[8px] font-bold tracking-wider font-mono">FIT PIECE</span>
              </button>

              <button
                onClick={() => setConfigModalOpen(true)}
                className={`w-full py-2.5 px-1 rounded-xl flex flex-col items-center gap-1 transition-all text-center group ${
                  configModalOpen
                    ? 'bg-[#603A46]/40 text-[#C6A064] border border-[#C6A064] shadow-[0_0_15px_rgba(198,160,100,0.25)]'
                    : 'text-[#C6A064] hover:text-[#F7F0E6] bg-[#161214] hover:bg-[#1F171A] border border-[#C6A064]/30'
                }`}
                title="Batch Configuration Hub (Copy All, Paste Config, Import/Export)"
              >
                <FileCode size={15} className="text-[#C6A064] group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-bold tracking-wider font-mono">CONFIG</span>
              </button>
            </div>
          </div>

          {/* Reset Camera View Button */}
          <div className="w-full px-2">
            <button
              onClick={() => {
                setPreviewPreset(null);
                setActiveCategory('Full Model');
              }}
              className="w-full py-3 rounded-xl flex flex-col items-center gap-1 text-[#8E8084] hover:text-[#C6A064] hover:bg-[#161214] border border-transparent hover:border-[#2D2427] transition"
              title="Reset to Full Portrait"
            >
              <RotateCcw size={16} />
              <span className="text-[9px] font-mono tracking-wider">RESET</span>
            </button>
          </div>
        </aside>

        {/* COLUMN B: CENTRAL 3D VIEWPORT */}
        <main className="flex-1 relative flex flex-col items-center justify-center bg-[#0C0A0C] overflow-hidden">
          {/* Interactive 3D Canvas */}
          <JewelryStudio3D
            ref={studio3DRef}
            activeCategory={activeCategory}
            selections={selections}
            autoRotate={autoRotate}
            cameraPresets={cameraPresets}
            previewPreset={previewPreset}
            productTransforms={productTransforms}
            activeTransformPreview={activeTransformPreview}
            products={allProducts}
          />

          {/* POV Studio Tuner Panel */}
          <PovTunerModal
            isOpen={tunerOpen}
            onClose={() => {
              setPreviewPreset(null);
              setTunerOpen(false);
            }}
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setPreviewPreset(null);
              setActiveCategory(cat);
            }}
            presets={cameraPresets}
            onSavePreset={handleSavePreset}
            onLivePreview={(p) => setPreviewPreset(p)}
            onResetCategory={handleResetCategory}
            onCaptureFromScene={() => studio3DRef.current?.getCurrentCameraState() || null}
            onOpenConfigHub={() => setConfigModalOpen(true)}
          />

          {/* Jewelry Piece Fit Tuner (Position, 3-Axis Rotation, Scale) */}
          <JewelryFitTuner
            isOpen={fitTunerOpen}
            onClose={() => {
              setActiveTransformPreview(null);
              setFitTunerOpen(false);
            }}
            activeProduct={activeProduct}
            transforms={productTransforms}
            onSaveTransform={handleSaveProductTransform}
            onLivePreview={(prodId, tf) =>
              setActiveTransformPreview(tf ? { productId: prodId, transform: tf } : null)
            }
            onResetTransform={handleResetProductTransform}
            onOpenConfigHub={() => setConfigModalOpen(true)}
            onApplyBatchTransforms={handleApplyBatchTransforms}
          />

          {/* Batch Configuration Hub Modal (Copy All & Paste) */}
          <StudioConfigModal
            isOpen={configModalOpen}
            onClose={() => setConfigModalOpen(false)}
            productTransforms={productTransforms}
            cameraPresets={cameraPresets}
            onApplyTransforms={handleApplyBatchTransforms}
            onApplyCameraPresets={handleApplyBatchCameraPresets}
            onResetAllTransforms={handleResetAllTransforms}
            onResetAllCameraPresets={handleResetAllCameraPresets}
          />

          {/* Add Personal Custom Product Modal */}
          <AddProductModal
            isOpen={addProductModalOpen}
            onClose={() => setAddProductModalOpen(false)}
            activeCategory={activeCategory}
            onAddProduct={handleAddCustomProduct}
          />

          {/* Viewport Floating Controls & Hints */}
          <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between pointer-events-none z-10">
            <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141013]/85 backdrop-blur-md border border-[#2D2427] text-[11px] text-[#A3999B]">
              <Info size={13} className="text-[#C6A064]" />
              <span>Rotate 360° · Right-click/Shift to pan · Scroll to zoom</span>
              <button
                onClick={() => setTunerOpen((prev) => !prev)}
                className="ml-2 px-2.5 py-0.5 rounded-full bg-[#C6A064]/20 hover:bg-[#C6A064]/30 text-[#C6A064] border border-[#C6A064]/40 text-[10px] font-semibold tracking-wider flex items-center gap-1 transition"
                title="Open POV Tuner to adjust camera position and zoom"
              >
                <Sliders size={11} />
                <span>ADJUST POV</span>
              </button>
              <button
                onClick={() => setFitTunerOpen((prev) => !prev)}
                className="px-2.5 py-0.5 rounded-full bg-[#603A46]/50 hover:bg-[#603A46]/80 text-[#E2D2B0] hover:text-[#FFF] border border-[#C6A064]/40 text-[10px] font-semibold tracking-wider flex items-center gap-1 transition"
                title="Fit active jewelry piece on hand/body (Position, 3-Axis Rotation, Scale)"
              >
                <RotateCw size={11} className="text-[#C6A064]" />
                <span>FIT PIECE</span>
              </button>
              <button
                onClick={() => setConfigModalOpen(true)}
                className="px-2.5 py-0.5 rounded-full bg-[#1C1619] hover:bg-[#2A2125] text-[#C6A064] hover:text-[#FFF] border border-[#C6A064]/40 text-[10px] font-semibold tracking-wider flex items-center gap-1 transition font-mono"
                title="Batch Copy & Paste Configuration (All Jewelry & Cameras)"
              >
                <ClipboardPaste size={11} />
                <span>CONFIG (COPY/PASTE)</span>
              </button>
            </div>

            {/* Currently worn pieces badges */}
            <div className="hidden lg:flex items-center gap-2 pointer-events-auto">
              <button
                onClick={handleAddAllSelectedToBag}
                className="px-4 py-2 rounded-full bg-[#603A46] hover:bg-[#852F3A] text-[#F7F0E6] text-xs font-semibold tracking-wider flex items-center gap-2 shadow-lg transition border border-[#C6A064]/30"
              >
                <ShoppingBag size={13} className="text-[#C6A064]" />
                <span>BAG COMPLETE LOOK</span>
              </button>
            </div>
          </div>

          {/* Mobile Product Drawer Trigger */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-[#1F171A] text-[#C6A064] text-xs font-semibold tracking-wider border border-[#C6A064]/50 flex items-center gap-2 shadow-xl"
          >
            <Sparkles size={14} />
            <span>BROWSE {activeCategory === 'Bracelets' ? 'WRIST' : activeCategory.toUpperCase()}</span>
          </button>
        </main>

        {/* COLUMN C: RIGHT PRODUCT DRAWER (Jewellery Selector) */}
        <aside
          className={`fixed lg:static top-0 right-0 bottom-0 w-84 md:w-96 shrink-0 bg-[#120E11] border-l border-[#2A2326] flex flex-col z-30 transition-transform duration-300 lg:translate-x-0 ${
            mobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-[#241D20] flex items-center justify-between shrink-0 bg-[#151013]">
            <div>
              <h2 className="font-['Cormorant_Garamond',serif] text-xl font-semibold tracking-wide text-[#F7F0E6]">
                {activeCategory === 'Full Model'
                  ? 'Jewellery Collection'
                  : activeCategory === 'Bracelets'
                  ? 'Wrist & Bracelets'
                  : activeCategory}
              </h2>

              <p className="text-[11px] text-[#A3999B] tracking-wider">
                Select a piece to try on instantly
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAddProductModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-[#C6A064]/20 hover:bg-[#C6A064]/30 text-[#C6A064] text-[10px] font-mono font-bold flex items-center gap-1 border border-[#C6A064]/40 transition"
                title="Add your personal jewelry piece with photo and 3D mesh"
              >
                <Plus size={12} />
                <span>+ ADD PIECE</span>
              </button>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="lg:hidden p-1.5 rounded-full hover:bg-[#251F22] text-[#A3999B]"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-[#241D20] text-xs font-medium shrink-0 bg-[#0F0C0E]">
            <button
              onClick={() => setPanelTab('all')}
              className={`flex-1 py-2.5 text-center tracking-wider transition ${
                panelTab === 'all'
                  ? 'text-[#C6A064] border-b-2 border-[#C6A064] bg-[#161214]'
                  : 'text-[#8E8084] hover:text-[#F7F0E6]'
              }`}
            >
              ALL DESIGNS
            </button>
            <button
              onClick={() => setPanelTab('sets')}
              className={`flex-1 py-2.5 text-center tracking-wider transition ${
                panelTab === 'sets'
                  ? 'text-[#C6A064] border-b-2 border-[#C6A064] bg-[#161214]'
                  : 'text-[#8E8084] hover:text-[#F7F0E6]'
              }`}
            >
              CURATED SETS
            </button>
          </div>

          {/* Scrollable 2-Column Product Grid */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {categoryProducts.map((prod) => {
                const isSelected = selections[prod.category] === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all flex flex-col bg-[#161215] ${
                      isSelected
                        ? 'border-[#C6A064] shadow-[0_0_15px_rgba(198,160,100,0.25)] ring-1 ring-[#C6A064]'
                        : 'border-[#2D2427] hover:border-[#524147]'
                    }`}
                  >
                    {/* Active Selected Checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 z-10 w-5 h-5 rounded-full bg-[#C6A064] text-[#120E11] flex items-center justify-center shadow-md">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}

                    {/* Badge */}
                    {prod.badge && (
                      <span className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider font-semibold uppercase bg-[#603A46]/90 text-[#F7F0E6]">
                        {prod.badge}
                      </span>
                    )}

                    {/* Image Thumbnail */}
                    <div className="aspect-square w-full overflow-hidden bg-[#0A080A]">
                      <img
                        src={
                          prod.image.startsWith('http') || prod.image.startsWith('/')
                            ? prod.image
                            : `https://images.unsplash.com/${prod.image}?auto=format&fit=crop&w=350&q=80`
                        }
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-2.5 flex flex-col flex-1 justify-between gap-1">
                      <div>
                        <h4 className="text-xs font-medium text-[#F7F0E6] line-clamp-1 group-hover:text-[#C6A064] transition">
                          {prod.name}
                        </h4>
                        <p className="text-[10px] text-[#A3999B] line-clamp-1">{prod.finish}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#241D20]">
                        <span className="text-xs font-semibold text-[#C6A064]">
                          {money(prod.price)}
                        </span>
                        {prod.oldPrice && (
                          <span className="text-[10px] text-[#695F63] line-through">
                            {money(prod.oldPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Selected Detail Card */}
            {activeProduct && (
              <div className="mt-4 p-3.5 rounded-xl bg-[#191417] border border-[#2F2629] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-[#C6A064] uppercase">
                      ACTIVE PIECE ON MODEL
                    </span>
                    <h3 className="text-sm font-semibold text-[#F7F0E6]">{activeProduct.name}</h3>
                  </div>
                  <span className="text-sm font-semibold text-[#C6A064]">
                    {money(activeProduct.price)}
                  </span>
                </div>

                <p className="text-[11px] text-[#A3999B] leading-relaxed">
                  {activeProduct.description}
                </p>

                <div className="text-[10px] text-[#7E7175] space-y-0.5 border-t border-[#2A2125] pt-2">
                  <div>Finish: <strong className="text-[#D8CCD0]">{activeProduct.finish}</strong></div>
                  <div>Material: <span className="text-[#A3999B]">{activeProduct.material}</span></div>
                  {activeProduct.dimensions && (
                    <div>Dimensions: <span className="text-[#A3999B]">{activeProduct.dimensions}</span></div>
                  )}
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={() => {
                    if (onAddToCart) {
                      onAddToCart(
                        {
                          id: activeProduct.id,
                          name: activeProduct.name,
                          category: activeProduct.category,
                          price: activeProduct.price,
                          oldPrice: activeProduct.oldPrice,
                          image: activeProduct.image,
                          lifestyleImage: activeProduct.image,
                          color: activeProduct.finish,
                          material: activeProduct.material,
                          dimensions: activeProduct.dimensions || '',
                          description: activeProduct.description,
                          rating: '4.9',
                          reviewsCount: 50,
                        },
                        1
                      );
                    }
                    if (onOpenCart) {
                      onOpenCart();
                    }
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#C6A064] hover:bg-[#D4B07B] text-[#141013] font-semibold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={14} />
                  <span>ADD SELECTED PIECE TO BAG</span>
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
