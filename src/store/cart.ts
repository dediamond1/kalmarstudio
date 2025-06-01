"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useUserStore } from "./user";
import { saveCart } from "@/lib/api/cart";

declare module "@/lib/api/cart" {
  export interface SaveCartResponse {
    success: boolean;
    error?: string;
    status?: number;
    cartId?: string;
  }

  export function saveCart(
    email: string,
    items: CartItem[],
    upsert?: boolean
  ): Promise<SaveCartResponse>;
}

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
  setItems: (items: CartItem[]) => void;
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

async function saveToMongoDB(email: string, items: CartItem[]) {
  try {
    if (!email) {
      console.log("No user email - skipping MongoDB save");
      return;
    }

    console.log(`Saving cart for user ${email} via API`);
    const result = await saveCart(email, items, true);

    if (result && "success" in result && result.success) {
      console.log("Cart upserted successfully via API");
    } else {
      console.error("Failed to upsert cart via API:", {
        error: result?.error,
        status: result?.status,
      });
      // Retry once after 1 second if failed
      setTimeout(async () => {
        console.log("Retrying cart upsert...");
        try {
          const retryResult = await saveCart(email, items, true);
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
    console.error("Failed to upsert cart via API:", {
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
        const currentItems = get().items || [];
        const existingItemIndex = currentItems.findIndex(
          (i) =>
            i?.productId === item.productId &&
            i?.color === item.color &&
            i?.printType === item.printType &&
            i?.material === item.material
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
            const email = useUserStore.getState().user?.email;
            if (email) saveToMongoDB(email, newItems);
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
          const email = useUserStore.getState().user?.email;
          if (email) saveToMongoDB(email, newItems);
          return { items: newItems };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          const email = useUserStore.getState().user?.email;
          if (email) saveToMongoDB(email, newItems);
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
          const email = useUserStore.getState().user?.email;
          if (email) saveToMongoDB(email, newItems);
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
          const email = useUserStore.getState().user?.email;
          if (email) saveToMongoDB(email, newItems);
          return { items: newItems };
        });
      },

      setItems: (items) => {
        set(() => {
          const email = useUserStore.getState().user?.email;
          if (email) saveToMongoDB(email, items);
          return { items };
        });
      },

      clearCart: () => {
        set(() => {
          const email = useUserStore.getState().user?.email;
          if (email) saveToMongoDB(email, []);
          return { items: [] };
        });
      },

      totalItems: () => {
        const items = get().items;
        if (!Array.isArray(items)) return 0;
        return items.reduce((total, item) => {
          if (!item?.sizes || !Array.isArray(item.sizes)) return total;
          return (
            total +
            item.sizes.reduce((sum, size) => sum + (size?.quantity || 0), 0)
          );
        }, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.items = Array.isArray(state.items) ? state.items : [];
        }
      },
    }
  )
);
