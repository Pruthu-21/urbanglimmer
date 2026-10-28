export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  lifestyleImage: string;
  badge?: string;
  badgeType?: 'bestseller' | 'wine' | 'light';
  color: string;
  material: string;
  dimensions: string;
  description: string;
  rating: string;
  reviewsCount: number;
  modelUrl?: string;
  modelType?: 'procedural' | 'polycam';
  createdAt?: string;
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'The Solara Sculpted Hoops',
    category: 'Earrings',
    price: 1499,
    oldPrice: 1899,
    image: 'photo-1630019852942-f89202989a59',
    lifestyleImage: 'photo-1617038220319-276d3cfab638',
    badge: 'BESTSELLER',
    badgeType: 'bestseller',
    color: '18k Gold Vermeil',
    material: 'Thick 18k gold over recycled sterling silver',
    dimensions: '22mm diameter · 3.2g pair weight',
    description: 'Sculptural, featherweight hoops with a soft sunlit polish. Engineered for all-day comfort with hollow interior architecture.',
    rating: '4.9',
    reviewsCount: 84,
    modelUrl: '/models/jewelry/earrings.glb',
    modelType: 'procedural',
  },
  {
    id: 2,
    name: 'Amara Layered Pendant Chain',
    category: 'Necklaces',
    price: 1899,
    oldPrice: 2299,
    image: 'photo-1599643478518-a784e5dc4c8f',
    lifestyleImage: 'photo-1611652022419-a9419f74343d',
    badge: 'FESTIVE EDIT',
    badgeType: 'wine',
    color: '18k Gold Plated',
    material: 'Triple-coated 18k yellow gold with anti-tarnish barrier',
    dimensions: '40cm + 5cm extension chain',
    description: 'An effortless dual-layered look in one balanced piece. Catches the light with delicate faceted links and a warm gleam.',
    rating: '4.8',
    reviewsCount: 62,
    modelUrl: '/models/jewelry/necklace.glb',
    modelType: 'procedural',
  },
  {
    id: 3,
    name: 'Aurelia Polished Ribbed Cuff',
    category: 'Bracelets',
    price: 1699,
    image: 'photo-1611591437281-460bfbe1220a',
    lifestyleImage: 'photo-1573408301185-9146fe634ad0',
    color: 'Polished Gold',
    material: 'Hypoallergenic brass core dipped in 18k yellow gold',
    dimensions: '60mm adjustable inner diameter',
    description: 'A clean, modern sculptural cuff designed to stack or stand alone. Soft contouring sits smoothly against the wrist.',
    rating: '4.9',
    reviewsCount: 47,
    modelUrl: '/models/jewelry/bracelet.glb',
    modelType: 'procedural',
  },
  {
    id: 4,
    name: 'Luna Luminous Pearl Drops',
    category: 'Earrings',
    price: 1799,
    oldPrice: 2199,
    image: 'photo-1617038220319-276d3cfab638',
    lifestyleImage: 'photo-1630019852942-f89202989a59',
    badge: 'LOW STOCK',
    badgeType: 'light',
    color: 'Freshwater Pearl & Gold',
    material: 'Natural organic freshwater pearls & 18k gold vermeil posts',
    dimensions: '28mm drop length',
    description: 'Softly luminous baroque pearls paired with an organic gold huggie. Each pearl is hand-selected for unique luster.',
    rating: '4.7',
    reviewsCount: 39,
    modelUrl: '/models/jewelry/earrings.glb',
    modelType: 'procedural',
  },
  {
    id: 5,
    name: 'Solstice Sculpted Signet Ring',
    category: 'Rings',
    price: 1199,
    oldPrice: 1499,
    image: 'photo-1605100804763-247f67b3557e',
    lifestyleImage: 'photo-1603561591411-07134e71a2a9',
    badge: 'JUST DROPPED',
    badgeType: 'wine',
    color: '18k Gold Tone',
    material: 'Solid brass with high-polish 18k gold sealing',
    dimensions: 'Sizes US 5, 6, 7 & 8 available',
    description: 'A confident, low-profile signet with a gently brushed face. Minimalist enough for everyday, bold enough to be remembered.',
    rating: '4.8',
    reviewsCount: 53,
    modelUrl: '/models/jewelry/solitaire_ring.glb',
    modelType: 'procedural',
  },
  {
    id: 6,
    name: 'Mira Delicate Sunburst Pendant',
    category: 'Necklaces',
    price: 1399,
    image: 'photo-1611652022419-a9419f74343d',
    lifestyleImage: 'photo-1599643478518-a784e5dc4c8f',
    badge: 'BESTSELLER',
    badgeType: 'bestseller',
    color: '18k Gold Vermeil',
    material: '18k gold vermeil on 925 sterling silver',
    dimensions: '42cm length + 3cm extender',
    description: 'A fine coin medallion featuring an engraved radial glimmer. The piece you leave on when you step into the sun.',
    rating: '4.9',
    reviewsCount: 91,
    modelUrl: '/models/jewelry/necklace.glb',
    modelType: 'procedural',
  },
  {
    id: 7,
    name: 'Elysia Stacking Duo Rings',
    category: 'Rings',
    price: 1499,
    oldPrice: 1799,
    image: 'photo-1603561591411-07134e71a2a9',
    lifestyleImage: 'photo-1605100804763-247f67b3557e',
    badge: 'TRENDING',
    badgeType: 'wine',
    color: '18k Gold & Pavé',
    material: 'Micro-pavé zirconia set in 18k gold-dipped silver',
    dimensions: 'Sold as a complementary set of two rings',
    description: 'Twin fluid bands contoured to interlock seamlessly. Wear together on one finger or split across both hands.',
    rating: '4.8',
    reviewsCount: 44,
    modelUrl: '/models/jewelry/solitaire_ring.glb',
    modelType: 'procedural',
  },
  {
    id: 8,
    name: 'Afterglow Dainty Box Chain Bracelet',
    category: 'Bracelets',
    price: 1599,
    image: 'photo-1573408301185-9146fe634ad0',
    lifestyleImage: 'photo-1611591437281-460bfbe1220a',
    color: '18k Gold Plated',
    material: 'Reflective Italian box chain with lobster clasp',
    dimensions: '16cm + 3cm extension',
    description: 'A micro-geometric chain bracelet that gleams with every gesture. Finished with an engraved Urban Glimmer hallmark tag.',
    rating: '4.8',
    reviewsCount: 31,
    modelUrl: '/models/jewelry/bracelet.glb',
    modelType: 'procedural',
  },
];

