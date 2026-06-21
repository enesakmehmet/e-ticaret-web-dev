"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { CONFIG, rigState } from "./store";
import { CloseButton } from "./CloseButton";
import "./HoloCardMaterial";
import type { ShoeData } from "@/types";

interface HoloCardMaterialUniforms extends THREE.ShaderMaterial {
  uOpacity: number;
  uTime: number;
  uActive: number;
}

interface DreiTextHandle {
  fillOpacity: number;
  scale: {
    setScalar: (value: number) => void;
  };
}

export function ShoeTile({
  data,
  index,
  basePos,
  gridVisible,
  transitionStartTime,
  interactive,
  gridHeight,
}: {
  data: ShoeData;
  index: number;
  basePos: { x: number; y: number };
  gridVisible: boolean;
  transitionStartTime: number;
  interactive: boolean;
  gridHeight: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const imageRef = useRef<THREE.Mesh>(null);
  const titleRef = useRef<DreiTextHandle | null>(null);
  const priceRef = useRef<DreiTextHandle | null>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(data.imageUrl || data.image_url) as THREE.Texture;

  const focusZ = useRef(0);
  const rotationX = useRef(0);
  const rotationY = useRef(0);
  const curveZ = useRef(0);
  const transitionZ = useRef(0);
  const transitionY = useRef(0);
  const breathScale = useRef(1);

  const animatedPos = useRef({ x: basePos.x, y: basePos.y });
  const filterOpacity = useRef(1);
  const filterScale = useRef(1);
  const isSleep = useRef(false);
  const wasDimmedByFocus = useRef(false);

  const getMaterial = () => imageRef.current?.material as HoloCardMaterialUniforms | undefined;

  useLayoutEffect(() => {
    const normalizedY = gridHeight > 0 ? basePos.y / (gridHeight / 2) : 0;
    const material = getMaterial();

    if (gridVisible) {
      transitionZ.current = CONFIG.enterStartZ;
      transitionY.current = normalizedY * CONFIG.enterSpreadY;
      if (material) material.uOpacity = CONFIG.enterStartOpacity;
      isSleep.current = false;
    } else {
      transitionZ.current = 0;
      transitionY.current = 0;
      if (material) material.uOpacity = 1;
    }
  }, [gridVisible, basePos.y, gridHeight]);

  const imageDims = useMemo(() => {
    const maxSize = CONFIG.itemSize * 0.9;
    if (!texture.image) return { width: maxSize, height: maxSize };

    const img = texture.image as HTMLImageElement;
    const imgAspect = img.width / img.height;
    return imgAspect > 1
      ? { width: maxSize, height: maxSize / imgAspect }
      : { width: maxSize * imgAspect, height: maxSize };
  }, [texture]);

  useFrame((state, delta) => {
    if (!ref.current || isSleep.current) return;

    easing.damp(animatedPos.current, "x", basePos.x, 0.2, delta);
    easing.damp(animatedPos.current, "y", basePos.y, 0.2, delta);

    easing.damp(filterOpacity, "current", 1, CONFIG.filterOpacityDamp, delta);
    easing.damp(filterScale, "current", 1, CONFIG.filterOpacityDamp, delta);

    const canTransition = Date.now() - transitionStartTime > 0;
    let targetTransitionOpacity = 1;
    let targetTransitionZ = 0;
    const normalizedY = gridHeight > 0 ? basePos.y / (gridHeight / 2) : 0;
    let targetTransitionY = 0;

    if (gridVisible) {
      if (!canTransition) {
        targetTransitionOpacity = CONFIG.enterStartOpacity;
        targetTransitionZ = CONFIG.enterStartZ;
        targetTransitionY = normalizedY * CONFIG.enterSpreadY;
      }
    } else if (canTransition) {
      targetTransitionOpacity = 0;
      targetTransitionZ = CONFIG.exitEndZ;
      targetTransitionY = normalizedY * CONFIG.exitSpreadY;
    }

    const x = animatedPos.current.x + rigState.current.x;
    const y = animatedPos.current.y + rigState.current.y;
    const currentCull = CONFIG.cullDistance * (rigState.zoom / 8);
    const isPositionVisible = Math.abs(x) < currentCull && Math.abs(y) < currentCull;

    if (!gridVisible && targetTransitionOpacity < 0.01 && filterOpacity.current < 0.01) {
      ref.current.visible = false;
      isSleep.current = true;
      return;
    }

    if (!isPositionVisible && !(!gridVisible && canTransition)) {
      ref.current.visible = false;
      return;
    }

    if ((getMaterial()?.uOpacity ?? 1) < 0.01 && targetTransitionOpacity < 0.01) {
      ref.current.visible = false;
      return;
    }

    ref.current.visible = true;

    const isZoomedIn = rigState.zoom <= CONFIG.zoomIn + 0.5;
    const maxZoom = CONFIG.zoomOut || 50;
    const zoomRatio = isZoomedIn
      ? 0
      : THREE.MathUtils.clamp((rigState.zoom - CONFIG.zoomIn) / (maxZoom - CONFIG.zoomIn), 0, 1);

    const smoothRatio = easing.cubic.inOut(zoomRatio);
    const distSq = x * x + y * y;
    const dist = Math.sqrt(distSq);
    const targetCurveZ = -distSq * CONFIG.curvatureStrength * smoothRatio;

    let rotX = 0;
    let rotY = 0;
    if (targetTransitionOpacity > 0.1) {
      const rotationIntensity = Math.min(dist * 0.4, 2.0) * smoothRatio;
      rotX = y * CONFIG.curvatureStrength * CONFIG.rotationStrength * rotationIntensity;
      rotY = -x * CONFIG.curvatureStrength * CONFIG.rotationStrength * rotationIntensity;
    }

    const isFocusMode = rigState.activeId !== null;
    const isActive = rigState.activeId === index.toString();
    const isHovered = hovered && interactive;

    let interactionScale = 1;
    let interactionOpacity = 1;
    let targetTextOpacity = 0;
    let targetFocusZ = 0;

    if (isFocusMode) {
      if (isActive) {
        interactionScale = CONFIG.focusScale;
        targetTextOpacity = 1;
        targetFocusZ = 2;
      } else {
        interactionScale = CONFIG.dimScale;
        interactionOpacity = CONFIG.dimOpacity;
        targetFocusZ = -0.5;
        wasDimmedByFocus.current = true;
      }
    } else {
      interactionScale = isHovered && !rigState.isDragging ? 1.05 : 1;
      targetFocusZ = isHovered && !rigState.isDragging ? 0.5 : 0;
    }

    const finalOpacity = interactionOpacity * targetTransitionOpacity * filterOpacity.current;
    const combinedScale = interactionScale * filterScale.current;

    easing.damp(ref.current.scale, "x", combinedScale, 0.15, delta);
    easing.damp(ref.current.scale, "y", combinedScale, 0.15, delta);
    easing.damp(focusZ, "current", targetFocusZ, 0.2, delta);
    easing.damp(curveZ, "current", targetCurveZ, 0.2, delta);
    easing.damp(transitionZ, "current", targetTransitionZ, CONFIG.transitionZDamp, delta);
    easing.damp(transitionY, "current", targetTransitionY, CONFIG.transitionYDamp, delta);

    ref.current.position.set(x, y + transitionY.current, curveZ.current + focusZ.current + transitionZ.current);

    easing.damp(rotationX, "current", rotX, 0.2, delta);
    easing.damp(rotationY, "current", rotY, 0.2, delta);
    ref.current.rotation.set(rotationX.current, rotationY.current, 0);

    const material = getMaterial();
    if (material) {
      material.uTime = state.clock.elapsedTime;
      easing.damp(material, "uActive", isActive ? 1 : 0, isActive ? 0.6 : 0.15, delta);

      const isFilterTransition = filterOpacity.current < 0.99;
      const isFocusRecovery = !isFocusMode && wasDimmedByFocus.current;

      let opacityDamp = CONFIG.exitOpacityDamp;
      if (isFilterTransition && gridVisible) {
        opacityDamp = CONFIG.filterOpacityDamp;
      } else if (isFocusRecovery && gridVisible) {
        opacityDamp = CONFIG.filterOpacityDamp;
        if (material.uOpacity > 0.95) wasDimmedByFocus.current = false;
      } else if (gridVisible) {
        opacityDamp = CONFIG.enterOpacityDamp;
      }

      easing.damp(material, "uOpacity", finalOpacity, opacityDamp, delta);
    }

    if (gridVisible) {
      const textTarget = targetTransitionOpacity < 0.8 ? 0 : targetTextOpacity;
      if (titleRef.current) easing.damp(titleRef.current, "fillOpacity", textTarget, 0.1, delta);
      if (priceRef.current) easing.damp(priceRef.current, "fillOpacity", textTarget, 0.1, delta);

      const targetBreath = isActive ? 1 + Math.sin(state.clock.elapsedTime * 2) * 0.035 : 1;
      easing.damp(breathScale, "current", targetBreath, 0.1, delta);

      titleRef.current?.scale.setScalar(breathScale.current);
      priceRef.current?.scale.setScalar(breathScale.current);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive) return;
    if (rigState.isDragging) {
      e.stopPropagation();
      return;
    }

    e.stopPropagation();
    if (rigState.activeId === index.toString()) {
      rigState.activeId = null;
      rigState.zoom = CONFIG.zoomOut;
      return;
    }

    const isZoomedOut = rigState.zoom > CONFIG.zoomIn + 2;
    rigState.target.set(-basePos.x, -basePos.y, 0);
    rigState.activeId = index.toString();
    if (isZoomedOut) {
      rigState.zoom = CONFIG.zoomIn;
    }
  };

  const textY = -(imageDims.height / 2) - 0.25;
  const isActive = rigState.activeId === index.toString();

  return (
    <group ref={ref}>
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={handleClick}>
        <planeGeometry args={[imageDims.width * 1.1, imageDims.height * 1.1]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <mesh ref={imageRef}>
        <planeGeometry args={[imageDims.width, imageDims.height, 16, 16]} />
        <holoCardMaterial transparent uTexture={texture} />
      </mesh>

      {gridVisible && (
        <>
          <Text
            ref={titleRef}
            position={[0, textY, 0.01]}
            fontSize={0.12}
            color="#000"
            anchorY="top"
            anchorX="center"
            maxWidth={2.5}
            fillOpacity={0}
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          >
            {data.name}
          </Text>
          {data.price && (
            <Text
              ref={priceRef}
              position={[0, textY - 0.25, 0.01]}
              fontSize={0.1}
              color="#555"
              anchorY="top"
              anchorX="center"
              fillOpacity={0}
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            >
              {String(data.price)}
            </Text>
          )}
        </>
      )}

      <CloseButton
        isActive={isActive}
        position={[imageDims.width / 2 - 0.15, imageDims.height / 2 - 0.15, 0.02]}
        onClose={() => {
          rigState.activeId = null;
          rigState.zoom = CONFIG.zoomOut;
        }}
      />
    </group>
  );
}
