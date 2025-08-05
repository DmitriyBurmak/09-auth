import { create } from 'zustand';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
  setIsAuthReady: (isReady: boolean) => void;
}

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  isAuthenticated: false,
  isAuthReady: false, 
  setUser: user => set({ user, isAuthenticated: !!user, isAuthReady: true }), 
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false, isAuthReady: true }), 
  setIsAuthReady: (isReady: boolean) => set({ isAuthReady: isReady }),
}));
