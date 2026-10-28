import { CameraPreset, JewelryCategory, ProductTransform, StudioProduct } from './types';

export const CAMERA_PRESETS: Record<JewelryCategory, CameraPreset> = {
  'Full Model': {
    position: [0, 1.28, 2.25],
    target: [0, 1.18, 0],
    fov: 40,
  },
  'Earrings': {
    position: [0.24, 1.58, 0.62],
    target: [0.14, 1.54, 0.02],
    fov: 28,
  },
  'Necklaces': {
    position: [0, 1.54, 0.65],
    target: [0, 1.51, 0.0],
    fov: 28,
  },
  'Rings': {
    position: [-0.20, 1.67, 0.28],
    target: [-0.09, 1.63, -0.052],
    fov: 22,
  },
  'Bracelets': {
    position: [-0.42, 0.93, 0.24],
    target: [-0.13, 0.89, 0.11],
    fov: 23,
  },
};

export const STORAGE_KEY_PRESETS = 'urban_glimmer_camera_presets';

export function getStoredCameraPresets(): Record<JewelryCategory, CameraPreset> {
  if (typeof window === 'undefined') return { ...CAMERA_PRESETS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRESETS);
    if (!raw) return { ...CAMERA_PRESETS };
    const parsed = JSON.parse(raw);
    return { ...CAMERA_PRESETS, ...parsed };
  } catch {
    return { ...CAMERA_PRESETS };
  }
}

export function saveStoredCameraPresets(presets: Record<JewelryCategory, CameraPreset>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
  } catch (err) {
    console.warn('Failed saving camera presets to localStorage:', err);
  }
}

export function resetStoredCameraPresets(): Record<JewelryCategory, CameraPreset> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY_PRESETS);
    } catch {
      // ignore
    }
  }
  return { ...CAMERA_PRESETS };
}

// ==========================================
// Per-Product Attachment Transforms (Position, Rotation, Scale)
// ==========================================
export const DEFAULT_PRODUCT_TRANSFORMS: Record<number, ProductTransform> = {
  // --- Rings ---
  5: {
    // The Solstice Sculpted Signet Ring
    position: [-0.09, 1.63, -0.052],
    rotation: [1.57, 0.4, 0],
    scale: 1.0,
  },
  7: {
    // Elysia Stacking Duo Rings
    position: [-0.09, 1.63, -0.052],
    rotation: [1.57, 0.4, 0],
    scale: 1.0,
  },
  12: {
    // Celestial Solitaire Diamond Ring
    position: [-0.09, 1.63, -0.052],
    rotation: [1.57, 0.4, 0],
    scale: 1.0,
  },

  // --- Necklaces ---
  2: {
    // Amara Layered Pendant Chain
    position: [0, 1.52, -0.05],
    rotation: [0, 0, 0],
    scale: 1.0,
  },
  6: {
    // Mira Delicate Sunburst Pendant
    position: [0, 1.52, -0.05],
    rotation: [0, 0, 0],
    scale: 1.0,
  },
  11: {
    // Zuri Pavé Diamond Tennis Choker
    position: [0, 1.52, -0.05],
    rotation: [0, 0, 0],
    scale: 1.0,
  },

  // --- Bracelets ---
  3: {
    // Aurelia Polished Ribbed Cuff
    position: [-0.13, 0.89, 0.11],
    rotation: [0.8, 0.4, -0.5],
    scale: 1.0,
  },
  8: {
    // Afterglow Dainty Box Chain Bracelet
    position: [-0.13, 0.89, 0.11],
    rotation: [0.8, 0.4, -0.5],
    scale: 1.0,
  },
  13: {
    // Verona Twisted Rope Bangle
    position: [-0.13, 0.89, 0.11],
    rotation: [0.8, 0.4, -0.5],
    scale: 1.0,
  },

  // --- Earrings ---
  1: {
    // The Solara Sculpted Hoops
    position: [0.035, 1.58, -0.055],
    rotation: [0, 0, 0],
    scale: 1.0,
  },
  4: {
    // Luna Luminous Pearl Drops
    position: [0.035, 1.58, -0.055],
    rotation: [0, 0, 0],
    scale: 1.0,
  },
  9: {
    // Royal Heritage Gold Jhumkas
    position: [0.035, 1.58, -0.055],
    rotation: [0, 0, 0],
    scale: 1.0,
  },
  10: {
    // Emerald Halo Pavé Drops
    position: [0.035, 1.58, -0.055],
    rotation: [0, 0, 0],
    scale: 1.0,
  },
};

