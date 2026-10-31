export type Product = {
  id: number;
  name: string;
  slug?: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  lifestyleImage: string;
  images?: string[];
  badge?: string;
  badgeType?: 'bestseller' | 'wine' | 'light';
  color: string;
  material: string;
  finish?: string;
  dimensions: string;
  weight?: string;
  hallmark?: string;
  description: string;
  rating: string;
  reviewsCount: number;
  modelUrl?: string;
  modelType?: 'procedural' | 'polycam';
  sku?: string;
  stock?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  collections?: string[];
  occasion?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'The Solara Sculpted Hoops',
    slug: 'the-solara-sculpted-hoops',
    category: 'Earrings',
    price: 1499,
    oldPrice: 1899,
    image: 'photo-1630019852942-f89202989a59',
    lifestyleImage: 'photo-1617038220319-276d3cfab638',
    images: [
      'photo-1630019852942-f89202989a59',
      'photo-1617038220319-276d3cfab638',
      'photo-1535632066927-ab7c9ab60908',
    ],
    badge: 'BESTSELLER',
    badgeType: 'bestseller',
    color: '18k Gold Vermeil',
    material: 'Thick 18k gold over recycled sterling silver',
    finish: 'High Polish 18k Yellow Gold',
    dimensions: '22mm diameter · 3.2g pair weight',
    weight: '3.2g',
    hallmark: 'BIS 925 Silver with 18k Gold Vermeil Certificate',
    description: 'Sculptural, featherweight hoops with a soft sunlit polish. Engineered for all-day comfort with hollow interior architecture. Perfect for festive celebrations and everyday glamour.',
    rating: '4.9',
    reviewsCount: 84,
    sku: 'UG-EAR-001',
    stock: 24,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    collections: ['Everyday Elegance', 'Modern Gold', 'Festive Radiance'],
    occasion: 'Daily Minimal',
    seoTitle: 'Solara Sculpted Hoops in 18k Gold Vermeil | Urban Glimmer',
    seoDescription: 'Shop handcrafted 18k gold vermeil sculpted hoops. Hypoallergenic, lightweight, and anti-tarnish designed in India.',
    modelUrl: '/models/jewelry/earrings.glb',
    modelType: 'procedural',
  },
  {
    id: 2,
    name: 'Amara Layered Pendant Chain',
    slug: 'amara-layered-pendant-chain',
    category: 'Necklaces',
    price: 1899,
    oldPrice: 2299,
    image: 'photo-1599643478518-a784e5dc4c8f',
    lifestyleImage: 'photo-1611652022419-a9419f74343d',
    images: [
      'photo-1599643478518-a784e5dc4c8f',
      'photo-1611652022419-a9419f74343d',
      'photo-1515562141207-7a88fb7ce338',
    ],
    badge: 'FESTIVE EDIT',
    badgeType: 'wine',
    color: '18k Gold Plated',
    material: 'Triple-coated 18k yellow gold with anti-tarnish barrier',
    finish: 'Warm Sunlit Gold',
    dimensions: '40cm + 5cm extension chain',
    weight: '6.4g',
    hallmark: 'Certified Anti-Tarnish Lifetime Seal',
    description: 'An effortless dual-layered look in one balanced piece. Catches the light with delicate faceted links and a warm gleam. Designed for Diwali parties, family poojas, and evening receptions.',
    rating: '4.8',
    reviewsCount: 62,
    sku: 'UG-NCK-002',
    stock: 18,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    collections: ['Festive Radiance', 'Wedding Collection'],
    occasion: 'Festive Celebrations',
    seoTitle: 'Amara Layered Pendant Chain | Urban Glimmer Festive Edit',
    seoDescription: 'Dual-strand 18k gold plated pendant chain with high-shine links and heirloom charm for traditional and modern styling.',
    modelUrl: '/models/jewelry/necklace.glb',
    modelType: 'procedural',
  },
  {
    id: 3,
    name: 'Aurelia Polished Ribbed Cuff',
    slug: 'aurelia-polished-ribbed-cuff',
    category: 'Bracelets',
    price: 1699,
    oldPrice: 1999,
    image: 'photo-1611591437281-460bfbe1220a',
    lifestyleImage: 'photo-1573408301185-9146fe634ad0',
    images: [
      'photo-1611591437281-460bfbe1220a',
      'photo-1573408301185-9146fe634ad0',
    ],
    badge: 'STATEMENT',
    badgeType: 'wine',
    color: 'Polished Gold',
    material: 'Hypoallergenic brass core dipped in 18k yellow gold',
    finish: 'Mirror Polished Champagne Gold',
    dimensions: '60mm adjustable inner diameter',
    weight: '14.8g',
    hallmark: 'Urban Glimmer Hallmark Engraved',
    description: 'A clean, modern sculptural cuff designed to stack or stand alone. Soft contouring sits smoothly against the wrist, making it an exquisite accompaniment to both silks and tailored blazers.',
    rating: '4.9',
    reviewsCount: 47,
    sku: 'UG-BRC-003',
    stock: 12,
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    collections: ['Statement Pieces', 'Modern Gold'],
    occasion: 'Evening Soirée',
    seoTitle: 'Aurelia Polished Ribbed Cuff | Urban Glimmer Statement Jewellery',
    seoDescription: 'Sculptural 18k gold dipped cuff bracelet with comfortable flexible contour. A luxury statement piece for Indian modern wear.',
    modelUrl: '/models/jewelry/bracelet.glb',
    modelType: 'procedural',
  },
  {
    id: 4,
    name: 'Luna Luminous Pearl Drops',
    slug: 'luna-luminous-pearl-drops',
    category: 'Earrings',
    price: 1799,
    oldPrice: 2199,
    image: 'photo-1617038220319-276d3cfab638',
    lifestyleImage: 'photo-1630019852942-f89202989a59',
    images: [
      'photo-1617038220319-276d3cfab638',
      'photo-1630019852942-f89202989a59',
    ],
    badge: 'LOW STOCK',
    badgeType: 'light',
    color: 'Freshwater Pearl & Gold',
    material: 'Natural organic freshwater pearls & 18k gold vermeil posts',
    finish: 'Organic Luster & Gold Tone',
    dimensions: '28mm drop length',
    weight: '4.1g',
    hallmark: 'Natural Pearl Authenticity Verified',
    description: 'Softly luminous baroque pearls paired with an organic gold huggie. Each pearl is hand-selected for unique luster and natural iridescent depth.',
    rating: '4.7',
    reviewsCount: 39,
    sku: 'UG-EAR-004',
    stock: 4,
    inStock: true,
    isFeatured: false,
    isBestseller: true,
    collections: ['Wedding Collection', 'Gifts That Sparkle'],
    occasion: 'Bridal & Wedding',
    seoTitle: 'Luna Luminous Pearl Drop Earrings | Urban Glimmer',
    seoDescription: 'Genuine freshwater pearl drop earrings with 18k gold vermeil huggie clasp. Timeless bridal and festive elegance.',
    modelUrl: '/models/jewelry/earrings.glb',
    modelType: 'procedural',
  },
  {
    id: 5,
    name: 'Solstice Sculpted Signet Ring',
    slug: 'solstice-sculpted-signet-ring',
    category: 'Rings',
    price: 1199,
    oldPrice: 1499,
    image: 'photo-1605100804763-247f67b3557e',
    lifestyleImage: 'photo-1603561591411-07134e71a2a9',
    images: [
      'photo-1605100804763-247f67b3557e',
      'photo-1603561591411-07134e71a2a9',
    ],
    badge: 'JUST DROPPED',
    badgeType: 'wine',
    color: '18k Gold Tone',
    material: 'Solid brass with high-polish 18k gold sealing',
    finish: 'Brushed Gold Face & Mirror Bevel',
    dimensions: 'Sizes US 5, 6, 7 & 8 available',
    weight: '5.6g',
    hallmark: '18k Micron Gold Plate Seal',
    description: 'A confident, low-profile signet with a gently brushed face. Minimalist enough for everyday wear, bold enough to anchor any stack.',
    rating: '4.8',
    reviewsCount: 53,
    sku: 'UG-RNG-005',
    stock: 29,
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    collections: ['Everyday Elegance', 'Modern Gold'],
    occasion: 'Daily Minimal',
    seoTitle: 'Solstice Sculpted Signet Ring in 18k Gold Tone | Urban Glimmer',
    seoDescription: 'Architectural signet ring designed with brushed center and polished bevels. Modern luxury for men and women.',
    modelUrl: '/models/jewelry/solitaire_ring.glb',
    modelType: 'procedural',
  },
  {
    id: 6,
    name: 'Mira Delicate Sunburst Pendant',
    slug: 'mira-delicate-sunburst-pendant',
    category: 'Necklaces',
    price: 1399,
    oldPrice: 1699,
    image: 'photo-1611652022419-a9419f74343d',
    lifestyleImage: 'photo-1599643478518-a784e5dc4c8f',
    images: [
      'photo-1611652022419-a9419f74343d',
      'photo-1599643478518-a784e5dc4c8f',
    ],
    badge: 'BESTSELLER',
    badgeType: 'bestseller',
    color: '18k Gold Vermeil',
    material: '18k gold vermeil on 925 sterling silver',
    finish: 'Micro-Engraved Radial Glimmer',
    dimensions: '42cm length + 3cm extender',
    weight: '4.8g',
    hallmark: 'BIS 925 Hallmark Verified',
    description: 'A fine coin medallion featuring an engraved radial sunburst glimmer. The beloved talisman piece that stays on from dawn to midnight.',
    rating: '4.9',
    reviewsCount: 91,
    sku: 'UG-NCK-006',
    stock: 22,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    collections: ['Everyday Elegance', 'Gifts That Sparkle'],
    occasion: 'Daily Minimal',
    seoTitle: 'Mira Sunburst Medallion Pendant | Urban Glimmer',
    seoDescription: 'Handcrafted sun medallion necklace in sterling silver coated with 18k vermeil gold. Water-resistant and daily wearable.',
    modelUrl: '/models/jewelry/necklace.glb',
    modelType: 'procedural',
  },
  {
    id: 7,
    name: 'Elysia Stacking Duo Rings',
    slug: 'elysia-stacking-duo-rings',
    category: 'Rings',
    price: 1499,
    oldPrice: 1799,
    image: 'photo-1603561591411-07134e71a2a9',
    lifestyleImage: 'photo-1605100804763-247f67b3557e',
    images: [
      'photo-1603561591411-07134e71a2a9',
      'photo-1605100804763-247f67b3557e',
    ],
    badge: 'TRENDING',
    badgeType: 'wine',
    color: '18k Gold & Pavé',
    material: 'Micro-pavé zirconia set in 18k gold-dipped silver',
    finish: 'Pavé Sparkle & Gold Ribbon',
    dimensions: 'Sold as a complementary set of two rings',
    weight: '3.9g set',
    hallmark: 'Hand-set AAA CZ Guarantee',
    description: 'Twin fluid bands contoured to interlock seamlessly. Wear together on one finger for dramatic gleam or split across both hands.',
    rating: '4.8',
    reviewsCount: 44,
    sku: 'UG-RNG-007',
    stock: 15,
    inStock: true,
    isFeatured: false,
    isBestseller: true,
    collections: ['Wedding Collection', 'Festive Radiance'],
    occasion: 'Festive Celebrations',
    seoTitle: 'Elysia Stacking Duo Rings with Micro Pavé | Urban Glimmer',
    seoDescription: 'Interlocking twin band ring set with fine pavé gemstones and warm champagne gold plating.',
    modelUrl: '/models/jewelry/solitaire_ring.glb',
    modelType: 'procedural',
  },
  {
    id: 8,
    name: 'Afterglow Dainty Box Chain Bracelet',
    slug: 'afterglow-dainty-box-chain-bracelet',
    category: 'Bracelets',
    price: 1599,
    oldPrice: 1899,
    image: 'photo-1573408301185-9146fe634ad0',
    lifestyleImage: 'photo-1611591437281-460bfbe1220a',
    images: [
      'photo-1573408301185-9146fe634ad0',
      'photo-1611591437281-460bfbe1220a',
    ],
    badge: 'NEW',
    badgeType: 'wine',
    color: '18k Gold Plated',
    material: 'Reflective Italian box chain with lobster clasp',
    finish: 'Mirror-cut Italian Gold Links',
    dimensions: '16cm + 3cm extension',
    weight: '3.6g',
    hallmark: 'Urban Glimmer Signature Tag',
    description: 'A micro-geometric chain bracelet that catches ambient light with every gesture. Finished with an engraved Urban Glimmer hallmark tag.',
    rating: '4.8',
    reviewsCount: 31,
    sku: 'UG-BRC-008',
    stock: 19,
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    collections: ['Everyday Elegance', 'Modern Gold'],
    occasion: 'Daily Minimal',
    seoTitle: 'Afterglow Dainty Italian Box Chain Bracelet | Urban Glimmer',
    seoDescription: 'High-shine reflective box chain bracelet in 18k gold plating. Featherweight everyday luxury jewellery.',
    modelUrl: '/models/jewelry/bracelet.glb',
    modelType: 'procedural',
  },
];

