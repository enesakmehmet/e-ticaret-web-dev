"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

import { FavoriteItem } from "@/types";

interface FavoritesContextType {
  items: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  itemCount: number;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mount edildiğinde localStorage'dan yükle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavs = localStorage.getItem("step-space-favorites");
      if (storedFavs) {
        try {
          const parsed = JSON.parse(storedFavs);
          setItems(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error("Failed to parse favorites from localStorage", error);
          setItems([]);
        }
      }
    }
    setIsInitialized(true);
  }, []);

  // Öğeler her değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem("step-space-favorites", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addFavorite = (newItem: FavoriteItem) => {
    setItems((prevItems) => {
      if (prevItems.some((item) => item.id === newItem.id)) {
        return prevItems; // zaten mevcut
      }
      return [...prevItems, newItem];
    });
  };

  const removeFavorite = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const toggleFavorite = (item: FavoriteItem) => {
    setItems((prevItems) => {
      if (prevItems.some((i) => i.id === item.id)) {
        return prevItems.filter((i) => i.id !== item.id);
      }
      return [...prevItems, item];
    });
  };

  const isFavorite = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const clearFavorites = () => {
    setItems([]);
  };

  const itemCount = items.length;

  return (
    <FavoritesContext.Provider
      value={{
        items,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        itemCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
