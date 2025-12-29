import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  useTheme,
  CardActionArea,
  CardActions,
  Chip,
  Divider,
  Avatar,
  Stack,
  Paper,
  Modal,
  IconButton,
  Fade,
  Backdrop,
  useMediaQuery
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StoryImage = styled(CardMedia)({
  height: 200,
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
});

const StoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
  display: 'inline',
  lineHeight: 1.4,
  boxShadow: theme.palette.mode === 'dark' 
    ? `8px 0 0 ${theme.palette.background.paper}, -8px 0 0 ${theme.palette.background.paper}` 
    : `8px 0 0 #fff, -8px 0 0 #fff`,
  boxDecorationBreak: 'clone',
  padding: '0 4px',
  position: 'relative',
  zIndex: 1,
}));

// Interfaz para el tipo de historia
interface SuccessStory {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  tags?: string[];
  socialShares?: {
    facebook: number;
    twitter: number;
    linkedin: number;
  };
}

const HistoriasExito: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (story: SuccessStory) => {
    setSelectedStory(story);
    setOpen(true);
    // Desplazamiento suave al principio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClose = () => {
    setOpen(false);
    // Pequeño retraso para permitir la animación de cierre
    setTimeout(() => setSelectedStory(null), 300);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = selectedStory?.title || '';
    const text = selectedStory?.excerpt || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`,
    };

    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // Aquí podrías agregar un snackbar o toast para confirmar que se copió el enlace
  };

  const successStories: SuccessStory[] = [
    {
      id: 1,
      title: 'Mi experiencia en el programa',
      author: 'María González',
      date: '2024-01-15',
      excerpt: 'Gracias al programa Kuxtal he podido desarrollar habilidades de liderazgo...',
      content: 'Mi experiencia en el programa Kuxtal ha sido verdaderamente transformadora. Cuando comencé, no tenía idea de las habilidades que podía desarrollar. A lo largo del programa, no solo he mejorado mis capacidades de liderazgo, sino que también he aprendido a trabajar en equipo de manera efectiva y a comunicar mis ideas con claridad.\n\nEl apoyo de los mentores ha sido fundamental en mi crecimiento personal y profesional. Las sesiones prácticas me han permitido aplicar lo aprendido en situaciones reales, lo que ha sido invaluable para mi desarrollo.\n\nRecomiendo ampliamente este programa a cualquiera que busque crecer y desarrollarse tanto personal como profesionalmente.',
      image: '/placeholder-story.jpg',
      tags: ['Liderazgo', 'Desarrollo personal', 'Éxito'],
      socialShares: {
        facebook: 24,
        twitter: 15,
        linkedin: 8
      }
    },
    {
      id: 2,
      title: 'Transformando mi comunidad',
      author: 'Carlos Mendoza',
      date: '2024-01-10',
      excerpt: 'El impacto del programa en mi comunidad ha sido increíble...',
      content: 'Transformar mi comunidad siempre fue mi sueño, pero no sabía por dónde empezar. Gracias al programa Kuxtal, he adquirido las herramientas y la confianza necesarias para liderar proyectos de impacto social.\n\nHemos logrado implementar iniciativas de limpieza, talleres educativos y programas de reciclaje que han mejorado significativamente la calidad de vida en nuestro barrio. La metodología aprendida en el programa me ha permitido involucrar a más miembros de la comunidad y crear un cambio duradero.\n\nLo más valioso ha sido ver cómo estas acciones han inspirado a otros a sumarse y convertirse en agentes de cambio en sus propias comunidades.',
      image: '/placeholder-story.jpg',
      tags: ['Impacto social', 'Comunidad', 'Sostenibilidad'],
      socialShares: {
        facebook: 42,
        twitter: 28,
        linkedin: 15
      }
    },
    {
      id: 3,
      title: 'Nuevas oportunidades',
      author: 'Ana Rodríguez',
      date: '2024-01-05',
      excerpt: 'Las capacitaciones me han abierto puertas que nunca imaginé...',
      content: 'Antes de unirme al programa Kuxtal, me sentía estancado profesionalmente. Las capacitaciones no solo me brindaron conocimientos técnicos valiosos, sino que también me ayudaron a desarrollar una mentalidad de crecimiento.\n\nGracias a las habilidades adquiridas, pude postularme a un puesto mejor remunerado y fui seleccionado entre más de 50 candidatos. Mi jefe ha destacado mi capacidad para resolver problemas y trabajar en equipo, habilidades que perfeccioné durante el programa.\n\nAhora, con más confianza en mí mismo, estoy considerando emprender mi propio negocio, algo que nunca antes me había atrevido a soñar.',
      image: '/placeholder-story.jpg',
      tags: ['Crecimiento profesional', 'Oportunidades', 'Empleabilidad'],
      socialShares: {
        facebook: 36,
        twitter: 19,
        linkedin: 22
      }
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" color="text.primary" gutterBottom>
          Historias de Éxito
        </Typography>
        <Divider />
      </Box>

      {/* Historias destacadas */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {successStories.map((story) => (
          <Grid item xs={12} sm={6} lg={4} key={story.id}>
            <StyledCard sx={{ cursor: 'pointer' }}>
              <CardActionArea 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(story);
                }}
              >
                <StoryImage
                  image={story.image}
                  title={story.title}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 2,
                    color: 'white',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${story.image})`,
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
                    <StoryTitle variant="h6" color="white">
                      {story.title}
                    </StoryTitle>
                  </Box>
                </StoryImage>
              </CardActionArea>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    icon={<PersonIcon fontSize="small" />}
                    label={story.author}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<CalendarIcon fontSize="small" />}
                    label={new Date(story.date).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {story.excerpt}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ ml: 'auto' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen(story);
                  }}
                >
                  Leer más
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Sección para compartir historia */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)' 
            : 'linear-gradient(145deg, #f5f7ff 0%, #f0f4ff 100%)',
        }}
      >
        <Box maxWidth="md" mx="auto" textAlign="center">
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Comparte tu historia
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3, maxWidth: '700px', mx: 'auto' }}>
            ¿Tienes una historia de éxito que compartir? Nos encantaría conocer tu experiencia
            y cómo el programa Kuxtal ha impactado tu vida.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            startIcon={<ShareIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 20px 0 rgba(0, 118, 255, 0.23)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Compartir mi historia
          </Button>
        </Box>
      </Paper>

      {/* Modal de Detalles de la Historia */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: isMobile ? 2 : 4,
          overflowY: 'auto',
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        <Fade in={open}>
          <Paper
            elevation={24}
            sx={{
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 2,
              bgcolor: 'background.paper',
              position: 'relative',
              '&:focus-visible': {
                outline: 'none',
              },
            }}
          >
            {selectedStory && (
              <>
                {/* Header del Modal */}
                <Box
                  sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    bgcolor: 'background.paper',
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h5" component="h2">
                    {selectedStory.title}
                  </Typography>
                  <IconButton
                    onClick={handleClose}
                    size="large"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Contenido del Modal */}
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                  {/* Imagen de portada */}
                  <Box
                    sx={{
                      height: { xs: '200px', md: '400px' },
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative',
                      mb: 4,
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage: `url(${selectedStory.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        p: 3,
                      }}
                    >
                      <Box>
                        <Typography variant="h3" component="h1" color="white" gutterBottom>
                          {selectedStory.title}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1, color: 'white' }} />
                            <Typography variant="subtitle1" color="white">
                              {selectedStory.author}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon sx={{ mr: 1, color: 'white' }} />
                            <Typography variant="body2" color="white">
                              {new Date(selectedStory.date).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>

                  {/* Contenido principal */}
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: 1.8 }}>
                          {selectedStory.content}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          Impacto logrado
                        </Typography>
                        <Typography variant="body1" paragraph>
                          Gracias a esta experiencia, he podido crecer personal y profesionalmente, adquiriendo habilidades que seguiré utilizando en mi vida diaria y en futuros proyectos.
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50', mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          Comparte esta historia
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <IconButton
                            onClick={() => handleShare('facebook')}
                            sx={{
                              bgcolor: '#3b5998',
                              color: 'white',
                              '&:hover': { bgcolor: '#344e86' },
                            }}
                          >
                            <FacebookIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleShare('twitter')}
                            sx={{
                              bgcolor: '#1DA1F2',
                              color: 'white',
                              '&:hover': { bgcolor: '#1991da' },
                            }}
                          >
                            <TwitterIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleShare('linkedin')}
                            sx={{
                              bgcolor: '#0077B5',
                              color: 'white',
                              '&:hover': { bgcolor: '#00669b' },
                            }}
                          >
                            <LinkedInIcon />
                          </IconButton>
                          <IconButton
                            onClick={handleCopyLink}
                            sx={{
                              bgcolor: 'grey.300',
                              color: 'text.primary',
                              '&:hover': { bgcolor: 'grey.400' },
                            }}
                          >
                            <LinkIcon />
                          </IconButton>
                        </Stack>
                        {selectedStory.socialShares && (
                          <Typography variant="caption" color="text.secondary">
                            Compartido {selectedStory.socialShares.facebook + selectedStory.socialShares.twitter + selectedStory.socialShares.linkedin} veces
                          </Typography>
                        )}
                      </Paper>

                      {selectedStory.tags && selectedStory.tags.length > 0 && (
                        <Box>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                            Etiquetas
                          </Typography>
                          <Stack direction="row" flexWrap="wrap" gap={1}>
                            {selectedStory.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderRadius: 1,
                                  bgcolor: 'action.selected',
                                  borderColor: 'divider',
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Box>

                {/* Footer del Modal */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    bgcolor: 'background.default',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 10,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      startIcon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />}
                      onClick={handleClose}
                      sx={{ textTransform: 'none' }}
                    >
                      Volver al listado
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ShareIcon />}
                      onClick={() => handleShare('facebook')}
                      sx={{ textTransform: 'none' }}
                    >
                      Compartir historia
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Fade>
      </Modal>
    </Container>
  );
};

export default HistoriasExito;