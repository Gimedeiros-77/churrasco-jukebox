
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  username: string;
  isAuthenticated: boolean;
};

type AuthStore = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (username: string, password: string) => {
        // Check if username and password match the default credentials
        if (username === 'admin' && password === 'user') {
          set({ user: { username, isAuthenticated: true } });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage
    }
  )
);
