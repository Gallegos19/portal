
import React, { useState } from 'react';
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
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  PlayCircleOutline as PlayIcon,
  CheckCircle as CheckIcon,
  EmojiEvents as CertificateIcon,
  Check as CheckMarkIcon,
  Lock as LockIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  PersonAdd as PersonAddIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
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
  { 
    id: 1, 
    title: 'Introducción al programa', 
    description: 'Aprende los conceptos básicos del programa de becarios',
    duration: '15:30', 
    completed: true, 
    videoId: 'dQw4w9WgXcQ',
    date: '15/09/2023',
    views: 124,
    progress: 100
  },
  { 
    id: 2, 
    title: 'Desarrollo personal', 
    description: 'Técnicas para el crecimiento personal',
    duration: '22:45', 
    completed: true, 
    videoId: 'dQw4w9WgXcQ',
    date: '20/09/2023',
    views: 98,
    progress: 100
  },
  { 
    id: 3, 
    title: 'Liderazgo comunitario', 
    description: 'Cómo liderar proyectos en tu comunidad',
    duration: '18:20', 
    completed: false, 
    videoId: 'dQw4w9WgXcQ',
    date: '25/09/2023',
    views: 45,
    progress: 30
  },
  { 
    id: 4, 
    title: 'Gestión de proyectos', 
    description: 'Metodologías ágiles para la gestión de proyectos',
    duration: '25:10', 
    completed: false, 
    videoId: 'dQw4w9WgXcQ',
    date: '01/10/2023',
    views: 32,
    progress: 15
  },
  { 
    id: 5, 
    title: 'Comunicación efectiva', 
    description: 'Mejora tus habilidades de comunicación',
    duration: '19:55', 
    completed: false, 
    videoId: 'dQw4w9WgXcQ',
    date: '05/10/2023',
    views: 28,
    progress: 5
  },
  { 
    id: 6, 
    title: 'Trabajo en equipo', 
    description: 'Estrategias para un trabajo en equipo efectivo',
    duration: '16:40', 
    completed: false, 
    videoId: 'dQw4w9WgXcQ',
    date: '10/10/2023',
    views: 15,
    progress: 0
  },
];

const Capacitacion: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string; videoId: string} | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);

  const handleOpen = (video: {title: string; videoId: string}) => {
    setCurrentVideo(video);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentVideo(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedVideos(videoData.map(video => video.id));
    } else {
      setSelectedVideos([]);
    }
  };

  const handleSelectVideo = (videoId: number) => {
    setSelectedVideos(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const filteredVideos = videoData.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedVideos = videoData.filter(video => video.completed);
  const inProgressVideos = videoData.filter(video => video.progress > 0 && video.progress < 100);
  const notStartedVideos = videoData.filter(video => video.progress === 0);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header con título y botones de acción */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Capacitación para Facilitadores
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona y monitorea el progreso de los videos de capacitación para facilitadores
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PersonAddIcon />}
            sx={{ mr: 2 }}
          >
            Agregar Video
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<DownloadIcon />}
          >
            Exportar Reporte
          </Button>
        </Box>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <StatCard>
            <Typography variant="h4" className="stat-value" color="primary">
              {videoData.length}
            </Typography>
            <Typography variant="body1" className="stat-label">
              Videos Totales
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard>
            <Typography variant="h4" className="stat-value" color="success.main">
              {completedVideos.length}
            </Typography>
            <Typography variant="body1" className="stat-label">
              Completados
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard>
            <Typography variant="h4" className="stat-value" color="warning.main">
              {inProgressVideos.length}
            </Typography>
            <Typography variant="body1" className="stat-label">
              En Progreso
            </Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Barra de búsqueda y filtros */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          placeholder="Buscar videos..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { width: 350 }
          }}
        />
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<FilterIcon />}
            sx={{ mr: 1 }}
          >
            Filtros
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<MoreIcon />}
          >
            Más
          </Button>
        </Box>
      </Box>

      {/* Pestañas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs de capacitación">
          <Tab label="Todos" />
          <Tab label="Completados" />
          <Tab label="En progreso" />
          <Tab label="No iniciados" />
        </Tabs>
      </Box>

      {/* Tabla de videos */}
      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedVideos.length > 0 && selectedVideos.length < videoData.length
                    }
                    checked={selectedVideos.length === videoData.length && videoData.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Video</TableCell>
                <TableCell>Fecha de publicación</TableCell>
                <TableCell>Vistas</TableCell>
                <TableCell>Progreso</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVideos.map((video) => (
                <TableRow key={video.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedVideos.includes(video.id)}
                      onChange={() => handleSelectVideo(video.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box 
                        sx={{
                          width: 120,
                          height: 68,
                          bgcolor: 'grey.300',
                          borderRadius: 1,
                          overflow: 'hidden',
                          position: 'relative',
                          mr: 2,
                          cursor: 'pointer',
                          '&:hover .play-overlay': {
                            opacity: 1,
                          },
                        }}
                        onClick={() => handleOpen(video)}
                      >
                        <Box
                          className="play-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.3)',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            color: 'white',
                          }}
                        >
                          <PlayIcon fontSize="large" />
                        </Box>
                        {video.completed && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              bgcolor: 'success.main',
                              color: 'white',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckMarkIcon sx={{ fontSize: 16 }} />
                          </Box>
                        )}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            px: 0.5,
                            borderRadius: 0.5,
                            fontSize: 12,
                          }}
                        >
                          {video.duration}
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">{video.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {video.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{video.date}</TableCell>
                  <TableCell>{video.views}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" width={100}>
                      <Box width="100%" mr={1}>
                        <LinearProgress 
                          variant="determinate" 
                          value={video.progress} 
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {video.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={
                        video.completed 
                          ? 'Completado' 
                          : video.progress > 0 
                            ? 'En progreso' 
                            : 'No iniciado'
                      }
                      color={
                        video.completed 
                          ? 'success' 
                          : video.progress > 0 
                            ? 'warning' 
                            : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpen(video)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVideos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No se encontraron videos que coincidan con tu búsqueda
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal de reproducción de video */}
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
            <Typography variant="h6" id="video-modal-title">
              {currentVideo?.title}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Contenido del Modal */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 2 }}>
              {currentVideo && (
                <YouTube
                  videoId={currentVideo.videoId}
                  opts={{
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
                  }}
                  onReady={(e) => {
                    // Puedes acceder al reproductor con e.target
                  }}
                  onPlaybackRateChange={(e) => {
                    // Manejar cambios en la velocidad de reproducción
                  }}
                  onError={(e) => {
                    console.error('Error al cargar el video:', e);
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Descripción del video seleccionado. Aquí puedes incluir detalles adicionales
                sobre el contenido del video, objetivos de aprendizaje, etc.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Capacitacion;