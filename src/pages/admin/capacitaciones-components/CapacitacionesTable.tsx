import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  OpenInNew as OpenInNewIcon,
  PlayCircleOutline as PlayIcon,
} from '@mui/icons-material';
import type { Training } from '../../../types/api';

interface CapacitacionesTableProps {
  trainings: Training[];
  loading: boolean;
  onPlay: (training: Training) => void;
  onEdit: (training: Training) => void;
  onDelete: (training: Training) => void;
}

const CapacitacionesTable: React.FC<CapacitacionesTableProps> = ({
  trainings,
  loading,
  onPlay,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (trainings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="body1" color="text.secondary">
          No hay capacitaciones para mostrar
        </Typography>
      </Box>
    );
  }

  return (
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
      {trainings.map((training) => (
        <Card
          key={training.id}
          sx={{
            borderRadius: 3,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 8,
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              pt: '56.25%',
            }}
          >
            <Box
              onClick={() => onPlay(training)}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 64,
                height: 64,
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <PlayIcon fontSize="large" />
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.75)',
                color: 'white',
                px: 1,
                borderRadius: 1,
                fontSize: '0.75rem',
              }}
            >
              {training.tiempo || '00:00'}
            </Box>

            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: 'primary.main',
                color: 'white',
                px: 1,
                borderRadius: 1,
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              {training.target_audience || 'General'}
            </Box>
          </Box>

          <CardContent>
            <Typography variant="subtitle1" component="h3" gutterBottom noWrap>
              {training.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
              {training.description || 'Sin descripción'}
            </Typography>

            <LinearProgress variant="determinate" value={100} sx={{ mt: 2, mb: 1, height: 6, borderRadius: 3 }} />

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Chip label="Disponible" color="success" size="small" variant="outlined" />

              <Box>
                {training.url && (
                  <IconButton
                    size="small"
                    color="primary"
                    title="Abrir enlace"
                    onClick={() => window.open(training.url, '_blank', 'noopener,noreferrer')}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                )}

                <IconButton size="small" color="primary" title="Editar" onClick={() => onEdit(training)}>
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton size="small" color="error" title="Eliminar" onClick={() => onDelete(training)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Button
              variant="text"
              size="small"
              sx={{ mt: 1, textTransform: 'none' }}
              onClick={() => onPlay(training)}
              startIcon={<PlayIcon />}
            >
              Reproducir
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CapacitacionesTable;
