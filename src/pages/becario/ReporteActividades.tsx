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
import { internService } from '../../services/api/intern';
import { subprojectService } from '../../services/api/subproject';
import { socialFacilitatorService } from '../../services/api/socialFacilitator';
import { userService } from '../../services/api/user';
import { buildActividadesExcelFile } from '../../utils/reportExcel';

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
  const [nombreBecario, setNombreBecario] = useState('');
  const [chid, setChid] = useState('');
  const [nivelEducativo, setNivelEducativo] = useState('');
  const [lugarServicio, setLugarServicio] = useState('');
  const [zona, setZona] = useState('');
  const [subproyecto, setSubproyecto] = useState('');
  const [nombreFacilitador, setNombreFacilitador] = useState('');
  const [tituloProyecto, setTituloProyecto] = useState('Portal Kuxtal');
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

  React.useEffect(() => {
    if (!user?.id) return;

    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    if (fullName) {
      setNombreBecario(fullName);
    }

    const loadInternContext = async () => {
      try {
        const internResponse = await internService.getByUserId(user.id);
        const intern = internResponse.data;

        if (intern?.chid) {
          setChid(intern.chid);
        }
        if (intern?.education_level) {
          setNivelEducativo(intern.education_level);
        }
        if (intern?.service) {
          setLugarServicio(intern.service);
        }

        if (intern?.id_subproject) {
          const subprojectResponse = await subprojectService.getById(intern.id_subproject);
          const subprojectData = subprojectResponse.data;
          if (subprojectData?.name_subproject) {
            setSubproyecto(subprojectData.name_subproject);
          }
          if (subprojectData?.id_social_facilitator) {
            const facilitatorResponse = await socialFacilitatorService.getById(subprojectData.id_social_facilitator);
            const facilitator = facilitatorResponse.data;
            if (facilitator?.id_user) {
              const facilitatorUserResponse = await userService.getById(facilitator.id_user);
              const facilitatorUser = facilitatorUserResponse.data;
              const facilitatorName = `${facilitatorUser.first_name ?? ''} ${facilitatorUser.last_name ?? ''}`.trim();
              if (facilitatorName) {
                setNombreFacilitador(facilitatorName);
              }
            }
          }
        }
      } catch (error) {
        console.error('No se pudo cargar contexto del becario para reporte de actividades:', error);
      }
    };

    loadInternContext();
  }, [user?.id, user?.firstName, user?.lastName]);

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

    if (!nombreBecario.trim() || !chid.trim() || !subproyecto.trim()) {
      showToast('Completa nombre, CHID y subproyecto para generar el formato completo.', 'warning');
      return;
    }

    try {
      setSaving(true);

      const reportTitle = `Reporte de Actividades - ${periodo}`;
      const actividadesResumen = actividades.trim().replace(/\s+/g, ' ').slice(0, 180);
      const actividadesListado = actividades
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 5);

      const informeCompleto = [
        logros.trim() ? `Logros y avances:\n${logros.trim()}` : '',
        dificultades.trim() ? `Dificultades enfrentadas:\n${dificultades.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      const excelFile = await buildActividadesExcelFile({
        fileName: `${reportTitle.replace(/\s+/g, '_')}.xlsx`,
        periodo,
        nombreBecario,
        chid,
        nivelEducativo,
        lugarServicio,
        zona,
        subproyecto,
        nombreFacilitador,
        tituloProyecto,
        actividades: actividadesListado,
        informe: informeCompleto || actividades,
        evidences: archivos,
      });

      const archiveResponse = await archiveService.uploadFile(
        excelFile,
        user.id,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'reportes/actividades'
      );

      await reportService.create({
        title: reportTitle,
        description: `Periodo: ${periodo}. Actividades: ${actividadesResumen}`,
        type: 'ACTIVIDADES',
        id_archive: archiveResponse.data.id,
      });

      showToast('Reporte de actividades exportado y guardado correctamente.', 'success');

      setPeriodo('');
      setZona('');
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

            <Box
              sx={{
                mb: 3,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              <TextField
                size="small"
                label="Nombre del becario(a)"
                value={nombreBecario}
                onChange={(event) => setNombreBecario(event.target.value)}
                required
              />
              <TextField
                size="small"
                label="CHID"
                value={chid}
                onChange={(event) => setChid(event.target.value)}
                required
              />
              <TextField
                size="small"
                label="Nivel educativo"
                value={nivelEducativo}
                onChange={(event) => setNivelEducativo(event.target.value)}
              />
              <TextField
                size="small"
                label="Lugar de servicio"
                value={lugarServicio}
                onChange={(event) => setLugarServicio(event.target.value)}
              />
              <TextField
                size="small"
                label="Zona"
                value={zona}
                onChange={(event) => setZona(event.target.value)}
              />
              <TextField
                size="small"
                label="Subproyecto"
                value={subproyecto}
                onChange={(event) => setSubproyecto(event.target.value)}
                required
              />
              <TextField
                size="small"
                label="Facilitador(a) social"
                value={nombreFacilitador}
                onChange={(event) => setNombreFacilitador(event.target.value)}
              />
              <TextField
                size="small"
                label="Título del proyecto"
                value={tituloProyecto}
                onChange={(event) => setTituloProyecto(event.target.value)}
              />
            </Box>

            {/* Actividades principales */}
            <TextField
              fullWidth
              label="Actividades principales realizadas"
              multiline
              rows={5}
              value={actividades}
              onChange={(e) => setActividades(e.target.value)}
              placeholder="Escribe una actividad por línea (máximo 5) para el resumen del formato..."
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<SaveIcon />}
                type="button"
                disabled={saving}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Guardar borrador
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                type="submit"
                disabled={saving}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
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
                  sx={{
                    p: 2,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ minWidth: 0, width: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {report.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(report.created_at).toLocaleString('es-MX')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
                    <Button
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownloadReport(report)}
                      sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                      Descargar
                    </Button>
                    <Button
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteReport(report)}
                      disabled={deletingReportId === report.id}
                      sx={{ width: { xs: '100%', sm: 'auto' } }}
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