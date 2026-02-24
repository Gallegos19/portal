import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Container, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { Training } from '../../types/api';
import { trainingService } from '../../services/api/training';
import { useToast } from '../../hooks/useToast';
import {
  CapacitacionesDeleteDialog,
  CapacitacionesFilters,
  CapacitacionesFormDialog,
  CapacitacionesStats,
  CapacitacionesTable,
  CapacitacionesVideoModal,
  type TrainingFormValues,
} from './capacitaciones-components';

const extractYouTubeVideoId = (input: string): string | null => {
  const value = input.trim();
  if (!value) return null;

  const idPattern = /^[a-zA-Z0-9_-]{11}$/;
  if (idPattern.test(value)) {
    return value;
  }

  if (value.includes('v=')) {
    return value.split('v=')[1]?.split('&')[0] || null;
  }

  if (value.includes('youtu.be/')) {
    return value.split('youtu.be/')[1]?.split('?')[0] || null;
  }

  if (value.includes('/embed/')) {
    return value.split('/embed/')[1]?.split('?')[0] || null;
  }

  return null;
};

const emptyFormValues: TrainingFormValues = {
  title: '',
  description: '',
  url: '',
  tiempo: '00:30',
  target_audience: 'Becario',
};

const Capacitaciones: React.FC = () => {
  const { showToast } = useToast();

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('Todos');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [videoToPlay, setVideoToPlay] = useState<{ title: string; videoId: string } | null>(null);

  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

  const loadTrainings = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await trainingService.getAll();
      setTrainings(response.data || []);
    } catch (error) {
      console.error('Error cargando capacitaciones:', error);
      setErrorMessage('No se pudieron cargar las capacitaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  const filteredTrainings = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return trainings.filter((training) => {
      const audience = training.target_audience || 'Becario';

      const matchesSearch =
        !search ||
        training.title.toLowerCase().includes(search) ||
        (training.description || '').toLowerCase().includes(search) ||
        (training.url || '').toLowerCase().includes(search);

      const matchesAudience =
        audienceFilter === 'Todos' || audience === audienceFilter || audience === 'Ambos';

      return matchesSearch && matchesAudience;
    });
  }, [trainings, searchTerm, audienceFilter]);

  const handleCreate = async (values: TrainingFormValues) => {
    try {
      setSubmitting(true);

      await trainingService.create({
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        url: values.url.trim(),
        tiempo: values.tiempo,
        target_audience: values.target_audience,
      } as Omit<Training, 'id'>);

      showToast('Capacitación creada exitosamente', 'success');
      setShowCreateDialog(false);
      await loadTrainings();
    } catch (error) {
      console.error('Error creando capacitación:', error);
      showToast('No se pudo crear la capacitación.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (training: Training) => {
    setSelectedTraining(training);
    setShowEditDialog(true);
  };

  const handleUpdate = async (values: TrainingFormValues) => {
    if (!selectedTraining) return;

    try {
      setSubmitting(true);

      await trainingService.updateById(selectedTraining.id, {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        url: values.url.trim(),
        tiempo: values.tiempo,
        target_audience: values.target_audience,
      });

      showToast('Capacitación actualizada exitosamente', 'success');
      setShowEditDialog(false);
      setSelectedTraining(null);
      await loadTrainings();
    } catch (error) {
      console.error('Error actualizando capacitación:', error);
      showToast('No se pudo actualizar la capacitación.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (training: Training) => {
    setSelectedTraining(training);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedTraining) return;

    try {
      setDeleting(true);
      await trainingService.deleteById(selectedTraining.id);
      showToast('Capacitación eliminada exitosamente', 'success');
      setShowDeleteDialog(false);
      setSelectedTraining(null);
      await loadTrainings();
    } catch (error) {
      console.error('Error eliminando capacitación:', error);
      showToast('No se pudo eliminar la capacitación.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const editInitialValues: TrainingFormValues = selectedTraining
    ? {
        title: selectedTraining.title || '',
        description: selectedTraining.description || '',
        url: selectedTraining.url || '',
        tiempo: selectedTraining.tiempo || '00:30',
        target_audience: selectedTraining.target_audience || 'Becario',
      }
    : emptyFormValues;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Capacitaciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administra las capacitaciones disponibles para la plataforma
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateDialog(true)}>
          Nueva Capacitación
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <CapacitacionesFilters
        searchTerm={searchTerm}
        audienceFilter={audienceFilter}
        onSearchChange={(value) => {
          setSearchTerm(value);
        }}
        onAudienceFilterChange={(value) => {
          setAudienceFilter(value);
        }}
      />

      <CapacitacionesStats trainings={filteredTrainings} />

      <CapacitacionesTable
        trainings={filteredTrainings}
        loading={loading}
        onPlay={(training) => {
          const rawUrl = training.url || '';
          console.log('URL de capacitación:', rawUrl);
          const parsedVideoId = extractYouTubeVideoId(rawUrl) || 'dQw4w9WgXcQ';

          setVideoToPlay({ title: training.title, videoId: parsedVideoId });
          setOpenVideoModal(true);
        }}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <CapacitacionesVideoModal
        open={openVideoModal}
        title={videoToPlay?.title || ''}
        videoId={videoToPlay?.videoId || 'dQw4w9WgXcQ'}
        onClose={() => {
          setOpenVideoModal(false);
          setVideoToPlay(null);
        }}
      />

      <CapacitacionesFormDialog
        open={showCreateDialog}
        title="Nueva Capacitación"
        initialValues={emptyFormValues}
        submitting={submitting}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreate}
      />

      <CapacitacionesFormDialog
        open={showEditDialog}
        title="Editar Capacitación"
        initialValues={editInitialValues}
        submitting={submitting}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedTraining(null);
        }}
        onSubmit={handleUpdate}
      />

      <CapacitacionesDeleteDialog
        open={showDeleteDialog}
        title={selectedTraining?.title}
        deleting={deleting}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedTraining(null);
        }}
        onConfirm={handleDelete}
      />
    </Container>
  );
};

export default Capacitaciones;
