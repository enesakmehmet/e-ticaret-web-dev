"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import shoesData from "@/lib/shoes.json";
import { ChevronDown, Heart } from "lucide-react";
import { CONFIG, rigState } from "./store";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import type { ShoeData } from "@/types";

const ShoeGrid = dynamic(() => import("./ShoeGrid"), { ssr: false });

const FILTERS = [
  { label: "Nike", value: "Nike" },
  { label: "Adidas", value: "Adidas" },
  { label: "Jordan", value: "Jordan" },
  { label: "New Balance", value: "New Balance" },
];

export function Hero3D() {
  const [activeFilter, setActiveFilter] = useState("Nike");
  const [activeShoeIndex, setActiveShoeIndex] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("42");
  const [addedMessage, setAddedMessage] = useState(false);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { dict } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShoeIndex(rigState.activeId);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const allProducts: ShoeData[] = shoesData.map((p, index: number) => ({
    id: String(p.id),
    index,
    name: p.title,
    brand: p.brand,
    price: p.price,
    imageUrl: p.image_url,
    image_url: p.image_url,
    category: { name: p.brand },
    primary_color: p.primary_color,
    primary_color_hex: p.primary_color_hex,
  }));

  const filteredProducts = allProducts
    .filter((p) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "Jordan") {
        return p.name.toLowerCase().includes("jordan");
      }
      if (activeFilter === "Nike") {
        return p.brand === "Nike" && !p.name.toLowerCase().includes("jordan");
      }
      return p.brand === activeFilter;
    })
    .slice(0, 32)
    .map((p, index: number) => ({ ...p, index }));

  const activeProduct = useMemo(() => {
    if (!activeShoeIndex) {
      return null;
    }

    return filteredProducts.find((product) => String(product.index) === activeShoeIndex) ?? null;
  }, [activeShoeIndex, filteredProducts]);

  const activeProductId = activeProduct?.id ?? null;
  const favoriteActive = activeProductId ? isFavorite(activeProductId) : false;

  return (
    <div className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden bg-[#f0f0f0]">
      <ShoeGrid items={filteredProducts} />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(240,240,240,0.5) 40%, rgba(240,240,240,0.85) 70%, rgba(240,240,240,1) 100%)",
          pointerEvents: "none",
          zIndex: 15,
        }}
      />

      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center justify-center md:bottom-12">
        <div
          className={`absolute flex items-center justify-center gap-2 rounded-[2rem] p-1.5 transition-all duration-500 ease-in-out ${
            activeProduct ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"
          }`}
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid rgba(255,255,255,0.9)",
            maxWidth: "90vw",
          }}
        >
          <div className="relative shrink-0">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="appearance-none rounded-full border border-gray-200 bg-white py-2 pl-3 pr-6 text-xs font-semibold text-black shadow-sm transition-colors hover:border-gray-300 focus:outline-none"
            >
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="42">42</option>
              <option value="43">43</option>
              <option value="44">44</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!activeProduct) {
                return;
              }

              router.push(`/products/${activeProduct.id}`);
            }}
            className="whitespace-nowrap rounded-full bg-white border border-gray-200 px-5 py-2 text-xs font-semibold text-black shadow-sm transition-all hover:scale-105 hover:bg-gray-50 active:scale-95"
          >
            Detay
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!activeProduct) {
                return;
              }

              const numericPrice = parseInt(String(activeProduct.price).replace(/[^\d]/g, ""), 10) || 0;
              addToCart({
                productId: activeProduct.id,
                name: activeProduct.name,
                price: numericPrice,
                quantity: 1,
                size: selectedSize,
                imageUrl: activeProduct.imageUrl,
              });
              setAddedMessage(true);
              setTimeout(() => setAddedMessage(false), 2000);
            }}
            className="whitespace-nowrap rounded-full bg-black px-5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-gray-800 active:scale-95"
          >
            {addedMessage ? dict.product.added : dict.product.addToCart}
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!activeProduct) {
                return;
              }

              const numericPrice = parseInt(String(activeProduct.price).replace(/[^\d]/g, ""), 10) || 0;
              toggleFavorite({
                id: activeProduct.id,
                name: activeProduct.name,
                price: numericPrice,
                imageUrl: activeProduct.imageUrl,
                brand: activeProduct.brand,
              });
            }}
            className={`group flex h-10 w-10 md:h-9 md:w-9 cursor-pointer items-center justify-center rounded-full border shadow-sm transition-all ${
              favoriteActive
                ? "border-red-200 bg-red-50"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Heart
              className={`pointer-events-none h-[18px] w-[18px] md:h-4 md:w-4 transition-all duration-300 ${
                favoriteActive ? "scale-110 fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-500"
              } group-active:scale-90`}
            />
          </div>
        </div>

        <div
          className={`absolute transition-all duration-500 ease-in-out ${
            !activeProduct ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"
          }`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "nowrap",
            overflowX: "auto",
            gap: 4,
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
            border: "1px solid rgba(255,255,255,0.8)",
            maxWidth: "90vw",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                rigState.activeId = null;
                rigState.zoom = CONFIG.zoomOut;
                setActiveFilter(f.value);
              }}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                transition: "all 0.25s ease",
                background: activeFilter === f.value ? "#1a1a1a" : "transparent",
                color: activeFilter === f.value ? "#fff" : "#666",
                whiteSpace: "nowrap",
                letterSpacing: 0.3,
                flexShrink: 0,
              }}
              onMouseOver={(e) => {
                if (activeFilter !== f.value) {
                  e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                }
              }}
              onMouseOut={(e) => {
                if (activeFilter !== f.value) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute left-0 right-0 hidden items-center justify-center md:flex"
        style={{ bottom: 76, zIndex: 16 }}
      >
        <p
          style={{
            fontSize: 10,
            color: "rgba(0,0,0,0.4)",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {dict.home.dragToScroll}
        </p>
      </div>
    </div>
  );
}
