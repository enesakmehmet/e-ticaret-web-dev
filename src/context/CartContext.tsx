"use client";

import React, { createContext, useReducer, useEffect, useMemo, ReactNode } from "react";
import { CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: "INIT"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "ADD_ITEM": {
      const newItem = action.payload;
      const id = `${newItem.productId}-${newItem.size}`;
      const existingItem = state.find((item) => item.id === id);

      if (existingItem) {
        return state.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...state, { ...newItem, id }];
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload);
    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Mount edildiğinde localStorage'dan yükle
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("step-space-cart");
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          dispatch({ type: "INIT", payload: parsedCart });
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Öğeler her değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("step-space-cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const contextValue = useMemo(() => {
    const addToCart = (newItem: Omit<CartItem, "id">) => dispatch({ type: "ADD_ITEM", payload: newItem });
    const removeFromCart = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
    const updateQuantity = (id: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    const clearCart = () => dispatch({ type: "CLEAR_CART" });

    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    return {
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount,
    };
  }, [items]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
