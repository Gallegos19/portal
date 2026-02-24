import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import type { Photo, SuccessStory } from '../../types/api';
import { successStoryService } from '../../services/api/successStory';
import { archiveService } from '../../services/api/archive';
import { photoService } from '../../services/api/photo';
import { useToast } from '../../hooks/useToast';
import { useAuthStore } from '../../store/authStore';

interface StoryFormValues {
  title: string;
  description: string;
  imageFile: File | null;
}

const emptyFormValues: StoryFormValues = {
  title: '',
  description: '',
  imageFile: null,
};

const HistoriasExito: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuthStore();

  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [createValues, setCreateValues] = useState<StoryFormValues>(emptyFormValues);
  const [editValues, setEditValues] = useState<StoryFormValues>(emptyFormValues);
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  const loadImageUrls = useCallback(async (storiesToLoad: SuccessStory[]) => {
    const nextMap = new Map<string, string>();

    await Promise.all(
      storiesToLoad.map(async (story) => {
        const archiveIdFromRelation = story.foto?.id_archive;

        if (archiveIdFromRelation) {
          try {
            const relationSignedUrlResponse = await archiveService.getSignedUrl(archiveIdFromRelation, 3600);
            nextMap.set(story.id, relationSignedUrlResponse.data.signed_url);
            return;
          } catch (error) {
            console.error(`Error obteniendo imagen por foto relacionada en historia ${story.id}:`, error);
          }
        }

        if (!story.id_photo) return;

        try {
          const photoResponse = await photoService.getById(story.id_photo);
          const archiveId = photoResponse.data?.id_archive;

          if (archiveId) {
            const response = await archiveService.getSignedUrl(archiveId, 3600);
            nextMap.set(story.id, response.data.signed_url);
            return;
          }
        } catch {
          try {
            const fallbackResponse = await archiveService.getSignedUrl(story.id_photo, 3600);
            nextMap.set(story.id, fallbackResponse.data.signed_url);
          } catch (fallbackError) {
            console.error(`Error obteniendo imagen de historia ${story.id}:`, fallbackError);
          }
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
    } catch (error) {
      console.error('Error cargando historias de éxito:', error);
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
        story.title.toLowerCase().includes(search) ||
        (story.description || '').toLowerCase().includes(search)
      );
    });
  }, [stories, searchTerm]);

  const paginatedStories = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredStories.slice(start, start + rowsPerPage);
  }, [filteredStories, page, rowsPerPage]);

  const resetCreateDialog = () => {
    setCreateValues(emptyFormValues);
    setShowCreateDialog(false);
  };

  const resetEditDialog = () => {
    setEditValues(emptyFormValues);
    setSelectedStory(null);
    setShowEditDialog(false);
  };

  const handleCreate = async () => {
    if (!createValues.title.trim()) {
      showToast('Ingresa el título de la historia.', 'warning');
      return;
    }

    if (!user?.id) {
      showToast('No se pudo identificar al usuario. Inicia sesión nuevamente.', 'error');
      return;
    }

    try {
      setSubmitting(true);

      let idPhoto: string | undefined;

      if (createValues.imageFile) {
        const archiveResponse = await archiveService.uploadFile(
          createValues.imageFile,
          user.id,
          createValues.imageFile.type || 'image/jpeg',
          'historias-exito'
        );

        const photoResponse = await photoService.create({
          title: createValues.title.trim(),
          description: createValues.description.trim() || undefined,
          id_archive: archiveResponse.data.id,
        } as Omit<Photo, 'id'>);

        idPhoto = photoResponse.data.id;
      }

      await successStoryService.create({
        title: createValues.title.trim(),
        description: createValues.description.trim() || undefined,
        id_photo: idPhoto,
        created_by: user.id,
      } as Omit<SuccessStory, 'id'>);

      showToast('Historia de éxito creada exitosamente', 'success');
      resetCreateDialog();
      await loadStories();
    } catch (error) {
      console.error('Error creando historia de éxito:', error);
      showToast('No se pudo crear la historia de éxito.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (story: SuccessStory) => {
    setSelectedStory(story);
    setEditValues({
      title: story.title || '',
      description: story.description || '',
      imageFile: null,
    });
    setShowEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!selectedStory) return;

    if (!editValues.title.trim()) {
      showToast('Ingresa el título de la historia.', 'warning');
      return;
    }

    if (!user?.id) {
      showToast('No se pudo identificar al usuario. Inicia sesión nuevamente.', 'error');
      return;
    }

    try {
      setSubmitting(true);

      let nextPhotoId = selectedStory.id_photo;

      if (editValues.imageFile) {
        const archiveResponse = await archiveService.uploadFile(
          editValues.imageFile,
          user.id,
          editValues.imageFile.type || 'image/jpeg',
          'historias-exito'
        );

        const photoResponse = await photoService.create({
          title: editValues.title.trim(),
          description: editValues.description.trim() || undefined,
          id_archive: archiveResponse.data.id,
        } as Omit<Photo, 'id'>);

        nextPhotoId = photoResponse.data.id;
      }

      await successStoryService.updateById(selectedStory.id, {
        title: editValues.title.trim(),
        description: editValues.description.trim() || undefined,
        id_photo: nextPhotoId,
      });

      showToast('Historia de éxito actualizada exitosamente', 'success');
      resetEditDialog();
      await loadStories();
    } catch (error) {
      console.error('Error actualizando historia de éxito:', error);
      showToast('No se pudo actualizar la historia de éxito.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (story: SuccessStory) => {
    setSelectedStory(story);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedStory) return;

    try {
      setDeleting(true);
      await successStoryService.deleteById(selectedStory.id);
      showToast('Historia de éxito eliminada exitosamente', 'success');
      setShowDeleteDialog(false);
      setSelectedStory(null);
      await loadStories();
    } catch (error) {
      console.error('Error eliminando historia de éxito:', error);
      showToast('No se pudo eliminar la historia de éxito.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Historias de Éxito
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administra las historias de éxito publicadas en la plataforma
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateDialog(true)}>
          Nueva Historia
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por título o descripción"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Card>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Título</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Imagen</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Creado</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 140 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedStories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        No hay historias para mostrar.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedStories.map((story) => (
                      <TableRow key={story.id} hover>
                        <TableCell sx={{ maxWidth: 220 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {story.title}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 320 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {story.description || 'Sin descripción'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {imageUrls.get(story.id) ? (
                            <CardMedia
                              component="img"
                              image={imageUrls.get(story.id)!}
                              alt={story.title}
                              sx={{ width: 72, height: 48, borderRadius: 1, objectFit: 'cover' }}
                            />
                          ) : (
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                              <ImageIcon fontSize="small" />
                              <Typography variant="caption">Sin imagen</Typography>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {story.created_at
                              ? new Date(story.created_at).toLocaleDateString('es-MX')
                              : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(story)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleOpenDelete(story)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredStories.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Filas por página"
            />
          </>
        )}
      </Card>

      <Dialog open={showCreateDialog} onClose={() => !submitting && resetCreateDialog()} fullWidth maxWidth="sm">
        <DialogTitle>
          Nueva Historia de Éxito
          <IconButton
            aria-label="close"
            onClick={resetCreateDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            disabled={submitting}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Título"
              value={createValues.title}
              onChange={(event) => setCreateValues((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              required
            />

            <TextField
              label="Descripción"
              value={createValues.description}
              onChange={(event) =>
                setCreateValues((prev) => ({ ...prev, description: event.target.value }))
              }
              fullWidth
              multiline
              minRows={3}
            />

            <Button variant="outlined" component="label" startIcon={<ImageIcon />}>
              {createValues.imageFile ? createValues.imageFile.name : 'Seleccionar imagen'}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setCreateValues((prev) => ({ ...prev, imageFile: file }));
                }}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetCreateDialog} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} variant="contained" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditDialog} onClose={() => !submitting && resetEditDialog()} fullWidth maxWidth="sm">
        <DialogTitle>
          Editar Historia de Éxito
          <IconButton
            aria-label="close"
            onClick={resetEditDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            disabled={submitting}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Título"
              value={editValues.title}
              onChange={(event) => setEditValues((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              required
            />

            <TextField
              label="Descripción"
              value={editValues.description}
              onChange={(event) => setEditValues((prev) => ({ ...prev, description: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />

            <Button variant="outlined" component="label" startIcon={<ImageIcon />}>
              {editValues.imageFile ? editValues.imageFile.name : 'Reemplazar imagen (opcional)'}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setEditValues((prev) => ({ ...prev, imageFile: file }));
                }}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetEditDialog} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleUpdate} variant="contained" disabled={submitting}>
            {submitting ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => !deleting && setShowDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar Historia</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            ¿Seguro que deseas eliminar la historia <strong>{selectedStory?.title || ''}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowDeleteDialog(false);
              setSelectedStory(null);
            }}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistoriasExito;
