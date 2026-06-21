import * as THREE from "three";
import type { ShoeData } from "@/types";

// --- YAPILANDIRMA ---
export const DEFAULT_CONFIG = {
  gridCols: 8,
  itemSize: 2.5,
  gap: 0.4,

  // Fizik
  dragSpeed: 2.2,
  dampFactor: 0.2,
  tiltFactor: 0.08,
  clickThreshold: 5,
  dragResistance: 0.25,

  // Kamera / Yakınlaştırma
  zoomIn: 12,
  zoomOut: 31,
  zoomDamp: 0.25,

  // Görseller
  focusScale: 1.5,
  dimScale: 0.5,
  dimOpacity: 0.15,

  // 3B Eğrilik Efekti
  curvatureStrength: 0.06,
  rotationStrength: 0,

  // Kırpma
  cullDistance: 14,

  // Mini Harita
  mapWidth: 120,
  mapDotSize: 2,

  // Sis
  fogNear: 19,
  fogFar: 100,

  // Animasyon
  enterStartOpacity: 0.0,
  enterStartZ: -50,
  exitEndZ: 20,
  transitionZDamp: 0.25,
  enterOpacityDamp: 0.85,
  exitOpacityDamp: 0.15,
  enterStaggerDelay: 400,
  exitStaggerDelay: 300,
  cleanupTimeout: 700,
  exitSpreadY: 0.5,
  enterSpreadY: 1,
  transitionYDamp: 0.08,
  filterOpacityDamp: 0.06,
  filterScaleTarget: 0.5,

  // Teknoloji Arka Planı (Orijinal Açık Tema)
  bgColor: "#e0e0e0",
  bgOpacity: 0.4,
  bgSpeed: 0.05,
  bgScale: 3.0,
  bgLineThickness: 0.03,
};

export const CONFIG = { ...DEFAULT_CONFIG };

// --- KÜRESEL DURUM ---
export const rigState = {
  target: new THREE.Vector3(0, 2, 0),
  current: new THREE.Vector3(0, 2, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  zoom: CONFIG.zoomOut,
  isDragging: false,
  activeId: null as string | null,
};

// --- YARDIMCI: Izgara Boyutları ---
export const calculateGridDimensions = (count: number) => {
  const rows = Math.ceil(count / CONFIG.gridCols);
  const spacing = CONFIG.itemSize + CONFIG.gap;
  return {
    width: CONFIG.gridCols * spacing,
    height: rows * spacing,
  };
};

export const EMPTY_COLORS: string[] = [];

export const matchesFilter = (
  item: ShoeData,
  filter: string,
  colorFilter: string[] = EMPTY_COLORS,
  searchTerm: string = ""
) => {
  let matchesType = true;
  if (filter !== "all") {
    // item.category'nin "nike", "jordan", "adidas" veya item.brand olduğunu varsayarak
    const brand = (item.brand || item.category?.name || "").toLowerCase();
    matchesType = brand.includes(filter.toLowerCase());
  }

  let matchesSearch = true;
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    matchesSearch = item.name.toLowerCase().includes(term) || (item.brand || "").toLowerCase().includes(term);
  }

  return matchesType && matchesSearch;
};
