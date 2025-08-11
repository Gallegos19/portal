import { create } from 'zustand';
import { User, UserRole, Permission, LoginCredentials } from '../types/auth';
import { authService } from '../services/api/auth';
import { setAuthToken, removeAuthToken } from '../services/httpClient';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  permissions: Permission[];
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  userRole: null,
  permissions: [],
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(credentials);
      const { token, user } = response.data;
      
      setAuthToken(token);
      set({
        user,
        token,
        isAuthenticated: true,
        userRole: user.role,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    removeAuthToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      userRole: null,
      permissions: [],
      isLoading: false
    });
  },

  refreshToken: async () => {
    try {
      const response = await authService.refreshToken();
      const { token, user } = response.data;
      
      setAuthToken(token);
      set({
        user,
        token,
        isAuthenticated: true,
        userRole: user.role
      });
    } catch (error) {
      get().logout();
      throw error;
    }
  },

  setUser: (user: User) => {
    set({ user, userRole: user.role });
  }
}));