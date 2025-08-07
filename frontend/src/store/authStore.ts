import { create } from 'zustand';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('loginTime', Date.now().toString());
    localStorage.setItem('loginTime', Date.now().toString());
    set({ token, user, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    set({ token: null, user: null, isAuthenticated: false });
  },
  
  updateUser: (user: User) => {
    set({ user });
  },
}));