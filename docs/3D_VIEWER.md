# Urban Glimmer — 3D Virtual Jewellery Studio Architecture

## 1. Design Philosophy: Luxury First, Optional 3D

In accordance with Phase 4.3 & Phase 9 of the Urban Glimmer Master Specification:
- **Urban Glimmer is NOT a pure 3D experiment.**
- The primary user journey is effortless discovery, photography-led appreciation, and secure purchasing of fine jewellery.
- The 3D studio is an **optional immersive enhancement** that patrons can choose to enter and exit at any time.
- The 3D canvas **never runs permanently on the homepage background**, preserving Core Web Vitals, battery life, and smooth scrolling on mobile devices.

---

## 2. Technical Stack & Component Map

| Component | Path | Responsibility |
|---|---|---|
| `VirtualStudioModal.tsx` | `components/studio/VirtualStudioModal.tsx` | Full-viewport modal wrapper with scroll-lock, close button, and studio UI |
| `JewelryStudio3D.tsx` | `components/studio/JewelryStudio3D.tsx` | Three.js canvas, procedural geometries, GLB loader, studio lighting, OrbitControls |
| `studioConfig.ts` | `components/studio/studioConfig.ts` | Default camera positions, materials, finish shaders, rotation speeds |
| `ProductSuggestions.tsx` | `components/studio/ProductSuggestions.tsx` | Complete-the-look matching jewellery pieces available inside the 3D studio |
| `upload-model/route.ts` | `app/api/upload-model/route.ts` | Server-side validation and persistence for `.glb` and `.gltf` binary assets |

---

## 3. Dynamic Lazy Loading Architecture

To prevent heavy Three.js bundles (~600KB) from delaying initial storefront rendering:

```tsx
import dynamic from 'next/dynamic';

const VirtualStudioModal = dynamic(
  () => import('@/components/studio/VirtualStudioModal'),
  { ssr: false }
);
```

- Three.js is **only fetched when the customer clicks "Experience 3D"** on the hero or "View in 3D" on a compatible product page.
- When the modal is closed:
  - The WebGL rendering loop is stopped.
  - The customer's previous scroll position is preserved and restored.
  - Normal storefront interaction resumes instantaneously.

---

## 4. 3D Asset Guidelines & Uploading

### Supported Asset Formats
- Binary GL Transmission Format: `.glb` (Recommended, self-contained textures and geometry)
- Standard GL Transmission Format: `.gltf`

### Asset Constraints:
- **Maximum File Size**: 15 MB per piece.
- **Polycount**: 15,000 to 50,000 polygons for optimal mobile 60fps rendering.
- **Texture Resolution**: 2048 x 2048 (or 1024 x 1024) PNG/WebP with PBR metallic-roughness maps.
- **Color Space**: sRGB for albedo/diffuse; Linear for roughness/metalness/normal.

### Associating a 3D Model with a Product
1. Go to **Admin** -> **Media Library** -> Click **Upload Media or 3D Model**.
2. Select your `.glb` asset. Once uploaded, click **Copy URL** (e.g. `/models/jewelry/17300000_piece.glb`).
3. Navigate to **Products** -> Click **Edit** on the desired jewellery piece.
4. Paste the URL into the **3D GLB/GLTF Model URL** field and save.
5. The product page will now display the **Experience in 3D Studio** button!
