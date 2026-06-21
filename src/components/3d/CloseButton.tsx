"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function CloseButton({
  isActive,
  position,
  onClose,
}: {
  isActive: boolean;
  position: [number, number, number];
  onClose: () => void;
}) {
  const { gl } = useThree();
  const [shouldShow, setShouldShow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    canvasRef.current = gl.domElement;
  }, [gl]);

  // 250ms delay before showing
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isActive) {
      timerRef.current = setTimeout(() => {
        setShouldShow(false);
      }, 0);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    timerRef.current = setTimeout(() => {
      setShouldShow(true);
    }, 250);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  const [x, y, z] = position;

  return (
    <Html
      position={[x, y, z]}
      center
      style={{
        pointerEvents: "auto",
        transform: "translate(-50%, -150%)",
      }}
      occlude
    >
      <style>
        {`
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.015); }
          }
        `}
      </style>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        onMouseEnter={() => {
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "pointer";
          }
        }}
        onMouseLeave={() => {
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        style={{
          width: "32px",
          height: "32px",
          border: "1px solid rgba(0, 0, 0, 1.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
          opacity: shouldShow ? 0.6 : 0,
          animation: shouldShow ? "breathe 3.14s ease-in-out infinite" : "none",
          transform: shouldShow ? "scale(1)" : "scale(0.8)",
          transition: "opacity 0.2s ease",
          background: "transparent",
          borderRadius: "50%",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.opacity = "0.8";
        }}
        onMouseOut={(e) => {
          if (shouldShow) {
            e.currentTarget.style.opacity = "0.6";
          }
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(0, 0, 0, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </Html>
  );
}
