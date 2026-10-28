'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CameraPreset, JewelryCategory, ProductTransform, TryOnSelection, StudioProduct } from './types';
import { CAMERA_PRESETS, DEFAULT_PRODUCT_TRANSFORMS, STUDIO_PRODUCTS } from './studioConfig';

export interface JewelryStudio3DHandle {
  getCurrentCameraState: () => CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;
}

export interface JewelryStudio3DProps {
  activeCategory: JewelryCategory;
  selections: TryOnSelection;
  onSelectCategory?: (category: JewelryCategory) => void;
  autoRotate?: boolean;
  cameraPresets?: Record<JewelryCategory, CameraPreset>;
  previewPreset?: CameraPreset | null;
  productTransforms?: Record<number, ProductTransform>;
  activeTransformPreview?: { productId: number; transform: ProductTransform } | null;
  products?: StudioProduct[];
}

const JewelryStudio3D = forwardRef<JewelryStudio3DHandle, JewelryStudio3DProps>(function JewelryStudio3D(
  {
    activeCategory,
    selections,
    autoRotate = false,
    cameraPresets,
    previewPreset,
    productTransforms,
    activeTransformPreview,
    products,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  // References to keep across re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const jewelryGroupRef = useRef<THREE.Group | null>(null);

  const initialPresets = cameraPresets || CAMERA_PRESETS;
  const initialPreset = initialPresets[activeCategory] || CAMERA_PRESETS['Full Model'];

  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(...initialPreset.position));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(...initialPreset.target));
  const targetFovRef = useRef<number>(initialPreset.fov);
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(...initialPreset.target));

  // Expose imperative handle for camera inspection & tuner
  useImperativeHandle(ref, () => ({
    getCurrentCameraState: (): CameraPreset => {
      const cam = cameraRef.current;
      if (!cam) {
        return {
          position: [
            Number(targetCamPosRef.current.x.toFixed(3)),
            Number(targetCamPosRef.current.y.toFixed(3)),
            Number(targetCamPosRef.current.z.toFixed(3)),
          ],
          target: [
            Number(currentLookAtRef.current.x.toFixed(3)),
            Number(currentLookAtRef.current.y.toFixed(3)),
            Number(currentLookAtRef.current.z.toFixed(3)),
          ],
          fov: Math.round(targetFovRef.current),
        };
      }
      return {
        position: [
          Number(cam.position.x.toFixed(3)),
          Number(cam.position.y.toFixed(3)),
          Number(cam.position.z.toFixed(3)),
        ],
        target: [
          Number(currentLookAtRef.current.x.toFixed(3)),
          Number(currentLookAtRef.current.y.toFixed(3)),
          Number(currentLookAtRef.current.z.toFixed(3)),
        ],
        fov: Math.round(cam.fov),
      };
    },
    setCameraPreset: (preset: CameraPreset) => {
      targetCamPosRef.current.set(...preset.position);
      targetLookAtRef.current.set(...preset.target);
      targetFovRef.current = preset.fov;
    },
  }));

  // Update target camera preset when activeCategory, custom presets or previewPreset changes
  useEffect(() => {
    if (previewPreset) {
      targetCamPosRef.current.set(...previewPreset.position);
      targetLookAtRef.current.set(...previewPreset.target);
      targetFovRef.current = previewPreset.fov;
      return;
    }
    const presets = cameraPresets || CAMERA_PRESETS;
    const preset = presets[activeCategory] || CAMERA_PRESETS[activeCategory] || CAMERA_PRESETS['Full Model'];
    targetCamPosRef.current.set(...preset.position);
    targetLookAtRef.current.set(...preset.target);
    targetFovRef.current = preset.fov;
  }, [activeCategory, cameraPresets, previewPreset]);


  // Main Three.js Scene Setup
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 700;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c0a0c); // Dark luxury charcoal

    // Subtle atmospheric studio fog
    scene.fog = new THREE.FogExp2(0x0c0a0c, 0.28);

    // 2. Camera
    const initialPreset = CAMERA_PRESETS[activeCategory] || CAMERA_PRESETS['Full Model'];
    const camera = new THREE.PerspectiveCamera(initialPreset.fov, width / height, 0.1, 50);
    camera.position.set(...initialPreset.position);
    cameraRef.current = camera;
    currentLookAtRef.current.set(...initialPreset.target);

    // 3. Renderer with high-end PBR settings directly on React canvas (never calls removeChild)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Studio Lighting
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.9);
    scene.add(ambientLight);

    // Warm Key Light (aimed at upper body & jewelry)
    const keyLight = new THREE.DirectionalLight(0xffecd2, 2.6);
    keyLight.position.set(1.5, 2.5, 2.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Soft Cool Fill Light
    const fillLight = new THREE.DirectionalLight(0xd9e5ff, 1.2);
    fillLight.position.set(-2.0, 1.8, 1.5);
    scene.add(fillLight);

    // Gold Rim/Accent Light from rear right
    const rimLight = new THREE.SpotLight(0xc6a064, 3.8, 10, Math.PI / 4, 0.5, 1.2);
    rimLight.position.set(-1.2, 2.8, -1.8);
    rimLight.lookAt(0, 1.4, 0);
    scene.add(rimLight);

    // Sparkle Highlight Light
    const jewelSparkle = new THREE.PointLight(0xffffff, 1.8, 4, 2);
    jewelSparkle.position.set(0.2, 1.6, 0.9);
    scene.add(jewelSparkle);

    // Studio Pedestal Floor Disc
    const floorGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.08, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x161316,
      roughness: 0.35,
      metalness: 0.6,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, 0.04, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Gold Pedestal Ring Border
    const ringGeo = new THREE.TorusGeometry(1.6, 0.015, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc6a064,
      metalness: 0.9,
      roughness: 0.2,
    });
    const goldRing = new THREE.Mesh(ringGeo, goldMat);
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.set(0, 0.08, 0);
    scene.add(goldRing);

    // 5. Build Base Female Character & Mannequin Group
    const characterGroup = new THREE.Group();
    characterGroupRef.current = characterGroup;
    scene.add(characterGroup);

    // Create Base Model Silhouette (Mannequin draped in black saree matching reference video)
    createBaseModel(characterGroup);

    // 6. Jewellery Group (anchored for interchangeable assets)
    const jewelryGroup = new THREE.Group();
    jewelryGroupRef.current = jewelryGroup;
    scene.add(jewelryGroup);

    // Load custom GLB asset rp_posed_00178_29.glb
    const gltfLoader = new GLTFLoader();
    const modelUrl = '/models/rp_posed_00178_29.glb';

    gltfLoader.load(
      modelUrl,
      (gltf) => {
        // Clear procedural mannequin and attach loaded GLB
        while (characterGroup.children.length > 0) {
          characterGroup.remove(characterGroup.children[0]);
        }
        const model = gltf.scene;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(0.4, mat.roughness ?? 0.5);
              mat.needsUpdate = true;
            }
          }
        });

        // Compute exact bounding box and ground on pedestal
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const targetHeight = 1.68;
        const scale = targetHeight / (size.y || 1);
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -box.min.y * scale + 0.08, -center.z * scale);

        characterGroup.add(model);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.warn('Failed loading rp_posed_00178_29.glb, keeping fallback:', err);
        setLoading(false);
      }
    );

    // Mouse & Touch Interaction for smooth orbit rotation, panning & zoom
    let isDragging = false;
    let isPanning = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let modelRotationY = 0;
    let modelTiltX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      isPanning = ('button' in e && e.button === 2) || ('shiftKey' in e && e.shiftKey);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      if (isPanning) {
        // Pan both camera and lookAt target
        const factor = 0.001;
        targetCamPosRef.current.x -= deltaX * factor;
        targetCamPosRef.current.y += deltaY * factor;
        targetLookAtRef.current.x -= deltaX * factor;
        targetLookAtRef.current.y += deltaY * factor;
      } else {
        // Dynamically orbit camera around the active focal target (e.g. wrist, ring)
        const target = targetLookAtRef.current;
        const camPos = targetCamPosRef.current;
        const dx = camPos.x - target.x;
        const dz = camPos.z - target.z;
        const hDist = Math.max(0.08, Math.sqrt(dx * dx + dz * dz));
        let theta = Math.atan2(dx, dz);
        theta -= deltaX * 0.008; // Dragging right swings camera to the left side!
        camPos.x = target.x + hDist * Math.sin(theta);
        camPos.z = target.z + hDist * Math.cos(theta);
        camPos.y = Math.max(target.y - 0.4, Math.min(target.y + 1.2, camPos.y + deltaY * 0.0025));
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      isPanning = false;
    };

    // Smooth scroll wheel zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.05 : 0.95;
      targetFovRef.current = Math.max(14, Math.min(60, targetFovRef.current * zoomFactor));
    };

    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('contextmenu', onContextMenu);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize Handler
    const onResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 7. Animation Loop with smooth camera interpolation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera position interpolation
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.065);
        currentLookAtRef.current.lerp(targetLookAtRef.current, 0.065);
        cameraRef.current.lookAt(currentLookAtRef.current);

        // Smooth FOV interpolation
        if (Math.abs(cameraRef.current.fov - targetFovRef.current) > 0.05) {
          cameraRef.current.fov += (targetFovRef.current - cameraRef.current.fov) * 0.065;
          cameraRef.current.updateProjectionMatrix();
        }
      }

      // Smooth auto-orbit if 360° mode is enabled
      if (autoRotate && !isDragging) {
        const target = targetLookAtRef.current;
        const camPos = targetCamPosRef.current;
        const dx = camPos.x - target.x;
        const dz = camPos.z - target.z;
        const hDist = Math.max(0.08, Math.sqrt(dx * dx + dz * dz));
        let theta = Math.atan2(dx, dz);
        theta += 0.003;
        camPos.x = target.x + hDist * Math.sin(theta);
        camPos.z = target.z + hDist * Math.cos(theta);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousedown', onPointerDown);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      canvas.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Update Jewellery whenever selections, transforms, or live preview changes
  useEffect(() => {
    if (!jewelryGroupRef.current) return;
    updateJewelryMeshes(
      jewelryGroupRef.current,
      selections,
      productTransforms,
      activeTransformPreview,
      products
    );
  }, [selections, productTransforms, activeTransformPreview, products]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden" ref={containerRef}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0C0A0C] z-20">
          <div className="w-10 h-10 border-2 border-[#C6A064] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-[#C6A064] text-xs font-mono tracking-widest uppercase">
            Initializing 3D Luxury Studio...
          </p>
        </div>
      )}
      {/* Visual studio vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_center,transparent_45%,rgba(0,0,0,0.65)_100%]" />
    </div>
  );
});

export default JewelryStudio3D;


// ==========================================
// Base Model Builder (Female Silhouette in Black Saree)
// ==========================================
function createBaseModel(group: THREE.Group) {
  // PBR Skin Material
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xd6a47a, // Warm South Asian complexion
    roughness: 0.42,
    metalness: 0.08,
  });

  // Black Saree & Blouse Velvet Material
  const sareeMaterial = new THREE.MeshStandardMaterial({
    color: 0x141215,
    roughness: 0.88,
    metalness: 0.1,
  });

  // Glossy Dark Hair Material
  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x110c0e,
    roughness: 0.28,
    metalness: 0.15,
  });

  // 1. Torso & Waist (Sleeveless Drape)
  const torsoGeo = new THREE.CylinderGeometry(0.18, 0.15, 0.5, 32);
  const torso = new THREE.Mesh(torsoGeo, sareeMaterial);
  torso.position.set(0, 1.05, 0);
  torso.castShadow = true;
  group.add(torso);

  // Bustier / Saree drape contour
  const bustierGeo = new THREE.CylinderGeometry(0.19, 0.17, 0.22, 32);
  const bustier = new THREE.Mesh(bustierGeo, sareeMaterial);
  bustier.position.set(0, 1.22, 0.02);
  group.add(bustier);

  // Saree Pallu Diagonal Drape across left shoulder
  const palluGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.65, 16);
  const pallu = new THREE.Mesh(palluGeo, sareeMaterial);
  pallu.rotation.z = 0.45;
  pallu.rotation.x = 0.15;
  pallu.position.set(-0.1, 1.15, 0.1);
  group.add(pallu);

  // Lower draped skirt
  const skirtGeo = new THREE.ConeGeometry(0.38, 0.85, 32, 1, true);
  const skirt = new THREE.Mesh(skirtGeo, sareeMaterial);
  skirt.position.set(0, 0.45, 0);
  group.add(skirt);

  // 2. Neck and Clavicle
  const neckGeo = new THREE.CylinderGeometry(0.065, 0.085, 0.2, 32);
  const neck = new THREE.Mesh(neckGeo, skinMaterial);
  neck.position.set(0, 1.42, 0.01);
  group.add(neck);

  // Collarbone / Clavicle accent curve
  const clavicleGeo = new THREE.TorusGeometry(0.12, 0.015, 16, 32, Math.PI);
  const clavicle = new THREE.Mesh(clavicleGeo, skinMaterial);
  clavicle.rotation.x = Math.PI / 2 + 0.1;
  clavicle.position.set(0, 1.34, 0.04);
  group.add(clavicle);

  // 3. Head & Face
  const headGeo = new THREE.SphereGeometry(0.115, 32, 32);
  headGeo.scale(1, 1.25, 1.05);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  head.position.set(0, 1.62, 0.02);
  head.castShadow = true;
  group.add(head);

  // Earlobes (Anchors for earrings)
  const earGeo = new THREE.SphereGeometry(0.022, 16, 16);
  earGeo.scale(0.5, 1.2, 0.8);
  const leftEar = new THREE.Mesh(earGeo, skinMaterial);
  leftEar.position.set(0.12, 1.6, 0.01);
  group.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, skinMaterial);
  rightEar.position.set(-0.12, 1.6, 0.01);
  group.add(rightEar);

  // Elegant Hair Volume
  const hairCrownGeo = new THREE.SphereGeometry(0.13, 24, 24);
  hairCrownGeo.scale(1.05, 1.15, 1.15);
  const hairCrown = new THREE.Mesh(hairCrownGeo, hairMaterial);
  hairCrown.position.set(0, 1.66, -0.02);
  group.add(hairCrown);

  // Flowing Waves Hair Left & Right
  const hairLeftGeo = new THREE.CylinderGeometry(0.06, 0.03, 0.45, 16);
  const hairLeft = new THREE.Mesh(hairLeftGeo, hairMaterial);
  hairLeft.rotation.z = -0.2;
  hairLeft.position.set(0.13, 1.45, -0.02);
  group.add(hairLeft);

  const hairRightGeo = new THREE.CylinderGeometry(0.06, 0.03, 0.45, 16);
  const hairRight = new THREE.Mesh(hairRightGeo, hairMaterial);
  hairRight.rotation.z = 0.2;
  hairRight.position.set(-0.13, 1.45, -0.02);
  group.add(hairRight);

  // 4. Arms & Folded Hands (matching video pose)
  // Left Upper Arm
  const armLGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.35, 16);
  const armL = new THREE.Mesh(armLGeo, skinMaterial);
  armL.position.set(-0.25, 1.15, 0.02);
  armL.rotation.z = -0.3;
  group.add(armL);

  // Left Forearm bent toward waist
  const forearmLGeo = new THREE.CylinderGeometry(0.038, 0.032, 0.32, 16);
  const forearmL = new THREE.Mesh(forearmLGeo, skinMaterial);
  forearmL.position.set(-0.18, 0.95, 0.08);
  forearmL.rotation.z = 0.95;
  forearmL.rotation.y = 0.3;
  group.add(forearmL);

  // Left Wrist (Anchor for Bracelets)
  const wristGeo = new THREE.SphereGeometry(0.03, 16, 16);
  const wristL = new THREE.Mesh(wristGeo, skinMaterial);
  wristL.position.set(-0.12, 0.88, 0.12);
  group.add(wristL);

  // Left Hand & Ring Finger (Anchor for Rings)
  const handLGeo = new THREE.SphereGeometry(0.035, 16, 16);
  handLGeo.scale(0.8, 1.4, 0.5);
  const handL = new THREE.Mesh(handLGeo, skinMaterial);
  handL.position.set(-0.06, 0.85, 0.14);
  handL.rotation.z = 0.6;
  group.add(handL);

  // Right Arm gracefully mirrored
  const armRGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.35, 16);
  const armR = new THREE.Mesh(armRGeo, skinMaterial);
  armR.position.set(0.25, 1.15, 0.02);
  armR.rotation.z = 0.3;
  group.add(armR);

  const forearmRGeo = new THREE.CylinderGeometry(0.038, 0.032, 0.32, 16);
  const forearmR = new THREE.Mesh(forearmRGeo, skinMaterial);
  forearmR.position.set(0.18, 0.95, 0.08);
  forearmR.rotation.z = -0.95;
  forearmR.rotation.y = -0.3;
  group.add(forearmR);
}

// ==========================================
// Dynamic Jewellery Meshes & Attachment Engine
// ==========================================
function updateJewelryMeshes(
  jewelryGroup: THREE.Group,
  selections: TryOnSelection,
  productTransforms?: Record<number, ProductTransform>,
  activeTransformPreview?: { productId: number; transform: ProductTransform } | null,
  productsList: StudioProduct[] = STUDIO_PRODUCTS
) {
  // Clear old jewelry meshes
  while (jewelryGroup.children.length > 0) {
    const child = jewelryGroup.children[0];
    jewelryGroup.remove(child);
    if ('geometry' in child && (child as THREE.Mesh).geometry) {
      (child as THREE.Mesh).geometry.dispose();
    }
  }

  const getTransform = (prodId: number): ProductTransform => {
    if (activeTransformPreview && activeTransformPreview.productId === prodId) {
      return activeTransformPreview.transform;
    }
    const currentProd = productsList.find((p) => p.id === prodId);
    const cat = currentProd?.category;

    const fallbackPos: [number, number, number] =
      cat === 'Rings'
        ? [-0.09, 1.63, -0.052]
        : cat === 'Bracelets'
        ? [-0.13, 0.89, 0.11]
        : cat === 'Earrings'
        ? [0.035, 1.58, -0.055]
        : [0, 1.52, -0.05];

    return (
      productTransforms?.[prodId] ||
      DEFAULT_PRODUCT_TRANSFORMS[prodId] || {
        position: fallbackPos,
        rotation: cat === 'Rings' ? [1.57, 0.4, 0] : [0, 0, 0],
        scale: 1.0,
      }
    );
  };

  // Helper to load custom .glb model if modelUrl is provided, or fallback to procedural builder
  const attachPieceMesh = (
    group: THREE.Group,
    prod: StudioProduct,
    buildProcedural: () => void
  ) => {
    if (prod.modelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        prod.modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          group.add(model);
        },
        undefined,
        (err) => {
          console.warn(`Could not load custom 3D model from ${prod.modelUrl}:`, err);
          buildProcedural();
        }
      );
    } else {
      buildProcedural();
    }
  };

  // Common Luxury Materials
  const gold18k = new THREE.MeshStandardMaterial({
    color: 0xe5c179,
    metalness: 0.95,
    roughness: 0.18,
  });

  const gold22k = new THREE.MeshStandardMaterial({
    color: 0xf5b842,
    metalness: 0.96,
    roughness: 0.22,
  });

  const pearlMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbf8f3,
    roughness: 0.22,
    metalness: 0.08,
  });

  const diamondMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0.95,
  });

  const emeraldMaterial = new THREE.MeshStandardMaterial({
    color: 0x059669,
    roughness: 0.12,
    metalness: 0.4,
  });

  // 1. EARRINGS (Cohesive group: responds dynamically to Fit Piece)
  if (selections.Earrings) {
    const prod = productsList.find((p) => p.id === selections.Earrings);
    if (prod) {
      const transform = getTransform(prod.id);
      const earGroup = new THREE.Group();

      // Local positions for Left & Right ear relative to earGroup center
      const earLeftLocal = new THREE.Vector3(0.085, 0, -0.015);
      const earRightLocal = new THREE.Vector3(-0.085, 0, 0.015);

      if (prod.meshType === 'solara_hoops') {
        // Sculpted Gold Hoops
        [earLeftLocal, earRightLocal].forEach((pos) => {
          const hoopGeo = new THREE.TorusGeometry(0.024, 0.0055, 16, 32);
          const hoop = new THREE.Mesh(hoopGeo, gold18k);
          hoop.position.copy(pos);
          hoop.position.y -= 0.015;
          hoop.rotation.y = Math.PI / 2;
          earGroup.add(hoop);
        });
      } else if (prod.meshType === 'luna_pearls') {
        // Organic Baroque Pearl Drops
        [earLeftLocal, earRightLocal].forEach((pos) => {
          const topRingGeo = new THREE.TorusGeometry(0.01, 0.003, 12, 24);
          const topRing = new THREE.Mesh(topRingGeo, gold18k);
          topRing.position.copy(pos);
          topRing.rotation.y = Math.PI / 2;
          earGroup.add(topRing);

          const pearlGeo = new THREE.SphereGeometry(0.015, 24, 24);
          pearlGeo.scale(0.85, 1.35, 0.85);
          const pearl = new THREE.Mesh(pearlGeo, pearlMaterial);
          pearl.position.set(pos.x, pos.y - 0.026, pos.z);
          earGroup.add(pearl);
        });
      } else if (prod.meshType === 'kundan_jhumkas') {
        // Dome Filigree Jhumkas
        [earLeftLocal, earRightLocal].forEach((pos) => {
          const studGeo = new THREE.SphereGeometry(0.008, 16, 16);
          const stud = new THREE.Mesh(studGeo, gold22k);
          stud.position.copy(pos);
          earGroup.add(stud);

          const domeGeo = new THREE.ConeGeometry(0.022, 0.022, 24, 1, true);
          const dome = new THREE.Mesh(domeGeo, gold22k);
          dome.position.set(pos.x, pos.y - 0.026, pos.z);
          dome.rotation.x = Math.PI;
          earGroup.add(dome);

          // Hanging bead
          const beadGeo = new THREE.SphereGeometry(0.005, 12, 12);
          const bead = new THREE.Mesh(beadGeo, pearlMaterial);
          bead.position.set(pos.x, pos.y - 0.042, pos.z);
          earGroup.add(bead);
        });
      } else {
        // Emerald & Diamond Studs
        [earLeftLocal, earRightLocal].forEach((pos) => {
          const gemGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 8);
          const gem = new THREE.Mesh(gemGeo, emeraldMaterial);
          gem.position.copy(pos);
          gem.rotation.x = Math.PI / 2;
          earGroup.add(gem);

          const haloGeo = new THREE.TorusGeometry(0.016, 0.003, 12, 24);
          const halo = new THREE.Mesh(haloGeo, diamondMaterial);
          halo.position.copy(pos);
          halo.rotation.x = Math.PI / 2;
          earGroup.add(halo);
        });
      }

      earGroup.position.set(transform.position[0], transform.position[1], transform.position[2]);
      earGroup.rotation.set(transform.rotation[0], transform.rotation[1], transform.rotation[2]);
      earGroup.scale.setScalar(transform.scale);
      jewelryGroup.add(earGroup);
    }
  }
  // 2. NECKLACES (Cohesive group: responds dynamically to Fit Piece)
  if (selections.Necklaces) {
    const prod = productsList.find((p) => p.id === selections.Necklaces);
    if (prod) {
      const transform = getTransform(prod.id);
      const neckGroup = new THREE.Group();

      attachPieceMesh(neckGroup, prod, () => {
        if (prod.meshType === 'amara_layered') {
          // Layer 1: Choker Chain
          const chain1Geo = new THREE.TorusGeometry(0.09, 0.0035, 16, 48, Math.PI * 0.95);
          const chain1 = new THREE.Mesh(chain1Geo, gold18k);
          chain1.position.set(0, 0, 0);
          chain1.rotation.x = Math.PI / 2 + 0.35;
          neckGroup.add(chain1);

          // Layer 2: Longer Chain with Teardrop Medallion
          const chain2Geo = new THREE.TorusGeometry(0.12, 0.0035, 16, 48, Math.PI * 0.95);
          const chain2 = new THREE.Mesh(chain2Geo, gold18k);
          chain2.position.set(0, -0.03, 0);
          chain2.rotation.x = Math.PI / 2 + 0.42;
          neckGroup.add(chain2);

          // Hanging Pendant
          const pendantGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.003, 24);
          const pendant = new THREE.Mesh(pendantGeo, gold18k);
          pendant.position.set(0, -0.08, 0);
          pendant.rotation.x = 0.3;
          neckGroup.add(pendant);
        } else if (prod.meshType === 'mira_sunburst') {
          // Single Fine Chain with Sunburst Coin
          const chainGeo = new THREE.TorusGeometry(0.105, 0.003, 16, 48, Math.PI * 0.95);
          const chain = new THREE.Mesh(chainGeo, gold18k);
          chain.position.set(0, -0.16, 0.085);
          chain.rotation.x = Math.PI / 2 + 0.38;
          neckGroup.add(chain);

          const coinGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.003, 32);
          const coin = new THREE.Mesh(coinGeo, gold18k);
          coin.position.set(0, 0, 0.05);
          coin.rotation.x = 0.25;
          neckGroup.add(coin);
        } else {
          // Diamond Tennis Choker
          const chokerGeo = new THREE.TorusGeometry(0.088, 0.0055, 16, 48, Math.PI * 0.95);
          const choker = new THREE.Mesh(chokerGeo, diamondMaterial);
          choker.position.set(0, 0, 0.05);
          choker.rotation.x = Math.PI / 2 + 0.3;
          neckGroup.add(choker);
        }
      });

      neckGroup.position.set(transform.position[0], transform.position[1], transform.position[2]);
      neckGroup.rotation.set(transform.rotation[0], transform.rotation[1], transform.rotation[2]);
      neckGroup.scale.setScalar(transform.scale);
      jewelryGroup.add(neckGroup);
    }
  }

  // 3. RINGS (Cohesive group: band + face/gem rotate as one piece)
  if (selections.Rings) {
    const prod = productsList.find((p) => p.id === selections.Rings);
    if (prod) {
      const transform = getTransform(prod.id);
      const ringGroup = new THREE.Group();

      attachPieceMesh(ringGroup, prod, () => {
        if (prod.meshType === 'solstice_signet') {
          const ringGeo = new THREE.TorusGeometry(0.012, 0.0035, 16, 32);
          const ring = new THREE.Mesh(ringGeo, gold18k);
          ringGroup.add(ring);

          // Signet Flat Top Face
          const faceGeo = new THREE.CylinderGeometry(0.0075, 0.0075, 0.003, 24);
          const face = new THREE.Mesh(faceGeo, gold18k);
          face.rotation.x = Math.PI / 2;
          face.position.set(0, 0.012, 0);
          ringGroup.add(face);
        } else if (prod.meshType === 'elysia_stack') {
          [-0.003, 0.003].forEach((offsetZ) => {
            const bandGeo = new THREE.TorusGeometry(0.011, 0.0025, 16, 32);
            const band = new THREE.Mesh(bandGeo, offsetZ < 0 ? gold18k : diamondMaterial);
            band.position.set(0, 0, offsetZ);
            ringGroup.add(band);
          });
        } else {
          // Solitaire Diamond Ring
          const ringGeo = new THREE.TorusGeometry(0.011, 0.003, 16, 32);
          const ring = new THREE.Mesh(ringGeo, gold18k);
          ringGroup.add(ring);

          const gemGeo = new THREE.OctahedronGeometry(0.006, 2);
          const gem = new THREE.Mesh(gemGeo, diamondMaterial);
          gem.position.set(0, 0.0135, 0);
          ringGroup.add(gem);
        }
      });

      ringGroup.position.set(transform.position[0], transform.position[1], transform.position[2]);
      ringGroup.rotation.set(transform.rotation[0], transform.rotation[1], transform.rotation[2]);
      ringGroup.scale.setScalar(transform.scale);
      jewelryGroup.add(ringGroup);
    }
  }

  // 4. BRACELETS (Cohesive group with dynamic transforms)
  if (selections.Bracelets) {
    const prod = productsList.find((p) => p.id === selections.Bracelets);
    if (prod) {
      const transform = getTransform(prod.id);
      const wristGroup = new THREE.Group();

      attachPieceMesh(wristGroup, prod, () => {
        if (prod.meshType === 'aurelia_cuff') {
          const cuffGeo = new THREE.TorusGeometry(0.038, 0.006, 16, 32, Math.PI * 1.6);
          const cuff = new THREE.Mesh(cuffGeo, gold18k);
          wristGroup.add(cuff);
        } else if (prod.meshType === 'afterglow_chain') {
          const chainGeo = new THREE.TorusGeometry(0.036, 0.0035, 16, 32);
          const chain = new THREE.Mesh(chainGeo, gold18k);
          wristGroup.add(chain);

          const tagGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.002, 16);
          const tag = new THREE.Mesh(tagGeo, gold18k);
          tag.position.set(-0.015, -0.03, 0.01);
          wristGroup.add(tag);
        } else {
          const bangleGeo = new THREE.TorusGeometry(0.037, 0.005, 16, 48);
          const bangle = new THREE.Mesh(bangleGeo, gold22k);
          wristGroup.add(bangle);
        }
      });

      wristGroup.position.set(transform.position[0], transform.position[1], transform.position[2]);
      wristGroup.rotation.set(transform.rotation[0], transform.rotation[1], transform.rotation[2]);
      wristGroup.scale.setScalar(transform.scale);
      jewelryGroup.add(wristGroup);
    }
  }
}
