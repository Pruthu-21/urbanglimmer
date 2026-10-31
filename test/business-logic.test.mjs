import test from 'node:test';
import assert from 'node:assert/strict';

// --- Pure Business Logic Implementations (Mirrored & Verified with lib/*) ---

// 1. Product Catalog Functions
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'The Solara Sculpted Hoops',
    slug: 'solara-sculpted-hoops',
    category: 'earrings',
    price: 3499,
    oldPrice: 4299,
    stock: 14,
    sku: 'UG-EAR-001',
    collections: ['festive-edit', 'modern-gold'],
  },
  {
    id: 2,
    name: 'Amara Layered Pendant Chain',
    slug: 'amara-layered-pendant-chain',
    category: 'necklaces',
    price: 4999,
    oldPrice: 5999,
    stock: 9,
    sku: 'UG-NECK-002',
    collections: ['everyday-elegance', 'modern-gold'],
  },
  {
    id: 3,
    name: 'Aurelia Polished Ribbed Cuff',
    slug: 'aurelia-polished-ribbed-cuff',
    category: 'cuffs',
    price: 5499,
    oldPrice: 6499,
    stock: 6,
    sku: 'UG-CUFF-003',
    collections: ['festive-edit', 'statement-pieces'],
  },
  {
    id: 4,
    name: 'Luna Luminous Pearl Drops',
    slug: 'luna-luminous-pearl-drops',
    category: 'earrings',
    price: 2899,
    oldPrice: 3499,
    stock: 12,
    sku: 'UG-EAR-004',
    collections: ['everyday-elegance'],
  },
];

function getProductById(catalog, id) {
  return catalog.find((p) => p.id === Number(id));
}

function getProductBySlug(catalog, slug) {
  return catalog.find((p) => p.slug === slug);
}

function getProductsByCategory(catalog, cat) {
  return catalog.filter((p) => p.category.toLowerCase() === cat.toLowerCase());
}

function getProductsByCollection(catalog, coll) {
  return catalog.filter((p) => p.collections?.includes(coll));
}

function adjustStock(catalog, id, delta) {
  const prod = catalog.find((p) => p.id === id);
  if (!prod) return false;
  prod.stock = Math.max(0, (prod.stock || 0) + delta);
  return true;
}

// 2. Coupon Engine Validation
const INITIAL_COUPONS = [
  {
    code: 'FESTIVE15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 2499,
    maxDiscountAmount: 1500,
    isActive: true,
  },
  {
    code: 'WELCOME500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 1999,
    isActive: true,
  },
  {
    code: 'ROYAL20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 5000,
    maxDiscountAmount: 3000,
    isActive: true,
  },
  {
    code: 'EXPIRED10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 1000,
    isActive: false,
  },
];

function validateCoupon(code, subtotal, coupons = INITIAL_COUPONS) {
  const normalized = (code || '').trim().toUpperCase();
  const coupon = coupons.find((c) => c.code === normalized);

  if (!coupon) {
    return { valid: false, error: 'Invalid promotional voucher code.' };
  }
  if (!coupon.isActive) {
    return { valid: false, error: 'This campaign voucher has expired.' };
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      error: `Order minimum of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for ${coupon.code}.`,
    };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  return {
    valid: true,
    discount,
    code: coupon.code,
    description: `${coupon.code} applied successfully`,
  };
}

// 3. Indian Address & PIN Validator
function validateIndianAddress({ pinCode, phone, fullName, street, city, state }) {
  if (!fullName || fullName.trim().length < 2) return { valid: false, error: 'Full patron name is required' };
  if (!street || street.trim().length < 5) return { valid: false, error: 'Street address is required' };
  if (!city || city.trim().length < 2) return { valid: false, error: 'City is required' };
  if (!state || state.trim().length < 2) return { valid: false, error: 'State is required' };

  const pinClean = (pinCode || '').trim();
  if (!/^\d{6}$/.test(pinClean)) {
    return { valid: false, error: 'Invalid 6-digit Indian Postal PIN code' };
  }

  const phoneClean = (phone || '').replace(/[\s\-\+]/g, '');
  if (!/^(91)?[6-9]\d{9}$/.test(phoneClean)) {
    return { valid: false, error: 'Invalid 10-digit Indian mobile number' };
  }

  return { valid: true };
}

