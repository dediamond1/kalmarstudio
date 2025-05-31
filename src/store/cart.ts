// src/store/cart.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useUserStore } from "./user";
import { connectToDB } from "@/lib/mongoose";

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
  addItem: (
    item: Omit<CartItem, "sizes" | "totalQuantity"> & {
      size: string;
      quantity?: number;
    }
  ) => void;
  addSize: (productId: string, size: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  removeSize: (productId: string, size: string) => void;
  updateSizeQuantity: (
    productId: string,
    size: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
}

async function saveToMongoDB(userId: string, items: CartItem[]) {
  try {
    const db = await connectToDB();
    await db.connection.db
      .collection("carts")
      .updateOne({ userId }, { $set: { items } }, { upsert: true });
  } catch (error) {
    console.error("Failed to save cart to MongoDB:", error);
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { size, quantity = 1, ...rest } = item;
        const existingItemIndex = get().items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.color === item.color &&
            i.printType === item.printType &&
            i.material === item.material
        );

        if (existingItemIndex >= 0) {
          // Item with same properties exists, add or update size
          get().addSize(item.productId, size, quantity);
        } else {
          // Add new item
          set((state) => {
            const newItems = [
              ...state.items,
              {
                ...rest,
                sizes: [{ size, quantity }],
                totalQuantity: quantity,
              },
            ];
            const userId = useUserStore.getState().user?._id;
            if (userId) saveToMongoDB(userId, newItems);
            return { items: newItems };
          });
        }
      },

      addSize: (productId, size, quantity = 1) => {
        set((state) => {
          const newItems = state.items.map((item) => {
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
              totalQuantity: newSizes.reduce((sum, s) => sum + s.quantity, 0),
            };
          });
          const userId = useUserStore.getState().user?._id;
          if (userId) saveToMongoDB(userId, newItems);
          return { items: newItems };
        });
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
                    totalQuantity: filteredSizes.reduce(
                      (sum, s) => sum + s.quantity,
                      0
                    ),
                  }
                : null;
            })
            .filter((item): item is CartItem => item !== null),
        }));
      },

      updateSizeQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          return get().removeSize(productId, size);
        }

        set((state) => ({
          items: state.items.map((item) => {
            // Find the matching item
            if (item.productId !== productId) return item;

            // Find the size in this item
            const sizeIndex = item.sizes.findIndex((s) => s.size === size);

            // If size doesn't exist, add it
            if (sizeIndex === -1) {
              const newSizes = [...item.sizes, { size, quantity }];
              return {
                ...item,
                sizes: newSizes,
                totalQuantity: newSizes.reduce((sum, s) => sum + s.quantity, 0),
              };
            }

            // Update existing size
            const newSizes = [...item.sizes];
            newSizes[sizeIndex] = { ...newSizes[sizeIndex], quantity };

            return {
              ...item,
              sizes: newSizes,
              totalQuantity: newSizes.reduce((sum, s) => sum + s.quantity, 0),
            };
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      totalItems: () => {
        return get().items.reduce(
          (total, item) =>
            total + item.sizes.reduce((sum, size) => sum + size.quantity, 0),
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
