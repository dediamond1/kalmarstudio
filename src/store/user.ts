import { create } from "zustand";
import { authClient } from "@/lib/auth-client";

interface User {
  _id: string;
  email: string;
  createdAt: Date;
  name: string;
  role: string;
  userId: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  fetchUserByEmail: (email: string) => Promise<User>;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const session = await authClient.getSession();
      const email = session?.data?.user?.email;
      if (email) {
        await get().fetchUserByEmail(email);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to fetch user data";
      set({ error, loading: false });
    }
  },

  fetchUserByEmail: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/users?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) throw new Error("Failed to fetch user");
      const userData = await response.json();
      set({ user: userData, loading: false });
      return userData;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to fetch user data";
      set({ error, loading: false });
      throw err;
    }
  },

  setUser: (user: User | null) => set({ user }),

  clearUser: () => set({ user: null }),
}));

// Utility hook for easy access to user data
export const useCurrentUser = () => {
  const { user, loading, error } = useUserStore();
  return { user, loading, error };
};