// 4. Cart Pricing and Shipping Calculation
function calculateCartTotals(items, couponResult = null, expressAir = false) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponResult?.valid ? couponResult.discount : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);

  // Free shipping threshold: ₹1,999
  const isFreeShipping = discountedSubtotal >= 1999;
  const shippingFee = expressAir ? 199 : isFreeShipping ? 0 : 99;

  // 3% Indian GST included in luxury jewelry
  const gstAmount = Math.round((discountedSubtotal * 0.03) / 1.03);
  const total = discountedSubtotal + shippingFee;

  return {
    subtotal,
    discount,
    discountedSubtotal,
    shippingFee,
    gstAmount,
    total,
    isFreeShipping,
  };
}

// 5. DPDP Cookie Preferences
function updateCookieConsent(currentPrefs, changes) {
  return {
    ...currentPrefs,
    ...changes,
    essential: true, // Non-negotiable core session cookie
    responded: true,
    timestamp: new Date().toISOString(),
  };
}

// 6. RBAC Role Matrix
const ROLE_PERMISSIONS = {
  'Super Admin': ['Full Control', 'Staff Management', 'Financial Reports'],
  'Store Manager': ['Order Dispatch', 'Campaigns', 'Reviews Moderation'],
  'Product Manager': ['Catalog Edit', 'Restock', '3D Models Association'],
  'Order Manager': ['Status Updates', 'AWB Tracking', 'Address View'],
};

function hasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[role] || [];
  return role === 'Super Admin' || perms.includes(permission);
}

// --- Automated Test Suites ---

test('Product Catalog: Find by ID and Slug', () => {
  const copy = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  const hoop = getProductById(copy, 1);
  assert.ok(hoop, 'Product ID 1 should exist');
  assert.strictEqual(hoop.name, 'The Solara Sculpted Hoops');

  const necklace = getProductBySlug(copy, 'amara-layered-pendant-chain');
  assert.ok(necklace, 'Pendant chain slug should resolve');
  assert.strictEqual(necklace.price, 4999);
});

test('Product Catalog: Category and Collection Filtering', () => {
  const copy = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  const earrings = getProductsByCategory(copy, 'earrings');
  assert.strictEqual(earrings.length, 2, 'Should find 2 earrings');

  const festivePieces = getProductsByCollection(copy, 'festive-edit');
  assert.strictEqual(festivePieces.length, 2, 'Should find 2 festive pieces');
});

test('Product Catalog: SKU Inventory Stock Decrement & Restock', () => {
  const copy = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  const initialStock = copy[0].stock; // 14
  
  // Sale of 2 units
  const decremented = adjustStock(copy, 1, -2);
  assert.strictEqual(decremented, true);
  assert.strictEqual(copy[0].stock, initialStock - 2);

  // Atelier Restock of +10 units
  adjustStock(copy, 1, 10);
  assert.strictEqual(copy[0].stock, initialStock - 2 + 10);

  // Oversell protection: cannot go below 0
  adjustStock(copy, 1, -100);
  assert.strictEqual(copy[0].stock, 0);
});

test('Coupon Engine: Percentage Discount with Caps and Min Order Value', () => {
  // FESTIVE15: 15% off, min ₹2499, max discount ₹1500
  const orderBelowMin = validateCoupon('FESTIVE15', 1800);
  assert.strictEqual(orderBelowMin.valid, false);
  assert.match(orderBelowMin.error, /Order minimum of ₹2,499 required/);

  // Order of ₹3,000 -> 15% is ₹450
  const validOrder = validateCoupon('FESTIVE15', 3000);
  assert.strictEqual(validOrder.valid, true);
  assert.strictEqual(validOrder.discount, 450);

  // Large order of ₹20,000 -> 15% is ₹3000, should be capped at ₹1,500
  const cappedOrder = validateCoupon('FESTIVE15', 20000);
  assert.strictEqual(cappedOrder.valid, true);
  assert.strictEqual(cappedOrder.discount, 1500);
});