const STORAGE_KEY = 'urban_glimmer_catalog_v2';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PRODUCTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse stored products:', err);
  }
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('urban_glimmer_catalog_updated'));
  } catch (err) {
    console.error('Failed to save products:', err);
  }
}

export function addProductToStore(productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>): Product {
  const current = getStoredProducts();
  const nextId = current.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const newProduct: Product = {
    ...productData,
    id: nextId,
    rating: '5.0',
    reviewsCount: 1,
    createdAt: new Date().toISOString(),
  };

  const updated = [newProduct, ...current];
  saveStoredProducts(updated);
  return newProduct;
}

export function updateProductInStore(id: number, updates: Partial<Product>): Product | null {
  const current = getStoredProducts();
  const idx = current.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const updatedProduct = { ...current[idx], ...updates };
  const updated = [...current];
  updated[idx] = updatedProduct;
  saveStoredProducts(updated);
  return updatedProduct;
}

export function deleteProductFromStore(id: number): boolean {
  const current = getStoredProducts();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length === current.length) return false;
  saveStoredProducts(filtered);
  return true;
}

export function resetProductsStore(): Product[] {
  saveStoredProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

/**
 * Suggestions Engine: 
 * Returns 3-4 other products from the SAME category
 */
export function getSameCategorySuggestions(target: Product, allProducts: Product[], limit = 4): Product[] {
  const same = allProducts.filter(
    (p) => p.category.toLowerCase() === target.category.toLowerCase() && p.id !== target.id
  );
  if (same.length >= limit) return same.slice(0, limit);
  return same;
}

/**
 * Suggestions Engine:
 * Returns 3-4 curated products from DIFFERENT categories to "Complete The Look"
 */
export function getDifferentCategorySuggestions(target: Product, allProducts: Product[], limit = 4): Product[] {
  const diff = allProducts.filter(
    (p) => p.category.toLowerCase() !== target.category.toLowerCase() && p.id !== target.id
  );
  
  // Pick one from each other category if available for a complete set
  const categoriesPresent = new Set<string>();
  const curated: Product[] = [];

  for (const item of diff) {
    if (!categoriesPresent.has(item.category)) {
      categoriesPresent.add(item.category);
      curated.push(item);
    }
    if (curated.length >= limit) break;
  }

  // If we still need more to reach limit, append remaining diff items
  if (curated.length < limit) {
    for (const item of diff) {
      if (!curated.some((c) => c.id === item.id)) {
        curated.push(item);
      }
      if (curated.length >= limit) break;
    }
  }

  return curated.slice(0, limit);
}
