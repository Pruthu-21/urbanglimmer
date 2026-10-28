'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  Copy,
  ClipboardPaste,
  Download,
  Upload,
  RotateCcw,
  Sliders,
  FileCode,
  Sparkles,
  Layers,
  AlertCircle,
  CheckCircle2,
  Maximize2,
  Camera,
} from 'lucide-react';
import { CameraPreset, JewelryCategory, ProductTransform } from './types';
import {
  exportAllProductTransformsTS,
  exportAllProductTransformsJSON,
  exportCameraPresetsTS,
  exportFullStudioConfigJSON,
  parseImportedConfig,
  ParseResult,
} from './configManager';

interface StudioConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTransforms: Record<number, ProductTransform>;
  cameraPresets: Record<JewelryCategory, CameraPreset>;
  onApplyTransforms: (transforms: Record<number, ProductTransform>, merge: boolean) => void;
  onApplyCameraPresets: (presets: Record<JewelryCategory, CameraPreset>, merge: boolean) => void;
  onResetAllTransforms: () => void;
  onResetAllCameraPresets: () => void;
}

export default function StudioConfigModal({
  isOpen,
  onClose,
  productTransforms,
  cameraPresets,
  onApplyTransforms,
  onApplyCameraPresets,
  onResetAllTransforms,
  onResetAllCameraPresets,
}: StudioConfigModalProps) {
  const [activeTab, setActiveTab] = useState<'copy' | 'paste' | 'reset'>('copy');

  // Export state
  const [exportScope, setExportScope] = useState<'transforms-ts' | 'transforms-json' | 'cameras-ts' | 'full-json'>('transforms-ts');
  const [copiedCode, setCopiedCode] = useState(false);

  // Paste / Import state
  const [pastedText, setPastedText] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [importMergeMode, setImportMergeMode] = useState<boolean>(true); // true = merge, false = replace
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-parse automatically whenever pasted text changes
  useEffect(() => {
    if (!pastedText.trim()) {
      setParseResult(null);
      return;
    }
    const res = parseImportedConfig(pastedText);
    setParseResult(res);
  }, [pastedText]);

  if (!isOpen) return null;

  // Compute current export code string based on scope
  const getExportCode = (): string => {
    switch (exportScope) {
      case 'transforms-ts':
        return exportAllProductTransformsTS(productTransforms);
      case 'transforms-json':
        return exportAllProductTransformsJSON(productTransforms);
      case 'cameras-ts':
        return exportCameraPresetsTS(cameraPresets);
      case 'full-json':
        return exportFullStudioConfigJSON(productTransforms, cameraPresets);
    }
  };

  const currentExportCode = getExportCode();

  const handleCopyExport = () => {
    navigator.clipboard.writeText(currentExportCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2400);
  };

  const handleDownloadExport = () => {
    const isTS = exportScope === 'transforms-ts' || exportScope === 'cameras-ts';
    const filename = isTS ? `studio_config_${exportScope}.ts` : `studio_config_${exportScope}.json`;
    const mime = isTS ? 'text/typescript' : 'application/json';

    const blob = new Blob([currentExportCode], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPastedText(text);
      }
    } catch {
      // ignore clipboard read failure (e.g. permission denied)
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPastedText(content);
      }
    };
    reader.readAsText(file);
    // Reset file input so user can pick the same file again if edited
    e.target.value = '';
  };

  const handleApplyPasted = () => {
    if (!parseResult || !parseResult.success) return;

    let appliedCountMessage = '';

    if (parseResult.productTransforms) {
      onApplyTransforms(parseResult.productTransforms, importMergeMode);
      const count = Object.keys(parseResult.productTransforms).length;
      appliedCountMessage += `${count} Product Transform(s) `;
    }

    if (parseResult.cameraPresets) {
      onApplyCameraPresets(parseResult.cameraPresets, importMergeMode);
      const count = Object.keys(parseResult.cameraPresets).length;
      appliedCountMessage += `${count} Camera Preset(s) `;
    }

    setAppliedSuccess(`Successfully applied & saved ${appliedCountMessage}!`);
    setTimeout(() => {
      setAppliedSuccess(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#120E11] border border-[#C6A064]/50 shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-[#F7F0E6] overflow-hidden">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.ts,.js,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* 1. Header */}
        <div className="p-4 sm:p-5 border-b border-[#2A2326] flex items-center justify-between bg-[#171215]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C6A064]/20 border border-[#C6A064]/50 flex items-center justify-center text-[#C6A064]">
              <FileCode size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wider font-mono uppercase text-[#F7F0E6] flex items-center gap-2">
                <span>Studio Configuration Hub</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#C6A064]/20 text-[#C6A064] font-sans font-bold border border-[#C6A064]/30">
                  BATCH COPY & PASTE
                </span>
              </h2>
              <p className="text-[11px] text-[#A3999B]">
                Copy all coordinates for your codebase or paste configuration to apply live
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#2A2326] text-[#A3999B] hover:text-[#F7F0E6] transition"
            aria-label="Close configuration modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Primary Tabs */}
        <div className="flex border-b border-[#241D20] bg-[#141013] text-xs">
          <button
            onClick={() => setActiveTab('copy')}
            className={`flex-1 py-3 text-center text-xs font-mono tracking-wider transition flex items-center justify-center gap-2 ${
              activeTab === 'copy'
                ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
                : 'text-[#8E8084] hover:text-[#F7F0E6]'
            }`}
          >
            <Copy size={14} />
            <span>1. COPY ALL (EXPORT)</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-3 text-center text-xs font-mono tracking-wider transition flex items-center justify-center gap-2 ${
              activeTab === 'paste'
                ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
                : 'text-[#8E8084] hover:text-[#F7F0E6]'
            }`}
          >
            <ClipboardPaste size={14} />
            <span>2. PASTE CONFIG (IMPORT)</span>
          </button>

          <button
            onClick={() => setActiveTab('reset')}
            className={`py-3 px-5 text-center text-xs font-mono tracking-wider transition flex items-center justify-center gap-2 ${
              activeTab === 'reset'
                ? 'text-[#C6A064] border-b-2 border-[#C6A064] font-semibold bg-[#1C1619]'
                : 'text-[#8E8084] hover:text-[#F7F0E6]'
            }`}
          >
            <RotateCcw size={14} />
            <span>RESET</span>
          </button>
        </div>

        {/* 3. Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: COPY ALL (EXPORT) */}
          {activeTab === 'copy' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#A3999B] font-medium">Select Export Format:</span>

                <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#1A1417] border border-[#2D2427]">
                  <button
                    onClick={() => setExportScope('transforms-ts')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition ${
                      exportScope === 'transforms-ts'
                        ? 'bg-[#603A46] text-[#F7F0E6] font-semibold border border-[#C6A064]/50'
                        : 'text-[#8E8084] hover:text-[#F7F0E6]'
                    }`}
                  >
                    Jewelry Fits (TS Code)
                  </button>

                  <button
                    onClick={() => setExportScope('transforms-json')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition ${
                      exportScope === 'transforms-json'
                        ? 'bg-[#603A46] text-[#F7F0E6] font-semibold border border-[#C6A064]/50'
                        : 'text-[#8E8084] hover:text-[#F7F0E6]'
                    }`}
                  >
                    Jewelry Fits (JSON)
                  </button>

                  <button
                    onClick={() => setExportScope('cameras-ts')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition ${
                      exportScope === 'cameras-ts'
                        ? 'bg-[#603A46] text-[#F7F0E6] font-semibold border border-[#C6A064]/50'
                        : 'text-[#8E8084] hover:text-[#F7F0E6]'
                    }`}
                  >
                    Cameras (TS Code)
                  </button>

                  <button
                    onClick={() => setExportScope('full-json')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition ${
                      exportScope === 'full-json'
                        ? 'bg-[#603A46] text-[#F7F0E6] font-semibold border border-[#C6A064]/50'
                        : 'text-[#8E8084] hover:text-[#F7F0E6]'
                    }`}
                  >
                    Full Studio (JSON)
                  </button>
                </div>
              </div>

              {/* Code display window */}
              <div className="relative rounded-xl border border-[#2D2427] bg-[#0A080A] overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#201A1D] bg-[#120E11] text-[11px] text-[#A3999B] font-mono">
                  <span>
                    {exportScope === 'transforms-ts' && 'studioConfig.ts -> DEFAULT_PRODUCT_TRANSFORMS'}
                    {exportScope === 'transforms-json' && 'transforms.json (All product coordinates)'}
                    {exportScope === 'cameras-ts' && 'studioConfig.ts -> CAMERA_PRESETS'}
                    {exportScope === 'full-json' && 'full_studio_config.json (Transforms + Cameras)'}
                  </span>
                  <span>{currentExportCode.split('\n').length} lines</span>
                </div>

                <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[300px] text-[#E5D5BA] selection:bg-[#603A46]">
                  <code>{currentExportCode}</code>
                </pre>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleDownloadExport}
                  className="px-4 py-2.5 rounded-xl bg-[#1C1619] hover:bg-[#251E22] text-[#A3999B] hover:text-[#F7F0E6] border border-[#2D2427] text-xs font-mono font-medium flex items-center gap-2 transition"
                >
                  <Download size={14} />
                  <span>DOWNLOAD FILE</span>
                </button>

                <button
                  onClick={handleCopyExport}
                  className="px-6 py-2.5 rounded-xl bg-[#603A46] hover:bg-[#852F3A] text-[#F7F0E6] border border-[#C6A064]/60 text-xs font-mono font-bold tracking-wider flex items-center gap-2 shadow-lg transition"
                >
                  {copiedCode ? <Check size={15} className="text-[#C6A064]" /> : <Copy size={15} />}
                  <span>{copiedCode ? 'COPIED TO CLIPBOARD!' : 'COPY ALL TO CLIPBOARD'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE & IMPORT */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-[#A3999B]">
                  Paste any JSON or TypeScript snippet from code or a previous export:
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-[#1C1619] hover:bg-[#251E22] text-[#C6A064] border border-[#2D2427] text-[11px] font-mono flex items-center gap-1.5 transition"
                  >
                    <Upload size={12} />
                    <span>Upload File</span>
                  </button>

                  <button
                    onClick={handlePasteFromClipboard}
                    className="px-3 py-1.5 rounded-lg bg-[#C6A064]/20 hover:bg-[#C6A064]/30 text-[#C6A064] border border-[#C6A064]/40 text-[11px] font-mono flex items-center gap-1.5 transition"
                  >
                    <ClipboardPaste size={12} />
                    <span>Paste Clipboard</span>
                  </button>
                </div>
              </div>

              {/* Paste Textarea */}
              <div className="relative">
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`Paste configuration here... Examples:\n\n1. Full code snippet:\nexport const DEFAULT_PRODUCT_TRANSFORMS = {\n  5: { position: [-0.09, 1.63, -0.052], rotation: [1.57, 0.4, 0], scale: 1 }\n};\n\n2. Or plain JSON:\n{\n  "5": { "position": [-0.09, 1.63, -0.052], "rotation": [1.57, 0.4, 0], "scale": 1 }\n}`}
                  className="w-full h-56 p-4 rounded-xl bg-[#0A080A] border border-[#2D2427] focus:border-[#C6A064] text-[11px] font-mono text-[#E5D5BA] placeholder:text-[#5E5256] outline-none transition resize-none leading-relaxed"
                />

                {pastedText && (
                  <button
                    onClick={() => setPastedText('')}
                    className="absolute top-3 right-3 px-2 py-1 rounded bg-[#20181C] hover:bg-[#2D2227] text-[10px] text-[#A3999B] hover:text-[#F7F0E6] border border-[#2D2427] transition"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Parsing Feedback & Validation Badge */}
              {pastedText.trim() && parseResult && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                    parseResult.success
                      ? 'bg-[#15251B] border-[#29633A] text-[#9AE6B4]'
                      : 'bg-[#291419] border-[#66232D] text-[#FEB2B2]'
                  }`}
                >
                  {parseResult.success ? (
                    <CheckCircle2 size={16} className="text-[#48BB78] shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="text-[#F56565] shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold font-mono tracking-wide">{parseResult.summary}</p>
                    {parseResult.error && (
                      <p className="text-[11px] text-[#FEB2B2]/80 mt-0.5">{parseResult.error}</p>
                    )}
                    {parseResult.productTransforms && (
                      <p className="text-[10px] text-[#9AE6B4]/80 mt-1 font-mono">
                        Product IDs detected:{' '}
                        {Object.keys(parseResult.productTransforms).join(', ')}
                      </p>
                    )}
                    {parseResult.cameraPresets && (
                      <p className="text-[10px] text-[#9AE6B4]/80 mt-1 font-mono">
                        Categories detected:{' '}
                        {Object.keys(parseResult.cameraPresets).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Merge vs Replace Mode Option */}
              {parseResult?.success && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#171215] border border-[#2D2427] text-xs">
                  <span className="text-[#A3999B]">Application Mode:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setImportMergeMode(true)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-mono transition ${
                        importMergeMode
                          ? 'bg-[#C6A064]/20 text-[#C6A064] border border-[#C6A064]/50 font-bold'
                          : 'text-[#8E8084] hover:text-[#F7F0E6]'
                      }`}
                      title="Only update products/cameras included in pasted snippet; keep others"
                    >
                      Merge (Recommended)
                    </button>
                    <button
                      onClick={() => setImportMergeMode(false)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-mono transition ${
                        !importMergeMode
                          ? 'bg-[#852F3A] text-[#F7F0E6] border border-[#C6A064]/50 font-bold'
                          : 'text-[#8E8084] hover:text-[#F7F0E6]'
                      }`}
                      title="Replace entire configuration"
                    >
                      Replace All
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                {appliedSuccess ? (
                  <div className="text-xs text-[#9AE6B4] font-semibold flex items-center gap-1.5">
                    <Check size={14} className="text-[#48BB78]" />
                    <span>{appliedSuccess}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#A3999B]">
                    Changes will apply immediately in the 3D scene & persist in browser
                  </div>
                )}

                <button
                  onClick={handleApplyPasted}
                  disabled={!parseResult?.success}
                  className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-2 shadow-lg transition ${
                    parseResult?.success
                      ? 'bg-[#603A46] hover:bg-[#852F3A] text-[#F7F0E6] border border-[#C6A064]/60 cursor-pointer'
                      : 'bg-[#20181C] text-[#605558] border border-[#2D2427] cursor-not-allowed'
                  }`}
                >
                  <Check size={14} />
                  <span>APPLY & SAVE ALL CONFIG</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FACTORY RESET */}
          {activeTab === 'reset' && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-[#1C1619] border border-[#2D2427] space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-[#F7F0E6] font-mono uppercase tracking-wider">
                    Reset Product Transforms
                  </h4>
                  <p className="text-[11px] text-[#A3999B] mt-0.5">
                    Revert all rings, bracelets, necklaces, and earrings back to the calibrated factory positions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onResetAllTransforms();
                    setAppliedSuccess('All product transforms reset to factory defaults.');
                    setTimeout(() => setAppliedSuccess(null), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2A1D22] hover:bg-[#3D252D] text-[#E5D5BA] hover:text-[#FFF] border border-[#C6A064]/30 text-xs font-mono font-semibold transition"
                >
                  Reset All Jewelry Coordinates
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#1C1619] border border-[#2D2427] space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-[#F7F0E6] font-mono uppercase tracking-wider">
                    Reset Camera POV Presets
                  </h4>
                  <p className="text-[11px] text-[#A3999B] mt-0.5">
                    Revert camera distances, targets, angles, and FOV for all categories back to defaults.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onResetAllCameraPresets();
                    setAppliedSuccess('All camera POV presets reset to factory defaults.');
                    setTimeout(() => setAppliedSuccess(null), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2A1D22] hover:bg-[#3D252D] text-[#E5D5BA] hover:text-[#FFF] border border-[#C6A064]/30 text-xs font-mono font-semibold transition"
                >
                  Reset All Camera Presets
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
