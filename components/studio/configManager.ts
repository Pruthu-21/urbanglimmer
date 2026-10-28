import { CameraPreset, JewelryCategory, ProductTransform, StudioProduct } from './types';
import { STUDIO_PRODUCTS, CAMERA_PRESETS, DEFAULT_PRODUCT_TRANSFORMS } from './studioConfig';

export interface StudioConfigExport {
  version: string;
  exportedAt: string;
  productTransforms: Record<number, ProductTransform>;
  cameraPresets: Record<JewelryCategory, CameraPreset>;
}

export interface ParseResult {
  success: boolean;
  productTransforms?: Record<number, ProductTransform>;
  cameraPresets?: Record<JewelryCategory, CameraPreset>;
  singleProductTransform?: ProductTransform;
  singleCameraPreset?: { category?: JewelryCategory; preset: CameraPreset };
  summary: string;
  error?: string;
}

/**
 * Generate clean TypeScript code for all product transforms,
 * grouped by category with comments, ready to paste directly into studioConfig.ts.
 */
export function exportAllProductTransformsTS(
  transforms: Record<number, ProductTransform>,
  customProducts: StudioProduct[] = []
): string {
  const allProds = [...STUDIO_PRODUCTS, ...customProducts];
  const categories: JewelryCategory[] = ['Rings', 'Necklaces', 'Bracelets', 'Earrings'];
  let code = `export const DEFAULT_PRODUCT_TRANSFORMS: Record<number, ProductTransform> = {\n`;

  categories.forEach((cat) => {
    const prods = allProds.filter((p) => p.category === cat);
    if (prods.length === 0) return;

    code += `  // ==========================================\n`;
    code += `  // --- ${cat} ---\n`;
    code += `  // ==========================================\n`;

    prods.forEach((p) => {
      const tf = transforms[p.id] || DEFAULT_PRODUCT_TRANSFORMS[p.id] || {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1.0,
      };

      const posX = Number(tf.position[0].toFixed(3));
      const posY = Number(tf.position[1].toFixed(3));
      const posZ = Number(tf.position[2].toFixed(3));

      const rotX = Number(tf.rotation[0].toFixed(3));
      const rotY = Number(tf.rotation[1].toFixed(3));
      const rotZ = Number(tf.rotation[2].toFixed(3));

      const rotXDeg = Math.round((tf.rotation[0] * 180) / Math.PI);
      const rotYDeg = Math.round((tf.rotation[1] * 180) / Math.PI);
      const rotZDeg = Math.round((tf.rotation[2] * 180) / Math.PI);

      code += `  ${p.id}: {\n`;
      code += `    // ${p.name}\n`;
      code += `    position: [${posX}, ${posY}, ${posZ}],\n`;
      code += `    rotation: [${rotX}, ${rotY}, ${rotZ}], // [${rotXDeg}°, ${rotYDeg}°, ${rotZDeg}°]\n`;
      code += `    scale: ${Number(tf.scale.toFixed(2))},\n`;
      code += `  },\n`;
    });
    code += `\n`;
  });

  code += `};`;
  return code;
}

/**
 * Export product transforms as JSON
 */
export function exportAllProductTransformsJSON(
  transforms: Record<number, ProductTransform>
): string {
  return JSON.stringify(transforms, null, 2);
}

/**
 * Generate clean TypeScript code for all camera presets
 */
export function exportCameraPresetsTS(
  presets: Record<JewelryCategory, CameraPreset>
): string {
  const categories: JewelryCategory[] = [
    'Full Model',
    'Earrings',
    'Necklaces',
    'Rings',
    'Bracelets',
  ];

  let code = `export const CAMERA_PRESETS: Record<JewelryCategory, CameraPreset> = {\n`;

  categories.forEach((cat) => {
    const p = presets[cat] || CAMERA_PRESETS[cat];
    if (!p) return;

    const posX = Number(p.position[0].toFixed(3));
    const posY = Number(p.position[1].toFixed(3));
    const posZ = Number(p.position[2].toFixed(3));

    const tarX = Number(p.target[0].toFixed(3));
    const tarY = Number(p.target[1].toFixed(3));
    const tarZ = Number(p.target[2].toFixed(3));

    code += `  '${cat}': {\n`;
    code += `    position: [${posX}, ${posY}, ${posZ}],\n`;
    code += `    target: [${tarX}, ${tarY}, ${tarZ}],\n`;
    code += `    fov: ${Math.round(p.fov)},\n`;
    code += `  },\n`;
  });

  code += `};`;
  return code;
}

/**
 * Export full Studio config (both product transforms and camera presets)
 */
