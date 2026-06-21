"use client";

import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CONFIG, rigState, calculateGridDimensions } from "./store";
import { Rig } from "./Rig";
import { GridCanvas } from "./GridCanvas";
import { TopologyBackground } from "./TopologyBackground";
import "./HoloCardMaterial";
import { AdaptiveDpr } from "@react-three/drei";
import type { ShoeData } from "@/types";

export default function ShoeGrid({ 
  items, 
}: { 
  items: ShoeData[],
}) {
  const [currentZoom, setCurrentZoom] = useState(rigState.zoom);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentZoom(rigState.zoom);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const isZoomedIn = currentZoom <= CONFIG.zoomIn + 0.5;

  useEffect(() => {
    const updateResponsiveZoom = () => {
      const width = window.innerWidth;
      let newZoomOut;
      if (width < 480) {
        newZoomOut = 48;
      } else if (width < 768) {
        newZoomOut = 38;
      } else {
        newZoomOut = CONFIG.zoomOut;
      }
      CONFIG.zoomOut = newZoomOut;
      if (rigState.zoom > CONFIG.zoomIn + 2) {
        rigState.zoom = newZoomOut;
        setCurrentZoom(newZoomOut);
      }
    };
    updateResponsiveZoom();
    window.addEventListener("resize", updateResponsiveZoom);
    return () => window.removeEventListener("resize", updateResponsiveZoom);
  }, []);

  const activeDims = calculateGridDimensions(items.length);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f0f0f0",
        position: "relative",
        overflow: "hidden",
        touchAction: "pan-y",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, CONFIG.zoomOut], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          toneMapping: THREE.NoToneMapping,
          powerPreference: "high-performance",
        }}
      >
        <AdaptiveDpr pixelated />
        
        <Rig gridW={activeDims.width} gridH={activeDims.height} />
        
        <TopologyBackground
          isZoomedIn={isZoomedIn}
          color={CONFIG.bgColor}
          opacity={CONFIG.bgOpacity}
          speed={CONFIG.bgSpeed}
          scale={CONFIG.bgScale}
          lineThickness={CONFIG.bgLineThickness}
        />
        
        <fog
          attach="fog"
          args={[
            "#f0f0f0",
            CONFIG.fogNear,
            CONFIG.fogFar,
          ]}
        />
        
        <Suspense fallback={null}>
          <GridCanvas
            items={items}
            gridVisible={true}
            transitionStartTime={0}
            interactive={true}
            filter="all"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
