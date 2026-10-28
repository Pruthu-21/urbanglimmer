export type JewelryCategory = 'Full Model' | 'Earrings' | 'Necklaces' | 'Rings' | 'Bracelets';

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface AttachmentAnchor {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface ProductTransform {
  position: [number, number, number];
  rotation: [number, number, number]; // [rotX, rotY, rotZ] in radians
  scale: number;
}


export interface StudioProduct {
  id: number;
  name: string;
  category: 'Earrings' | 'Necklaces' | 'Rings' | 'Bracelets';
  price: number;
  oldPrice?: number;
  image: string;
  finish: string;
  material: string;
  description: string;
  meshType: string;
  badge?: string;
  dimensions?: string;
  modelUrl?: string; // Optional path or URL to custom .glb/.gltf 3D model
}

export interface TryOnSelection {
  Earrings?: number;
  Necklaces?: number;
  Rings?: number;
  Bracelets?: number;
}
