'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  Move,
  RotateCw,
  Maximize,
  Sliders,
  Info,
  FileCode,
  ClipboardPaste,
} from 'lucide-react';
import { ProductTransform, StudioProduct } from './types';
import { DEFAULT_PRODUCT_TRANSFORMS } from './studioConfig';
import {
  exportAllProductTransformsTS,
  exportAllProductTransformsJSON,
  parseImportedConfig,
} from './configManager';

interface JewelryFitTunerProps {
  isOpen: boolean;
  onClose: () => void;
  activeProduct: StudioProduct | undefined;
  transforms: Record<number, ProductTransform>;
  onSaveTransform: (productId: number, transform: ProductTransform) => void;
  onLivePreview: (productId: number, transform: ProductTransform | null) => void;
  onResetTransform: (productId: number) => void;
  onOpenConfigHub?: () => void;
  onApplyBatchTransforms?: (transforms: Record<number, ProductTransform>, merge: boolean) => void;
}

export default function JewelryFitTuner({
  isOpen,
  onClose,
  activeProduct,
  transforms,
  onSaveTransform,
  onLivePreview,
  onResetTransform,
  onOpenConfigHub,
  onApplyBatchTransforms,
}: JewelryFitTunerProps) {
  const productId = activeProduct?.id || 5;

  // Local active editing values
  const [posX, setPosX] = useState(-0.09);
  const [posY, setPosY] = useState(1.63);
  const [posZ, setPosZ] = useState(-0.052);

  // Rotation in DEGREES for human-friendly editing
  const [rotXDeg, setRotXDeg] = useState(90);
  const [rotYDeg, setRotYDeg] = useState(23);
  const [rotZDeg, setRotZDeg] = useState(0);

  const [scale, setScale] = useState(1.0);

  const [copied, setCopied] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);
  const [activeTab, setActiveTab] = useState<'rotation' | 'position' | 'scale' | 'batch'>('rotation');

  // Inline batch paste state
  const [inlinePasteText, setInlinePasteText] = useState('');
  const [inlinePasteError, setInlinePasteError] = useState<string | null>(null);
  const [inlinePasteSuccess, setInlinePasteSuccess] = useState<string | null>(null);

  // Load product transform whenever activeProduct or transforms change
  useEffect(() => {
    const cur = transforms[productId] || DEFAULT_PRODUCT_TRANSFORMS[productId] || {
      position: [-0.09, 1.63, -0.052],
      rotation: [1.57, 0.4, 0],
      scale: 1.0,
    };

    setPosX(Number(cur.position[0].toFixed(3)));
    setPosY(Number(cur.position[1].toFixed(3)));
    setPosZ(Number(cur.position[2].toFixed(3)));

    setRotXDeg(Math.round((cur.rotation[0] * 180) / Math.PI));
    setRotYDeg(Math.round((cur.rotation[1] * 180) / Math.PI));
    setRotZDeg(Math.round((cur.rotation[2] * 180) / Math.PI));

    setScale(Number(cur.scale.toFixed(2)));
  }, [productId, transforms]);

  // Push live preview to 3D scene when any coordinate changes
  const triggerPreview = (
    newPos: [number, number, number],
    newRotDeg: [number, number, number],
    newScale: number
  ) => {
    const rotRad: [number, number, number] = [
      (newRotDeg[0] * Math.PI) / 180,
      (newRotDeg[1] * Math.PI) / 180,
      (newRotDeg[2] * Math.PI) / 180,
    ];
    onLivePreview(productId, {
      position: newPos,
      rotation: rotRad,
      scale: newScale,
    });
  };

  const updatePos = (setter: (v: number) => void, val: number, type: 'x' | 'y' | 'z') => {
    const rounded = Number(val.toFixed(3));
    setter(rounded);
    const newPos: [number, number, number] = [
      type === 'x' ? rounded : posX,
      type === 'y' ? rounded : posY,
      type === 'z' ? rounded : posZ,
    ];
    triggerPreview(newPos, [rotXDeg, rotYDeg, rotZDeg], scale);
  };

  const updateRot = (setter: (v: number) => void, val: number, type: 'rx' | 'ry' | 'rz') => {
    const deg = Math.round(val);
    setter(deg);
    const newRot: [number, number, number] = [
      type === 'rx' ? deg : rotXDeg,
      type === 'ry' ? deg : rotYDeg,
      type === 'rz' ? deg : rotZDeg,
    ];
    triggerPreview([posX, posY, posZ], newRot, scale);
  };

  const updateScaleVal = (val: number) => {
    const rounded = Number(val.toFixed(2));
    setScale(rounded);
    triggerPreview([posX, posY, posZ], [rotXDeg, rotYDeg, rotZDeg], rounded);
  };

  const applyQuickRotation = (rx: number, ry: number, rz: number) => {
    setRotXDeg(rx);
    setRotYDeg(ry);
    setRotZDeg(rz);
    triggerPreview([posX, posY, posZ], [rx, ry, rz], scale);
  };

  const handleSave = () => {
    const rotRad: [number, number, number] = [
      Number(((rotXDeg * Math.PI) / 180).toFixed(3)),
      Number(((rotYDeg * Math.PI) / 180).toFixed(3)),
      Number(((rotZDeg * Math.PI) / 180).toFixed(3)),
    ];
    const transform: ProductTransform = {
      position: [posX, posY, posZ],
      rotation: rotRad,
      scale,
    };
    onSaveTransform(productId, transform);
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2400);
  };

  const handleReset = () => {
    onResetTransform(productId);
    const def = DEFAULT_PRODUCT_TRANSFORMS[productId] || {
      position: [-0.09, 1.63, -0.052],
      rotation: [1.57, 0.4, 0],
      scale: 1.0,
    };
    setPosX(def.position[0]);
    setPosY(def.position[1]);
    setPosZ(def.position[2]);
    setRotXDeg(Math.round((def.rotation[0] * 180) / Math.PI));
    setRotYDeg(Math.round((def.rotation[1] * 180) / Math.PI));
    setRotZDeg(Math.round((def.rotation[2] * 180) / Math.PI));
    setScale(def.scale);
    triggerPreview(
      def.position,
      [
        Math.round((def.rotation[0] * 180) / Math.PI),
        Math.round((def.rotation[1] * 180) / Math.PI),
        Math.round((def.rotation[2] * 180) / Math.PI),
      ],
      def.scale
    );
  };

  const handleCopyCode = () => {
    const rotRadX = Number(((rotXDeg * Math.PI) / 180).toFixed(3));
    const rotRadY = Number(((rotYDeg * Math.PI) / 180).toFixed(3));
    const rotRadZ = Number(((rotZDeg * Math.PI) / 180).toFixed(3));

    const code = `// ${activeProduct?.name || 'Jewelry Piece'} (ID: ${productId}):
position: [${posX}, ${posY}, ${posZ}],
rotation: [${rotRadX}, ${rotRadY}, ${rotRadZ}], // [${rotXDeg}°, ${rotYDeg}°, ${rotZDeg}°]
scale: ${scale},`;

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopyAllTransforms = () => {
    const code = exportAllProductTransformsTS(transforms);
    navigator.clipboard.writeText(code);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2200);
  };

  const handleApplyInlinePaste = () => {
    if (!inlinePasteText.trim()) return;
    const res = parseImportedConfig(inlinePasteText);
    if (!res.success) {
      setInlinePasteError(res.error || 'Failed to parse configuration');
      return;
    }
    if (res.productTransforms && onApplyBatchTransforms) {
      onApplyBatchTransforms(res.productTransforms, true);
      const count = Object.keys(res.productTransforms).length;
      setInlinePasteSuccess(`Applied & saved ${count} product fit(s)!`);
      setInlinePasteError(null);
      setTimeout(() => setInlinePasteSuccess(null), 2500);
    } else if (res.singleProductTransform) {
      onSaveTransform(productId, res.singleProductTransform);
      setInlinePasteSuccess('Applied fit to current piece!');
      setInlinePasteError(null);
      setTimeout(() => setInlinePasteSuccess(null), 2500);
    } else {
      setInlinePasteError('No product transforms found in pasted text');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 sm:right-6 z-40 w-[94vw] sm:w-[420px] max-h-[calc(100vh-4.8rem)] flex flex-col rounded-2xl bg-[#120E11]/95 backdrop-blur-2xl border border-[#C6A064]/60 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#F7F0E6] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* 1. Header */}
      <div className="p-3.5 border-b border-[#2A2326] flex items-center justify-between bg-[#171215]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#C6A064]/20 border border-[#C6A064]/50 flex items-center justify-center text-[#C6A064]">
            <RotateCw size={15} />
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wider font-mono uppercase text-[#F7F0E6] flex items-center gap-1.5">
              <span>Jewelry Piece Fitter</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C6A064]/20 text-[#C6A064] font-sans font-bold">
                LIVE
              </span>
            </h3>
            <p className="text-[10px] text-[#A3999B] line-clamp-1">
              {activeProduct ? activeProduct.name : 'Adjust placement & rotation on hand'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onLivePreview(productId, null);
            onClose();
          }}
          className="p-1.5 rounded-full hover:bg-[#2A2326] text-[#A3999B] hover:text-[#F7F0E6] transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* 2. Section Tabs */}
      <div className="flex border-b border-[#241D20] bg-[#141013] text-xs">
        <button
          onClick={() => setActiveTab('rotation')}
          className={`flex-1 py-2 text-center text-[10px] font-mono tracking-wider transition ${
            activeTab === 'rotation'
              ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
              : 'text-[#8E8084] hover:text-[#F7F0E6]'
          }`}
        >
          1. ROTATE
        </button>
        <button
          onClick={() => setActiveTab('position')}
          className={`flex-1 py-2 text-center text-[10px] font-mono tracking-wider transition ${
            activeTab === 'position'
              ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
              : 'text-[#8E8084] hover:text-[#F7F0E6]'
          }`}
        >
          2. POSITION
        </button>
        <button
          onClick={() => setActiveTab('scale')}
          className={`flex-1 py-2 text-center text-[10px] font-mono tracking-wider transition ${
            activeTab === 'scale'
              ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
              : 'text-[#8E8084] hover:text-[#F7F0E6]'
          }`}
        >
          3. SIZE
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`flex-1 py-2 text-center text-[10px] font-mono tracking-wider transition flex items-center justify-center gap-1 ${
            activeTab === 'batch'
              ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
              : 'text-[#C6A064]/80 hover:text-[#F7F0E6]'
          }`}
        >
          <FileCode size={11} />
          <span>4. ALL</span>
        </button>
      </div>

      {/* 3. Tab Body */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[48vh]">
        {/* TAB 1: ROTATION */}
        {activeTab === 'rotation' && (
          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-mono tracking-wider text-[#A3999B] mb-2 uppercase">
                ONE-TAP ROTATION PRESETS
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyQuickRotation(90, 25, 0)}
                  className="py-1.5 px-2 rounded-lg bg-[#1C1619] hover:bg-[#2A2125] border border-[#2D2427] hover:border-[#C6A064]/40 text-[10px] font-mono text-[#E2D2B0] transition text-left"
                >
                  <span className="font-bold text-[#C6A064]">Finger Slant:</span> 25°
                </button>
                <button
                  onClick={() => applyQuickRotation(90, 45, 0)}
                  className="py-1.5 px-2 rounded-lg bg-[#1C1619] hover:bg-[#2A2125] border border-[#2D2427] hover:border-[#C6A064]/40 text-[10px] font-mono text-[#E2D2B0] transition text-left"
                >
                  <span className="font-bold text-[#C6A064]">Finger Slant:</span> 45°
                </button>
                <button
                  onClick={() => applyQuickRotation(90, 0, 0)}
                  className="py-1.5 px-2 rounded-lg bg-[#1C1619] hover:bg-[#2A2125] border border-[#2D2427] hover:border-[#C6A064]/40 text-[10px] font-mono text-[#E2D2B0] transition text-left"
                >
                  <span className="font-bold text-[#C6A064]">Lie Flat:</span> 90° X
                </button>
                <button
                  onClick={() => applyQuickRotation(0, 0, 0)}
                  className="py-1.5 px-2 rounded-lg bg-[#1C1619] hover:bg-[#2A2125] border border-[#2D2427] hover:border-[#C6A064]/40 text-[10px] font-mono text-[#E2D2B0] transition text-left"
                >
                  <span className="font-bold text-[#C6A064]">Straight:</span> 0°
                </button>
              </div>
            </div>

            <div className="border-t border-[#231C20] pt-3 space-y-3.5">
              <PrecisionSlider
                label="Rot X (Pitch / Tilt Up-Down)"
                value={rotXDeg}
                unit="°"
                min={-180}
                max={180}
                step={1}
                bigStep={5}
                onChange={(v) => updateRot(setRotXDeg, v, 'rx')}
              />

              <PrecisionSlider
                label="Rot Y (Yaw / Finger Heading)"
                value={rotYDeg}
                unit="°"
                min={-180}
                max={180}
                step={1}
                bigStep={5}
                onChange={(v) => updateRot(setRotYDeg, v, 'ry')}
              />

              <PrecisionSlider
                label="Rot Z (Roll / Ring Twist)"
                value={rotZDeg}
                unit="°"
                min={-180}
                max={180}
                step={1}
                bigStep={5}
                onChange={(v) => updateRot(setRotZDeg, v, 'rz')}
              />
            </div>

            <div className="p-2.5 rounded-xl bg-[#171215] border border-[#261E22] flex items-center gap-2 text-[10px] text-[#A3999B]">
              <Info size={13} className="text-[#C6A064] shrink-0" />
              <span>Rotations move the ring band and signet face together as one unit.</span>
            </div>
          </div>
        )}

        {/* TAB 2: POSITION */}
        {activeTab === 'position' && (
          <div className="space-y-3.5">
            <div className="text-[10px] font-mono tracking-wider text-[#A3999B] mb-2 flex items-center justify-between">
              <span>POSITION COORDINATES (METERS)</span>
              <span className="text-[#C6A064]">STEP: ±0.002m</span>
            </div>

            <PrecisionSlider
              label="Position X (Left / Right)"
              value={posX}
              unit="m"
              min={-0.6}
              max={0.6}
              step={0.002}
              bigStep={0.01}
              onChange={(v) => updatePos(setPosX, v, 'x')}
            />

            <PrecisionSlider
              label="Position Y (Up / Down)"
              value={posY}
              unit="m"
              min={0.5}
              max={2.0}
              step={0.002}
              bigStep={0.01}
              onChange={(v) => updatePos(setPosY, v, 'y')}
            />

            <PrecisionSlider
              label="Position Z (Forward / In-depth)"
              value={posZ}
              unit="m"
              min={-0.4}
              max={0.4}
              step={0.002}
              bigStep={0.01}
              onChange={(v) => updatePos(setPosZ, v, 'z')}
            />

            <div className="p-2.5 rounded-xl bg-[#171215] border border-[#261E22] text-[10px] font-mono text-[#A3999B] space-y-1">
              <div>
                Hand/Finger target:{' '}
                <span className="text-[#F7F0E6]">X: -0.09, Y: 1.63, Z: -0.052</span>
              </div>
              <div>
                Wrist/Arm target:{' '}
                <span className="text-[#F7F0E6]">X: -0.13, Y: 0.89, Z: 0.11</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SIZE / FIT */}
        {activeTab === 'scale' && (
          <div className="space-y-4">
            <PrecisionSlider
              label="Uniform Scale Factor"
              value={scale}
              unit="x"
              min={0.2}
              max={2.5}
              step={0.02}
              bigStep={0.1}
              onChange={updateScaleVal}
            />

            <div>
              <span className="block text-[10px] font-mono tracking-wider text-[#A3999B] mb-2 uppercase">
                QUICK SIZE PRESETS
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[0.8, 0.9, 1.0, 1.15].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateScaleVal(s)}
                    className={`py-1.5 rounded-lg border text-[11px] font-mono transition ${
                      scale === s
                        ? 'bg-[#603A46] border-[#C6A064] text-[#F7F0E6] font-bold'
                        : 'bg-[#1C1619] border-[#2D2427] text-[#A3999B] hover:text-[#F7F0E6]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BATCH ALL (COPY / PASTE) */}
        {activeTab === 'batch' && (
          <div className="space-y-3.5">
            <div>
              <span className="block text-[10px] font-mono tracking-wider text-[#A3999B] mb-1.5 uppercase">
                COPY ALL PRODUCTS (12 PIECES)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyAllTransforms}
                  className="py-2 px-2 rounded-xl bg-[#603A46]/40 hover:bg-[#603A46]/70 border border-[#C6A064]/50 text-[10px] font-mono text-[#F7F0E6] flex items-center justify-center gap-1.5 transition"
                >
                  {copiedAll ? <Check size={12} className="text-[#C6A064]" /> : <Copy size={12} />}
                  <span>{copiedAll ? 'COPIED TS!' : 'COPY ALL (TS CODE)'}</span>
                </button>
                <button
                  onClick={() => {
                    const json = exportAllProductTransformsJSON(transforms);
                    navigator.clipboard.writeText(json);
                    setCopiedAll(true);
                    setTimeout(() => setCopiedAll(false), 2200);
                  }}
                  className="py-2 px-2 rounded-xl bg-[#1F171A] hover:bg-[#2C2126] border border-[#2D2427] text-[10px] font-mono text-[#A3999B] hover:text-[#F7F0E6] flex items-center justify-center gap-1.5 transition"
                >
                  <Copy size={12} />
                  <span>COPY ALL (JSON)</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono tracking-wider text-[#A3999B] uppercase">
                  PASTE CONFIG TO APPLY LIVE
                </span>
                {onOpenConfigHub && (
                  <button
                    onClick={onOpenConfigHub}
                    className="text-[9px] text-[#C6A064] hover:underline font-mono"
                  >
                    Open Full Hub ↗
                  </button>
                )}
              </div>

              <textarea
                value={inlinePasteText}
                onChange={(e) => {
                  setInlinePasteText(e.target.value);
                  setInlinePasteError(null);
                }}
                placeholder="Paste code or JSON here (e.g. { 5: { position: [-0.09, 1.63, -0.052], ... } })"
                className="w-full h-24 p-2.5 rounded-xl bg-[#0A080A] border border-[#2D2427] focus:border-[#C6A064] text-[10px] font-mono text-[#E5D5BA] placeholder:text-[#5E5256] outline-none transition resize-none leading-relaxed"
              />

              {inlinePasteError && (
                <p className="text-[10px] text-[#FEB2B2] mt-1 font-mono">{inlinePasteError}</p>
              )}
              {inlinePasteSuccess && (
                <p className="text-[10px] text-[#9AE6B4] mt-1 font-mono font-semibold flex items-center gap-1">
                  <Check size={11} />
                  <span>{inlinePasteSuccess}</span>
                </p>
              )}

              <div className="flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text) setInlinePasteText(text);
                    } catch {}
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#1F171A] hover:bg-[#2C2126] border border-[#2D2427] text-[10px] font-mono text-[#A3999B] hover:text-[#F7F0E6] transition flex items-center gap-1"
                >
                  <ClipboardPaste size={11} />
                  <span>Paste Clipboard</span>
                </button>

                <button
                  onClick={handleApplyInlinePaste}
                  disabled={!inlinePasteText.trim()}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 ${
                    inlinePasteText.trim()
                      ? 'bg-[#603A46] hover:bg-[#852F3A] text-[#F7F0E6] border border-[#C6A064]/50 cursor-pointer'
                      : 'bg-[#1C1619] text-[#605558] border border-[#2D2427] cursor-not-allowed'
                  }`}
                >
                  <Check size={11} />
                  <span>APPLY & SAVE</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer Actions */}
      <div className="p-3.5 border-t border-[#241D20] bg-[#171215] flex flex-col gap-2">
        {/* Save & Reset row */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#603A46] hover:bg-[#852F3A] text-[#F7F0E6] border border-[#C6A064]/50 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
          >
            {savedBadge ? <Check size={14} strokeWidth={3} /> : <Check size={14} />}
            <span>{savedBadge ? 'SAVED TO MEMORY!' : 'SAVE FIT FOR THIS PIECE'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-[#1F171A] hover:bg-[#2D2327] text-[#8E8084] hover:text-[#F7F0E6] border border-[#2A2326] transition"
            title="Reset this piece back to default position & rotation"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Dual Copy Buttons: Single Piece vs All Pieces */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyCode}
            className="py-2 px-2.5 rounded-xl bg-[#1A1417] hover:bg-[#231A1F] border border-[#2D2427] text-[10px] font-mono text-[#A3999B] hover:text-[#F7F0E6] flex items-center justify-center gap-1.5 transition"
            title="Copy TypeScript snippet for currently selected piece"
          >
            {copied ? <Check size={12} className="text-[#C6A064]" /> : <Copy size={12} />}
            <span>{copied ? 'COPIED PIECE!' : 'COPY THIS PIECE'}</span>
          </button>

          <button
            onClick={handleCopyAllTransforms}
            className="py-2 px-2.5 rounded-xl bg-[#603A46]/30 hover:bg-[#603A46]/50 border border-[#C6A064]/40 text-[10px] font-mono text-[#C6A064] hover:text-[#F7F0E6] flex items-center justify-center gap-1.5 transition font-semibold"
            title="Copy TypeScript code for all 12 jewelry products"
          >
            {copiedAll ? <Check size={12} className="text-[#C6A064]" /> : <Copy size={12} />}
            <span>{copiedAll ? 'COPIED ALL 12!' : 'COPY ALL PIECES'}</span>
          </button>
        </div>

        {/* Config Hub / Paste Dialog Trigger */}
        {onOpenConfigHub && (
          <button
            onClick={onOpenConfigHub}
            className="w-full py-2 px-3 rounded-xl bg-[#171215] hover:bg-[#20181C] border border-[#C6A064]/30 text-[11px] text-[#C6A064] hover:text-[#F7F0E6] flex items-center justify-center gap-2 transition font-mono"
            title="Open Full Batch Configuration Hub (Copy, Paste, Import, Export, Download, Upload)"
          >
            <ClipboardPaste size={13} className="text-[#C6A064]" />
            <span>PASTE / BATCH CONFIG HUB</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Precision Slider Component with +/- buttons
function PrecisionSlider({
  label,
  value,
  unit,
  min,
  max,
  step,
  bigStep,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  bigStep: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-[#A3999B]">{label}</span>
        <span className="font-mono text-[#F7F0E6] font-semibold">
          {typeof value === 'number' ? (unit === '°' ? `${value}°` : value.toFixed(3)) : value}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(Math.max(min, value - bigStep))}
          className="w-6 h-6 rounded bg-[#1C1619] hover:bg-[#2A2125] text-[#C6A064] text-[10px] font-mono font-bold flex items-center justify-center border border-[#2D2427] transition"
          title={`-${bigStep}`}
        >
          --
        </button>
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-6 h-6 rounded bg-[#1C1619] hover:bg-[#2A2125] text-[#C6A064] text-xs font-mono font-bold flex items-center justify-center border border-[#2D2427] transition"
          title={`-${step}`}
        >
          -
        </button>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-[#C6A064] h-1.5 bg-[#251D22] rounded-lg appearance-none cursor-pointer"
        />

        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-6 h-6 rounded bg-[#1C1619] hover:bg-[#2A2125] text-[#C6A064] text-xs font-mono font-bold flex items-center justify-center border border-[#2D2427] transition"
          title={`+${step}`}
        >
          +
        </button>
        <button
          onClick={() => onChange(Math.min(max, value + bigStep))}
          className="w-6 h-6 rounded bg-[#1C1619] hover:bg-[#2A2125] text-[#C6A064] text-[10px] font-mono font-bold flex items-center justify-center border border-[#2D2427] transition"
          title={`+${bigStep}`}
        >
          ++
        </button>
      </div>
    </div>
  );
}
