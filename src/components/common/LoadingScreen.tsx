import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import unboundLogo from '../../core/assets/images/unbound-logo.webp';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Pantalla de carga con animación y estilo personalizado
 * Usa los colores del tema de la aplicación (#26C6DA)
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Cargando...' }) => {
  return (
    <Fade in={true} timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#f8fafc',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Elemento decorativo de fondo - círculo animado */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(38, 198, 218, 0.1) 0%, rgba(38, 198, 218, 0.05) 50%, transparent 100%)',
            animation: 'pulse 3s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 0.5,
              },
              '50%': {
                transform: 'translate(-50%, -50%) scale(1.1)',
                opacity: 0.3,
              },
            },
          }}
        />

        {/* Contenedor principal con el logo y el loader */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Logo UNBOUND con animación */}
          <Fade in={true} timeout={600}>
            <Box
              component="img"
              src={unboundLogo}
              alt="UNBOUND"
              sx={{
                height: 50,
                mb: 2,
                filter: 'drop-shadow(0 4px 12px rgba(38, 198, 218, 0.3))',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': {
                    transform: 'translateY(0px)',
                  },
                  '50%': {
                    transform: 'translateY(-10px)',
                  },
                },
              }}
            />
          </Fade>

          {/* Circular Progress con colores personalizados */}
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: '#26C6DA',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            {/* Círculo de fondo para efecto de profundidad */}
            <CircularProgress
              size={60}
              thickness={4}
              variant="determinate"
              value={100}
              sx={{
                color: '#e2e8f0',
                position: 'absolute',
                left: 0,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
                zIndex: -1,
              }}
            />
          </Box>

          {/* Mensaje de carga */}
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontSize: '16px',
              fontWeight: 500,
              textAlign: 'center',
              mt: 1,
              animation: 'fadeInOut 2s ease-in-out infinite',
              '@keyframes fadeInOut': {
                '0%, 100%': {
                  opacity: 0.6,
                },
                '50%': {
                  opacity: 1,
                },
              },
            }}
          >
            {message}
          </Typography>

          {/* Puntos animados */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 1,
            }}
          >
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#26C6DA',
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: `${index * 0.2}s`,
                  '@keyframes bounce': {
                    '0%, 80%, 100%': {
                      transform: 'scale(0.8)',
                      opacity: 0.5,
                    },
                    '40%': {
                      transform: 'scale(1.2)',
                      opacity: 1,
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingScreen;