export function exportFullStudioConfigJSON(
  transforms: Record<number, ProductTransform>,
  presets: Record<JewelryCategory, CameraPreset>
): string {
  const payload: StudioConfigExport = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    productTransforms: transforms,
    cameraPresets: presets,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Clean and normalize any JavaScript/TypeScript/JSON input string
 */
function cleanInputString(raw: string): string {
  let cleaned = raw.trim();

  // Strip leading TypeScript declarations e.g. "export const DEFAULT_PRODUCT_TRANSFORMS: Record<number, ProductTransform> = "
  cleaned = cleaned.replace(
    /^(export\s+)?(const|let|var)\s+[A-Za-z0-9_$]+(\s*:\s*[^=]+)?\s*=\s*/m,
    ''
  );

  // Strip trailing semicolons
  cleaned = cleaned.replace(/;\s*$/, '');

  // Find boundaries of the outermost object if embedded in extra code
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // Remove single line comments // ...
  cleaned = cleaned.replace(/\/\/.*$/gm, '');

  // Remove multi-line comments /* ... */
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');

  return cleaned.trim();
}

/**
 * Safe evaluator that parses JSON or relaxed JS object notation without global scope pollution.
 */
function evaluateObjectLiteral(cleaned: string): any {
  // First attempt standard fast JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Fall back to safe function constructor for JS/TS object literals (supports numbers as keys, trailing commas, etc.)
    try {
      // Ensure the string looks like an object literal
      if (!cleaned.startsWith('{') || !cleaned.endsWith('}')) {
        throw new Error('Input must be an enclosed object { ... }');
      }
      const fn = new Function(`"use strict"; return (${cleaned});`);
      return fn();
    } catch (err: any) {
      throw new Error(`Syntax error: ${err.message || 'Unable to parse object'}`);
    }
  }
}

/**
 * Helper to validate if an object has valid ProductTransform shape:
 * { position: [number, number, number], rotation: [number, number, number], scale: number }
 */
function isValidProductTransform(obj: any): obj is ProductTransform {
  if (!obj || typeof obj !== 'object') return false;
  const hasPos =
    Array.isArray(obj.position) &&
    obj.position.length === 3 &&
    obj.position.every((n: any) => typeof n === 'number' && !isNaN(n));
  const hasRot =
    Array.isArray(obj.rotation) &&
    obj.rotation.length === 3 &&
    obj.rotation.every((n: any) => typeof n === 'number' && !isNaN(n));
  const hasScale = typeof obj.scale === 'number' && !isNaN(obj.scale);

  return hasPos && hasRot && (hasScale || obj.scale === undefined);
}

/**
 * Helper to validate CameraPreset:
 * { position: [number, number, number], target: [number, number, number], fov: number }
 */
function isValidCameraPreset(obj: any): obj is CameraPreset {
  if (!obj || typeof obj !== 'object') return false;
  const hasPos =
    Array.isArray(obj.position) &&
    obj.position.length === 3 &&
    obj.position.every((n: any) => typeof n === 'number' && !isNaN(n));
  const hasTar =
    Array.isArray(obj.target) &&
    obj.target.length === 3 &&
    obj.target.every((n: any) => typeof n === 'number' && !isNaN(n));
  const hasFov = typeof obj.fov === 'number' && !isNaN(obj.fov);

  return hasPos && hasTar && hasFov;
}

/**
 * Intelligently parse any pasted configuration string:
 * - Full Studio Config ({ productTransforms, cameraPresets })
 * - Full Product Transforms ({ 5: { position, ... }, 7: { position, ... } })
 * - Full Camera Presets ({ Rings: { position, ... } })
 * - Single Product Transform ({ position, rotation, scale })
 */
