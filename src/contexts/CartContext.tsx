import React, { createContext, useContext, useState, useCallback } from "react";
import { Product, ProductVariant } from "@/data/products";

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface ComboDiscount {
  comboId: string;
  comboName: string;
  discountPercent: number;
  productIds: string[];
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, variant: ProductVariant) => void;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  toggleCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  comboDiscount: ComboDiscount | null;
  comboDiscountAmount: number;
  addCombo: (combo: ComboDiscount, products: { product: Product; variant: ProductVariant }[]) => void;
}

/** Unique key per product + variant combination */
function cartKey(productId: string, volume: string) {
  return `${productId}::${volume}`;
}

export function getCartKey(item: CartItem) {
  return cartKey(item.product.id, item.variant.volume);
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [comboDiscount, setComboDiscount] = useState<ComboDiscount | null>(null);

  const addToCart = useCallback((product: Product, variant: ProductVariant) => {
    const key = cartKey(product.id, variant.volume);
    setItems((prev) => {
      const existing = prev.find((item) => getCartKey(item) === key);
      if (existing) {
        return prev.map((item) =>
          getCartKey(item) === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const addCombo = useCallback((combo: ComboDiscount, products: { product: Product; variant: ProductVariant }[]) => {
    // Add all combo products to cart
    setItems((prev) => {
      let newItems = [...prev];
      products.forEach(({ product, variant }) => {
        const key = cartKey(product.id, variant.volume);
        const existing = newItems.find((item) => getCartKey(item) === key);
        if (existing) {
          newItems = newItems.map((item) =>
            getCartKey(item) === key ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          newItems.push({ product, variant, quantity: 1 });
        }
      });
      return newItems;
    });
    setComboDiscount(combo);
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => getCartKey(item) !== key);
      return newItems;
    });
  }, []);

  // If combo products are removed, clear the combo discount
  const checkComboValidity = useCallback((currentItems: CartItem[], combo: ComboDiscount | null) => {
    if (!combo) return null;
    const allPresent = combo.productIds.every((pid) =>
      currentItems.some((item) => item.product.id === pid)
    );
    return allPresent ? combo : null;
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => getCartKey(item) !== key));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        getCartKey(item) === key ? { ...item, quantity } : item
      )
    );
  }, []);

  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const clearCart = useCallback(() => {
    setItems([]);
    setComboDiscount(null);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  // Validate combo is still valid (all products present)
  const validCombo = checkComboValidity(items, comboDiscount);
  
  // Calculate combo discount amount based on combo product prices only
  const comboDiscountAmount = validCombo
    ? Math.round(
        items
          .filter((item) => validCombo.productIds.includes(item.product.id))
          .reduce((sum, item) => sum + item.variant.price * item.quantity, 0) *
          validCombo.discountPercent
      )
    : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        closeCart,
        clearCart,
        totalItems,
        subtotal,
        comboDiscount: validCombo,
        comboDiscountAmount,
        addCombo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
