'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Camera,
  Check,
  Copy,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  CircleDot,
  Maximize2,
  Eye,
  Crosshair,
  Compass,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Info,
  ClipboardPaste,
} from 'lucide-react';
import { CameraPreset, JewelryCategory } from './types';
import { CAMERA_PRESETS } from './studioConfig';
import { exportCameraPresetsTS } from './configManager';

interface PovTunerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: JewelryCategory;
  onSelectCategory: (cat: JewelryCategory) => void;
  presets: Record<JewelryCategory, CameraPreset>;
  onSavePreset: (cat: JewelryCategory, preset: CameraPreset) => void;
  onLivePreview: (preset: CameraPreset | null) => void;
  onResetCategory: (cat: JewelryCategory) => void;
  onCaptureFromScene: () => CameraPreset | null;
  onOpenConfigHub?: () => void;
}

export default function PovTunerModal({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
  presets,
  onSavePreset,
  onLivePreview,
  onResetCategory,
  onCaptureFromScene,
  onOpenConfigHub,
}: PovTunerModalProps) {
  // Local active editing values (XYZ Cartesian)
  const [posX, setPosX] = useState(-0.42);
  const [posY, setPosY] = useState(0.93);
  const [posZ, setPosZ] = useState(0.24);

  const [tarX, setTarX] = useState(-0.13);
  const [tarY, setTarY] = useState(0.89);
  const [tarZ, setTarZ] = useState(0.11);

  const [fov, setFov] = useState(23);

  const [copied, setCopied] = useState(false);
  const [copiedAllCameras, setCopiedAllCameras] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);
  const [activeTab, setActiveTab] = useState<'orbit' | 'position' | 'target' | 'zoom'>('orbit');

  // Load preset whenever activeCategory or presets change
  useEffect(() => {
    const current = presets[activeCategory] || CAMERA_PRESETS[activeCategory] || CAMERA_PRESETS['Full Model'];
    setPosX(Number(current.position[0].toFixed(3)));
    setPosY(Number(current.position[1].toFixed(3)));
    setPosZ(Number(current.position[2].toFixed(3)));

    setTarX(Number(current.target[0].toFixed(3)));
    setTarY(Number(current.target[1].toFixed(3)));
    setTarZ(Number(current.target[2].toFixed(3)));

    setFov(Math.round(current.fov));
  }, [activeCategory, presets]);

  // Derived Spherical Orbit values from current Cartesian XYZ
  const dx = posX - tarX;
  const dy = posY - tarY;
  const dz = posZ - tarZ;
  const hDist = Math.max(0.08, Math.sqrt(dx * dx + dz * dz));
  const currentAngleDeg = Math.round((Math.atan2(dx, dz) * 180) / Math.PI);

  // Push live preview to 3D scene when coordinates change
  const triggerPreview = (newPos: [number, number, number], newTar: [number, number, number], newFov: number) => {
    onLivePreview({
      position: newPos,
      target: newTar,
      fov: newFov,
    });
  };

  // Update Cartesian XYZ directly
  const updateCoord = (
    setter: (val: number) => void,
    newVal: number,
    type: 'posX' | 'posY' | 'posZ' | 'tarX' | 'tarY' | 'tarZ' | 'fov'
  ) => {
    const rounded = Number(newVal.toFixed(3));
    setter(rounded);

    const pos: [number, number, number] = [
      type === 'posX' ? rounded : posX,
      type === 'posY' ? rounded : posY,
      type === 'posZ' ? rounded : posZ,
    ];
    const tar: [number, number, number] = [
      type === 'tarX' ? rounded : tarX,
      type === 'tarY' ? rounded : tarY,
      type === 'tarZ' ? rounded : tarZ,
    ];
    const currentFov = type === 'fov' ? Math.round(rounded) : fov;

    triggerPreview(pos, tar, currentFov);
  };

  // Dynamically update Camera by Horizontal Orbit Angle (e.g. -90° = Left Side, 0° = Front)
  const setOrbitAngle = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    const newX = Number((tarX + hDist * Math.sin(rad)).toFixed(3));
    const newZ = Number((tarZ + hDist * Math.cos(rad)).toFixed(3));
    setPosX(newX);
    setPosZ(newZ);
    triggerPreview([newX, posY, newZ], [tarX, tarY, tarZ], fov);
  };

  // Dynamically update Camera Distance from Target
  const setOrbitDistance = (newDist: number) => {
    const rad = (currentAngleDeg * Math.PI) / 180;
    const newX = Number((tarX + newDist * Math.sin(rad)).toFixed(3));
    const newZ = Number((tarZ + newDist * Math.cos(rad)).toFixed(3));
    setPosX(newX);
    setPosZ(newZ);
    triggerPreview([newX, posY, newZ], [tarX, tarY, tarZ], fov);
  };

  // Dynamically update Camera Elevation Height Offset
  const setElevationOffset = (newElevation: number) => {
    const newY = Number((tarY + newElevation).toFixed(3));
    setPosY(newY);
    triggerPreview([posX, newY, posZ], [tarX, tarY, tarZ], fov);
  };

  // Quick Preset Angles (One-Tap Left Side, Front, Right, Top)
  const applyQuickAngle = (angleDeg: number, elevationOffset: number = 0.04) => {
    const targetDist =
      activeCategory === 'Rings'
        ? 0.36
        : activeCategory === 'Bracelets'
        ? 0.42
        : activeCategory === 'Earrings'
        ? 0.52
        : 0.75;
    const rad = (angleDeg * Math.PI) / 180;
    const newX = Number((tarX + targetDist * Math.sin(rad)).toFixed(3));
    const newZ = Number((tarZ + targetDist * Math.cos(rad)).toFixed(3));
    const newY = Number((tarY + elevationOffset).toFixed(3));

    setPosX(newX);
    setPosY(newY);
    setPosZ(newZ);
    triggerPreview([newX, newY, newZ], [tarX, tarY, tarZ], fov);
  };

  const handleCapture = () => {
    const captured = onCaptureFromScene();
    if (captured) {
      setPosX(Number(captured.position[0].toFixed(3)));
      setPosY(Number(captured.position[1].toFixed(3)));
      setPosZ(Number(captured.position[2].toFixed(3)));

      setTarX(Number(captured.target[0].toFixed(3)));
      setTarY(Number(captured.target[1].toFixed(3)));
      setTarZ(Number(captured.target[2].toFixed(3)));

      setFov(Math.round(captured.fov));

      triggerPreview(captured.position, captured.target, captured.fov);
    }
  };

  const handleSave = () => {
    const preset: CameraPreset = {
      position: [posX, posY, posZ],
      target: [tarX, tarY, tarZ],
      fov,
    };
    onSavePreset(activeCategory, preset);
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2400);
  };

  const handleReset = () => {
    onResetCategory(activeCategory);
    const def = CAMERA_PRESETS[activeCategory];
    if (def) {
      setPosX(def.position[0]);
      setPosY(def.position[1]);
      setPosZ(def.position[2]);
      setTarX(def.target[0]);
      setTarY(def.target[1]);
      setTarZ(def.target[2]);
      setFov(def.fov);
      triggerPreview(def.position, def.target, def.fov);
    }
  };

  const handleCopyCode = () => {
    const code = `'${activeCategory}': {
  position: [${posX}, ${posY}, ${posZ}],
  target: [${tarX}, ${tarY}, ${tarZ}],
  fov: ${fov},
},`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!isOpen) return null;

  const categories = [
    { cat: 'Bracelets' as const, label: 'Wrist', icon: Layers },
    { cat: 'Rings' as const, label: 'Rings', icon: Maximize2 },
    { cat: 'Necklaces' as const, label: 'Neck', icon: CircleDot },
    { cat: 'Earrings' as const, label: 'Ears', icon: Sparkles },
    { cat: 'Full Model' as const, label: 'Full', icon: Eye },
  ];

  // Helper label describing current angle orientation
  const getAngleLabel = (deg: number) => {
    if (deg <= -70 && deg >= -110) return '👈 PURE LEFT SIDE (90°)';
    if (deg < -25 && deg > -70) return '📐 FRONT-LEFT ANGLE (45°)';
    if (deg >= -25 && deg <= 25) return '🎯 DIRECT FRONT VIEW (0°)';
    if (deg > 25 && deg < 70) return '📐 FRONT-RIGHT ANGLE (45°)';
    if (deg >= 70 && deg <= 110) return '👉 PURE RIGHT SIDE (90°)';
    return '🔄 REAR VIEW';
  };

  return (
    <div className="absolute top-16 left-20 sm:left-24 z-40 w-[94vw] sm:w-[420px] max-h-[calc(100vh-4.8rem)] flex flex-col rounded-2xl bg-[#120E11]/95 backdrop-blur-2xl border border-[#C6A064]/50 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#F7F0E6] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* 1. Header */}
      <div className="p-3.5 border-b border-[#2A2326] flex items-center justify-between bg-[#171215]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#C6A064]/20 border border-[#C6A064]/40 flex items-center justify-center text-[#C6A064]">
            <Compass size={16} />
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wider font-mono uppercase text-[#F7F0E6] flex items-center gap-1.5">
              <span>POV Camera Director</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C6A064]/20 text-[#C6A064] font-sans font-bold">
                DYNAMIC
              </span>
            </h3>
            <p className="text-[10px] text-[#A3999B]">Move camera to left side or anywhere dynamically</p>
          </div>
        </div>

        <button
          onClick={() => {
            onLivePreview(null);
            onClose();
          }}
          className="p-1.5 rounded-full hover:bg-[#2A2326] text-[#A3999B] hover:text-[#F7F0E6] transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* 2. Category Selector Tabs */}
      <div className="p-2 border-b border-[#241D20] bg-[#0E0B0D]">
        <span className="block text-[9px] font-mono tracking-widest text-[#73666A] uppercase mb-1.5 px-1">
          FOCUS PIECE TO POSITION
        </span>
        <div className="grid grid-cols-5 gap-1">
          {categories.map((c) => {
            const isCur = activeCategory === c.cat;
            const Icon = c.icon;
            return (
              <button
                key={c.cat}
                onClick={() => {
                  onLivePreview(null);
                  onSelectCategory(c.cat);
                }}
                className={`py-1.5 px-1 rounded-lg text-center flex flex-col items-center gap-1 transition ${
                  isCur
                    ? 'bg-[#C6A064] text-[#120E11] font-bold shadow-md'
                    : 'bg-[#181316] text-[#A3999B] hover:text-[#F7F0E6] hover:bg-[#221B1F]'
                }`}
              >
                <Icon size={12} />
                <span className="text-[9px] tracking-wider uppercase font-semibold">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Section Tabs */}
      <div className="flex border-b border-[#241D20] bg-[#141013] text-xs">
        <button
          onClick={() => setActiveTab('orbit')}
          className={`flex-1 py-2 text-center text-[10px] font-mono tracking-wider transition ${
            activeTab === 'orbit'
              ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
              : 'text-[#8E8084] hover:text-[#F7F0E6]'
          }`}
        >
          1. ORBIT & SIDES
        </button>
        <button
          onClick={() => setActiveTab('position')}
          className={`flex-1 py-2 text-center text-[10px] font-mono tracking-wider transition ${
            activeTab === 'position'
              ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
              : 'text-[#8E8084] hover:text-[#F7F0E6]'
          }`}
        >
          2. XYZ POSITION
        </button>
        <button
          onClick={() => setActiveTab('target')}
          className={`flex-1 py-2 text-center text-[10px] font-mono tracking-wider transition ${
            activeTab === 'target'
              ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
              : 'text-[#8E8084] hover:text-[#F7F0E6]'
          }`}
        >
          3. TARGET
        </button>
        <button
          onClick={() => setActiveTab('zoom')}
          className={`flex-1 py-2 text-center text-[10px] font-mono tracking-wider transition ${
            activeTab === 'zoom'
              ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
              : 'text-[#8E8084] hover:text-[#F7F0E6]'
          }`}
        >
          4. ZOOM
        </button>
      </div>

      {/* 4. Tab Body */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[48vh]">
        {/* TAB 1: DYNAMIC ORBIT & ANGLES (Left side view etc.) */}
        {activeTab === 'orbit' && (
          <div className="space-y-4">
            {/* Quick Angle Presets */}
            <div>
              <span className="block text-[10px] font-mono tracking-wider text-[#A3999B] mb-2 uppercase">
                ONE-TAP QUICK ANGLES (SWING CAMERA)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => applyQuickAngle(-85, 0.04)}
                  className="py-2 px-2 rounded-xl bg-[#20181D] hover:bg-[#2F2129] border border-[#C6A064]/60 text-[#C6A064] text-[11px] font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                  title="Move camera directly to the left side of the piece"
                >
                  <ArrowLeft size={13} strokeWidth={2.5} />
                  <span>LEFT SIDE (90°)</span>
                </button>

                <button
                  onClick={() => applyQuickAngle(-45, 0.06)}
                  className="py-2 px-2 rounded-xl bg-[#181316] hover:bg-[#251E23] border border-[#2D2427] hover:border-[#C6A064]/50 text-[#F7F0E6] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                  title="Move camera to front-left 45 degree angle"
                >
                  <span>LEFT 45°</span>
                </button>

                <button
                  onClick={() => applyQuickAngle(0, 0.05)}
                  className="py-2 px-2 rounded-xl bg-[#181316] hover:bg-[#251E23] border border-[#2D2427] hover:border-[#C6A064]/50 text-[#F7F0E6] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                  title="Move camera straight in front"
                >
                  <Crosshair size={13} />
                  <span>FRONT (0°)</span>
                </button>

                <button
                  onClick={() => applyQuickAngle(45, 0.06)}
                  className="py-2 px-2 rounded-xl bg-[#181316] hover:bg-[#251E23] border border-[#2D2427] hover:border-[#C6A064]/50 text-[#F7F0E6] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <span>RIGHT 45°</span>
                </button>

                <button
                  onClick={() => applyQuickAngle(85, 0.04)}
                  className="py-2 px-2 rounded-xl bg-[#181316] hover:bg-[#251E23] border border-[#2D2427] hover:border-[#C6A064]/50 text-[#F7F0E6] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <span>RIGHT SIDE</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  onClick={() => applyQuickAngle(-35, 0.22)}
                  className="py-2 px-2 rounded-xl bg-[#181316] hover:bg-[#251E23] border border-[#2D2427] hover:border-[#C6A064]/50 text-[#F7F0E6] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <ArrowUp size={13} />
                  <span>TOP-DOWN</span>
                </button>
              </div>
            </div>

            {/* Orbit Horizontal Angle Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#171216] border border-[#2E2428]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#A3999B] font-medium">Horizontal Camera Orbit</span>
                <span className="text-[#C6A064] font-mono font-bold text-[11px]">
                  {getAngleLabel(currentAngleDeg)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrbitAngle(Math.max(-180, currentAngleDeg - 10))}
                  className="w-7 h-7 rounded bg-[#20181D] hover:bg-[#2F2129] text-[#C6A064] text-xs font-mono font-bold flex items-center justify-center border border-[#34292F] transition"
                  title="Orbit camera 10° further to the left"
                >
                  ◀
                </button>

                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={currentAngleDeg}
                  onChange={(e) => setOrbitAngle(parseInt(e.target.value, 10))}
                  className="flex-1 accent-[#C6A064] h-2 bg-[#251D22] rounded-lg appearance-none cursor-pointer"
                />

                <button
                  onClick={() => setOrbitAngle(Math.min(180, currentAngleDeg + 10))}
                  className="w-7 h-7 rounded bg-[#20181D] hover:bg-[#2F2129] text-[#C6A064] text-xs font-mono font-bold flex items-center justify-center border border-[#34292F] transition"
                  title="Orbit camera 10° further to the right"
                >
                  ▶
                </button>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#73666A]">
                <span>-180° (Back)</span>
                <span className="text-[#C6A064]">-90° (Left Side)</span>
                <span>0° (Front)</span>
                <span>+90° (Right)</span>
                <span>+180°</span>
              </div>
            </div>

            {/* Camera Distance Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#171216] border border-[#2E2428]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#A3999B]">Camera Distance (Radius)</span>
                <span className="text-[#C6A064] font-mono font-bold">{hDist.toFixed(2)}m</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrbitDistance(Math.max(0.12, hDist - 0.05))}
                  className="w-7 h-7 rounded bg-[#20181D] hover:bg-[#2F2129] text-[#C6A064] text-xs font-mono font-bold flex items-center justify-center border border-[#34292F] transition"
                >
                  -
                </button>
                <input
                  type="range"
                  min={0.12}
                  max={2.0}
                  step={0.01}
                  value={hDist}
                  onChange={(e) => setOrbitDistance(parseFloat(e.target.value))}
                  className="flex-1 accent-[#C6A064] h-2 bg-[#251D22] rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => setOrbitDistance(Math.min(2.0, hDist + 0.05))}
                  className="w-7 h-7 rounded bg-[#20181D] hover:bg-[#2F2129] text-[#C6A064] text-xs font-mono font-bold flex items-center justify-center border border-[#34292F] transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Camera Elevation (Height) */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#171216] border border-[#2E2428]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#A3999B]">Camera Height (Elevation Offset)</span>
                <span className="text-[#C6A064] font-mono font-bold">
                  {dy >= 0 ? `+${dy.toFixed(2)}m` : `${dy.toFixed(2)}m`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setElevationOffset(Math.max(-0.4, dy - 0.05))}
                  className="w-7 h-7 rounded bg-[#20181D] hover:bg-[#2F2129] text-[#C6A064] text-xs font-mono font-bold flex items-center justify-center border border-[#34292F] transition"
                >
                  -
                </button>
                <input
                  type="range"
                  min={-0.4}
                  max={0.8}
                  step={0.01}
                  value={dy}
                  onChange={(e) => setElevationOffset(parseFloat(e.target.value))}
                  className="flex-1 accent-[#C6A064] h-2 bg-[#251D22] rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => setElevationOffset(Math.min(0.8, dy + 0.05))}
                  className="w-7 h-7 rounded bg-[#20181D] hover:bg-[#2F2129] text-[#C6A064] text-xs font-mono font-bold flex items-center justify-center border border-[#34292F] transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CARTESIAN POSITION (XYZ) */}
        {activeTab === 'position' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#A3999B]">
              <span>Camera XYZ Coordinates</span>
              <span className="text-[#C6A064] font-mono text-[10px]">
                [{posX.toFixed(2)}, {posY.toFixed(2)}, {posZ.toFixed(2)}]
              </span>
            </div>

            {/* Pos X */}
            <CoordinateSlider
              label="Position X (Negative = Left Side)"
              value={posX}
              min={-2.5}
              max={2.5}
              step={0.01}
              onChange={(v) => updateCoord(setPosX, v, 'posX')}
            />

            {/* Pos Y */}
            <CoordinateSlider
              label="Position Y (Elevation Up ↕ Down)"
              value={posY}
              min={0.2}
              max={2.6}
              step={0.01}
              onChange={(v) => updateCoord(setPosY, v, 'posY')}
            />

            {/* Pos Z */}
            <CoordinateSlider
              label="Position Z (Front ↔ Side/Back)"
              value={posZ}
              min={-1.8}
              max={3.2}
              step={0.01}
              onChange={(v) => updateCoord(setPosZ, v, 'posZ')}
            />
          </div>
        )}

        {/* TAB 3: FOCUS TARGET (XYZ) */}
        {activeTab === 'target' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#A3999B]">
              <span>Look-At Target Focal Center</span>
              <span className="text-[#C6A064] font-mono text-[10px]">
                [{tarX.toFixed(2)}, {tarY.toFixed(2)}, {tarZ.toFixed(2)}]
              </span>
            </div>

            {/* Target X */}
            <CoordinateSlider
              label="Target X (Aim Left ↔ Right)"
              value={tarX}
              min={-1.5}
              max={1.5}
              step={0.01}
              onChange={(v) => updateCoord(setTarX, v, 'tarX')}
            />

            {/* Target Y */}
            <CoordinateSlider
              label="Target Y (Aim Down ↕ Up)"
              value={tarY}
              min={0.2}
              max={2.4}
              step={0.01}
              onChange={(v) => updateCoord(setTarY, v, 'tarY')}
            />

            {/* Target Z */}
            <CoordinateSlider
              label="Target Z (Aim Depth)"
              value={tarZ}
              min={-1.0}
              max={1.2}
              step={0.01}
              onChange={(v) => updateCoord(setTarZ, v, 'tarZ')}
            />
          </div>
        )}

        {/* TAB 4: ZOOM / FOV */}
        {activeTab === 'zoom' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#A3999B]">
              <span>Field of View (Macro Zoom)</span>
              <span className="text-[#C6A064] font-mono text-[11px] font-bold">{fov}°</span>
            </div>

            <CoordinateSlider
              label="FOV (Lower = Closer Macro Framing)"
              value={fov}
              min={14}
              max={55}
              step={1}
              onChange={(v) => updateCoord(setFov, v, 'fov')}
            />

            <div className="p-3 rounded-xl bg-[#181316] border border-[#2D2427] text-[11px] text-[#A3999B] space-y-1.5">
              <div className="flex items-center gap-2 text-[#C6A064] font-medium text-xs">
                <Info size={14} />
                <span>Mouse / Touch 3D Controls</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[10px] text-[#8E8084]">
                <li><strong>Drag right/left:</strong> Dynamically orbits camera around target</li>
                <li><strong>Right-click or Shift+drag:</strong> Pans focal target</li>
                <li><strong>Scroll wheel:</strong> Smooth zoom in / out</li>
              </ul>
            </div>
          </div>
        )}

        {/* Quick Capture Button */}
        <button
          onClick={handleCapture}
          className="w-full py-2.5 px-3 rounded-xl bg-[#1A1518] hover:bg-[#251D22] border border-[#C6A064]/50 text-[#C6A064] hover:text-[#F7F0E6] text-[11px] font-bold tracking-wider flex items-center justify-center gap-2 transition shadow-sm"
          title="Capture current camera position after dragging in 3D canvas"
        >
          <Crosshair size={14} />
          <span>CAPTURE CURRENT 3D CANVAS VIEW</span>
        </button>
      </div>

      {/* 5. Footer Actions */}
      <div className="p-3.5 border-t border-[#241D20] bg-[#151013] flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#C6A064] hover:bg-[#D4B37F] text-[#120E11] text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition shadow-md"
          >
            {savedBadge ? <Check size={14} strokeWidth={3} /> : <Camera size={14} />}
            <span>{savedBadge ? 'SAVED TO MEMORY!' : `SAVE AS ${activeCategory.toUpperCase()} POV`}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-[#1F171A] hover:bg-[#2D2327] text-[#8E8084] hover:text-[#F7F0E6] border border-[#2A2326] transition"
            title="Reset active category back to factory preset"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Dual Copy Buttons: Single Preset vs All Categories */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyCode}
            className="py-2 px-2.5 rounded-xl bg-[#1A1417] hover:bg-[#231A1F] border border-[#2D2427] text-[10px] font-mono text-[#A3999B] hover:text-[#F7F0E6] flex items-center justify-center gap-1.5 transition"
            title="Copy TypeScript snippet for current category"
          >
            {copied ? <Check size={12} className="text-[#C6A064]" /> : <Copy size={12} />}
            <span>{copied ? 'COPIED!' : 'COPY THIS POV'}</span>
          </button>

          <button
            onClick={() => {
              const code = exportCameraPresetsTS(presets);
              navigator.clipboard.writeText(code);
              setCopiedAllCameras(true);
              setTimeout(() => setCopiedAllCameras(false), 2200);
            }}
            className="py-2 px-2.5 rounded-xl bg-[#603A46]/30 hover:bg-[#603A46]/50 border border-[#C6A064]/40 text-[10px] font-mono text-[#C6A064] hover:text-[#F7F0E6] flex items-center justify-center gap-1.5 transition font-semibold"
            title="Copy TypeScript code for all 5 camera category presets"
          >
            {copiedAllCameras ? <Check size={12} className="text-[#C6A064]" /> : <Copy size={12} />}
            <span>{copiedAllCameras ? 'COPIED ALL!' : 'COPY ALL POVS'}</span>
          </button>
        </div>

        {/* Config Hub Trigger */}
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

// Micro Coordinate Slider Sub-Component
function CoordinateSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-[#A3999B]">{label}</span>
        <span className="font-mono text-[#F7F0E6] font-semibold">{value.toFixed(2)}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step * 2))}
          className="w-6 h-6 rounded bg-[#1C1619] hover:bg-[#2A2125] text-[#C6A064] text-xs font-mono flex items-center justify-center border border-[#2D2427] transition"
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
          onClick={() => onChange(Math.min(max, value + step * 2))}
          className="w-6 h-6 rounded bg-[#1C1619] hover:bg-[#2A2125] text-[#C6A064] text-xs font-mono flex items-center justify-center border border-[#2D2427] transition"
        >
          +
        </button>
      </div>
    </div>
  );
}
