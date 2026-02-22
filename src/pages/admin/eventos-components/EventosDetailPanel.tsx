import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Chip, Avatar, Button, CircularProgress, Skeleton, Dialog, IconButton } from '@mui/material';
import { Event as EventIcon, Image as ImageIcon, Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import type { Event, Photo } from '../../../types/api';
import { archiveService } from '../../../services/api/archive';

interface EventosDetailPanelProps {
  event: Event | null;
  getStatusLabel: (statusId?: string) => string;
  getStatusColor: (statusId?: string) => string;
  fotos?: Photo[];
  onAddPhotoClick?: () => void;
}

const EventosDetailPanel: React.FC<EventosDetailPanelProps> = ({
  event,
  getStatusLabel,
  getStatusColor,
  fotos,
  onAddPhotoClick,
}) => {
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  // Load image URLs when photos change
  useEffect(() => {
    const loadImageUrls = async () => {
      if (!fotos || fotos.length === 0) {
        setImageUrls(new Map());
        return;
      }

      setLoadingImages(true);
      const urlMap = new Map<string, string>();

      try {
        await Promise.all(
          fotos.map(async (foto) => {
            try {
              const response = await archiveService.getSignedUrl(foto.id_archive, 3600);
              urlMap.set(foto.id, response.data.signed_url);
            } catch (error) {
              console.error(`Error loading image for foto ${foto.id}:`, error);
            }
          })
        );
        setImageUrls(urlMap);
      } catch (error) {
        console.error('Error loading image URLs:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    loadImageUrls();
  }, [fotos]);
  if (!event) {
    return (
      <Card
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          bgcolor: '#f8f9fa',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <EventIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Selecciona un evento para ver detalles
          </Typography>
        </Box>
      </Card>
    );
  }

  const statusColor = getStatusColor(event.status_id);

  return (
    <>
    <Card
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
      }}
    >
      {/* Header Gradient */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${statusColor === '#3b82f6' ? '#3b82f6' : statusColor === '#ef4444' ? '#ef4444' : '#26C6DA'} 0%, ${statusColor === '#3b82f6' ? '#1e40af' : statusColor === '#ef4444' ? '#dc2626' : '#00BCD4'} 100%)`,
          p: 3,
          color: 'white',
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'rgba(255,255,255,0.3)',
            color: 'white',
            width: 56,
            height: 56,
            flexShrink: 0,
          }}
        >
          <EventIcon />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {event.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={getStatusLabel(event.status_id)}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.3)',
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-label': {
                  px: 1.5,
                },
              }}
            />
            {event.created_at && (
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                📅 {new Date(event.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Fotos Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon sx={{ fontSize: 18, color: '#26C6DA' }} />
              <Typography
                variant="overline"
                sx={{
                  color: '#1e293b',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  fontSize: '11px',
                }}
              >
                Fotos del Evento ({fotos?.length || 0})
              </Typography>
            </Box>
            {onAddPhotoClick && (
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAddPhotoClick}
                sx={{
                  textTransform: 'none',
                  fontSize: '12px',
                  background: 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)',
                  color: 'white',
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(38, 198, 218, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
                    boxShadow: '0 3px 6px rgba(38, 198, 218, 0.4)',
                  },
                }}
              >
                Agregar
              </Button>
            )}
          </Box>
          
          {fotos && fotos.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 1.5 }}>
              {fotos.map((foto) => (
                <Box
                  key={foto.id}
                  onClick={() => {
                    const url = imageUrls.get(foto.id);
                    if (url) {
                      setSelectedImage({ url, title: foto.title });
                    }
                  }}
                  sx={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '2px solid #e2e8f0',
                    bgcolor: '#f8fafc',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    cursor: imageUrls.has(foto.id) ? 'pointer' : 'default',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                      borderColor: '#26C6DA',
                    },
                  }}
                >
                  {loadingImages ? (
                    <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                  ) : imageUrls.has(foto.id) ? (
                    <>
                      <Box
                        component="img"
                        src={imageUrls.get(foto.id)}
                        alt={foto.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '10px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {foto.title}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f1f5f9',
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 32, color: '#cbd5e1' }} />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                bgcolor: '#f8fafc',
                borderRadius: 2,
                border: '2px dashed #cbd5e1',
                textAlign: 'center',
              }}
            >
              <ImageIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                No hay fotos asociadas
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '10px' }}>
                Haz clic en "Agregar" para subir fotos
              </Typography>
            </Box>
          )}
        </Box>

        {/* Description */}
        {event.description && (
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: '#1e293b',
                fontWeight: 700,
                letterSpacing: '0.05em',
                fontSize: '11px',
                display: 'block',
                mb: 1,
              }}
            >
              Descripción
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: '13px',
                color: '#475569',
                lineHeight: 1.6,
                bgcolor: '#f8fafc',
                p: 2,
                borderRadius: 1.5,
                border: '1px solid #e2e8f0',
              }}
            >
              {event.description}
            </Typography>
          </Box>
        )}

        {/* ID */}
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: '#1e293b',
              fontWeight: 700,
              letterSpacing: '0.05em',
              fontSize: '11px',
              display: 'block',
              mb: 1,
            }}
          >
            ID del Evento
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              fontSize: '12px',
              bgcolor: '#f1f5f9',
              p: 1.5,
              borderRadius: 1,
              display: 'block',
              wordBreak: 'break-all',
              color: '#475569',
              fontWeight: 500,
            }}
          >
            {event.id}
          </Typography>
        </Box>
      </Box>
    </Card>

    {/* Image Lightbox Modal */}
    <Dialog
      open={!!selectedImage}
      onClose={() => setSelectedImage(null)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.95)',
          boxShadow: 'none',
          maxHeight: '90vh',
        },
      }}
    >
      <Box sx={{ position: 'relative', p: 2 }}>
        <IconButton
          onClick={() => setSelectedImage(null)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        
        {selectedImage && (
          <Box sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              src={selectedImage.url}
              alt={selectedImage.title}
              sx={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                mt: 2,
                fontWeight: 500,
              }}
            >
              {selectedImage.title}
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
    </>
  );
};

export default EventosDetailPanel;
