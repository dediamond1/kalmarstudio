"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useUserStore } from "./user";
import { saveCart } from "@/lib/api/cart";

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
    if (!userId) {
      console.log("No user ID - skipping MongoDB save");
      return;
    }

    console.log(`Saving cart for user ${userId} via API`);
    const result = await saveCart(userId, items);

    if (result && "success" in result && result.success) {
      console.log("Cart saved successfully via API. Cart ID:", result.cartId);
    } else {
      console.error("Failed to save cart via API:", {
        error: result?.error,
        status: result?.status,
      });
      // Retry once after 1 second if failed
      setTimeout(async () => {
        console.log("Retrying cart save...");
        try {
          const retryResult = await saveCart(userId, items);
          console.log(
            "Retry result:",
            retryResult?.success ? "Success" : "Failed",
            retryResult
          );
        } catch (retryError) {
          console.error("Retry failed:", retryError);
        }
      }, 1000);
    }
  } catch (error) {
    console.error("Failed to save cart via API:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
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
          get().addSize(item.productId, size, quantity);
        } else {
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
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          const userId = useUserStore.getState().user?._id;
          if (userId) saveToMongoDB(userId, newItems);
          return { items: newItems };
        });
      },

      removeSize: (productId, size) => {
        set((state) => {
          const newItems = state.items
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
            .filter((item): item is CartItem => item !== null);
          const userId = useUserStore.getState().user?._id;
          if (userId) saveToMongoDB(userId, newItems);
          return { items: newItems };
        });
      },

      updateSizeQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          return get().removeSize(productId, size);
        }

        set((state) => {
          const newItems = state.items.map((item) => {
            if (item.productId !== productId) return item;

            const sizeIndex = item.sizes.findIndex((s) => s.size === size);

            if (sizeIndex === -1) {
              const newSizes = [...item.sizes, { size, quantity }];
              return {
                ...item,
                sizes: newSizes,
                totalQuantity: newSizes.reduce((sum, s) => sum + s.quantity, 0),
              };
            }

            const newSizes = [...item.sizes];
            newSizes[sizeIndex] = { ...newSizes[sizeIndex], quantity };

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

      clearCart: () => {
        set(() => {
          const userId = useUserStore.getState().user?._id;
          if (userId) saveToMongoDB(userId, []);
          return { items: [] };
        });
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
