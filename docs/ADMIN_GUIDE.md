# Urban Glimmer — Administrator & Operations Guide

## 1. Accessing the Control Panel

The administration suite is hosted at the `/admin` path:
- URL: `http://localhost:3000/admin` (or `https://your-domain.com/admin`)
- Security: Protected by client-side authentication checks in `AdminShell.tsx`.

### Preconfigured Staff Accounts for Testing:

| Staff Member | Email | Password | Role | Primary Responsibility |
|---|---|---|---|---|
| Aarav Rathore | `aarav@urbanglimmer.com` | `admin123` | **Super Admin** | Master configuration, staff accounts, financial reports |
| Tara Singhania | `tara.s@urbanglimmer.com` | `admin123` | **Store Manager** | Orders, campaigns, review moderation, customer notes |
| Kavita Iyer | `kavita@urbanglimmer.com` | `admin123` | **Product Manager**| Catalog CRUD, inventory restock, 3D GLB models |
| Dev Malhotra | `dev@urbanglimmer.com` | `admin123` | **Order Manager** | Status transitions, AWB tracking, courier dispatch |

> **Tip**: You can switch between staff accounts instantly on the login screen using the quick demo staff account cards.

---

## 2. Managing Products & 3D Assets

### Creating a New Jewellery Piece
1. In the sidebar, select **Products** -> click **Add New Piece** (top right).
2. Enter the Product Title, Category (e.g., `Earrings`, `Necklaces`, `Cuffs`), SKU (e.g., `UG-EAR-009`), and Material.
3. Upload product photography:
   - Primary Studio Photography (Square/Portrait aspect ratio recommended).
   - Secondary Lifestyle / Model Shot (displayed on card hover).
4. Enter pricing details in INR (`₹`) and inventory stock level.
5. **Optional 3D Model**:
   - If a GLB/GLTF model exists, upload it via the **Media Library** or enter its public URL (e.g., `/models/jewelry/piece.glb`).
   - If left blank, the product gracefully renders high-resolution photos with no broken 3D buttons.
6. Click **Publish Piece to Catalogue**. The piece appears immediately in the live storefront.

---

## 3. Order Processing & Tracking Workflow

1. Navigate to **Orders** (`/admin/orders`).
2. Search by Order ID (e.g., `UG-89412`) or filter by payment status (`Paid`, `Pending`, `COD`).
3. Click **Fulfill / View** to open the order details screen.
4. **Update Status**:
   - `Pending` -> `Confirmed` -> `In Production (Jaipur Atelier)` -> `Shipped` -> `Delivered`.
5. **Record BlueDart AWB Tracking**:
   - Select carrier: `BlueDart Luxury Express`.
   - Enter tracking AWB number (e.g., `BD-982144012IN`).
   - Save. The customer can now track their shipment via the storefront `/track-order` page.
6. **WhatsApp Customer Update**:
   - Click **WhatsApp Dispatch Update** to generate an automated personalized template message to send directly to the customer.

---

## 4. Configuring Seasonal Campaigns & Banners

To change the festive campaign without modifying code:
1. Navigate to **Campaigns** (`/admin/campaigns`).
2. **Top Announcement Bar**: Update text, link URL, and toggle visibility.
3. **Hero Editorial Section**: Modify eyebrow text, headline, subheadline, and CTA labels.
4. **Festive Promotional Modal**:
   - Change headline (e.g. "Celebrate Akshaya Tritiya" or "The Wedding Season Privilege").
   - Set promotional coupon code (e.g. `FESTIVE15`).
   - Toggle modal active/inactive.
5. Click **Publish Campaign Updates**. The storefront updates instantly.

---

## 5. Moderating Customer Reviews

1. Navigate to **Reviews** (`/admin/reviews`).
2. Inspect customer star ratings, comments, and verified purchase badges.
3. Actions:
   - **Approve**: Publishes the review on the product detail page.
   - **Hide**: Conceals inappropriate or spam comments.
   - **Reply**: Post an official atelier reply (e.g., thanking the patron or offering care tips).

---

## 6. Audit Trail & Compliance

Every staff action (order status change, stock restock, price modification, campaign change) is automatically recorded with:
- Timestamp (IST)
- Staff Member Name
- Action Category (`STATUS_UPDATE`, `INVENTORY_RESTOCK`, etc.)
- Target Entity & Detailed payload
- **CSV Export**: Click **Export Audit Log (CSV)** to download compliance logs for external accounting or audits.
