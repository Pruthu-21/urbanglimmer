# Urban Glimmer — Feature Catalogue & Functional Matrix

## 1. Customer-Facing Storefront Features

### 1.1 Header, Navigation & Mega-Menu
- **Configurable Announcement Bar**: Dismissible banner driven by `lib/campaignStore.ts` with direct links to seasonal campaigns.
- **Desktop Mega-Menu**: Multi-column editorial menu showcasing major categories (Earrings, Necklaces, Rings, Cuffs) and curated collection highlights.
- **Mobile Navigation Drawer**: Fully responsive accordion navigation with direct access to shopping bags, patron accounts, and policies.
- **Live Counters**: Real-time reactive item count for shopping bag and wishlist items.

### 1.2 Editorial Homepage (15 Deliberate Sections)
1. **Top Announcement Bar**: Dismissible promotional banner.
2. **Luxury Header**: Wordmark, navigation, search, wishlist, and bag triggers.
3. **Editorial Hero with Optional 3D**: High-contrast dark composition featuring an Indian festive model, champagne typography, and an "Experience 3D" trigger.
4. **Shop by Category**: Responsive visual grid for Earrings, Necklaces, Cuffs, Rings, Pearls, and Heirloom Sets.
5. **New Arrivals**: Real-time product cards with secondary hover images, finish tags, and quick-add actions.
6. **Bestsellers**: High-velocity pieces with BIS Hallmark badges and genuine reviews.
7. **Featured Collections**: Editorial storytelling for *The Festive Edit*, *Modern Gold*, and *Royal Polki*.
8. **Festive & Wedding Edit**: Curated festive jewelry with direct voucher application (`FESTIVE15`).
9. **Editorial Campaign Banner**: Full-width promotional photography highlighting Jaipur vermeil craftsmanship.
10. **Shop by Occasion**: Curated filtering for Weddings, Festive Soirées, Everyday Luxury, and Gifting.
11. **Curated Product Recommendations**: Complete-the-look pairings and matching sets.
12. **Brand Craftsmanship & Trust**: Four trust pillars (18k Vermeil, BIS Hallmarked, Insured Transit, 15-Day Returns).
13. **Jewellery Care & Styling Journal**: Editorial styling guide and vermeil preservation advice.
14. **Newsletter Subscription**: Patron privilege enrollment form with instant feedback.
15. **Luxury Footer**: Atelier locations, customer care, legal disclosures, and persistent DPDP "Cookie Settings" trigger.

### 1.3 Discovery, Search & Catalog Listing (`/shop`)
- **Facet Filters**: Category, occasion, finish (18k Yellow Gold, Rose Vermeil, Sterling Silver), and price range sliders.
- **Sorting Options**: Featured, Newest, Price: Low to High, Price: High to Low.
- **In-Stock Toggle**: Filter out depleted stock pieces instantly.
- **Search Drawer & Dedicated Search Page**: Live keystroke search matching product titles, materials, and categories.

### 1.4 Product Detail Page (`/products/[id]`)
- **Interactive Image Gallery**: Thumbnail switcher and zoom inspection.
- **Specifications Table**: Metal purity, plating thickness (2.5 microns 18k gold), weight in grams, dimensions, and BIS Hallmark identifier.
- **Indian PIN Code Delivery Checker**: 6-digit postal validator calculating estimated express delivery via BlueDart.
- **3D Studio Modal Trigger**: "Experience in 3D Studio" button available on compatible pieces.
- **Authentic Reviews Section**: Verified patron feedback with star breakdowns and "Write a Review" submission modal.

### 1.5 Shopping Bag & Multi-Step Checkout (`/cart`, `/checkout`)
- **Free Shipping Meter**: Visual progress bar tracking qualification toward complimentary insured transit (threshold: ₹1,999).
- **Promotional Coupon Validator**: Instant calculation of percentage and flat discounts.
- **Indian Postal Delivery**: City auto-fill from postal PIN codes, state selection, and landmark options.
- **Payment Methods**: Sandbox card simulator, UPI ID integration, and Cash on Delivery (COD).
- **Inventory Sync**: Immediate SKU stock decrement on order confirmation.

### 1.6 Patron Account & Live Order Tracking (`/account`, `/track-order`)
- **Patron Tier Status**: Silver, Gold, and Royal Gold membership tier badges based on lifetime atelier spend.
- **Order History & Timeline Tracking**: Six milestone states (`Pending`, `Confirmed`, `In Production`, `Shipped`, `Delivered`, `Cancelled`) with BlueDart AWB tracking links.
- **Address Book**: Multi-address management with default billing/shipping toggles.

---

## 2. Secure Administration Dashboard Features (`/admin`)

### 2.1 Role-Based Access Control (RBAC) & Authentication
- **Guarded Admin Shell**: Unauthenticated visitors are intercepted by a secure staff login screen.
- **Demo Staff Switcher**: Quick one-click testing between Super Admin, Store Manager, Product Manager, and Order Manager.
- **Role Permissions Matrix**:
  - `Super Admin`: Master control over catalog, financial reports, settings, and staff credentials.
  - `Store Manager`: Dispatches orders, controls seasonal banners, and moderates customer reviews.
  - `Product Manager`: Creates new pieces, manages collections, and uploads 3D GLB assets.
  - `Order Manager`: Updates BlueDart tracking numbers and manages shipment milestones.

### 2.2 Operational Modules Summary
- **Overview Dashboard (`/admin`)**: Real-time sales volume, gross realized revenue, AOV, low-stock warnings, and recent order queue.
- **Product Management (`/admin/products`, `/new`, `/[id]/edit`)**: Complete CRUD suite with image upload, finish selection, and GLB model association.
- **Inventory Management (`/admin/inventory`)**: SKU-level stock controller (+5 / -5 incrementors) with low-stock alerts.
- **Order Fulfillment (`/admin/orders`, `/[id]`)**: Status progression, AWB carrier tracking, CSV order export, and WhatsApp notification generator.
- **Customer Directory (`/admin/customers`)**: Lifetime spend tracking, address inspection, and concierge notes.
- **Coupon Engine (`/admin/coupons`)**: Percentage and flat voucher configuration, min order values, usage limits, and active toggles.
- **Campaign & Banner Management (`/admin/campaigns`)**: Announcement text, hero titles, and festive pop-up modal configuration without code edits.
- **Reviews & Moderation (`/admin/reviews`)**: Approve, hide, and publish official atelier replies to customer feedback.
- **Media & Asset Library (`/admin/media`)**: Image and 3D GLB model upload with one-click URL copying.
- **Analytics & Reporting (`/admin/analytics`)**: Date-filtered gross sales, AOV, category revenue distribution, and bestselling piece rankings.
- **Store Configuration (`/admin/settings`)**: GSTIN, registered head office, concierge contact details, and logistics thresholds.
- **Staff Accounts (`/admin/users`)**: Staff credential issuance and role assignments.
- **Audit Logs (`/admin/audit-logs`)**: Immutable timestamped activity trail with CSV export capability.
