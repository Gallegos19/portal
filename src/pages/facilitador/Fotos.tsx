
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tooltip,
  Badge,
  Avatar,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CloudUpload as CloudUploadIcon,
  Collections as CollectionsIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Datos de ejemplo para las fotos
const samplePhotos = [
  {
    id: 1,
    title: 'Reunión de equipo',
    date: new Date(2023, 8, 15),
    category: 'Reuniones',
    url: 'https://source.unsplash.com/random/800x600?meeting',
    featured: true,
    size: '2.4 MB',
    dimensions: '1920x1080',
    tags: ['equipo', 'oficina', 'reunión']
  },
  {
    id: 2,
    title: 'Taller de capacitación',
    date: new Date(2023, 8, 10),
    category: 'Capacitaciones',
    url: 'https://source.unsplash.com/random/800x600?workshop',
    featured: false,
    size: '3.1 MB',
    dimensions: '2000x1333',
    tags: ['capacitación', 'taller', 'aprendizaje']
  },
  {
    id: 3,
    title: 'Evento de lanzamiento',
    date: new Date(2023, 7, 28),
    category: 'Eventos',
    url: 'https://source.unsplash.com/random/800x600?event',
    featured: true,
    size: '4.2 MB',
    dimensions: '2560x1440',
    tags: ['evento', 'lanzamiento', 'presentación']
  },
  {
    id: 4,
    title: 'Sesión de fotos',
    date: new Date(2023, 7, 15),
    category: 'Sesiones',
    url: 'https://source.unsplash.com/random/800x600?photoshoot',
    featured: false,
    size: '1.8 MB',
    dimensions: '1600x1200',
    tags: ['sesión', 'fotos', 'retrato']
  },
  {
    id: 5,
    title: 'Visita a comunidad',
    date: new Date(2023, 7, 5),
    category: 'Visitas',
    url: 'https://source.unsplash.com/random/800x600?community',
    featured: true,
    size: '2.9 MB',
    dimensions: '2048x1365',
    tags: ['comunidad', 'visita', 'proyecto']
  },
  {
    id: 6,
    title: 'Sesión de capacitación',
    date: new Date(2023, 6, 28),
    category: 'Capacitaciones',
    url: 'https://source.unsplash.com/random/800x600?training',
    featured: false,
    size: '3.5 MB',
    dimensions: '1920x1280',
    tags: ['capacitación', 'aprendizaje', 'equipo']
  },
  {
    id: 7,
    title: 'Reunión con socios',
    date: new Date(2023, 6, 20),
    category: 'Reuniones',
    url: 'https://source.unsplash.com/random/800x600?business',
    featured: false,
    size: '2.1 MB',
    dimensions: '1600x1067',
    tags: ['reunión', 'socios', 'negocios']
  },
  {
    id: 8,
    title: 'Taller práctico',
    date: new Date(2023, 6, 12),
    category: 'Talleres',
    url: 'https://source.unsplash.com/random/800x600?workshop',
    featured: true,
    size: '3.8 MB',
    dimensions: '2400x1600',
    tags: ['taller', 'práctica', 'actividad']
  },
];

