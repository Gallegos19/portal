import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Modal,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
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
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import YouTube, { type YouTubeEvent } from 'react-youtube';
import type { Training, TrainingProgress } from '../../types/api';
import { trainingService } from '../../services/api/training';
import { trainingProgressService } from '../../services/api/trainingProgress';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/useToast';

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
  paddingTop: '56.25%',
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

interface TrainingRow {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoId: string;
  date: string;
  views: number;
  progress: number;
  completed: boolean;
}

interface ProgressByTraining {
  id?: string;
  progress_percentage: number;
  completed: boolean;
}

interface YouTubePlayerLike {
  getCurrentTime: () => number;
  getDuration: () => number;
  playVideo?: () => void;
}

const hasPlayerApi = (value: unknown): value is YouTubePlayerLike => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { getCurrentTime?: unknown }).getCurrentTime === 'function' &&
    typeof (value as { getDuration?: unknown }).getDuration === 'function'
  );
};

const DEFAULT_VIDEO_ID = 'dQw4w9WgXcQ';

const extractYouTubeVideoId = (input: string): string => {
  const value = (input || '').trim();
  if (!value) return DEFAULT_VIDEO_ID;

  const idPattern = /^[a-zA-Z0-9_-]{11}$/;
  if (idPattern.test(value)) return value;

  if (value.includes('v=')) return value.split('v=')[1]?.split('&')[0] || DEFAULT_VIDEO_ID;
  if (value.includes('youtu.be/')) return value.split('youtu.be/')[1]?.split('?')[0] || DEFAULT_VIDEO_ID;
  if (value.includes('/embed/')) return value.split('/embed/')[1]?.split('?')[0] || DEFAULT_VIDEO_ID;

  return DEFAULT_VIDEO_ID;
};

const formatDateValue = (value?: string): string => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleDateString('es-MX');
};

