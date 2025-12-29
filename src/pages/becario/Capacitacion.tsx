import React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Modal,
  Paper,
  Typography,
  useTheme,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import {
  PlayCircleOutline as PlayIcon,
  CheckCircle as CheckIcon,
  EmojiEvents as CertificateIcon,
  Check as CheckMarkIcon,
  Lock as LockIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import YouTube from 'react-youtube';

const VideoCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const VideoThumbnail = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[900],
  paddingTop: '56.25%', // 16:9 aspect ratio
  '& .play-button': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  '& .duration': {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: '0.75rem',
  },
  '& .completed-badge': {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.palette.success.main,
    color: 'white',
    borderRadius: '50%',
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  '& .stat-value': {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: theme.spacing(0.5),
  },
  '& .stat-label': {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
}));

// Mock video data with YouTube video IDs
const videoData = [
  { id: 1, title: 'Introducción al programa', duration: '15:30', completed: true, videoId: 'dQw4w9WgXcQ' },
  { id: 2, title: 'Desarrollo personal', duration: '22:45', completed: true, videoId: 'dQw4w9WgXcQ' },
  { id: 3, title: 'Liderazgo comunitario', duration: '18:20', completed: false, videoId: 'dQw4w9WgXcQ' },
  { id: 4, title: 'Gestión de proyectos', duration: '25:10', completed: false, videoId: 'dQw4w9WgXcQ' },
  { id: 5, title: 'Comunicación efectiva', duration: '19:55', completed: false, videoId: 'dQw4w9WgXcQ' },
  { id: 6, title: 'Trabajo en equipo', duration: '16:40', completed: false, videoId: 'dQw4w9WgXcQ' },
];

