# URBAN GLIMMER — Premium Jewellery E-Commerce & Admin Dashboard

> Modern Luxury Combined with Indian Festive & Heirloom Elegance

Urban Glimmer is a production-grade Indian luxury jewellery and fashion-accessories e-commerce platform and administrative suite. Engineered using **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, **TypeScript**, and **Three.js / React Three Fiber**, the platform delivers an editorial storefront with an optional, contained 3D virtual studio and a full-featured administrative control panel.

---

## Table of Contents

1. [Brand & Product Vision](#1-brand--product-vision)
2. [Key Features](#2-key-features)
3. [Technology Stack](#3-technology-stack)
4. [Prerequisites](#4-prerequisites)
5. [Installation & Setup](#5-installation--setup)
6. [Development Commands](#6-development-commands)
7. [Production Build & Deployment](#7-production-build--deployment)
8. [Environment Variable Reference](#8-environment-variable-reference)
9. [Database & Persistence Architecture](#9-database--persistence-architecture)
10. [Authentication & RBAC Setup](#10-authentication--rbac-setup)
11. [Payment Gateway Configuration](#11-payment-gateway-configuration)
12. [Media & Storage Configuration](#12-media--storage-configuration)
13. [Product & Collection Management](#13-product--collection-management)
14. [Admin Dashboard Access & Roles](#14-admin-dashboard-access--roles)
15. [DPDP Cookie Consent Implementation](#15-dpdp-cookie-consent-implementation)
16. [3D Virtual Jewellery Studio](#16-3d-virtual-jewellery-studio)
17. [Uploading & Associating 3D Models](#17-uploading--associating-3d-models)
18. [Configuring Promotional Campaigns](#18-configuring-promotional-campaigns)
19. [API Endpoints & Routing Matrix](#19-api-endpoints--routing-matrix)
20. [Testing Suite](#20-testing-suite)
21. [Troubleshooting Guide](#21-troubleshooting-guide)
22. [Known Limitations](#22-known-limitations)
23. [Security & Privacy Considerations](#23-security--privacy-considerations)
24. [Future Enhancements](#24-future-enhancements)
25. [License & Credits](#25-license--credits)

---

## 1. Brand & Product Vision

- **Brand**: Urban Glimmer
- **Positioning**: Premium Indian jewellery and fashion accessories handcrafted in 18k gold vermeil, sterling silver, and natural freshwater pearls.
- **Design Philosophy**: Traditional luxury shopping with generous whitespace, editorial typography, and an optional 3D experience. Product photography and jewellery always receive maximum visual attention.
- **Brand Palette**:
  - Deep Burgundy: `#603A46`
  - Festive Wine: `#852F3A`
  - Champagne Gold: `#C6A064`
  - Warm Ivory: `#F8F4EE`
  - Dark Canvas: `#151313` & `#211C1D`
  - Text Primary: `#211B1C` | Text Muted: `#766D6D`

---

## 2. Key Features

### Storefront Experience
- **15 Deliberate Editorial Sections**: Top announcement bar, luxury mega-menu, dark editorial hero with Indian model, category grid, new arrivals, bestsellers, festive edit, brand craftsmanship pillars, and styling journal.
- **Optional 3D Studio**: Light preview mode with an "Experience 3D" modal trigger. Does not take over the website permanently.
- **Complete Public Discovery**: Facet filtering by category, finish, occasion, price; live search keystroke matching.
- **Luxury PDP**: High-res image gallery zoom, specifications (hallmark, weight, dimensions), Indian 6-digit PIN delivery checker with BlueDart express estimation, and genuine customer reviews.
- **Shopping Bag & Checkout**: Subtotal meter with free shipping progress threshold (₹1,999), coupon validator (`FESTIVE15`, `WELCOME500`), Indian address validator, and payment simulator (Card, UPI, COD).
- **Patron Account & Tracking**: Tier status badges (Silver, Gold, Royal Gold), order history, saved addresses, and live milestone tracking (`Pending` through `Delivered`).
- **DPDP 2023 Cookie Consent**: Granular category preferences (Essential, Analytics, Marketing) with persistent footer settings trigger.

### Administrative Control Suite (`/admin`)
- **Server-Style RBAC Barrier**: Role-based access control protecting all admin subroutes.
- **Overview Dashboard**: Gross revenue, AOV, low-stock warnings, and order fulfillment queue.
- **Product Management**: Full CRUD interface with multiple image upload, specifications, and 3D GLB model link.
- **Inventory Controller**: SKU-level stock adjuster with overselling guard.
- **Order Fulfillment**: Milestone status transitions, BlueDart AWB tracking number recorder, CSV export, and WhatsApp template generator.
- **Campaign Management**: Dynamic top announcement text, hero headlines, and festive pop-up modal configurations editable without code changes.
- **Customer Directory**: Patron tier ratings and lifetime spend analytics.
- **Promotional Coupons**: Percentage and flat discount rules with minimum order values and caps.
- **Review Moderation**: Approve, hide, and post official atelier replies.
- **Media Library**: Ingestion and one-click URL copying for images and 3D `.glb` assets.
- **Audit Logs**: Immutable activity log recording all staff changes with CSV export.

---

## 3. Technology Stack

- **Framework**: Next.js 15.2 (App Router with React 19)
- **Styling**: Tailwind CSS v4, PostCSS, Vanilla CSS tokens
- **Typography**: Playfair Display (Serif) & Inter / Outfit (Sans)
- **Animation**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **3D Graphics**: Three.js & React Three Fiber (R3F) with OrbitControls
- **Testing**: Node.js Native Test Runner (`node --test`)
- **Validation**: Strict TypeScript (zero `any` regressions)

---

## 4. Prerequisites

- **Node.js**: v20.9.0 or higher (v24 LTS recommended)
- **NPM**: v10.0.0 or higher
- **Modern Browser**: Chrome, Safari, Firefox, or Edge with WebGL support for the 3D studio.

---

## 5. Installation & Setup

```bash
# 1. Clone repository
git clone https://github.com/Pruthu-21/urbanglimmer.git
cd urbanglimmer

# 2. Install dependencies
npm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) to view the admin dashboard.

---

## 6. Development Commands

| Command | Action |
|---|---|
| `npm run dev` | Starts Next.js development server on port 3000 |
| `npm run typecheck` | Validates TypeScript types across all files without compilation |
| `npm test` | Executes the automated test suite in `test/business-logic.test.mjs` |
| `npm run build` | Compiles optimized Next.js production bundle |
| `npm run start` | Boots production server from compiled `.next` build |
| `npm run package:hostinger` | Packages standalone bundle for Hostinger Cloud deployment |

---

## 7. Production Build & Deployment

For deployment guides covering **Hostinger**, **Vercel**, **Docker**, and **Node VPS**, consult [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

```bash
npm run typecheck
npm test
npm run build
npm run start
```

---

## 8. Environment Variable Reference

See `.env.example` for all configurable variables:

```bash
NEXT_PUBLIC_SITE_URL=https://urbanglimmer.com
NEXT_PUBLIC_PAYMENT_GATEWAY_MODE=sandbox # or 'production'
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
STORAGE_PROVIDER=local                   # or 's3'
```

---

## 9. Database & Persistence Architecture

The platform features a modular, schema-driven architecture organized under `lib/`:
- `lib/productStore.ts`: Product catalog, SKUs, finish, hallmarks, inventory stock levels.
- `lib/orderStore.ts`: Order timeline milestones, customer addresses, BlueDart AWB tracking, WhatsApp templates.
- `lib/campaignStore.ts`: Announcement text, hero copy, festive modal, promotional coupons engine.
- `lib/customerStore.ts`: Patron profiles, patron tiers (Silver, Gold, Royal Gold), staff accounts.
- `lib/settingsStore.ts`: Store parameters, GSTIN, shipping fees, DPDP cookie preferences, audit logs.
- `lib/reviewStore.ts`: Customer reviews, verified-purchase badges, atelier replies.

Data is persisted to browser storage with cross-tab reactive synchronization, allowing immediate production testing without external database dependencies.

---

## 10. Authentication & RBAC Setup

Access to `/admin` routes is guarded by `AdminShell.tsx`. Four default staff accounts are configured for demonstration and testing:

| Staff Member | Email | Password | Role |
|---|---|---|---|
| Aarav Rathore | `aarav@urbanglimmer.com` | `admin123` | **Super Admin** |
| Tara Singhania | `tara.s@urbanglimmer.com` | `admin123` | **Store Manager** |
| Kavita Iyer | `kavita@urbanglimmer.com` | `admin123` | **Product Manager** |
| Dev Malhotra | `dev@urbanglimmer.com` | `admin123` | **Order Manager** |

You can use the **Quick Demo Staff Accounts** widget on the login screen to switch roles with a single click.

---

## 11. Payment Gateway Configuration

- Current Mode: **Interactive Sandbox Simulator** (configured in `lib/settingsStore.ts`).
- Supports simulated Card, Indian UPI ID (`user@okhdfcbank`), and Cash on Delivery.
- In production, configure Razorpay or Cashfree keys in `.env.local` as detailed in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 12. Media & Storage Configuration

- Upload Endpoints:
  - `/api/upload-image`: Ingests JPEG, PNG, WebP images to `/public/images/products`.
  - `/api/upload-model`: Ingests `.glb` and `.gltf` 3D files to `/public/models/jewelry`.
- Managed in the Admin dashboard via **Media Library** (`/admin/media`).

---

## 13. Product & Collection Management

- Navigate to `/admin/products` to create, edit, or archive jewellery items.
- Configurable attributes include SKU, stock quantity, gold finish, metal weight (grams), dimensions, hallmarks, lifestyle images, and optional 3D GLB model links.
- Manage collections at `/admin/collections` to curate seasonal edits.

---

## 14. Admin Dashboard Access & Roles

For detailed operational guides for store managers, order dispatchers, and product managers, see [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md).

---

## 15. DPDP Cookie Consent Implementation

Complies with the **Indian Digital Personal Data Protection (DPDP) Act 2023**:
- Banner appears on first visit with "Accept All", "Reject Optional", and "Customize Preferences".
- Three clear categories:
  - **Essential Cookies**: Strictly required for shopping bag, patron login, and checkout. Always active.
  - **Analytics Cookies**: Disabled by default until explicit consent.
  - **Marketing Cookies**: Disabled by default until explicit consent.
- Patrons can adjust preferences at any time via the persistent **Cookie Settings** link in the footer.

---

## 16. 3D Virtual Jewellery Studio

- Built with **Three.js** and **React Three Fiber (R3F)**.
- Features OrbitControls (rotate, zoom, pan), studio lighting, metal finish shaders, and complete-the-look pairings.
- Dynamically imported with `ssr: false` to ensure fast initial page loads.
- See [docs/3D_VIEWER.md](docs/3D_VIEWER.md) for full architectural details.

---

## 17. Uploading & Associating 3D Models

1. Open **Admin** -> **Media Library** -> **Upload Media or 3D Model**.
2. Select your `.glb` file (recommended under 15MB, 15k-50k polygons).
3. Copy the uploaded asset URL (e.g., `/models/jewelry/piece.glb`).
4. Edit the desired product in `/admin/products` and paste the URL into the **3D GLB/GLTF Model URL** field.

---

## 18. Configuring Promotional Campaigns

Change Diwali, Akshaya Tritiya, or Wedding season campaigns without code changes:
- Navigate to `/admin/campaigns`.
- Edit the announcement text, hero copy, and festive modal coupon.
- Click **Publish Campaign Updates** to update the storefront immediately.

---

## 19. API Endpoints & Routing Matrix

### Public Storefront Routes
- `/`: Master 15-section editorial homepage
- `/shop` & `/shop/[category]`: Product catalog with facet filters
- `/collections` & `/collections/[slug]`: Editorial collections
- `/products/[id]` & `/product/[slug]`: Product detail page
- `/search`, `/wishlist`, `/cart`, `/checkout`: Shopping workflow
- `/account`, `/account/orders`, `/track-order`: Patron portal
- `/about`, `/contact`, `/faq`, `/offers`, `/virtual-studio`: Brand and policies

### Admin Routes
- `/admin`: Overview KPIs and charts
- `/admin/products`, `/admin/inventory`, `/admin/categories`, `/admin/collections`: Catalog
- `/admin/orders`, `/admin/customers`: Fulfillment
- `/admin/coupons`, `/admin/campaigns`, `/admin/reviews`: Promotions
- `/admin/media`, `/admin/analytics`, `/admin/settings`, `/admin/users`, `/admin/audit-logs`: Enterprise management

---

## 20. Testing Suite

Run automated unit and integration tests:

```bash
npm test
```

Tests validate product catalog lookups, stock decrements, coupon rules, cart totals, Indian address regexes, cookie preferences, and RBAC matrix. See [docs/TESTING.md](docs/TESTING.md) for full coverage details.

---

## 21. Troubleshooting Guide

- **3D Canvas is blank**: Verify the browser supports WebGL. Ensure the model URL exists in `/public/models/jewelry/`.
- **Admin login rejected**: Ensure you are using a configured staff email (e.g., `aarav@urbanglimmer.com`, password `admin123`).
- **Free shipping not applied**: Free shipping applies automatically when the subtotal after coupons is ₹1,999 or higher.

---

## 22. Known Limitations

- Production payment processing is currently in interactive sandbox mode. Real merchant API keys are required for live payments.
- Real-time courier AWB synchronization uses simulated BlueDart transit milestones until carrier credentials are provided.

---

## 23. Security & Privacy Considerations

- API secrets and private credentials must never be committed to git.
- Server-side validation is enforced on prices, stock, discounts, and order totals.
- DPDP 2023 compliant cookie consent prevents tracking prior to patron consent.

---

## 24. Future Enhancements

- Multi-currency support (USD, AED, GBP) for international Indian diaspora shipping.
- Augmented Reality (AR) face and wrist try-on utilizing WebXR.
- Automated WhatsApp Business API webhook integration for real-time dispatch alerts.

---

## 25. License & Credits

Urban Glimmer Atelier © 2026. All rights reserved. Built with pride for luxury Indian jewellery craftsmanship.
