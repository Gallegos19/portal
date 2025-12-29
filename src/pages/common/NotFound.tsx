import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowBack, Search, QuestionMark } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    // Navegación a página de búsqueda si la tienes
    navigate('/search');
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh' }}>
      {/* Banda decorativa superior */}
      <Box
        sx={{
          bgcolor: "white",
          py: 1,
          mb: 4,
          position: "relative",
          boxShadow: 2,
          borderRadius: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background:
              "linear-gradient(to right, #FFD700 0%, #FFD700 10%, #1E3A8A 10%, #1E3A8A 20%, #26C6DA 20%, #26C6DA 30%, #DC2626 30%, #DC2626 40%, #FFD700 40%, #FFD700 50%, #1E3A8A 50%, #1E3A8A 60%, #26C6DA 60%, #26C6DA 70%, #DC2626 70%, #DC2626 80%, #FFD700 80%, #FFD700 90%, #1E3A8A 90%, #1E3A8A 100%)",
          },
        }}
      />

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Elementos decorativos de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #26C6DA20, #FFD70020)',
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-10px) rotate(5deg)' }
            }
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #1E3A8A20, #DC262620)',
            animation: 'float 4s ease-in-out infinite reverse',
          }}
        />

        {/* Contenido principal */}
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {/* Número 404 grande y estilizado */}
          <Box 
            sx={{ 
              mb: 3,
              position: 'relative',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '6rem', md: '8rem' },
                fontWeight: 800,
                background: 'linear-gradient(45deg, #26C6DA, #1E3A8A, #DC2626)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px rgba(0,0,0,0.1)',
                letterSpacing: '-0.05em',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' }
                }
              }}
            >
              404
            </Typography>
            
            {/* Icono de interrogación flotante */}
            <Box
              sx={{
                position: 'absolute',
                top: '20%',
                right: { xs: '10%', md: '25%' },
                animation: 'bounce 2s infinite',
                '@keyframes bounce': {
                  '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                  '40%': { transform: 'translateY(-10px)' },
                  '60%': { transform: 'translateY(-5px)' }
                }
              }}
            >
              <QuestionMark 
                sx={{ 
                  fontSize: { xs: '2rem', md: '3rem' },
                  color: '#FFD700',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} 
              />
            </Box>
          </Box>

          {/* Título principal */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              mb: 2,
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}
          >
            ¡Oops! Página no encontrada
          </Typography>

          {/* Descripción */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: '500px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Lo sentimos, la página que estás buscando no existe o ha sido movida. 
            No te preocupes, te ayudamos a encontrar el camino correcto.
          </Typography>

          {/* Botones de acción */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              maxWidth: '500px',
              mx: 'auto'
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={handleGoHome}
              sx={{
                bgcolor: '#26C6DA',
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(38, 198, 218, 0.3)',
                '&:hover': {
                  bgcolor: '#00ACC1',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(38, 198, 218, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Volver al inicio
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                borderColor: '#64748b',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#1e293b',
                  color: '#1e293b',
                  bgcolor: '#f8fafc',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Regresar
            </Button>

            <Button
              variant="text"
              size="large"
              startIcon={<Search />}
              onClick={handleSearch}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                color: '#1E3A8A',
                '&:hover': {
                  bgcolor: '#f1f5f9',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Buscar
            </Button>
          </Box>

          {/* Mensaje adicional */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
            <Typography
              variant="body2"
              sx={{
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}
            >
              Si crees que esto es un error, por favor contacta al administrador
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Banda decorativa inferior */}
      <Box
        sx={{
          bgcolor: "white",
          py: 1,
          mt: 4,
          position: "relative",
          boxShadow: 2,
          borderRadius: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background:
              "linear-gradient(to right, #1E3A8A 0%, #1E3A8A 10%, #26C6DA 10%, #26C6DA 20%, #DC2626 20%, #DC2626 30%, #FFD700 30%, #FFD700 40%, #1E3A8A 40%, #1E3A8A 50%, #26C6DA 50%, #26C6DA 60%, #DC2626 60%, #DC2626 70%, #FFD700 70%, #FFD700 80%, #1E3A8A 80%, #1E3A8A 90%, #26C6DA 90%, #26C6DA 100%)",
          },
        }}
      />
    </Container>
  );
};

export default NotFound;