const Capacitacion: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string; videoId: string} | null>(null);

  const handleOpen = (video: {title: string; videoId: string}) => {
    setCurrentVideo(video);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentVideo(null);
  };

    const [isLoading, setIsLoading] = useState(true);
  const [player, setPlayer] = useState<any>(null);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      fs: 0,
      iv_load_policy: 3,
      disablekb: 1,
    },
  };

  const onReady = (event: any) => {
    setPlayer(event.target);
    setIsLoading(false);
  };

  const onPlaybackRateChange = (event: any) => {
    // Handle playback rate changes if needed
  };

  const onError = (error: any) => {
    console.error('YouTube Player Error:', error);
    setIsLoading(false);
  };
  const trainingVideos = videoData;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Video Modal Mejorado */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="video-modal-title"
        aria-describedby="video-modal-description"
        closeAfterTransition
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(4px)',
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '1100px',
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[24],
            borderRadius: 2,
            overflow: 'hidden',
            outline: 'none',
            transform: open ? 'scale(1)' : 'scale(0.95)',
            opacity: open ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Header del Modal */}
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography 
              id="video-modal-title" 
              variant="h6" 
              component="h2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                maxWidth: 'calc(100% - 48px)', // Asegura que el título no se solape con el botón de cerrar
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentVideo?.title}
            </Typography>
            <IconButton
              aria-label="Cerrar reproductor de video"
              onClick={handleClose}
              size="large"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: 'action.hover',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Contenedor del Video */}
          <Box 
            sx={{ 
              position: 'relative',
              width: '100%',
              height: 0,
              paddingBottom: '56.25%', // 16:9 aspect ratio
              bgcolor: 'black',
            }}
          >
            {isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                  zIndex: 1,
                }}
              >
                <Box 
                  sx={{
                    display: 'inline-block',
                    position: 'relative',
                    width: 80,
                    height: 80,
                    '& div': {
                      boxSizing: 'border-box',
                      display: 'block',
                      position: 'absolute',
                      width: 64,
                      height: 64,
                      margin: 8,
                      border: '6px solid',
                      borderRadius: '50%',
                      animation: 'lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
                      borderColor: `${theme.palette.primary.main} transparent transparent transparent`,
                    },
                    '& div:nth-child(1)': { animationDelay: '-0.45s' },
                    '& div:nth-child(2)': { animationDelay: '-0.3s' },
                    '& div:nth-child(3)': { animationDelay: '-0.15s' },
                    '@keyframes lds-ring': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                >
                  <div></div><div></div><div></div><div></div>
                </Box>
              </Box>
            )}
            
            {currentVideo && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: isLoading ? 0 : 1,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              >
                <YouTube
                  videoId={currentVideo.videoId}
                  opts={opts}
                  onReady={onReady}
                  onPlaybackRateChange={onPlaybackRateChange}
                  onError={onError}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  iframeClassName="youtube-iframe"
                  containerClassName="youtube-container"
                />
              </Box>
            )}
          </Box>
          
          {/* Pie del Modal */}
          <Box 
            sx={{
              p: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Reproduciendo: {currentVideo?.title}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  YouTube Player
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<PlayIcon />}
                onClick={() => player?.playVideo()}
                sx={{ ml: 2 }}
              >
                Reproducir
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" color="textPrimary" gutterBottom>
          Capacitación
        </Typography>
      </Box>
      
      {/* Videos de capacitación */}
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="Videos de capacitación para becarios" 
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {trainingVideos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <VideoCard onClick={() => handleOpen({title: video.title, videoId: video.videoId})} sx={{ cursor: 'pointer' }}>
                  <VideoThumbnail>
                    <Box className="play-button">
                      <PlayIcon fontSize="large" />
                    </Box>
                    
                    {video.completed && (
                      <Box className="completed-badge">
                        <CheckIcon fontSize="small" />
                      </Box>
                    )}
                    
                    <Box className="duration">
                      {video.duration}
                    </Box>
                  </VideoThumbnail>
                  
                  <CardContent>
                    <Typography variant="subtitle1" component="h3" gutterBottom>
                      {video.title}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip 
                        label={video.completed ? 'Completado' : 'Pendiente'}
                        color={video.completed ? 'success' : 'default'}
                        size="small"
                        variant={video.completed ? 'filled' : 'outlined'}
                      />
                      <Button 
                        color="primary" 
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen({title: video.title, videoId: video.videoId});
                        }}
                      >
                        {video.completed ? 'Ver de nuevo' : 'Ver ahora'}
                      </Button>
                    </Box>
                  </CardContent>
                </VideoCard>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Progreso general */}
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="Mi progreso" 
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body2" color="text.secondary">
              Videos completados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              2 de 6
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={33} 
            color="primary" 
            sx={{ height: 8, borderRadius: 4, mb: 4 }}
          />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard elevation={0}>
                <Typography variant="h4" className="stat-value" color="primary">
                  2
                </Typography>
                <Typography variant="body2" className="stat-label">
                  Completados
                </Typography>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard elevation={0}>
                <Typography variant="h4" className="stat-value" color="text.secondary">
                  4
                </Typography>
                <Typography variant="body2" className="stat-label">
                  Pendientes
                </Typography>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard elevation={0}>
                <Typography variant="h4" className="stat-value" color="info.main">
                  38m
                </Typography>
                <Typography variant="body2" className="stat-label">
                  Tiempo total
                </Typography>
              </StatCard>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Certificaciones */}
      <Card>
        <CardHeader 
          title="Mis certificaciones" 
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent>
          <Box textAlign="center" py={4}>
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              color={theme.palette.grey[400]}
              mb={2}
            >
              <CertificateIcon fontSize="large" />
            </Box>
            <Typography variant="h6" component="h4" gutterBottom>
              ¡Obtén tu certificación!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Completa todos los videos de capacitación para obtener tu certificado oficial del programa de becas.
            </Typography>
            
            <Paper 
              elevation={0} 
              sx={{ 
                bgcolor: 'grey.50', 
                p: 2, 
                mb: 3,
                textAlign: 'left',
                borderRadius: 2
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'grey.300', mr: 2, width: 32, height: 32 }}>
                    <CheckMarkIcon fontSize="small" sx={{ color: 'grey.600' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.primary">
                      Certificado de Capacitación Básica
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Progreso: 33% completado
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label="En progreso" 
                  color="warning" 
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Paper>
            
            <Button 
              variant="contained" 
              disabled 
              startIcon={<LockIcon />}
              sx={{ textTransform: 'none' }}
            >
              Descargar certificado (Completa todos los videos)
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Capacitacion;