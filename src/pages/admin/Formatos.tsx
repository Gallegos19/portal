import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import type { SelectChangeEvent } from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import type { Format } from '../../types/api';
import { archiveService } from '../../services/api/archive';
import { formatService } from '../../services/api/format';
import { useToast } from '../../hooks/useToast';
import { useAuthStore } from '../../store/authStore';

type RolDestino = 'Becario' | 'Personal' | 'Ambos';

interface FormularioSubida {
  tipoFormato: string;
  rolDestino: RolDestino;
  archivo: File | null;
}

interface FormularioEdicion {
  tipoFormato: string;
  rolDestino: RolDestino;
}

const initialFormState: FormularioSubida = {
  tipoFormato: '',
  rolDestino: 'Becario',
  archivo: null,
};

const initialEditState: FormularioEdicion = {
  tipoFormato: '',
  rolDestino: 'Becario',
};

interface FormatosProps {
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

const Formatos: React.FC<FormatosProps> = ({
  canCreate = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { showToast } = useToast();
  const { user } = useAuthStore();

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<FormularioSubida>(initialFormState);
  const [editData, setEditData] = useState<FormularioEdicion>(initialEditState);
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rolFiltro, setRolFiltro] = useState<'Todos' | RolDestino>('Todos');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formats, setFormats] = useState<Format[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeDownloadId, setActiveDownloadId] = useState<string | null>(null);
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);

  const loadFormats = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await formatService.getAll();
      setFormats(response.data || []);
    } catch (error) {
      console.error('Error cargando formatos:', error);
      setErrorMessage('No se pudieron cargar los formatos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFormats();
  }, []);

  const handleOpenModal = () => {
    setFormData(initialFormState);
    setUploadProgress(0);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setOpenModal(false);
    setFormData(initialFormState);
    setUploadProgress(0);
  };

  const toRolDestino = (value?: string): RolDestino => {
    if (value === 'Personal' || value === 'Ambos') return value;
    return 'Becario';
  };

  const handleOpenEditModal = (format: Format) => {
    if (!canEdit) return;

    setSelectedFormat(format);
    setEditData({
      tipoFormato: format.title,
      rolDestino: toRolDestino(format.description?.trim()),
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (updating) return;
    setOpenEditModal(false);
    setSelectedFormat(null);
    setEditData(initialEditState);
  };

  const handleOpenDeleteDialog = (format: Format) => {
    if (!canDelete) return;

    setSelectedFormat(format);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    if (activeDeleteId) return;
    setOpenDeleteDialog(false);
    setSelectedFormat(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    setFormData((prev) => ({
      ...prev,
      archivo: e.target.files![0],
    }));
  };

  const handleTipoFormatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      tipoFormato: e.target.value,
    }));
  };

  const handleRolDestinoChange = (e: SelectChangeEvent<RolDestino>) => {
    setFormData((prev) => ({
      ...prev,
      rolDestino: e.target.value as RolDestino,
    }));
  };

  const handleEditRolDestinoChange = (e: SelectChangeEvent<RolDestino>) => {
    setEditData((prev) => ({
      ...prev,
      rolDestino: e.target.value as RolDestino,
    }));
  };

  const handleRolFilterChange = (e: SelectChangeEvent<'Todos' | RolDestino>) => {
    setRolFiltro(e.target.value as 'Todos' | RolDestino);
    setPage(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      showToast('No se pudo identificar al usuario. Inicia sesión nuevamente.', 'error');
      return;
    }

    if (!formData.archivo) {
      showToast('Selecciona un archivo PDF antes de guardar.', 'warning');
      return;
    }

    if (!formData.tipoFormato.trim()) {
      showToast('Ingresa el nombre del formato.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const archiveResponse = await archiveService.uploadFile(
        formData.archivo,
        user.id,
        'application/pdf',
        'formatos',
        setUploadProgress
      );

      await formatService.create({
        title: formData.tipoFormato.trim(),
        description: formData.rolDestino,
        id_archive: archiveResponse.data.id,
      });

      showToast('Formato subido exitosamente', 'success');
      handleCloseModal();
      await loadFormats();
    } catch (error) {
      console.error('Error subiendo formato:', error);
      setErrorMessage('No se pudo subir el formato.');
      showToast('Error al subir el formato', 'error');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFormat) return;

    if (!editData.tipoFormato.trim()) {
      showToast('Ingresa el nombre del formato.', 'warning');
      return;
    }

    try {
      setUpdating(true);
      await formatService.updateById(selectedFormat.id, {
        title: editData.tipoFormato.trim(),
        description: editData.rolDestino,
      });

      showToast('Formato actualizado exitosamente', 'success');
      handleCloseEditModal();
      await loadFormats();
    } catch (error) {
      console.error('Error actualizando formato:', error);
      showToast('No se pudo actualizar el formato.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFormat) return;

    try {
      setActiveDeleteId(selectedFormat.id);
      await formatService.deleteById(selectedFormat.id);
      showToast('Formato eliminado exitosamente', 'success');
      handleCloseDeleteDialog();
      await loadFormats();
    } catch (error) {
      console.error('Error eliminando formato:', error);
      showToast('No se pudo eliminar el formato.', 'error');
    } finally {
      setActiveDeleteId(null);
    }
  };

  const filteredForms = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return formats.filter((format) => {
      const rol = (format.description?.trim() || 'Becario') as RolDestino;

      const matchesSearch =
        !search ||
        format.title.toLowerCase().includes(search) ||
        rol.toLowerCase().includes(search);

      const matchesRol = rolFiltro === 'Todos' || rol === rolFiltro || rol === 'Ambos';

      return matchesSearch && matchesRol;
    });
  }, [formats, searchTerm, rolFiltro]);

  const handleDownload = async (format: Format) => {
    if (!format.id_archive) {
      showToast('Este formato no tiene archivo asociado.', 'warning');
      return;
    }

    try {
      setActiveDownloadId(format.id);
      const response = await archiveService.getSignedUrl(format.id_archive);
      const signedUrl = response.data.signed_url;

      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = `${format.title}.pdf`;
      link.rel = 'noopener';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error descargando formato:', error);
      showToast('No se pudo descargar el formato.', 'error');
    } finally {
      setActiveDownloadId(null);
    }
  };

  const getRolChipColor = (rol: string): 'primary' | 'secondary' | 'default' => {
    if (rol === 'Becario') return 'primary';
    if (rol === 'Personal') return 'secondary';
    return 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Formatos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {canCreate
              ? 'Administra y descarga los formatos disponibles'
              : 'Consulta y descarga los formatos disponibles'}
          </Typography>
        </Box>
        {canCreate && (
          <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={handleOpenModal}>
            Subir Formato
          </Button>
        )}
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={3}>
        <TextField
          size="small"
          placeholder="Buscar formato..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 4, bgcolor: 'background.paper' },
          }}
          sx={{ width: 300 }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por rol</InputLabel>
          <Select
            value={rolFiltro}
            label="Filtrar por rol"
            onChange={handleRolFilterChange}
            sx={{ borderRadius: 4 }}
          >
            <MenuItem value="Todos">Todos los roles</MenuItem>
            <MenuItem value="Becario">Becario</MenuItem>
            <MenuItem value="Personal">Personal</MenuItem>
            <MenuItem value="Ambos">Ambos</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Dialog open={canCreate && openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Subir Nuevo Formato</Typography>
            <IconButton edge="end" onClick={handleCloseModal} disabled={submitting}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                name="tipoFormato"
                label="Nombre del formato"
                value={formData.tipoFormato}
                onChange={handleTipoFormatoChange}
                placeholder="Ej. Formato de Evaluación"
                required
              />

              <FormControl fullWidth size="small" margin="normal">
                <InputLabel id="rol-destino-label">Rol Destino</InputLabel>
                <Select
                  labelId="rol-destino-label"
                  name="rolDestino"
                  value={formData.rolDestino}
                  onChange={handleRolDestinoChange}
                  label="Rol Destino"
                  required
                >
                  <MenuItem value="Becario">Becario</MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Ambos">Ambos</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 1, mb: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  disabled={submitting}
                >
                  Subir Archivo (PDF)
                  <input type="file" hidden accept=".pdf,application/pdf" onChange={handleFileChange} required />
                </Button>
                {formData.archivo && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Archivo seleccionado: {formData.archivo.name}
                  </Typography>
                )}
              </Box>

              {submitting && uploadProgress > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Subiendo archivo: {uploadProgress}%
                  </Typography>
                  <Box sx={{ mt: 0.5, height: 6, borderRadius: 999, bgcolor: '#e2e8f0' }}>
                    <Box
                      sx={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        borderRadius: 999,
                        bgcolor: '#26C6DA',
                        transition: 'width 0.2s ease',
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseModal} color="inherit" disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={canEdit && openEditModal} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Editar Formato</Typography>
            <IconButton edge="end" onClick={handleCloseEditModal} disabled={updating}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleUpdate}>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Nombre del formato"
                value={editData.tipoFormato}
                onChange={(e) => setEditData((prev) => ({ ...prev, tipoFormato: e.target.value }))}
                required
              />

              <FormControl fullWidth size="small" margin="normal">
                <InputLabel id="edit-rol-destino-label">Rol Destino</InputLabel>
                <Select
                  labelId="edit-rol-destino-label"
                  value={editData.rolDestino}
                  onChange={handleEditRolDestinoChange}
                  label="Rol Destino"
                  required
                >
                  <MenuItem value="Becario">Becario</MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Ambos">Ambos</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseEditModal} color="inherit" disabled={updating}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={updating}>
              {updating ? <CircularProgress size={20} color="inherit" /> : 'Actualizar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={canDelete && openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar formato</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            ¿Seguro que deseas eliminar el formato{' '}
            <Typography component="span" fontWeight={600} color="text.primary">
              {selectedFormat?.title}
            </Typography>
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteDialog} color="inherit" disabled={!!activeDeleteId}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={!!activeDeleteId}>
            {activeDeleteId ? <CircularProgress size={20} color="inherit" /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper elevation={0} sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre del Formato</TableCell>
                <TableCell align="center">Tipo</TableCell>
                <TableCell align="center">Rol</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : filteredForms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No hay formatos para mostrar
                  </TableCell>
                </TableRow>
              ) : (
                filteredForms
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((format) => {
                    const rol = format.description?.trim() || 'Becario';

                    return (
                      <TableRow key={format.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: 'grey.100', color: 'error.main', mr: 2 }}>
                              <PdfIcon />
                            </Avatar>
                            <Typography variant="body2" fontWeight="medium">
                              {format.title}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <Chip label="PDF" size="small" variant="outlined" color="default" />
                        </TableCell>

                        <TableCell align="center">
                          <Chip label={rol} size="small" variant="outlined" color={getRolChipColor(rol)} />
                        </TableCell>

                        <TableCell align="right">
                          {canEdit && (
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenEditModal(format)}
                              title="Editar"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}

                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleDownload(format)}
                            title="Descargar"
                            disabled={activeDownloadId === format.id}
                          >
                            {activeDownloadId === format.id ? (
                              <CircularProgress size={18} />
                            ) : (
                              <DownloadIcon fontSize="small" />
                            )}
                          </IconButton>

                          {canDelete && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(format)}
                              title="Eliminar"
                              disabled={activeDeleteId === format.id}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredForms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>
    </Container>
  );
};

export default Formatos;
