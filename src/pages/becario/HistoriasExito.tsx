import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  EmojiEvents as TrophyIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import type { SuccessStory } from '../../types/api';
import { successStoryService } from '../../services/api/successStory';
import { archiveService } from '../../services/api/archive';
import { photoService } from '../../services/api/photo';

const formatDateValue = (value?: string): string => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const defaultImage =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';

const imageCardSx = {
  objectFit: 'cover',
  objectPosition: 'center top',
} as const;

const imageDialogSx = {
  position: 'relative',
  width: '100%',
  height: { xs: 220, sm: 300, md: 340 },
  borderRadius: 1.5,
  overflow: 'hidden',
  mb: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'grey.100',
} as const;

const HistoriasExito: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  const loadImageUrls = useCallback(async (storiesToLoad: SuccessStory[]) => {
    const nextMap = new Map<string, string>();

    await Promise.all(
      storiesToLoad.map(async (story) => {
        const archiveIdFromRelation = story.foto?.id_archive;

        if (archiveIdFromRelation) {
          try {
            const signedUrl = await archiveService.getSignedUrl(archiveIdFromRelation, 3600);
            nextMap.set(story.id, signedUrl.data.signed_url);
            return;
          } catch {
            return;
          }
        }

        if (!story.id_photo) return;

        try {
          const photoResponse = await photoService.getById(story.id_photo);
          const archiveId = photoResponse.data?.id_archive;

          if (archiveId) {
            const signedUrl = await archiveService.getSignedUrl(archiveId, 3600);
            nextMap.set(story.id, signedUrl.data.signed_url);
            return;
          }
        } catch {
          return;
        }
      })
    );

    setImageUrls(nextMap);
  }, []);

  const loadStories = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await successStoryService.getAll();
      const fetchedStories = response.data || [];
      setStories(fetchedStories);
      await loadImageUrls(fetchedStories);
    } catch {
      setErrorMessage('No se pudieron cargar las historias de éxito.');
    } finally {
      setLoading(false);
    }
  }, [loadImageUrls]);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const filteredStories = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return stories.filter((story) => {
      if (!search) return true;
      return (
        (story.title || '').toLowerCase().includes(search) ||
        (story.description || '').toLowerCase().includes(search)
      );
    });
  }, [stories, searchTerm]);

  const featuredStory = filteredStories[0] || null;
  const storyGrid = filteredStories.slice(1);
  const selectedImageUrl = selectedStory ? imageUrls.get(selectedStory.id) || defaultImage : defaultImage;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Historias de Éxito
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Inspírate con experiencias reales de impacto y crecimiento.
        </Typography>
      </Box>

      <Paper sx={{ p: 2.5, mb: 3 }} variant="outlined">
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por título o contenido..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 7 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {featuredStory && (
            <Paper variant="outlined" sx={{ overflow: 'hidden', mb: 3, borderRadius: 2 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '320px 1fr' },
                }}
              >
                <CardMedia
                  component="img"
                  image={imageUrls.get(featuredStory.id) || defaultImage}
                  alt={featuredStory.title}
                  sx={{ height: { xs: 180, md: 220 }, ...imageCardSx }}
                />

                <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip
                    label="Historia destacada"
                    icon={<TrophyIcon />}
                    color="warning"
                    size="small"
                    sx={{ alignSelf: 'flex-start' }}
                  />

                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {featuredStory.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <CalendarIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">
                      {formatDateValue((featuredStory as SuccessStory & { created_at?: string }).created_at)}
                    </Typography>
                  </Box>

                  <Typography variant="body1" color="text.secondary" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {featuredStory.description || 'Sin descripción disponible.'}
                  </Typography>

                  <Box sx={{ mt: 'auto' }}>
                    <Chip
                      label="Leer historia completa"
                      icon={<ViewIcon />}
                      onClick={() => setSelectedStory(featuredStory)}
                      color="primary"
                      size="small"
                      clickable
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            {storyGrid.map((story) => (
              <Card key={story.id} variant="outlined" sx={{ height: '100%' }}>
                <CardActionArea
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  onClick={() => setSelectedStory(story)}
                >
                  <CardMedia
                    component="img"
                    image={imageUrls.get(story.id) || defaultImage}
                    alt={story.title}
                    sx={{ height: 150, ...imageCardSx }}
                  />
                  <CardContent sx={{ flex: 1, width: '100%', p: 1.75 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {story.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      {formatDateValue((story as SuccessStory & { created_at?: string }).created_at)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {story.description || 'Sin descripción disponible.'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>

          {filteredStories.length === 0 && (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No se encontraron historias de éxito con ese criterio.
              </Typography>
            </Paper>
          )}
        </>
      )}

      <Dialog
        open={Boolean(selectedStory)}
        onClose={() => setSelectedStory(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ pr: 6 }}>
          {selectedStory?.title}
          <IconButton
            onClick={() => setSelectedStory(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedStory && (
            <>
              <Box
                sx={{
                  ...imageDialogSx,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${selectedImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: 'scale(1.1)',
                    filter: 'blur(16px)',
                    opacity: 0.45,
                  },
                }}
              >
                <Box
                  component="img"
                  src={selectedImageUrl}
                  alt={selectedStory.title}
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: 1,
                    boxShadow: 3,
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 2 }}>
                <CalendarIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">
                  {formatDateValue((selectedStory as SuccessStory & { created_at?: string }).created_at)}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {selectedStory.description || 'Sin descripción disponible.'}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default HistoriasExito;
