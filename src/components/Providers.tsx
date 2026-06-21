"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { LanguageProvider } from "@/context/LanguageContext";
import type { Dictionary } from "@/lib/dictionaries";

export function Providers({ 
  children,
  initialLocale,
  initialDict,
}: { 
  children: ReactNode;
  initialLocale: "tr" | "en";
  initialDict: Dictionary;
}) {
  return (
    <SessionProvider>
      <LanguageProvider initialLocale={initialLocale} initialDict={initialDict}>
        <FavoritesProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </FavoritesProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
