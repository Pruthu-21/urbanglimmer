export type AnnouncementConfig = {
  id: string;
  text: string;
  linkText?: string;
  linkUrl?: string;
  highlightText?: string;
  isEnabled: boolean;
};

export type HeroCampaignConfig = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  show3DButton: boolean;
  modelBadge: string;
};

export type FestiveModalConfig = {
  isEnabled: boolean;
  title: string;
  subtitle: string;
  discountCode: string;
  discountAmountText: string;
  ctaText: string;
  ctaLink: string;
  minOrderText: string;
};

export type Coupon = {
  code: string;
  discountType: 'percent' | 'flat';
  value: number; // e.g. 15 for 15%, or 500 for ₹500
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate?: string;
  isActive: boolean;
  usageCount: number;
  description: string;
};

const DEFAULT_ANNOUNCEMENT: AnnouncementConfig = {
  id: 'festive-2026',
  text: 'The Festive Edit — Discover heirloom jewellery for every celebration.',
  linkText: 'Shop New Arrivals',
  linkUrl: '/shop',
  highlightText: 'Complimentary insured shipping on orders above ₹1,999',
  isEnabled: true,
};

const DEFAULT_HERO: HeroCampaignConfig = {
  eyebrow: 'ROYAL HEIRLOOM COLLECTION · AUTUMN 2026',
  title: 'Jewellery That Becomes Your Story',
  subtitle: 'Discover timeless elegance, handcrafted in 18k gold vermeil and natural pearls for your most meaningful moments.',
  primaryCtaText: 'Explore The Collection',
  primaryCtaLink: '/shop',
  secondaryCtaText: 'Experience 3D',
  show3DButton: true,
  modelBadge: 'INTERACTIVE 3D COMPATIBLE',
};

const DEFAULT_FESTIVE_MODAL: FestiveModalConfig = {
  isEnabled: true,
  title: 'Celebrate The Season of Light',
  subtitle: 'Enjoy festive privilege on your first order. Handcrafted in Jaipur, delivered in signature velvet packaging.',
  discountCode: 'FESTIVE15',
  discountAmountText: '15% OFF',
  ctaText: 'Claim Festive Privilege',
  ctaLink: '/shop',
  minOrderText: 'Valid on orders above ₹1,999 · Use code FESTIVE15',
};

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'FESTIVE15',
    discountType: 'percent',
    value: 15,
    minOrderValue: 1999,
    maxDiscount: 1000,
    isActive: true,
    usageCount: 142,
    description: '15% off up to ₹1,000 on festive orders above ₹1,999',
  },
  {
    code: 'GLIMMER10',
    discountType: 'percent',
    value: 10,
    minOrderValue: 999,
    maxDiscount: 500,
    isActive: true,
    usageCount: 289,
    description: '10% instant welcome savings on orders above ₹999',
  },
  {
    code: 'ROYAL500',
    discountType: 'flat',
    value: 500,
    minOrderValue: 2999,
    isActive: true,
    usageCount: 78,
    description: 'Flat ₹500 off on bridal & statement pieces above ₹2,999',
  },
];

const ANNOUNCEMENT_KEY = 'ug_announcement_v1';
const HERO_KEY = 'ug_hero_v1';
const FESTIVE_MODAL_KEY = 'ug_festive_modal_v1';
const COUPONS_KEY = 'ug_coupons_v1';

export function getStoredAnnouncement(): AnnouncementConfig {
  if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENT;
  try {
    const raw = localStorage.getItem(ANNOUNCEMENT_KEY);
    if (!raw) return DEFAULT_ANNOUNCEMENT;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
}

export function saveStoredAnnouncement(config: AnnouncementConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ANNOUNCEMENT_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event('ug_campaigns_updated'));
}

export function getStoredHeroConfig(): HeroCampaignConfig {
  if (typeof window === 'undefined') return DEFAULT_HERO;
  try {
    const raw = localStorage.getItem(HERO_KEY);
    if (!raw) return DEFAULT_HERO;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_HERO;
  }
}

export function saveStoredHeroConfig(config: HeroCampaignConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HERO_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event('ug_campaigns_updated'));
}

export function getStoredFestiveModal(): FestiveModalConfig {
  if (typeof window === 'undefined') return DEFAULT_FESTIVE_MODAL;
  try {
    const raw = localStorage.getItem(FESTIVE_MODAL_KEY);
    if (!raw) return DEFAULT_FESTIVE_MODAL;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FESTIVE_MODAL;
  }
}

export function saveStoredFestiveModal(config: FestiveModalConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FESTIVE_MODAL_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event('ug_campaigns_updated'));
}

export function getStoredCoupons(): Coupon[] {
  if (typeof window === 'undefined') return INITIAL_COUPONS;
  try {
    const raw = localStorage.getItem(COUPONS_KEY);
    if (!raw) return INITIAL_COUPONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COUPONS;
  } catch {
    return INITIAL_COUPONS;
  }
}

export function saveStoredCoupons(coupons: Coupon[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
  window.dispatchEvent(new Event('ug_coupons_updated'));
}

export function validateCoupon(
  code: string,
  subtotal: number
): { isValid: boolean; discount: number; message: string; coupon?: Coupon } {
  if (!code || !code.trim()) {
    return { isValid: false, discount: 0, message: 'Please enter a coupon code.' };
  }

  const clean = code.trim().toUpperCase();
  const coupons = getStoredCoupons();
  const found = coupons.find((c) => c.code.toUpperCase() === clean);

  if (!found) {
    return { isValid: false, discount: 0, message: `Coupon "${clean}" is not recognized or has expired.` };
  }

  if (!found.isActive) {
    return { isValid: false, discount: 0, message: `Coupon "${clean}" is currently inactive.` };
  }

  if (subtotal < found.minOrderValue) {
    return {
      isValid: false,
      discount: 0,
      message: `Order subtotal must be at least ₹${found.minOrderValue.toLocaleString('en-IN')} to apply "${clean}".`,
    };
  }

  let calculatedDiscount = 0;
  if (found.discountType === 'percent') {
    calculatedDiscount = Math.round((subtotal * found.value) / 100);
    if (found.maxDiscount && calculatedDiscount > found.maxDiscount) {
      calculatedDiscount = found.maxDiscount;
    }
  } else {
    calculatedDiscount = Math.min(found.value, subtotal);
  }

  return {
    isValid: true,
    discount: calculatedDiscount,
    message: `Promo "${found.code}" applied! You saved ₹${calculatedDiscount.toLocaleString('en-IN')}.`,
    coupon: found,
  };
}