const Capacitacion: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [open, setOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<TrainingRow | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [progressByTraining, setProgressByTraining] = useState<Record<string, ProgressByTraining>>({});
  const [loading, setLoading] = useState(false);

  const progressRef = useRef<Record<string, ProgressByTraining>>({});
  const playerRef = useRef<YouTubePlayerLike | null>(null);
  const trackingIntervalRef = useRef<number | null>(null);
  const activeTrainingIdRef = useRef<string | null>(null);

  useEffect(() => {
    progressRef.current = progressByTraining;
  }, [progressByTraining]);

  const loadData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [trainingResponse, progressResponse] = await Promise.all([
        trainingService.getAll(),
        trainingProgressService.getByUserId(user.id),
      ]);

      const allTrainings = trainingResponse.data || [];
      const progressList = progressResponse.data || [];

      const progressMap: Record<string, ProgressByTraining> = {};
      progressList.forEach((item) => {
        progressMap[item.id_training] = {
          id: item.id,
          progress_percentage: item.progress_percentage ?? 0,
          completed: item.completed ?? false,
        };
      });

      setTrainings(allTrainings);
      setProgressByTraining(progressMap);
    } catch (error) {
      console.error('Error cargando capacitaciones/progreso:', error);
      showToast('No se pudieron cargar las capacitaciones.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const trainingVideos: TrainingRow[] = useMemo(() => {
    return trainings.map((training) => {
      const progressInfo = progressByTraining[training.id];
      const progress = Math.max(0, Math.min(100, progressInfo?.progress_percentage ?? 0));
      const completed = progressInfo?.completed ?? progress >= 100;

      return {
        id: training.id,
        title: training.title,
        description: training.description || 'Sin descripción',
        duration: training.tiempo || '00:00',
        videoId: extractYouTubeVideoId(training.url),
        date: formatDateValue((training as Training & { created_at?: string }).created_at),
        views: progress > 0 ? 1 : 0,
        progress,
        completed,
      };
    });
  }, [trainings, progressByTraining]);

  const completedVideos = trainingVideos.filter((video) => video.completed);
  const inProgressVideos = trainingVideos.filter((video) => video.progress > 0 && video.progress < 100);

  const visibleByTab = useMemo(() => {
    if (tabValue === 1) return trainingVideos.filter((v) => v.completed);
    if (tabValue === 2) return trainingVideos.filter((v) => v.progress > 0 && v.progress < 100);
    if (tabValue === 3) return trainingVideos.filter((v) => v.progress === 0);
    return trainingVideos;
  }, [tabValue, trainingVideos]);

  const filteredVideos = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return visibleByTab;
    return visibleByTab.filter(
      (video) =>
        video.title.toLowerCase().includes(search) ||
        video.description.toLowerCase().includes(search)
    );
  }, [visibleByTab, searchTerm]);

  const persistProgress = async (trainingId: string, nextProgress: number, force = false) => {
    if (!user?.id) return;

    const current = progressRef.current[trainingId];
    const prevProgress = current?.progress_percentage ?? 0;
    const progressValue = Math.max(0, Math.min(100, Math.round(nextProgress)));
    const completed = progressValue >= 100;

    if (!force && progressValue <= prevProgress) return;

    setProgressByTraining((prev) => ({
      ...prev,
      [trainingId]: {
        id: prev[trainingId]?.id,
        progress_percentage: progressValue,
        completed,
      },
    }));

    try {
      if (current?.id) {
        await trainingProgressService.updateById(current.id, {
          progress_percentage: progressValue,
          completed,
          last_viewed_at: new Date().toISOString(),
          completed_at: completed ? new Date().toISOString() : undefined,
        });
      } else {
        const response = await trainingProgressService.create({
          id_training: trainingId,
          id_user: user.id,
          progress_percentage: progressValue,
          completed,
          last_viewed_at: new Date().toISOString(),
          completed_at: completed ? new Date().toISOString() : undefined,
        } as Omit<TrainingProgress, 'id'>);

        setProgressByTraining((prev) => ({
          ...prev,
          [trainingId]: {
            id: response.data.id,
            progress_percentage: progressValue,
            completed,
          },
        }));
      }
    } catch (error) {
      console.error('Error guardando avance de capacitación:', error);
    }
  };

  const stopTracking = () => {
    if (trackingIntervalRef.current) {
      window.clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
  };

  const startTracking = (trainingId: string) => {
    stopTracking();

    trackingIntervalRef.current = window.setInterval(async () => {
      try {
        const player = playerRef.current;
        if (!player?.getCurrentTime || !player?.getDuration) return;

        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        if (!duration) return;

        const progress = (currentTime / duration) * 100;
        await persistProgress(trainingId, progress);
      } catch (error) {
        console.error('Error calculando progreso:', error);
      }
    }, 6000);
  };

  const handleOpen = (video: TrainingRow) => {
    setCurrentVideo(video);
    activeTrainingIdRef.current = video.id;
    setOpen(true);
  };

  const handleClose = async () => {
    stopTracking();

    const activeTrainingId = activeTrainingIdRef.current;
    if (activeTrainingId) {
      try {
        const player = playerRef.current;
        if (player?.getCurrentTime && player?.getDuration) {
          const duration = player.getDuration();
          if (duration) {
            const progress = (player.getCurrentTime() / duration) * 100;
            await persistProgress(activeTrainingId, progress, true);
          }
        }
      } catch (error) {
        console.error('Error al cerrar video y guardar avance:', error);
      }
    }

    activeTrainingIdRef.current = null;
    playerRef.current = null;
    setOpen(false);
    setCurrentVideo(null);
  };

  const handleYouTubeReady = (event: YouTubeEvent<unknown>) => {
    playerRef.current = hasPlayerApi(event.target) ? event.target : null;
  };

  const handleYouTubeStateChange = async (event: YouTubeEvent<number>) => {
    const trainingId = activeTrainingIdRef.current;
    if (!trainingId) return;

    if (event.data === 1) {
      startTracking(trainingId);
      return;
    }

    if (event.data === 2 || event.data === 0) {
      stopTracking();

      try {
        const player = playerRef.current;
        if (player?.getCurrentTime && player?.getDuration) {
          const duration = player.getDuration();
          if (duration) {
            const progress = (player.getCurrentTime() / duration) * 100;
            await persistProgress(trainingId, progress, true);
          }
        }
      } catch (error) {
        console.error('Error guardando avance en pausa/fin:', error);
      }
    }
  };

  useEffect(() => {
    return () => stopTracking();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" color="textPrimary" gutterBottom>
          Capacitación
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          placeholder="Buscar videos..."
          size="small"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { width: 350 },
          }}
        />
        <Box>
          <Button variant="outlined" startIcon={<FilterIcon />} sx={{ mr: 1 }} disabled>
            Filtros
          </Button>
          <Button variant="outlined" startIcon={<MoreIcon />} disabled>
            Más
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Todos" />
          <Tab label="Completados" />
          <Tab label="En progreso" />
          <Tab label="No iniciados" />
        </Tabs>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Videos de capacitación para becarios"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 3,
              }}
            >
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} onClick={() => handleOpen(video)} sx={{ cursor: 'pointer' }}>
                  <VideoThumbnail>
                    <Box className="play-button">
                      <PlayIcon fontSize="large" />
                    </Box>

                    {video.completed && (
                      <Box className="completed-badge">
                        <CheckIcon fontSize="small" />
                      </Box>
                    )}

                    <Box className="duration">{video.duration}</Box>
                  </VideoThumbnail>

                  <CardContent>
                    <Typography variant="subtitle1" component="h3" gutterBottom>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {video.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip
                        label={video.completed ? 'Completado' : video.progress > 0 ? 'En progreso' : 'Pendiente'}
                        color={video.completed ? 'success' : video.progress > 0 ? 'warning' : 'default'}
                        size="small"
                        variant={video.completed ? 'filled' : 'outlined'}
                      />
                      <Button
                        color="primary"
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpen(video);
                        }}
                      >
                        {video.completed ? 'Ver de nuevo' : 'Ver ahora'}
                      </Button>
                    </Box>
                  </CardContent>
                </VideoCard>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardHeader title="Mi progreso" titleTypographyProps={{ variant: 'h6' }} />
        <Divider />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body2" color="text.secondary">
              Videos completados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completedVideos.length} de {trainingVideos.length || 0}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={trainingVideos.length ? (completedVideos.length / trainingVideos.length) * 100 : 0}
            color="primary"
            sx={{ height: 8, borderRadius: 4, mb: 4 }}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
              gap: 3,
            }}
          >
            <StatCard elevation={0}>
              <Typography variant="h4" className="stat-value" color="primary">
                {completedVideos.length}
              </Typography>
              <Typography variant="body2" className="stat-label">
                Completados
              </Typography>
            </StatCard>
            <StatCard elevation={0}>
              <Typography variant="h4" className="stat-value" color="text.secondary">
                {trainingVideos.length - completedVideos.length}
              </Typography>
              <Typography variant="body2" className="stat-label">
                Pendientes
              </Typography>
            </StatCard>
            <StatCard elevation={0}>
              <Typography variant="h4" className="stat-value" color="info.main">
                {inProgressVideos.length}
              </Typography>
              <Typography variant="body2" className="stat-label">
                En progreso
              </Typography>
            </StatCard>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Mis certificaciones" titleTypographyProps={{ variant: 'h6' }} />
        <Divider />
        <CardContent>
          <Box textAlign="center" py={4}>
            <Box display="flex" alignItems="center" justifyContent="center" color={theme.palette.grey[400]} mb={2}>
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
                borderRadius: 2,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      bgcolor: 'grey.300',
                      mr: 2,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckMarkIcon fontSize="small" sx={{ color: 'grey.600' }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.primary">
                      Certificado de Capacitación Básica
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Progreso: {trainingVideos.length ? Math.round((completedVideos.length / trainingVideos.length) * 100) : 0}% completado
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={completedVideos.length === trainingVideos.length && trainingVideos.length > 0 ? 'Listo' : 'En progreso'}
                  color={completedVideos.length === trainingVideos.length && trainingVideos.length > 0 ? 'success' : 'warning'}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Paper>

            <Button
              variant="contained"
              disabled={!(completedVideos.length === trainingVideos.length && trainingVideos.length > 0)}
              startIcon={<LockIcon />}
              sx={{ textTransform: 'none' }}
            >
              Descargar certificado
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="video-modal-title"
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
                  onReady={handleYouTubeReady}
                  onStateChange={handleYouTubeStateChange}
                  onError={(error) => {
                    console.error('Error al cargar el video:', error);
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
              <Typography variant="body1">{currentVideo?.description}</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PlayIcon />}
                onClick={() => playerRef.current?.playVideo?.()}
              >
                Reproducir
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {!loading && filteredVideos.length === 0 && (
        <Paper sx={{ mt: 3, p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No se encontraron videos que coincidan con tu búsqueda
          </Typography>
        </Paper>
      )}

      {!loading && trainingVideos.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
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
                    <TableCell>{video.title}</TableCell>
                    <TableCell>{video.date}</TableCell>
                    <TableCell>{video.views}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" width={120}>
                        <Box width="100%" mr={1}>
                          <LinearProgress variant="determinate" value={video.progress} sx={{ height: 6, borderRadius: 3 }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {video.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={video.completed ? 'Completado' : video.progress > 0 ? 'En progreso' : 'No iniciado'}
                        color={video.completed ? 'success' : video.progress > 0 ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpen(video)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default Capacitacion;
