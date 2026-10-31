# Urban Glimmer — System Architecture & Technical Specifications

## 1. High-Level Architectural Overview

Urban Glimmer is structured as a modern, decoupled luxury e-commerce platform built on **Next.js 15.2 (App Router)**, **React 19**, **Tailwind CSS v4**, **Three.js / React Three Fiber**, and persistent TypeScript state engines.

```
+-----------------------------------------------------------------------------------+
|                                CLIENT APPLICATION                                 |
+----------------------------------------+------------------------------------------+
|          CUSTOMER STOREFRONT           |             ADMIN DASHBOARD              |
|  - Editorial Hero (Optional 3D)        |  - Enterprise RBAC Authentication        |
|  - Mega Menu & Mobile Drawer           |  - Real-time KPI Sales Analytics         |
|  - Dynamic Product Listing & PDP       |  - SKU Inventory Sync & Oversell Guard   |
|  - Real-time Bag, Wishlist & Search    |  - Order Fulfillment & BlueDart Tracking |
|  - Multi-Step Indian Checkout          |  - Campaign & Festive Modal Engine       |
|  - Patron Account & Live Order Tracker |  - DPDP Compliance & Audit Logs Trail    |
|  - 3D Virtual Jewellery Studio (Modal) |  - Media & 3D GLB Asset Manager          |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                              BUSINESS LOGIC & STATE                               |
|  - lib/productStore.ts   : Catalog, SKUs, Hallmark, Stock Decrement & Restock     |
|  - lib/orderStore.ts     : Multi-Milestone Timeline, AWB Tracking, WhatsApp/SMS    |
|  - lib/campaignStore.ts  : Dynamic Announcement, Hero, Festive Modal & Coupons   |
|  - lib/customerStore.ts  : Patron Directory, Saved Addresses, RBAC Admin Sessions|
|  - lib/settingsStore.ts  : GSTIN, Logistics Thresholds, DPDP Consent, Audit Trail|
|  - lib/reviewStore.ts    : Genuine Patron Reviews, Moderation & Atelier Replies   |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                               API & PERSISTENCE LAYER                             |
|  - /api/upload-image     : Secure product & campaign photo ingestion              |
|  - /api/upload-model     : GLB/GLTF 3D model validation & local disk persistence  |
|  - LocalStorage / Cache  : Client & Administrative cross-tab state synchronization|
|  - Next.js Edge Routes   : Dynamic XML Sitemap & Robots.txt                       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
urbanglimmer/
├── app/
│   ├── (storefront)/
│   │   ├── page.tsx                    # 15-section editorial homepage with optional 3D hero
│   │   ├── shop/                       # Product discovery catalog with facet filters
│   │   │   ├── page.tsx
│   │   │   └── [category]/page.tsx     # Dynamic category taxonomy routes
│   │   ├── collections/                # Curated editorial collections
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx         # Dynamic collection landing pages
│   │   ├── products/[id]/page.tsx      # Luxury PDP with image zoom, PIN checker & 3D modal
│   │   ├── product/[slug]/page.tsx     # Canonical SEO slug router
│   │   ├── search/page.tsx             # Full-page search with real-time query matching
│   │   ├── wishlist/page.tsx           # Saved heirloom pieces manager
│   │   ├── cart/page.tsx               # Full shopping bag review & free shipping meter
│   │   ├── checkout/page.tsx           # Multi-step Indian checkout with PIN & UPI support
│   │   ├── account/                    # Patron dashboard, orders, addresses, profile
│   │   ├── track-order/page.tsx        # Standalone public order milestone tracker
│   │   ├── offers/page.tsx             # Active campaign vouchers & festive privileges
│   │   ├── virtual-studio/page.tsx     # Standalone full-viewport 3D studio experience
│   │   ├── about/, contact/, faq/      # Brand heritage, client concierge & FAQ
│   │   └── shipping-policy/, etc.      # Insured transit, DPDP privacy & return policies
│   ├── admin/                          # Secure enterprise administration suite
│   │   ├── layout.tsx & AdminShell.tsx # Guarded RBAC layout & navigation shell
│   │   ├── page.tsx                    # Real KPIs, revenue trends & fulfillment queue
│   │   ├── products/                   # Product catalog CRUD & 3D model linker
│   │   ├── categories/ & collections/  # Taxonomy and seasonal curation managers
│   │   ├── inventory/                  # SKU-level stock controller & low-stock alerts
│   │   ├── orders/                     # Order lifecycle, status updater & CSV exporter
│   │   ├── customers/                  # Patron directory, lifetime value & tier badges
│   │   ├── coupons/                    # Voucher engine (percentage, flat, minimums)
│   │   ├── campaigns/                  # Dynamic announcements, hero text & modal config
│   │   ├── reviews/                    # Review moderation & concierge replies
│   │   ├── media/                      # Media library for photos and 3D GLB assets
│   │   ├── analytics/                  # Financial reports, AOV, category performance
│   │   ├── settings/                   # Store branding, GSTIN & logistics settings
│   │   ├── users/                      # RBAC staff accounts & permissions matrix
│   │   └── audit-logs/                 # Immutable event trail of all staff operations
│   ├── api/
│   │   ├── upload-image/route.ts       # Image upload endpoint
│   │   └── upload-model/route.ts       # 3D GLB/GLTF model upload endpoint
│   ├── globals.css                     # Brand design tokens & Tailwind v4 theme
│   ├── sitemap.ts                      # Dynamic XML sitemap generator
│   └── robots.ts                       # SEO robots.txt directives
├── components/
│   ├── storefront/                     # Header, MegaMenu, CartDrawer, SearchDrawer, etc.
│   ├── studio/                         # Three.js 3D canvas, procedural shaders, controls
│   └── admin/                          # Admin navigation shell and staff switcher
├── lib/                                # Domain business logic engines
├── test/                               # Automated unit & integration test suites
└── docs/                               # Comprehensive technical documentation
```

---

## 3. Brand Identity & Design Tokens

The application strictly implements the Phase 2 luxury brand palette defined in `app/globals.css`:

| Token | Hex Code | Visual Application |
|---|---|---|
| `--burgundy` | `#603A46` | Editorial badges, CTA buttons, active sidebar tabs |
| `--festive-wine` | `#852F3A` | Button hover states, sale accents, festive highlights |
| `--champagne-gold` | `#C6A064` | Delicate borders, star ratings, icon accents, luxury typography |
| `--warm-ivory` | `#F8F4EE` | Storefront surfaces, product card cards, light backgrounds |
| `--dark-bg` | `#151313` | Hero background, virtual 3D viewport canvas, admin sidebar |
| `--dark-surface` | `#211C1D` | Navigation headers, modal backdrops, admin cards |
| `--text-dark` | `#211B1C` | Primary typography on light surfaces |
| `--text-muted` | `#766D6D` | Subtitles, SKU labels, secondary descriptions |
| `--border-light` | `#E8DFD5` | Clean dividers, input borders, luxury table borders |

---

## 4. 3D Virtual Studio Engine

- **Library**: Three.js & React Three Fiber (R3F) with OrbitControls.
- **Lazy Loading**: Loaded via Next.js `dynamic(() => import(...), { ssr: false })` to protect Core Web Vitals (LCP/FID).
- **Graceful Fallback**: Automatically renders high-resolution studio photography if WebGL is unavailable or assets fail.
- **Resource Management**: Canvas animation loops are paused and GPU contexts detached when the modal closes.
