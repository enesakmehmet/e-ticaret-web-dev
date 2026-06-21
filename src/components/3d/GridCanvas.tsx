"use client";

import { useMemo, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { CONFIG, matchesFilter, calculateGridDimensions, EMPTY_COLORS } from "./store";
import { ShoeTile } from "./ShoeTile";
import type { MappedShoeData, ShoeData } from "@/types";

export function GridCanvas({
  items,
  gridVisible,
  transitionStartTime,
  interactive,
  filter = "all",
  colorFilter = EMPTY_COLORS,
  searchTerm = "",
}: {
  items: ShoeData[];
  gridVisible: boolean;
  transitionStartTime: number;
  interactive: boolean;
  filter?: string;
  colorFilter?: string[];
  searchTerm?: string;
}) {
  const { mappedItems, filteredGridDims } = useMemo(() => {
    const spacing = CONFIG.itemSize + CONFIG.gap;
    const filteredItems = items.filter((item) =>
      matchesFilter(item, filter, colorFilter, searchTerm)
    );
    const filteredCount = filteredItems.length;
    const filteredDims = calculateGridDimensions(filteredCount);
    const maxDelay = gridVisible ? CONFIG.enterStaggerDelay : CONFIG.exitStaggerDelay;
    
    let filteredIdx = 0;
    
    const mapped: MappedShoeData[] = items.map((shoe, i) => {
      const matches = matchesFilter(shoe, filter, colorFilter, searchTerm);
      let targetPos: { x: number; y: number };
      
      if (matches) {
        const col = filteredIdx % CONFIG.gridCols;
        const row = Math.floor(filteredIdx / CONFIG.gridCols);
        targetPos = {
          x: col * spacing - filteredDims.width / 2 + spacing / 2,
          y: -(row * spacing) + filteredDims.height / 2 - spacing / 2,
        };
        filteredIdx++;
      } else {
        const col = i % CONFIG.gridCols;
        const row = Math.floor(i / CONFIG.gridCols);
        const originalDims = calculateGridDimensions(items.length);
        targetPos = {
          x: col * spacing - originalDims.width / 2 + spacing / 2,
          y: -(row * spacing) + originalDims.height / 2 - spacing / 2,
        };
      }
      
      return {
        ...shoe,
        index: i,
        randomDelay: Math.random() * maxDelay,
        basePos: targetPos,
        matchesFilter: matches,
      };
    });
    
    return {
      mappedItems: mapped,
      filteredGridDims: filteredDims,
    };
  }, [items, filter, colorFilter, searchTerm, gridVisible]);

  const [mountedCount, setMountedCount] = useState(gridVisible ? 0 : items.length);
  
  useFrame(() => {
    if (mountedCount < mappedItems.length) {
      setMountedCount((prev) => Math.min(prev + 15, mappedItems.length));
    }
  });

  return (
    <>
      {mappedItems.map((item, i) => {
        if (i > mountedCount) return null;
        return (
          <Suspense key={item.id || item.index} fallback={null}>
            <ShoeTile
              data={item}
              index={item.index}
              basePos={item.basePos}
              gridVisible={gridVisible}
              transitionStartTime={transitionStartTime}
              interactive={interactive && !!item.matchesFilter}
              gridHeight={filteredGridDims.height}
            />
          </Suspense>
        );
      })}
    </>
  );
}
