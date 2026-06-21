"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { setLocale } from "@/actions/locale";
import type { Dictionary } from "@/lib/dictionaries";

interface LanguageContextType {
  locale: "tr" | "en";
  dict: Dictionary;
  changeLanguage: (lang: "tr" | "en") => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale,
  initialDict,
}: {
  children: React.ReactNode;
  initialLocale: "tr" | "en";
  initialDict: Dictionary;
}) {
  const [locale, setLocaleState] = useState<"tr" | "en">(initialLocale);
  const [dict, setDict] = useState<Dictionary>(initialDict);

  const changeLanguage = async (lang: "tr" | "en") => {
    // Optimistic UI (Arayüzü anında) güncelle
    setLocaleState(lang);
    
    // Server Action ile çerezi (cookie) ayarla
    await setLocale(lang);
    
    // Güncel server componentleri ve sözlüğü almak için sayfayı tamamen yenile
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ locale, dict, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
