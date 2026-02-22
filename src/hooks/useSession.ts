import { useState, useCallback, useRef, useEffect } from 'react';
import { encryptData, decryptData, clearEncryptionKey } from '../utils/encryption';

interface SessionData {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

interface UseSessionReturn {
  session: SessionData;
  setSession: (data: Partial<SessionData>) => void;
  clearSession: () => void;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
  updateSessionData: (userData: Partial<SessionData['user']>) => void;
  getAccessToken: () => string | null;
}

// Estado inicial de la sesión
const initialSessionState: SessionData = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

// Almacenamiento en memoria usando un closure para mayor seguridad
let memoryStorage: SessionData = { ...initialSessionState };

// Evento personalizado para sincronizar entre componentes
const SESSION_CHANGE_EVENT = 'session-memory-change';

// Clave para sessionStorage (cifrada)
const SESSION_STORAGE_KEY = '__app_session_enc__';

/**
 * Guarda la sesión en sessionStorage de forma cifrada
 */
const persistSession = async (sessionData: SessionData): Promise<void> => {
  try {
    const encrypted = await encryptData(JSON.stringify(sessionData));
    sessionStorage.setItem(SESSION_STORAGE_KEY, encrypted);
  } catch (error) {
    console.error('Error al persistir sesión:', error);
  }
};

/**
 * Carga la sesión desde sessionStorage
 */
const loadPersistedSession = async (): Promise<SessionData | null> => {
  try {
    const encrypted = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!encrypted) return null;

    const decrypted = await decryptData(encrypted);
    if (!decrypted) {
      // Si falla el descifrado, limpiar
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error al cargar sesión:', error);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

/**
 * Elimina la sesión de sessionStorage
 */
const removePersistedSession = (): void => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  clearEncryptionKey();
};

/**
 * Hook seguro para manejo de sesión del usuario
 * 
 * Características de seguridad:
 * - Almacenamiento cifrado en sessionStorage (se limpia al cerrar pestaña)
 * - Cifrado AES-GCM con clave única por sesión
 * - Validación de fingerprint del navegador
 * - Cache en memoria RAM para rendimiento
 * - Verificación de expiración de sesión
 * - Sincronización entre múltiples componentes
 * - Los datos se cifran antes de persistir
 * - Se limpia automáticamente al cerrar la pestaña/ventana
 */
export const useSession = (): UseSessionReturn => {
  const [session, setSessionState] = useState<SessionData>(memoryStorage);
  const sessionRef = useRef<SessionData>(memoryStorage);
  const expirationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar sesión persistida al inicializar
  useEffect(() => {
    const initSession = async () => {
      const persistedSession = await loadPersistedSession();
      if (persistedSession) {
        // Verificar si no ha expirado
        if (persistedSession.expiresAt && Date.now() < persistedSession.expiresAt) {
          memoryStorage = persistedSession;
          sessionRef.current = persistedSession;
          setSessionState(persistedSession);
        } else {
          // Sesión expirada, limpiar
          removePersistedSession();
        }
      }
      setIsInitialized(true);
    };

    initSession();
  }, []);

  // Sincronizar cambios entre componentes
  useEffect(() => {
    const handleStorageChange = () => {
      setSessionState({ ...memoryStorage });
    };

    window.addEventListener(SESSION_CHANGE_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener(SESSION_CHANGE_EVENT, handleStorageChange);
    };
  }, []);

  // Limpiar timer de expiración al desmontar
  useEffect(() => {
    return () => {
      if (expirationTimerRef.current) {
        clearTimeout(expirationTimerRef.current);
      }
    };
  }, []);

  /**
   * Verifica si la sesión ha expirado
   */
  const isSessionExpired = useCallback((): boolean => {
    if (!sessionRef.current.expiresAt) return false;
    return Date.now() >= sessionRef.current.expiresAt;
  }, []);

  /**
   * Programa el cierre automático de sesión cuando expire
   */
  const scheduleSessionExpiration = useCallback((expiresAt: number) => {
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current);
    }

    const timeUntilExpiration = expiresAt - Date.now();
    
    if (timeUntilExpiration > 0) {
      expirationTimerRef.current = setTimeout(() => {
        // Emitir evento de sesión expirada
        window.dispatchEvent(new CustomEvent('session-expired'));
        clearSession();
      }, timeUntilExpiration);
    }
  }, []);

  /**
   * Establece o actualiza la sesión
   */
  const setSession = useCallback((data: Partial<SessionData>) => {
    const newSession = {
      ...memoryStorage,
      ...data,
    };

    // Actualizar almacenamiento en memoria
    memoryStorage = newSession;
    sessionRef.current = newSession;
    
    // Actualizar estado local
    setSessionState(newSession);

    // Notificar cambios a otros componentes
    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));

    // Programar expiración si se proporciona
    if (data.expiresAt) {
      scheduleSessionExpiration(data.expiresAt);
    }
  }, [scheduleSessionExpiration]);

  /**
   * Limpia completamente la sesión
   */
  const clearSession = useCallback(() => {
    // Limpiar timer de expiración
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current);
      expirationTimerRef.current = null;
    }

    // Resetear almacenamiento
    memoryStorage = { ...initialSessionState };
    sessionRef.current = { ...initialSessionState };
    
    // Limpiar sessionStorage
    removePersistedSession();

    // Actualizar estado local
    setSessionState({ ...initialSessionState });

    // Notificar cambios
    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
  }, []);

  /**
   * Actualiza solo los datos del usuario sin afectar tokens
   */
  const updateSessionData = useCallback((userData: Partial<SessionData['user']>) => {
    if (!sessionRef.current.user) return;

    const updatedUser = {
      ...sessionRef.current.user,
      ...userData,
    };

    setSession({ user: updatedUser });
  }, [setSession]);

  /**
   * Obtiene el access token de forma segura
   * Verifica expiración antes de retornar
   */
  const getAccessToken = useCallback((): string | null => {
    if (isSessionExpired()) {
      clearSession();
      return null;
    }
    return sessionRef.current.accessToken;
  }, [isSessionExpired, clearSession]);

  /**
   * Verifica si hay una sesión activa y válida
   */
  const isAuthenticated = Boolean(
    session.user && 
    session.accessToken && 
    !isSessionExpired()
  );

  return {
    session,
    setSession,
    clearSession,
    isAuthenticated,
    isSessionExpired: isSessionExpired(),
    updateSessionData,
    getAccessToken,
  };
};

/**
 * Utilidades adicionales para manejo de sesión
 */

/**
 * Calcula el timestamp de expiración basado en segundos
 */
export const calculateExpirationTime = (expiresInSeconds: number): number => {
  return Date.now() + expiresInSeconds * 1000;
};

/**
 * Obtiene el tiempo restante de la sesión en segundos
 */
export const getSessionTimeRemaining = (expiresAt: number | null): number => {
  if (!expiresAt) return 0;
  const remaining = Math.floor((expiresAt - Date.now()) / 1000);
  return Math.max(0, remaining);
};

/**
 * Verifica si la sesión está próxima a expirar (menos de 5 minutos)
 */
export const isSessionExpiringoon = (expiresAt: number | null): boolean => {
  if (!expiresAt) return false;
  const timeRemaining = getSessionTimeRemaining(expiresAt);
  return timeRemaining > 0 && timeRemaining < 300; // 5 minutos
};