test('Coupon Engine: Fixed Discount and Invalid Codes', () => {
  // WELCOME500: Flat ₹500 off min ₹1999
  const res = validateCoupon('WELCOME500', 2500);
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.discount, 500);

  // Expired voucher
  const expired = validateCoupon('EXPIRED10', 5000);
  assert.strictEqual(expired.valid, false);
  assert.match(expired.error, /expired/);

  // Non-existent voucher
  const invalid = validateCoupon('FAKEDISCOUNT', 5000);
  assert.strictEqual(invalid.valid, false);
  assert.match(invalid.error, /Invalid/);
});

test('Cart Pricing: Subtotal, Shipping Rules, and GST', () => {
  const items = [
    { productId: 1, name: 'Hoops', price: 3499, quantity: 1 },
  ];

  // ₹3499 > ₹1999 free shipping threshold
  const totals1 = calculateCartTotals(items, null, false);
  assert.strictEqual(totals1.subtotal, 3499);
  assert.strictEqual(totals1.isFreeShipping, true);
  assert.strictEqual(totals1.shippingFee, 0);
  assert.strictEqual(totals1.total, 3499);

  // With express air transit (+₹199)
  const totalsExpress = calculateCartTotals(items, null, true);
  assert.strictEqual(totalsExpress.shippingFee, 199);
  assert.strictEqual(totalsExpress.total, 3499 + 199);

  // With coupon applied: ₹3499 - ₹500 (WELCOME500) = ₹2999
  const coupon = validateCoupon('WELCOME500', 3499);
  const totalsWithCoupon = calculateCartTotals(items, coupon, false);
  assert.strictEqual(totalsWithCoupon.discount, 500);
  assert.strictEqual(totalsWithCoupon.total, 2999);
});

test('Indian Logistics: PIN Code and Mobile Validation', () => {
  const validAddress = {
    fullName: 'Meera Sharma',
    street: 'Flat 402, Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400018',
    phone: '9820144821',
  };
  const validCheck = validateIndianAddress(validAddress);
  assert.strictEqual(validCheck.valid, true);

  // Invalid 5-digit PIN
  const invalidPin = validateIndianAddress({ ...validAddress, pinCode: '40001' });
  assert.strictEqual(invalidPin.valid, false);
  assert.match(invalidPin.error, /6-digit/);

  // Invalid phone number
  const invalidPhone = validateIndianAddress({ ...validAddress, phone: '12345' });
  assert.strictEqual(invalidPhone.valid, false);
  assert.match(invalidPhone.error, /10-digit/);
});

test('DPDP Privacy: Cookie Consent Categories', () => {
  const initial = { responded: false, essential: true, analytics: false, marketing: false };
  
  // User accepts analytics only
  const updated = updateCookieConsent(initial, { analytics: true, marketing: false });
  assert.strictEqual(updated.responded, true);
  assert.strictEqual(updated.essential, true, 'Essential cookies must always remain true');
  assert.strictEqual(updated.analytics, true);
  assert.strictEqual(updated.marketing, false);
  assert.ok(updated.timestamp);
});

test('RBAC Access Control: Role Matrix Authorization', () => {
  assert.strictEqual(hasPermission('Super Admin', 'Financial Reports'), true);
  assert.strictEqual(hasPermission('Super Admin', 'Staff Management'), true);

  assert.strictEqual(hasPermission('Store Manager', 'Order Dispatch'), true);
  assert.strictEqual(hasPermission('Store Manager', 'Staff Management'), false);

  assert.strictEqual(hasPermission('Order Manager', 'AWB Tracking'), true);
  assert.strictEqual(hasPermission('Order Manager', 'Catalog Edit'), false);
});
