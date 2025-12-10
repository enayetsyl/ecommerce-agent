"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Cart, CartItem } from "@/types/cart";
import { ProductWithDetails } from "@/lib/api/products";

interface CartContextType {
  cart: Cart;
  addToCart: (
    product: ProductWithDetails,
    variantId?: number | null,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  isInCart: (productId: number, variantId?: number | null) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "voice-commerce-cart";

// Helper function to calculate cart totals
const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  return { totalItems, totalPrice };
};

// Helper function to generate cart item ID
const generateCartItemId = (productId: number, variantId: number | null): string => {
  return variantId ? `${productId}-${variantId}` : `${productId}`;
};

// Load cart from localStorage
const loadCartFromStorage = (): Cart => {
  if (typeof window === "undefined") {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Recalculate totals in case of data inconsistency
      const { totalItems, totalPrice } = calculateCartTotals(parsed.items || []);
      return {
        items: parsed.items || [],
        totalItems,
        totalPrice,
      };
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }

  return { items: [], totalItems: 0, totalPrice: 0 };
};

// Save cart to localStorage
const saveCartToStorage = (cart: Cart): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(loadCartFromStorage);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = useCallback(
    (
      product: ProductWithDetails,
      variantId: number | null = null,
      quantity: number = 1
    ) => {
      setCart((prevCart) => {
        const itemId = generateCartItemId(product.id, variantId);

        // Find if item already exists in cart
        const existingItemIndex = prevCart.items.findIndex(
          (item) => item.id === itemId
        );

        let newItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          newItems = [...prevCart.items];
          const existingItem = newItems[existingItemIndex];
          const newQuantity = existingItem.quantity + quantity;
          newItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
            totalPrice: existingItem.price * newQuantity,
          };
        } else {
          // Add new item
          const variant = variantId
            ? product.variants?.find((v) => v.id === variantId)
            : null;

          const price = variant?.price
            ? parseFloat(variant.price)
            : product.variants?.[0]?.price
            ? parseFloat(product.variants[0].price)
            : 0;

          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            product: {
              id: product.id,
              title: product.title,
              handle: product.handle,
              image: product.image || product.images?.[0]
                ? {
                    src: product.image?.src || product.images?.[0]?.src || "",
                    alt: product.image?.alt || product.images?.[0]?.alt || null,
                  }
                : null,
              vendor: product.vendor,
            },
            variantId: variantId,
            variant: variant
              ? {
                  id: variant.id,
                  title: variant.title,
                  price: variant.price,
                  sku: variant.sku,
                  available: variant.available,
                }
              : null,
            quantity,
            price,
            totalPrice: price * quantity,
          };

          newItems = [...prevCart.items, newItem];
        }

        const { totalItems, totalPrice } = calculateCartTotals(newItems);

        return {
          items: newItems,
          totalItems,
          totalPrice,
        };
      });
    },
    []
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== itemId);
      const { totalItems, totalPrice } = calculateCartTotals(newItems);

      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.price * quantity,
          };
        }
        return item;
      });

      const { totalItems, totalPrice } = calculateCartTotals(newItems);

      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  }, [removeFromCart]);

  const increaseQuantity = useCallback(
    (itemId: string) => {
      setCart((prevCart) => {
        const newItems = prevCart.items.map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + 1;
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: item.price * newQuantity,
            };
          }
          return item;
        });

        const { totalItems, totalPrice } = calculateCartTotals(newItems);

        return {
          items: newItems,
          totalItems,
          totalPrice,
        };
      });
    },
    []
  );

  const decreaseQuantity = useCallback(
    (itemId: string) => {
      setCart((prevCart) => {
        const newItems = prevCart.items
          .map((item) => {
            if (item.id === itemId) {
              const newQuantity = item.quantity - 1;
              if (newQuantity <= 0) {
                return null; // Remove item
              }
              return {
                ...item,
                quantity: newQuantity,
                totalPrice: item.price * newQuantity,
              };
            }
            return item;
          })
          .filter((item): item is CartItem => item !== null);

        const { totalItems, totalPrice } = calculateCartTotals(newItems);

        return {
          items: newItems,
          totalItems,
          totalPrice,
        };
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
  }, []);

  const getCartItemCount = useCallback(() => {
    return cart.totalItems;
  }, [cart.totalItems]);

  const isInCart = useCallback(
    (productId: number, variantId?: number | null) => {
      const itemId = generateCartItemId(productId, variantId ?? null);
      return cart.items.some((item) => item.id === itemId);
    },
    [cart.items]
  );

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartItemCount,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

