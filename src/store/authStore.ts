import { create } from "zustand";
import type {
  User,
  UserRole,
  Permission,
  LoginCredentials,
} from "../types/auth";
import { authService } from "../services/api/auth";
import { setAuthToken, removeAuthToken } from "../services/httpClient";

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
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Credenciales mock por defecto
      const mockUsers = {
        'becario123': {
          id: '1',
          email: 'becario123',
          firstName: 'Juan',
          lastName: 'Pérez',
          avatar: '/avatar-placeholder.jpg',
          role: 'BECARIO' as UserRole,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'admin123': {
          id: '2',
          email: 'admin123',
          firstName: 'María',
          lastName: 'González',
          avatar: '/avatar-placeholder.jpg',
          role: 'ADMIN' as UserRole,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'facilitador123': {
          id: '3',
          email: 'facilitador123',
          firstName: 'Carlos',
          lastName: 'Rodríguez',
          avatar: '/avatar-placeholder.jpg',
          role: 'FACILITADOR' as UserRole,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      };

      const mockPasswords = {
        'becario123': '123456',
        'admin123': '123456',
        'facilitador123': '123456'
      };

      // Verificar credenciales
      const user = mockUsers[credentials.email as keyof typeof mockUsers];
      const validPassword = mockPasswords[credentials.email as keyof typeof mockPasswords];

      if (!user || credentials.password !== validPassword) {
        throw new Error('Credenciales inválidas');
      }

      const token = 'mock-jwt-token-' + user.role.toLowerCase();
      
      setAuthToken(token);
      set({
        user,
        token,
        isAuthenticated: true,
        userRole: user.role,
        isLoading: false,
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
      isLoading: false,
    });
  },

  refreshToken: async () => {
    try {
      const response = await authService.refreshToken();
      const { token, user } = response.data.data;

      setAuthToken(token);
      set({
        user,
        token,
        isAuthenticated: true,
        userRole: user.role,
      });
    } catch (error) {
      get().logout();
      throw error;
    }
  },

  setUser: (user: User) => {
    set({ user, userRole: user.role });
  },
}));
