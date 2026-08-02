import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string) => void;
  logout: () => void;
}

// NOTE: This is a frontend-only mock auth store. There is no real backend —
// `login` simply marks the session as authenticated and stores a fabricated
// profile so the rest of the app has something to render. Swap this out for
// real API calls (e.g. via React Query) once the auth service exists.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email: string) =>
        set({
          isAuthenticated: true,
          user: {
            id: "usr-001",
            name: email.split("@")[0].replace(/[._]/g, " ") || "SOC Analyst",
            role: "Administrator",
            email,
            avatarInitials: (email[0] ?? "S").toUpperCase(),
          },
        }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: "sentinel-chain-auth" }
  )
);