const STORAGE_KEY = 'urban_glimmer_catalog_v3';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse stored products:', err);
  }
  return INITIAL_PRODUCTS;
}

export const getAllProducts = getStoredProducts;

export function saveStoredProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('urban_glimmer_catalog_updated'));
  } catch (err) {
    console.error('Failed to save products:', err);
  }
}

export function getProductById(id: number | string): Product | undefined {
  const numId = Number(id);
  const current = getStoredProducts();
  return current.find((p) => p.id === numId);
}

export function getProductBySlug(slug: string): Product | undefined {
  const current = getStoredProducts();
  return current.find((p) => p.slug === slug || String(p.id) === slug);
}

export function getProductsByCategory(category: string): Product[] {
  const current = getStoredProducts();
  if (!category || category.toLowerCase() === 'all' || category.toLowerCase() === 'all pieces') {
    return current;
  }
  return current.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export function getProductsByCollection(collectionName: string): Product[] {
  const current = getStoredProducts();
  return current.filter(
    (p) => p.collections?.some((c) => c.toLowerCase() === collectionName.toLowerCase())
  );
}

export function addProductToStore(productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>): Product {
  const current = getStoredProducts();
  const nextId = current.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const sku = productData.sku || `UG-${productData.category.slice(0, 3).toUpperCase()}-${String(nextId).padStart(3, '0')}`;
  
  const newProduct: Product = {
    ...productData,
    id: nextId,
    slug,
    sku,
    rating: '5.0',
    reviewsCount: 1,
    stock: productData.stock ?? 20,
    inStock: (productData.stock ?? 20) > 0,
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
  if (typeof updatedProduct.stock === 'number') {
    updatedProduct.inStock = updatedProduct.stock > 0;
  }
  const updated = [...current];
  updated[idx] = updatedProduct;
  saveStoredProducts(updated);
  return updatedProduct;
}

export function adjustProductStock(id: number, delta: number): boolean {
  const current = getStoredProducts();
  const idx = current.findIndex((p) => p.id === id);
  if (idx === -1) return false;

  const currentStock = current[idx].stock ?? 0;
  const newStock = Math.max(0, currentStock + delta);
  current[idx] = {
    ...current[idx],
    stock: newStock,
    inStock: newStock > 0,
  };
  saveStoredProducts(current);
  return true;
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

export function getSameCategorySuggestions(target: Product, allProducts: Product[], limit = 4): Product[] {
  const same = allProducts.filter(
    (p) => p.category.toLowerCase() === target.category.toLowerCase() && p.id !== target.id
  );
  if (same.length >= limit) return same.slice(0, limit);
  return same;
}

export function getDifferentCategorySuggestions(target: Product, allProducts: Product[], limit = 4): Product[] {
  const diff = allProducts.filter(
    (p) => p.category.toLowerCase() !== target.category.toLowerCase() && p.id !== target.id
  );
  
  const categoriesPresent = new Set<string>();
  const curated: Product[] = [];

  for (const item of diff) {
    if (!categoriesPresent.has(item.category)) {
      categoriesPresent.add(item.category);
      curated.push(item);
    }
    if (curated.length >= limit) break;
  }

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
