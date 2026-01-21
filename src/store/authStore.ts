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

// CONFIGURACIÓN DE DESARROLLO: Cambia este valor para usar diferentes usuarios mock
// Opciones: 'becario123', 'admin123', 'facilitador123', null (sin auto-login)
const DEV_AUTO_LOGIN_USER: string | null = 'becario123';

// Usuarios mock para desarrollo
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
    console.log('💾 Guardando sesión cifrada...', { user: state.user?.email });
    const encrypted = await encryptData(JSON.stringify(sessionData));
    sessionStorage.setItem(SESSION_STORAGE_KEY, encrypted);
    console.log('✅ Sesión guardada exitosamente');
  } catch (error) {
    console.error('💥 Error al persistir sesión:', error);
  }
};

// Cargar sesión cifrada
const loadPersistedSession = async (): Promise<Partial<AuthState> | null> => {
  try {
    console.log('🔍 Intentando cargar sesión persistida...');
    const encrypted = sessionStorage.getItem(SESSION_STORAGE_KEY);
    
    if (!encrypted) {
      console.log('⚠️ No hay sesión persistida en sessionStorage');
      
      // MODO DESARROLLO: Auto-login con usuario configurado
      if (import.meta.env.DEV && DEV_AUTO_LOGIN_USER) {
        console.log(`🔧 Modo desarrollo: Auto-login activado para ${DEV_AUTO_LOGIN_USER}`);
        const mockUser = mockUsers[DEV_AUTO_LOGIN_USER as keyof typeof mockUsers];
        
        if (mockUser) {
          const mockSession = {
            user: mockUser,
            token: `mock-jwt-token-${mockUser.role.toLowerCase()}-dev`,
            userRole: mockUser.role,
            permissions: [] as Permission[],
            isAuthenticated: true,
          };
          
          // Persistir la sesión mock
          await persistSession(mockSession);
          setAuthToken(mockSession.token);
          
          console.log(`✅ Auto-login exitoso: ${mockUser.firstName} ${mockUser.lastName} (${mockUser.role})`);
          
          return mockSession;
        }
      }
      return null;
    }

    console.log('🔓 Descifrando sesión...');
    const decrypted = await decryptData(encrypted);
    
    if (!decrypted) {
      console.warn('❌ Error al descifrar sesión, limpiando...');
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    const sessionData = JSON.parse(decrypted);
    console.log('📦 Sesión descifrada:', { 
      user: sessionData.user?.email, 
      role: sessionData.userRole,
      hasToken: !!sessionData.token 
    });
    
    // Verificar expiración
    if (sessionData.expiresAt && Date.now() >= sessionData.expiresAt) {
      console.warn('⏰ Sesión expirada, limpiando...');
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    // Restaurar token en axios
    if (sessionData.token) {
      setAuthToken(sessionData.token);
      console.log('🔑 Token restaurado en httpClient');
    }

    console.log('✅ Sesión cargada exitosamente');
    return {
      user: sessionData.user,
      token: sessionData.token,
      userRole: sessionData.userRole,
      permissions: sessionData.permissions || [],
      isAuthenticated: !!sessionData.user && !!sessionData.token,
    };
  } catch (error) {
    console.error('💥 Error al cargar sesión:', error);
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
    console.log('🚀 Inicializando sesión...');
    try {
      const persistedState = await loadPersistedSession();
      if (persistedState) {
        console.log('✅ Sesión restaurada:', persistedState.user?.email);
        set({
          ...persistedState,
          isInitialized: true,
        });
      } else {
        console.log('ℹ️ No hay sesión para restaurar');
        set({ isInitialized: true });
      }
    } catch (error) {
      console.error('💥 Error inicializando sesión:', error);
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