export function parseImportedConfig(rawInput: string): ParseResult {
  if (!rawInput || !rawInput.trim()) {
    return {
      success: false,
      summary: 'Empty input',
      error: 'Please paste a valid JSON or TypeScript configuration object.',
    };
  }

  let parsedObj: any;
  try {
    const cleaned = cleanInputString(rawInput);
    parsedObj = evaluateObjectLiteral(cleaned);
  } catch (err: any) {
    return {
      success: false,
      summary: 'Syntax Error',
      error: `Could not parse text: ${err.message}. Ensure braces and brackets match.`,
    };
  }

  if (!parsedObj || typeof parsedObj !== 'object') {
    return {
      success: false,
      summary: 'Invalid Format',
      error: 'Parsed input is not a valid object.',
    };
  }

  // Case 1: Combined Studio Config ({ productTransforms: ..., cameraPresets: ... })
  if (parsedObj.productTransforms || parsedObj.cameraPresets) {
    const validTransforms: Record<number, ProductTransform> = {};
    const validPresets: Record<JewelryCategory, CameraPreset> = {} as any;

    let tfCount = 0;
    if (parsedObj.productTransforms && typeof parsedObj.productTransforms === 'object') {
      for (const [key, val] of Object.entries(parsedObj.productTransforms)) {
        const id = parseInt(key, 10);
        if (!isNaN(id) && isValidProductTransform(val)) {
          validTransforms[id] = {
            position: [val.position[0], val.position[1], val.position[2]],
            rotation: [val.rotation[0], val.rotation[1], val.rotation[2]],
            scale: typeof val.scale === 'number' ? val.scale : 1.0,
          };
          tfCount++;
        }
      }
    }

    let presetCount = 0;
    const knownCategories: JewelryCategory[] = [
      'Full Model',
      'Earrings',
      'Necklaces',
      'Rings',
      'Bracelets',
    ];
    if (parsedObj.cameraPresets && typeof parsedObj.cameraPresets === 'object') {
      for (const [cat, val] of Object.entries(parsedObj.cameraPresets)) {
        if (knownCategories.includes(cat as JewelryCategory) && isValidCameraPreset(val)) {
          validPresets[cat as JewelryCategory] = {
            position: [val.position[0], val.position[1], val.position[2]],
            target: [val.target[0], val.target[1], val.target[2]],
            fov: val.fov,
          };
          presetCount++;
        }
      }
    }

    if (tfCount === 0 && presetCount === 0) {
      return {
        success: false,
        summary: 'No valid data found',
        error: 'Found studio config wrapper, but no valid product transforms or camera presets.',
      };
    }

    return {
      success: true,
      productTransforms: tfCount > 0 ? validTransforms : undefined,
      cameraPresets: presetCount > 0 ? validPresets : undefined,
      summary: `Found ${tfCount} Product Transform(s) and ${presetCount} Camera Preset(s).`,
    };
  }

  // Case 2: Direct Single Product Transform { position: [...], rotation: [...], scale: 1 }
  if (isValidProductTransform(parsedObj)) {
    return {
      success: true,
      singleProductTransform: {
        position: [parsedObj.position[0], parsedObj.position[1], parsedObj.position[2]],
        rotation: [parsedObj.rotation[0], parsedObj.rotation[1], parsedObj.rotation[2]],
        scale: typeof parsedObj.scale === 'number' ? parsedObj.scale : 1.0,
      },
      summary: 'Found 1 single product transform.',
    };
  }

  // Case 3: Direct Single Camera Preset { position: [...], target: [...], fov: 23 }
  if (isValidCameraPreset(parsedObj)) {
    return {
      success: true,
      singleCameraPreset: {
        preset: {
          position: [parsedObj.position[0], parsedObj.position[1], parsedObj.position[2]],
          target: [parsedObj.target[0], parsedObj.target[1], parsedObj.target[2]],
          fov: parsedObj.fov,
        },
      },
      summary: 'Found 1 camera POV preset.',
    };
  }

  // Case 4: Multiple Product Transforms directly ({ 5: { position, ... }, 7: { position, ... } })
  const validTransforms: Record<number, ProductTransform> = {};
  let productTransformCount = 0;

  for (const [key, val] of Object.entries(parsedObj)) {
    const id = parseInt(key, 10);
    if (!isNaN(id) && isValidProductTransform(val)) {
      validTransforms[id] = {
        position: [val.position[0], val.position[1], val.position[2]],
        rotation: [val.rotation[0], val.rotation[1], val.rotation[2]],
        scale: typeof val.scale === 'number' ? val.scale : 1.0,
      };
      productTransformCount++;
    }
  }

  if (productTransformCount > 0) {
    return {
      success: true,
      productTransforms: validTransforms,
      summary: `Found ${productTransformCount} Product Transform(s).`,
    };
  }

  // Case 5: Multiple Camera Presets directly ({ 'Rings': { position, ... }, 'Earrings': ... })
  const validPresets: Record<JewelryCategory, CameraPreset> = {} as any;
  let presetCount = 0;
  const knownCategories: JewelryCategory[] = [
    'Full Model',
    'Earrings',
    'Necklaces',
    'Rings',
    'Bracelets',
  ];

  for (const [key, val] of Object.entries(parsedObj)) {
    if (knownCategories.includes(key as JewelryCategory) && isValidCameraPreset(val)) {
      validPresets[key as JewelryCategory] = {
        position: [val.position[0], val.position[1], val.position[2]],
        target: [val.target[0], val.target[1], val.target[2]],
        fov: val.fov,
      };
      presetCount++;
    }
  }

  if (presetCount > 0) {
    return {
      success: true,
      cameraPresets: validPresets,
      summary: `Found ${presetCount} Camera Preset(s).`,
    };
  }

  return {
    success: false,
    summary: 'Unrecognized structure',
    error:
      'The pasted data does not match product transforms (missing position/rotation) or camera presets.',
  };
}
