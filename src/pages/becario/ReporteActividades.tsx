import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Download as DownloadIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/useToast';
import type { Report } from '../../types/api';
import { Periodo } from '../../types/types';
import { reportService } from '../../services/api/report';
import { archiveService } from '../../services/api/archive';
import { buildExcelFile } from '../../utils/reportExcel';

const ReporteActividades: React.FC = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const schoolYearStart = currentMonth >= 6 ? currentYear : currentYear - 1;
  const periodosDisponibles = Object.values(Periodo).map((nombrePeriodo, index) => {
    const isCurrentSchoolYearEndPeriod = index >= 2;
    const periodYear = isCurrentSchoolYearEndPeriod ? schoolYearStart + 1 : schoolYearStart;

    return {
      label: `${nombrePeriodo} ${periodYear}`,
      value: `${nombrePeriodo} ${periodYear}`,
    };
  });
  const [periodo, setPeriodo] = useState('');
  const [actividades, setActividades] = useState('');
  const [logros, setLogros] = useState('');
  const [dificultades, setDificultades] = useState('');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  const loadHistory = React.useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadingHistory(true);
      setHistoryError(null);
      const response = await reportService.getByCreatorId(user.id);
      const all = response.data || [];
      setReports(all.filter((report) => (report.type || '').toUpperCase() === 'ACTIVIDADES'));
    } catch (error) {
      console.error('Error cargando historial de reportes de actividades:', error);
      setHistoryError('No se pudieron cargar los reportes anteriores.');
    } finally {
      setLoadingHistory(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setArchivos([...archivos, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...archivos];
    newFiles.splice(index, 1);
    setArchivos(newFiles);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user?.id) {
      showToast('No se pudo identificar al usuario autenticado.', 'error');
      return;
    }

    if (!periodo.trim() || !actividades.trim()) {
      showToast('Completa al menos período y actividades principales.', 'warning');
      return;
    }

    try {
      setSaving(true);

      const reportTitle = `Reporte de Actividades - ${periodo}`;

      const excelFile = await buildExcelFile({
        sheetName: 'Actividades',
        fileName: `${reportTitle.replace(/\s+/g, '_')}.xlsx`,
        evidences: archivos,
        metadata: {
          Titulo: reportTitle,
          Periodo: periodo,
          Usuario: user.email,
          Fecha: new Date().toLocaleString('es-MX'),
          EvidenciasAdjuntas: archivos.length,
        },
        rows: [
          {
            Periodo: periodo,
            Actividades: actividades,
            Logros: logros,
            Dificultades: dificultades,
            Evidencias: archivos.map((file) => file.name).join(' | '),
          },
        ],
      });

      const archiveResponse = await archiveService.uploadFile(
        excelFile,
        user.id,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'reportes/actividades'
      );

      await reportService.create({
        title: reportTitle,
        description: `Periodo: ${periodo}. Actividades: ${actividades}`,
        type: 'ACTIVIDADES',
        id_archive: archiveResponse.data.id,
      });

      showToast('Reporte de actividades exportado y guardado correctamente.', 'success');

      setPeriodo('');
      setActividades('');
      setLogros('');
      setDificultades('');
      setArchivos([]);
      await loadHistory();
    } catch (error) {
      console.error('Error guardando reporte de actividades:', error);
      showToast('No se pudo guardar el reporte de actividades.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadReport = async (report: Report) => {
    if (!report.id_archive) {
      showToast('Este reporte no tiene archivo asociado.', 'warning');
      return;
    }

    try {
      const response = await archiveService.getSignedUrl(report.id_archive, 300);
      window.open(response.data.signed_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error descargando reporte:', error);
      showToast('No se pudo descargar el reporte.', 'error');
    }
  };

  const handleDeleteReport = async (report: Report) => {
    const confirmed = window.confirm(`¿Deseas eliminar el reporte "${report.title}"?`);
    if (!confirmed) return;

    try {
      setDeletingReportId(report.id);
      await reportService.deleteById(report.id);
      showToast('Reporte eliminado correctamente.', 'success');
      await loadHistory();
    } catch (error) {
      console.error('Error eliminando reporte:', error);
      showToast('No se pudo eliminar el reporte.', 'error');
    } finally {
      setDeletingReportId(null);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.100', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
        {/* Header con título */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Actividades
          </Typography>
        </Box>
        
        {/* Formulario de reporte trimestral */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" component="h2">
              Reporte trimestral de actividades
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            {/* Período */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="periodo-label">Período de reporte</InputLabel>
              <Select
                labelId="periodo-label"
                value={periodo}
                label="Período de reporte"
                onChange={(e) => setPeriodo(e.target.value)}
                required
              >
                <MenuItem value="">Selecciona el período</MenuItem>
                {periodosDisponibles.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Actividades principales */}
            <TextField
              fullWidth
              label="Actividades principales realizadas"
              multiline
              rows={4}
              value={actividades}
              onChange={(e) => setActividades(e.target.value)}
              placeholder="Describe las actividades más importantes que realizaste durante este trimestre..."
              sx={{ mb: 3 }}
              required
            />

            {/* Logros y avances */}
            <TextField
              fullWidth
              label="Logros y avances"
              multiline
              rows={4}
              value={logros}
              onChange={(e) => setLogros(e.target.value)}
              placeholder="Menciona los logros más significativos y avances en tu desarrollo..."
              sx={{ mb: 3 }}
            />

            {/* Dificultades enfrentadas */}
            <TextField
              fullWidth
              label="Dificultades enfrentadas"
              multiline
              rows={4}
              value={dificultades}
              onChange={(e) => setDificultades(e.target.value)}
              placeholder="Describe los principales obstáculos o dificultades que enfrentaste..."
              sx={{ mb: 3 }}
            />

            {/* Evidencias */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Evidencias (fotos, documentos)
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  border: '2px dashed',
                  borderColor: 'divider',
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <CloudUploadIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                    Sube archivos
                  </Box>{' '}
                  o arrastra y suelta
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PNG, JPG, PDF hasta 10MB
                </Typography>
              </Paper>
              
              {/* Lista de archivos subidos */}
              {archivos.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {archivos.map((file, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DescriptionIcon color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                          {file.name}
                        </Typography>
                      </Box>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>

            {/* Botones */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<SaveIcon />}
                type="button"
                disabled={saving}
              >
                Guardar borrador
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                type="submit"
                disabled={saving}
              >
                {saving ? 'Procesando...' : 'Enviar reporte'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Reportes anteriores */}
        <Paper elevation={3}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" component="h3">
              Reportes anteriores
            </Typography>
          </Box>

          {historyError && (
            <Alert severity="error" sx={{ m: 2 }}>
              {historyError}
            </Alert>
          )}

          {loadingHistory ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : reports.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <DescriptionIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                No hay reportes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aún no has enviado ningún reporte. Tu primer reporte aparecerá aquí una vez que lo envíes.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              {reports.map((report) => (
                <Paper
                  key={report.id}
                  variant="outlined"
                  sx={{ p: 2, mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {report.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(report.created_at).toLocaleString('es-MX')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button startIcon={<DownloadIcon />} onClick={() => handleDownloadReport(report)}>
                      Descargar
                    </Button>
                    <Button
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteReport(report)}
                      disabled={deletingReportId === report.id}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ReporteActividades;