export const STORAGE_KEY_PRODUCT_TRANSFORMS = 'urban_glimmer_product_transforms';

export function getStoredProductTransforms(): Record<number, ProductTransform> {
  if (typeof window === 'undefined') return { ...DEFAULT_PRODUCT_TRANSFORMS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCT_TRANSFORMS);
    if (!raw) return { ...DEFAULT_PRODUCT_TRANSFORMS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PRODUCT_TRANSFORMS, ...parsed };
  } catch {
    return { ...DEFAULT_PRODUCT_TRANSFORMS };
  }
}

export function saveStoredProductTransforms(transforms: Record<number, ProductTransform>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCT_TRANSFORMS, JSON.stringify(transforms));
  } catch (err) {
    console.warn('Failed saving product transforms to localStorage:', err);
  }
}

export function resetStoredProductTransform(productId: number): ProductTransform {
  const def = DEFAULT_PRODUCT_TRANSFORMS[productId] || {
    position: [-0.09, 1.63, -0.052],
    rotation: [1.57, 0.4, 0],
    scale: 1.0,
  };
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRODUCT_TRANSFORMS);
      if (raw) {
        const parsed = JSON.parse(raw);
        delete parsed[productId];
        localStorage.setItem(STORAGE_KEY_PRODUCT_TRANSFORMS, JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  }
  return def;
}

export const STORAGE_KEY_CUSTOM_PRODUCTS = 'urban_glimmer_custom_products';

