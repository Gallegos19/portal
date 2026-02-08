import { create } from "zustand";
import type {
  User,
  UserRole,
  Permission,
  LoginCredentials,
} from "../types/auth";
import { authService } from "../services/api/auth";
import { setAuthToken, removeAuthToken } from "../services/httpClient";
import { encryptData, decryptData, clearEncryptionKey } from "../utils/encryption";

// Clave para sessionStorage cifrado
const SESSION_STORAGE_KEY = '__auth_session_enc__';

// Calcular tiempo de expiración (1 hora por defecto)
const calculateExpirationTime = (expiresInSeconds: number = 3600): number => {
  return Date.now() + expiresInSeconds * 1000;
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  permissions: Permission[];
  isLoading: boolean;
  isInitialized: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
  initializeSession: () => Promise<void>;
}

// Guardar sesión cifrada
const persistSession = async (state: Pick<AuthState, 'user' | 'token' | 'userRole' | 'permissions'>): Promise<void> => {
  try {
    const sessionData = {
      user: state.user,
      token: state.token,
      userRole: state.userRole,
      permissions: state.permissions,
      expiresAt: calculateExpirationTime(86400), // 24 horas en desarrollo
    };
    const encrypted = await encryptData(JSON.stringify(sessionData));
    sessionStorage.setItem(SESSION_STORAGE_KEY, encrypted);
  } catch (error) {
    console.error('Error al persistir sesión:', error);
  }
};

// Cargar sesión cifrada
const loadPersistedSession = async (): Promise<Partial<AuthState> | null> => {
  try {
    const encrypted = sessionStorage.getItem(SESSION_STORAGE_KEY);
    
    if (!encrypted) {
      return null;
    }

    const decrypted = await decryptData(encrypted);
    
    if (!decrypted) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    const sessionData = JSON.parse(decrypted);
    
    // Verificar expiración
    if (sessionData.expiresAt && Date.now() >= sessionData.expiresAt) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    // Restaurar token en axios
    if (sessionData.token) {
      setAuthToken(sessionData.token);
    }

    return {
      user: sessionData.user,
      token: sessionData.token,
      userRole: sessionData.userRole,
      permissions: sessionData.permissions || [],
      isAuthenticated: !!sessionData.user && !!sessionData.token,
    };
  } catch (error) {
    console.error('Error al cargar sesión:', error);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

// Eliminar sesión cifrada
const removePersistedSession = (): void => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  clearEncryptionKey();
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  userRole: null,
  permissions: [],
  isLoading: false,
  isInitialized: false,

  // Inicializar sesión desde almacenamiento cifrado
  initializeSession: async () => {
    const state = get();
    
    // Si ya se inicializó, no volver a ejecutar
    if (state.isInitialized) {
      return;
    }
    
    try {
      const persistedState = await loadPersistedSession();
      if (persistedState) {
        set({
          ...persistedState,
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true });
      }
    } catch (error) {
      console.error('Error inicializando sesión:', error);
      set({ isInitialized: true });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    
    try {
      // Llamar al backend real
      const response = await authService.login(credentials);
      const { token, user: backendUser } = response.data;
      
      // Mapear la respuesta del backend a nuestro formato User
      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        firstName: backendUser.first_name,
        lastName: backendUser.last_name,
        role: backendUser.role.toUpperCase() as UserRole,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setAuthToken(token);
      
      const newState = {
        user,
        token,
        userRole: user.role,
        permissions: [] as Permission[],
      };

      set({
        ...newState,
        isAuthenticated: true,
        isLoading: false,
      });

      // Persistir sesión cifrada
      await persistSession(newState);
    } catch (error) {
      // No limpiar ni recargar nada, solo detener el loading y propagar el error
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    removeAuthToken();
    removePersistedSession();
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
      const { token, user: backendUser } = response.data;
      
      // Mapear la respuesta del backend a nuestro formato User
      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        firstName: backendUser.first_name,
        lastName: backendUser.last_name,
        role: backendUser.role.toUpperCase() as UserRole,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAuthToken(token);
      
      const newState = {
        user,
        token,
        userRole: user.role,
        permissions: get().permissions,
      };

      set({
        ...newState,
        isAuthenticated: true,
      });

      // Persistir sesión actualizada
      await persistSession(newState);
    } catch (error) {
      get().logout();
      throw error;
    }
  },

  setUser: async (user: User) => {
    const state = get();
    const newState = {
      user,
      token: state.token,
      userRole: user.role,
      permissions: state.permissions,
    };
    
    set({ user, userRole: user.role });
    
    // Persistir cambios
    if (state.token) {
      await persistSession(newState);
    }
  },
}));
