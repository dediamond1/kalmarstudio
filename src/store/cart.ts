"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItemSize {
  size: string;
  quantity: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  printType?: string;
  material?: string;
  sizes: CartItemSize[];
  totalQuantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'sizes'> & { size: string }) => void;
  addSize: (productId: string, size: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  removeSize: (productId: string, size: string) => void;
  updateSizeQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find(
          (i) => 
            i.productId === item.productId && 
            i.color === item.color
        );

        if (existingItem) {
          return get().addSize(item.productId, item.size);
        }

        set((state) => ({
          items: [...state.items, { 
            ...item, 
            sizes: [{ size: item.size, quantity: 1 }],
            totalQuantity: 1
          }],
        }));
      },
      addSize: (productId, size, quantity = 1) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId !== productId) return item;
            
            const existingSize = item.sizes.find((s) => s.size === size);
            let newQuantity = quantity;
            
            if (existingSize) {
              newQuantity = existingSize.quantity + quantity;
            }

            const newSizes = existingSize
              ? item.sizes.map((s) =>
                  s.size === size ? { ...s, quantity: newQuantity } : s
                )
              : [...item.sizes, { size, quantity }];

            return {
              ...item,
              sizes: newSizes,
              totalQuantity: newSizes.reduce((sum, s) => sum + s.quantity, 0)
            };
          })
        }));
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },
      removeSize: (productId, size) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.productId !== productId) return item;
              
              const filteredSizes = item.sizes.filter((s) => s.size !== size);
              return filteredSizes.length > 0 
                ? {
                    ...item,
                    sizes: filteredSizes,
                    totalQuantity: filteredSizes.reduce((sum, s) => sum + s.quantity, 0)
                  }
                : null;
            })
            .filter((item): item is CartItem => item !== null)
        }));
      },
      updateSizeQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          return get().removeSize(productId, size);
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId !== productId) return item;
            
            const newSizes = item.sizes.map((s) =>
              s.size === size ? { ...s, quantity } : s
            );

            return {
              ...item,
              sizes: newSizes,
              totalQuantity: newSizes.reduce((sum, s) => sum + s.quantity, 0)
            };
          })
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      totalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.sizes.reduce(
            (sum, size) => sum + size.quantity, 0
          ), 0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