export function getStoredCustomProducts(): StudioProduct[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredCustomProducts(products: StudioProduct[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.warn('Failed saving custom products to localStorage:', err);
  }
}

export const STUDIO_PRODUCTS: StudioProduct[] = [
  // --- Earrings ---
  {
    id: 1,
    name: 'The Solara Sculpted Hoops',
    category: 'Earrings',
    price: 1499,
    oldPrice: 1899,
    image: 'photo-1630019852942-f89202989a59',
    finish: '18k Gold Vermeil',
    material: 'Thick 18k gold over recycled sterling silver',
    description: 'Sculptural, featherweight hoops with a soft sunlit polish. Engineered for all-day comfort with hollow interior architecture.',
    meshType: 'solara_hoops',
    badge: 'BESTSELLER',
    dimensions: '22mm diameter · 3.2g pair weight',
  },
  {
    id: 4,
    name: 'Luna Luminous Pearl Drops',
    category: 'Earrings',
    price: 1799,
    oldPrice: 2199,
    image: 'photo-1617038220319-276d3cfab638',
    finish: 'Freshwater Pearl & Gold',
    material: 'Natural organic freshwater pearls & 18k gold vermeil posts',
    description: 'Softly luminous baroque pearls paired with an organic gold huggie. Each pearl is hand-selected for unique luster.',
    meshType: 'luna_pearls',
    badge: 'LOW STOCK',
    dimensions: '28mm drop length',
  },
  {
    id: 9,
    name: 'Royal Heritage Gold Jhumkas',
    category: 'Earrings',
    price: 2499,
    oldPrice: 2999,
    image: 'photo-1535632066927-ab7c9ab60908',
    finish: '22k Antique Gold',
    material: 'Handcrafted brass core finished in micro-plated 22k antique gold',
    description: 'Iconic dome jhumka drops adorned with delicate micro-filigree bells that chime with graceful head movement.',
    meshType: 'kundan_jhumkas',
    badge: 'FESTIVE EDIT',
    dimensions: '38mm drop · 6.5g pair weight',
  },
  {
    id: 10,
    name: 'Emerald Halo Pavé Drops',
    category: 'Earrings',
    price: 1999,
    image: 'photo-1599643477877-530eb83abc8e',
    finish: 'Emerald & 18k Gold',
    material: 'Vibrant lab-grown emerald cabochon framed in sparkling pavé zirconia',
    description: 'An eye-catching festive green gem surrounded by warm gold prongs for royal evening elegance.',
    meshType: 'emerald_studs',
    dimensions: '18mm drop length',
  },

  // --- Necklaces ---
  {
    id: 2,
    name: 'Amara Layered Pendant Chain',
    category: 'Necklaces',
    price: 1899,
    image: 'photo-1599643478518-a784e5dc4c8f',
    finish: '18k Gold Plated',
    material: 'Triple-coated 18k yellow gold with anti-tarnish barrier',
    description: 'An effortless dual-layered look in one balanced piece. Catches the light with delicate faceted links and a warm gleam.',
    meshType: 'amara_layered',
    badge: 'FESTIVE EDIT',
    dimensions: '40cm + 5cm extension chain',
  },
  {
    id: 6,
    name: 'Mira Delicate Sunburst Pendant',
    category: 'Necklaces',
    price: 1399,
    image: 'photo-1611652022419-a9419f74343d',
    finish: '18k Gold Vermeil',
    material: '18k gold vermeil on 925 sterling silver',
    description: 'A fine coin medallion featuring an engraved radial glimmer. The piece you leave on when you step into the sun.',
    meshType: 'mira_sunburst',
    badge: 'BESTSELLER',
    dimensions: '42cm length + 3cm extender',
  },
  {
    id: 11,
    name: 'Zuri Pavé Diamond Tennis Choker',
    category: 'Necklaces',
    price: 2899,
    oldPrice: 3499,
    image: 'photo-1515562141207-7a88fb7ce338',
    finish: '18k White & Yellow Gold',
    material: 'Continuous row of precision-cut faceted cubic zirconia in 4-prong settings',
    description: 'A liquid ribbon of pure light that rests smoothly against the collarbone, engineered for non-flipping comfort.',
    meshType: 'tennis_choker',
    badge: 'SIGNATURE',
    dimensions: '38cm choker fit',
  },

  // --- Rings ---
  {
    id: 5,
    name: 'Solstice Sculpted Signet Ring',
    category: 'Rings',
    price: 1199,
    image: 'photo-1605100804763-247f67b3557e',
    finish: '18k Gold Tone',
    material: 'Solid brass with high-polish 18k gold sealing',
    description: 'A confident, low-profile signet with a gently brushed face. Minimalist enough for everyday, bold enough to be remembered.',
    meshType: 'solstice_signet',
    badge: 'JUST DROPPED',
    dimensions: 'Sizes US 5, 6, 7 & 8 available',
  },
  {
    id: 7,
    name: 'Elysia Stacking Duo Rings',
    category: 'Rings',
    price: 1499,
    oldPrice: 1799,
    image: 'photo-1603561591411-07134e71a2a9',
    finish: '18k Gold & Pavé',
    material: 'Micro-pavé zirconia set in 18k gold-dipped silver',
    description: 'Twin fluid bands contoured to interlock seamlessly. Wear together on one finger or split across both hands.',
    meshType: 'elysia_stack',
    badge: 'TRENDING',
    dimensions: 'Sold as a complementary set of two rings',
  },
  {
    id: 12,
    name: 'Celestial Solitaire Diamond Ring',
    category: 'Rings',
    price: 1699,
    image: 'photo-1605100804763-247f67b3557e',
    finish: 'Solid 18k Gold Vermeil',
    material: 'Center 1.5ct equivalent cushion cut zirconia with cathedral shoulder accents',
    description: 'Timeless luxury with unmatched fire and scintillation, set in a six-prong tapered gold band.',
    meshType: 'celestial_solitaire',
    dimensions: 'US Size 6 & 7 available',
  },

  // --- Bracelets ---
  {
    id: 3,
    name: 'Aurelia Polished Ribbed Cuff',
    category: 'Bracelets',
    price: 1699,
    image: 'photo-1611591437281-460bfbe1220a',
    finish: 'Polished Gold',
    material: 'Hypoallergenic brass core dipped in 18k yellow gold',
    description: 'A clean, modern sculptural cuff designed to stack or stand alone. Soft contouring sits smoothly against the wrist.',
    meshType: 'aurelia_cuff',
    dimensions: '60mm adjustable inner diameter',
  },
  {
    id: 8,
    name: 'Afterglow Dainty Box Chain Bracelet',
    category: 'Bracelets',
    price: 1599,
    image: 'photo-1573408301185-9146fe634ad0',
    finish: '18k Gold Plated',
    material: 'Reflective Italian box chain with lobster clasp',
    description: 'A micro-geometric chain bracelet that gleams with every gesture. Finished with an engraved Urban Glimmer hallmark tag.',
    meshType: 'afterglow_chain',
    dimensions: '16cm + 3cm extension',
  },
  {
    id: 13,
    name: 'Verona Twisted Rope Bangle',
    category: 'Bracelets',
    price: 1899,
    oldPrice: 2299,
    image: 'photo-1611591437281-460bfbe1220a',
    finish: '22k Gold Dipped',
    material: 'Intertwined double helices of polished and sandblasted gold cords',
    description: 'Subtle textural contrast that catches light dynamically during motion. Fitted with a secure safety hinge.',
    meshType: 'verona_bangle',
    badge: 'NEW',
    dimensions: '62mm oval wrist fit',
  },
];
