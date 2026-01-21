import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Box, CircularProgress } from '@mui/material';

interface SessionInitializerProps {
  children: React.ReactNode;
}

/**
 * Componente que inicializa la sesión cifrada al cargar la aplicación
 * Muestra un loader mientras verifica si hay una sesión persistida
 */
export const SessionInitializer: React.FC<SessionInitializerProps> = ({ children }) => {
  const { isInitialized, initializeSession } = useAuthStore();

  useEffect(() => {
    // Inicializar sesión al montar el componente
    initializeSession();
  }, [initializeSession]);

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
