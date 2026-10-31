# Urban Glimmer — Quality Assurance & Testing Suite

## 1. Automated Testing Suite

Urban Glimmer leverages Node.js's native test runner (`node --test`), providing rapid sub-50ms execution with zero heavy overhead.

### Running Automated Tests:

```bash
npm test
```

### Test Coverage Matrix (`test/business-logic.test.mjs`):

| Test Suite | Module Under Test | Validated Behaviors |
|---|---|---|
| **Product Catalog Lookup** | `lib/productStore.ts` | Lookup by primary key ID and SEO slug; non-existent ID safety |
| **Facet & Taxonomy Filters** | `lib/productStore.ts` | Category and collection queries; case-insensitive resolution |
| **Inventory Stock Sync** | `lib/productStore.ts` | Immediate decrement on sale; restock additions; oversell clamp at 0 |
| **Percentage Voucher Caps** | `lib/campaignStore.ts` | `FESTIVE15` calculation; max discount cap adherence; min order gate |
| **Flat Amount Vouchers** | `lib/campaignStore.ts` | `WELCOME500` deduction; rejection on expired and invalid codes |
| **Cart Pricing & Logistics** | Storefront & Checkout | Free shipping qualification above ₹1,999; express air fee; GST inclusion |
| **Indian Postal Validation** | `app/checkout/page.tsx` | 6-digit Indian PIN regex; 10-digit Indian phone validation |
| **DPDP Privacy Preferences** | `lib/settingsStore.ts` | Essential cookie lock; granular analytics and marketing consents |
| **RBAC Authorization** | `lib/customerStore.ts` | Super Admin, Store Manager, Product Manager, Order Manager matrix |

---

## 2. Static Analysis & Type Checking

To verify strict TypeScript typing without compiling:

```bash
npm run typecheck
```

Must return `exit code 0` with zero diagnostic errors across all storefront and admin routes.

---

## 3. Manual Functional Verification Checklist

- [x] **Storefront Navigation**: Mega-menu links, category buttons, policy pages open correct dynamic routes.
- [x] **Catalog Discovery**: Search keystrokes filter live catalog; price sliders and finish pills update grid.
- [x] **Product Detail Page**: Image zoom works; PIN code estimate shows BlueDart express delivery; "Write a Review" persists to review store.
- [x] **Shopping Bag**: Quantity increment/decrement recalculates subtotal and free shipping progress meter.
- [x] **Checkout Flow**: Validates 6-digit PIN; accepts simulated card/UPI; decrements SKU stock in inventory store upon placement.
- [x] **Patron Accounts**: Order history displays live order milestones and BlueDart tracking numbers.
- [x] **Admin Authentication**: Intercepts unauthenticated visits with staff portal; supports instant switcher between staff accounts.
- [x] **Admin Product CRUD**: Add, edit, and delete pieces with image upload and GLB link.
- [x] **Admin Campaigns**: Modifying announcement or hero text immediately reflects on the public storefront.
- [x] **Cookie Consent**: Persistent "Cookie Settings" trigger in footer reopens DPDP preference modal.
- [x] **3D Virtual Studio**: Opens cleanly on hero or PDP trigger; closes with previous scroll position intact.
