import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Box, CircularProgress } from '@mui/material';

interface SessionInitializerProps {
  children: React.ReactNode;
}

// Variable de módulo para controlar que solo se inicialice UNA vez
let hasInitializedSession = false;

/**
 * Componente que inicializa la sesión cifrada al cargar la aplicación
 * Muestra un loader mientras verifica si hay una sesión persistida
 */
export const SessionInitializer: React.FC<SessionInitializerProps> = ({ children }) => {
  const { isInitialized, initializeSession } = useAuthStore();

  useEffect(() => {
    // Inicializar sesión solo una vez, incluso con React StrictMode
    if (!hasInitializedSession) {
      hasInitializedSession = true;
      initializeSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mostrar loader mientras se inicializa
  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#f8fafc',
        }}
      >
        <CircularProgress sx={{ color: '#26C6DA' }} />
      </Box>
    );
  }

  return <>{children}</>;
};