// Categorías únicas para los filtros
const categories = ['Todas', ...new Set(samplePhotos.map(photo => photo.category))];

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 8,
    top: 8,
    padding: '0 4px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const Fotos: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePhotoClick = (photo: any, index: number) => {
    setSelectedPhoto(photo);
    setCurrentImageIndex(index);
  };

  const handleClosePreview = () => {
    setSelectedPhoto(null);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIndex]);
    setCurrentImageIndex(nextIndex);
  };

  const handlePrevImage = () => {
    const prevIndex = (currentImageIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[prevIndex]);
    setCurrentImageIndex(prevIndex);
  };

  const handleSelectPhoto = (photoId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedPhotos(prev => 
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPhotos(filteredPhotos.map(photo => photo.id));
    } else {
      setSelectedPhotos([]);
    }
  };

  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadClose = () => {
    setUploadDialogOpen(false);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simular carga de archivos
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadDialogOpen(false);
            setUploadProgress(0);
            setIsUploading(false);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Filtrar fotos según búsqueda y categoría
  const filteredPhotos = samplePhotos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Todas' || photo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Contar fotos por categoría
  const photoCounts = samplePhotos.reduce((acc, photo) => {
    acc[photo.category] = (acc[photo.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header con título y acciones */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Galería de Fotos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra y comparte las fotos de tus actividades
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleUploadClick}
            sx={{ mr: 2 }}
          >
            Subir Fotos
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CollectionsIcon />}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'Vista de lista' : 'Vista de cuadrícula'}
          </Button>
        </Box>
      </Box>

      {/* Filtros y búsqueda */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box display="flex" gap={1} flexWrap="wrap">
          {categories.map(category => (
            <Chip
              key={category}
              label={`${category} ${category !== 'Todas' ? `(${photoCounts[category] || 0})` : ''}`}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              clickable
            />
          ))}
        </Box>
        <Box width={300}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar fotos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Acciones para fotos seleccionadas */}
      {selectedPhotos.length > 0 && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'action.hover' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="subtitle2">
                {selectedPhotos.length} {selectedPhotos.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas'}
              </Typography>
              <Button size="small" startIcon={<DownloadIcon />}>
                Descargar
              </Button>
              <Button size="small" startIcon={<ShareIcon />}>
                Compartir
              </Button>
              <Button size="small" color="error" startIcon={<DeleteIcon />}>
                Eliminar
              </Button>
            </Box>
            <IconButton size="small" onClick={() => setSelectedPhotos([])}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Galería de fotos */}
      {viewMode === 'grid' ? (
        <Grid container spacing={2}>
          {filteredPhotos.map((photo, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover .photo-actions': {
                    opacity: 1,
                  },
                  border: selectedPhotos.includes(photo.id) 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : '2px solid transparent',
                }}
                onClick={() => handlePhotoClick(photo, index)}
              >
                <Box sx={{ position: 'relative', pt: '56.25%' }}>
                  <CardMedia
                    component="img"
                    image={photo.url}
                    alt={photo.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    className="photo-actions"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Tooltip title={photo.featured ? 'Destacada' : 'Destacar'}>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: 'background.paper',
                          '&:hover': {
                            bgcolor: 'background.paper',
                            color: theme.palette.warning.main,
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Aquí iría la lógica para marcar como destacada
                        }}
                      >
                        {photo.featured ? <StarIcon color="warning" /> : <StarBorderIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Seleccionar">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: 'background.paper',
                          '&:hover': {
                            bgcolor: 'background.paper',
                          },
                        }}
                        onClick={(e) => handleSelectPhoto(photo.id, e)}
                      >
                        <Checkbox
                          checked={selectedPhotos.includes(photo.id)}
                          sx={{
                            color: 'primary.main',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                            p: 0,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {photo.featured && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'warning.main',
                        color: 'warning.contrastText',
                        px: 1,
                        borderRadius: 1,
                        fontSize: 12,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <StarIcon sx={{ fontSize: 14 }} />
                      Destacada
                    </Box>
                  )}
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="subtitle1" noWrap>
                        {photo.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(photo.date, 'd MMM yyyy', { locale: es })}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhoto(photo);
                          setCurrentImageIndex(index);
                        }}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                    {photo.tags.slice(0, 2).map((tag, i) => (
                      <Chip 
                        key={i} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchTerm(tag);
                        }}
                      />
                    ))}
                    {photo.tags.length > 2 && (
                      <Chip 
                        label={`+${photo.tags.length - 2}`} 
                        size="small" 
                        variant="outlined"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Vista de lista
        <Paper variant="outlined">
          <Box p={2}>
            {filteredPhotos.map((photo, index) => (
              <Box 
                key={photo.id}
                display="flex"
                alignItems="center"
                p={2}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  cursor: 'pointer',
                  bgcolor: selectedPhotos.includes(photo.id) ? 'action.selected' : 'transparent',
                }}
                onClick={() => handlePhotoClick(photo, index)}
              >
                <Box 
                  sx={{ 
                    width: 100, 
                    height: 60, 
                    borderRadius: 1, 
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                  {photo.featured && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        bgcolor: 'warning.main',
                        color: 'warning.contrastText',
                        px: 0.5,
                        borderRadius: 0.5,
                        fontSize: 10,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <StarIcon sx={{ fontSize: 12 }} />
                    </Box>
                  )}
                </Box>
                <Box ml={2} flexGrow={1} minWidth={0}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="subtitle1" noWrap>
                      {photo.title}
                    </Typography>
                    {photo.featured && <StarIcon color="warning" fontSize="small" />}
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
                    <Chip 
                      label={photo.category} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(photo.category);
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {format(photo.date, 'd MMM yyyy', { locale: es })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {photo.dimensions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {photo.size}
                    </Typography>
                  </Box>
                  <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                    {photo.tags.map((tag, i) => (
                      <Chip 
                        key={i} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchTerm(tag);
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" ml={2}>
                  <Checkbox
                    checked={selectedPhotos.includes(photo.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPhoto(photo.id, e as any);
                    }}
                    sx={{ mr: 1 }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Acción de menú
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Vista previa de foto */}
      <Dialog
        open={!!selectedPhoto}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            height: '90vh',
            overflow: 'hidden',
          },
        }}
      >
        {selectedPhoto && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{selectedPhoto.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(selectedPhoto.date, 'd MMMM yyyy', { locale: es })}
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={handleClosePreview}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Box 
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'black',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'calc(90vh - 150px)',
                    objectFit: 'contain',
                  }}
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)',
                    },
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)',
                    },
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Box>
              <Box p={2} sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip 
                      label={selectedPhoto.category} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                    />
                    {selectedPhoto.featured && (
                      <Chip 
                        icon={<StarIcon />} 
                        label="Destacada" 
                        size="small" 
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Box display="flex" gap={1}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<DownloadIcon />}
                    >
                      Descargar
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<ShareIcon />}
                    >
                      Compartir
                    </Button>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedPhoto.dimensions} • {selectedPhoto.size}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                  {selectedPhoto.tags.map((tag: string, i: number) => (
                    <Chip 
                      key={i} 
                      label={tag} 
                      size="small" 
                      variant="outlined"
                      onClick={() => setSearchTerm(tag)}
                    />
                  ))}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Diálogo de carga de fotos */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadClose} maxWidth="sm" fullWidth>
        <DialogTitle>Subir Fotos</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              mb: 2,
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <CloudUploadIcon fontSize="large" color="action" sx={{ mb: 1 }} />
            <Typography variant="h6">Arrastra y suelta tus fotos aquí</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              o haz clic para seleccionar archivos
            </Typography>
            <Button variant="contained" component="label">
              Seleccionar archivos
              <input type="file" hidden multiple accept="image/*" />
            </Button>
          </Box>
          {isUploading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Subiendo archivos...
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" display="block" textAlign="right" mt={0.5}>
                {uploadProgress}%
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleUploadClose} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleUpload} 
            variant="contained" 
            disabled={isUploading}
            startIcon={<CloudUploadIcon />}
          >
            {isUploading ? 'Subiendo...' : 'Subir Fotos'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Fotos;