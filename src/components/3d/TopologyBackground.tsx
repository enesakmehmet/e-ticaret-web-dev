"use client";

import React, { useRef } from "react";
import { useFrame, extend, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial, Plane } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { topographyVert, topographyFrag } from "./shaders";

// --- 1. SHADER: AKIŞKAN TOPOGRAFYA ---
const TopographyMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#e0e0e0"),
    uResolution: new THREE.Vector2(1, 1),
    uOpacity: 1.0,
    uLineOpacity: 0.4,
    uScale: 3.0,
    uLineThickness: 0.03,
  },
  topographyVert,
  topographyFrag
);

extend({ TopographyMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    topographyMaterial: ThreeElement<typeof TopographyMaterial>;
  }
}

interface TopologyBackgroundProps {
  isZoomedIn?: boolean;
  quality?: number;
  color?: string;
  opacity?: number;
  speed?: number;
  scale?: number;
  lineThickness?: number;
}

interface TopographyShaderMaterial extends THREE.ShaderMaterial {
  uTime: number;
  uColor: THREE.Color;
  uResolution: THREE.Vector2;
  uOpacity: number;
  uLineOpacity: number;
  uScale: number;
  uLineThickness: number;
}

export function TopologyBackground({
  isZoomedIn = false,
  quality = 1,
  color = "#e0e0e0",
  opacity = 0.4,
  speed = 0.05,
  scale = 3.0,
  lineThickness = 0.03,
}: TopologyBackgroundProps) {
  const materialRef = useRef<TopographyShaderMaterial | null>(null);

  // Sabit dünya alanı boyutları (kamera yakınlaştırmasıyla değişmez)
  const planeWidth = 90;
  const planeHeight = 40;

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    materialRef.current.uTime += delta * (speed / 0.05); // Hızı normalleştir
    materialRef.current.uResolution.set(planeWidth, planeHeight);
    materialRef.current.uColor.set(color);
    materialRef.current.uLineOpacity = opacity;
    materialRef.current.uScale = scale;
    materialRef.current.uLineThickness = lineThickness;

    // Yakınlaştırma durumuna göre opaklığı değiştir
    const targetOpacity = isZoomedIn ? 0.25 : 1.0;
    easing.damp(materialRef.current, "uOpacity", targetOpacity, 0.3, delta);
  });

  // Düşük kalite modu: basit düz renkli düzlem çiz (shader yok)
  if (quality < 0.5) {
    return (
      <Plane args={[planeWidth, planeHeight]} position={[0, 0, -15]} renderOrder={-1}>
        <meshBasicMaterial color="#e8e8e8" />
      </Plane>
    );
  }

  return (
    // Hesaplanmış Genişlik/Yüksekliği geometriye aktar
    <Plane args={[planeWidth, planeHeight]} position={[0, 0, -15]} renderOrder={-1}>
      <topographyMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
      />
    </Plane>
  );
}
