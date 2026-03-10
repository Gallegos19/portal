import React, { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AttachFile as AttachFileIcon,
  Add as AddIcon,
  Message as MessageIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/useToast';
import type { Report } from '../../types/api';
import { Periodo } from '../../types/types';
import { archiveService } from '../../services/api/archive';
import { reportService } from '../../services/api/report';
import { internService } from '../../services/api/intern';
import { subprojectService } from '../../services/api/subproject';
import { buildBecasExcelFile } from '../../utils/reportExcel';

type GastoItem = {
  id: number;
  fecha: string;
  emisor: string;
  concepto: string;
  montoCompra: string;
  observacion: string;
};

const createEmptyGasto = (id: number): GastoItem => ({
  id,
  fecha: '',
  emisor: '',
  concepto: '',
  montoCompra: '',
  observacion: '',
});

const toAmount = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};


const ReporteBecas = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const schoolYearStart = currentMonth >= 6 ? currentYear : currentYear - 1;
  const periodosDisponibles = Object.values(Periodo).map((nombrePeriodo, index) => {
    const isCurrentSchoolYearEndPeriod = index >= 2;
    const periodYear = isCurrentSchoolYearEndPeriod ? schoolYearStart + 1 : schoolYearStart;
    return `${nombrePeriodo} ${periodYear}`;
  });
  const comprobantesInputRef = useRef<HTMLInputElement | null>(null);
  const [periodo, setPeriodo] = useState('');
  const [nombreBecario, setNombreBecario] = useState('');
  const [chid, setChid] = useState('');
  const [subproyecto, setSubproyecto] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [saldoMesAnterior, setSaldoMesAnterior] = useState('0');
  const [depositoBeca, setDepositoBeca] = useState('0');
  const [depositoMateriales, setDepositoMateriales] = useState('0');
  const [gastos, setGastos] = useState<GastoItem[]>([
    createEmptyGasto(1),
    createEmptyGasto(2),
  ]);
  const [comentarios, setComentarios] = useState('');
  const [comprobantes, setComprobantes] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  const agregarGasto = () => {
    const nuevoId = gastos.length > 0 ? Math.max(...gastos.map(g => g.id)) + 1 : 1;
    setGastos([...gastos, createEmptyGasto(nuevoId)]);
  };

  const eliminarGasto = (id: number) => {
    if (gastos.length > 1) {
      setGastos(gastos.filter(gasto => gasto.id !== id));
    }
  };

  const actualizarGasto = (id: number, campo: keyof GastoItem, valor: string) => {
    setGastos(gastos.map(gasto => (gasto.id === id ? { ...gasto, [campo]: valor } : gasto)));
  };

  const loadHistory = React.useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadingHistory(true);
      setHistoryError(null);
      const response = await reportService.getByCreatorId(user.id);
      const all = response.data || [];
      setReports(all.filter((report) => (report.type || '').toUpperCase() === 'BECAS'));
    } catch (error) {
      console.error('Error cargando historial de reportes de becas:', error);
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

        if (intern?.id_subproject) {
          const subprojectResponse = await subprojectService.getById(intern.id_subproject);
          const subprojectData = subprojectResponse.data;
          if (subprojectData?.name_subproject) {
            setSubproyecto(subprojectData.name_subproject);
          }
        }
      } catch (error) {
        console.error('No se pudo cargar contexto del becario para el reporte de becas:', error);
      }
    };

    loadInternContext();
  }, [user?.id, user?.firstName, user?.lastName]);

  const handleComprobantesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setComprobantes((prev) => [...prev, ...Array.from(event.target.files)]);
    event.target.value = '';
  };

  const handleOpenComprobantesPicker = () => {
    comprobantesInputRef.current?.click();
  };

  const handleRemoveComprobante = (index: number) => {
    setComprobantes((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSaveReport = async () => {
    if (!user?.id) {
      showToast('No se pudo identificar al usuario autenticado.', 'error');
      return;
    }

    if (!periodo.trim()) {
      showToast('Selecciona el período del reporte.', 'warning');
      return;
    }

    if (!nombreBecario.trim() || !chid.trim() || !subproyecto.trim()) {
      showToast('Completa nombre, CHID y subproyecto para generar el formato completo.', 'warning');
      return;
    }

    const hasRows = gastos.some((item) => item.fecha || item.emisor || item.concepto || item.montoCompra || item.observacion);
    if (!hasRows) {
      showToast('Completa al menos un registro de gasto.', 'warning');
      return;
    }

    try {
      setSaving(true);

      const reportTitle = `Comprobación de Becas y Materiales - ${periodo}`;
      const comentariosResumen = comentarios.trim().replace(/\s+/g, ' ').slice(0, 180);

      const excelFile = await buildBecasExcelFile({
        fileName: `${reportTitle.replace(/\s+/g, '_')}.xlsx`,
        periodo,
        nombreBecario,
        chid,
        subproyecto,
        numeroTarjeta,
        saldoMesAnterior,
        depositoBeca,
        depositoMateriales,
        comentarios,
        gastos: gastos.map((item) => ({
          fecha: item.fecha,
          emisor: item.emisor,
          concepto: item.concepto,
          montoCompra: item.montoCompra,
          observacion: item.observacion,
        })),
        evidences: comprobantes,
      });

      const archiveResponse = await archiveService.uploadFile(
        excelFile,
        user.id,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'reportes/becas'
      );

      await reportService.create({
        title: reportTitle,
        description: `Periodo: ${periodo}. CHID: ${chid}. ${comentariosResumen || 'Sin comentarios adicionales.'}`,
        type: 'BECAS',
        id_archive: archiveResponse.data.id,
      });

      showToast('Reporte de becas exportado y guardado correctamente.', 'success');
      setPeriodo('');
      setNumeroTarjeta('');
      setSaldoMesAnterior('0');
      setDepositoBeca('0');
      setDepositoMateriales('0');
      setGastos([createEmptyGasto(1), createEmptyGasto(2)]);
      setComentarios('');
      setComprobantes([]);
      await loadHistory();
    } catch (error) {
      console.error('Error guardando reporte de becas:', error);
      showToast('No se pudo guardar el reporte de becas.', 'error');
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', p: { xs: 2, sm: 3 } }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Becas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reportes • Becas Becarios
          </Typography>
        </Box>

        {/* Formulario Principal */}
        <Paper elevation={2} sx={{ overflow: 'hidden', mb: 3 }}>
          <Box sx={{ px: 3, py: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              Reporte bimestral de becas y materiales
            </Typography>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="periodo-becas-label">Período de reporte</InputLabel>
              <Select
                labelId="periodo-becas-label"
                value={periodo}
                label="Período de reporte"
                onChange={(event) => setPeriodo(event.target.value)}
                required
              >
                <MenuItem value="">Selecciona el período</MenuItem>
                {periodosDisponibles.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
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
                label="Nombre del/la becario(a)"
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
                label="Subproyecto"
                value={subproyecto}
                onChange={(event) => setSubproyecto(event.target.value)}
                required
              />
              <TextField
                size="small"
                label="N° de tarjeta"
                value={numeroTarjeta}
                onChange={(event) => setNumeroTarjeta(event.target.value)}
              />
              <TextField
                type="number"
                size="small"
                label="Saldo del mes anterior"
                value={saldoMesAnterior}
                onChange={(event) => setSaldoMesAnterior(event.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
              <TextField
                type="number"
                size="small"
                label="Depósito de beca"
                value={depositoBeca}
                onChange={(event) => setDepositoBeca(event.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
              <TextField
                type="number"
                size="small"
                label="Depósito de materiales"
                value={depositoMateriales}
                onChange={(event) => setDepositoMateriales(event.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
            </Box>

            {/* Grid de gastos */}
            <Box sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
              {gastos.map((gasto) => (
                <Paper 
                  key={gasto.id} 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.paper',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '2fr 2fr 2fr 1.5fr 2fr auto' },
                    gap: 2
                  }}
                >
                  {/* Fecha de compra */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Fecha de compra
                    </Typography>
                    <TextField
                      type="date"
                      size="small"
                      fullWidth
                      value={gasto.fecha}
                      onChange={(e) => actualizarGasto(gasto.id, 'fecha', e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarIcon color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* Emisor */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Emisor
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      value={gasto.emisor}
                      onChange={(e) => actualizarGasto(gasto.id, 'emisor', e.target.value)}
                      placeholder="Nombre del emisor"
                    />
                  </Box>

                  {/* Concepto */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Concepto
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      value={gasto.concepto}
                      onChange={(e) => actualizarGasto(gasto.id, 'concepto', e.target.value)}
                      placeholder="Concepto del gasto"
                    />
                  </Box>

                  {/* Monto total de compra */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Monto (total de la compra)
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={gasto.montoCompra}
                      onChange={(e) => actualizarGasto(gasto.id, 'montoCompra', e.target.value)}
                      placeholder="0.00"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Box>

                  {/* Observación */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Observación
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      value={gasto.observacion}
                      onChange={(e) => actualizarGasto(gasto.id, 'observacion', e.target.value)}
                      placeholder="Detalle adicional"
                    />
                  </Box>

                  {/* Acción */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Acción
                    </Typography>
                    <Box 
                      sx={{ 
                        px: 2, 
                        py: 1, 
                        bgcolor: 'grey.100', 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        borderRadius: 1,
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Tooltip title="Eliminar gasto">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => eliminarGasto(gasto.id)}
                          disabled={gastos.length <= 1}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              ))}

              {/* Botón para añadir otro gasto */}
              <Button
                onClick={agregarGasto}
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ mt: 1 }}
              >
                Añadir otro gasto
              </Button>
            </Box>

            {/* Comentarios */}
            <Box sx={{ mt: 3, position: 'relative' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Comentarios
              </Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="Agrega comentarios adicionales sobre los gastos realizados..."
                value={comentarios}
                onChange={(event) => setComentarios(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ position: 'absolute', right: 8, top: 8 }}>
                      <MessageIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Comprobantes */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Comprobantes de gastos
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  borderStyle: 'dashed',
                  bgcolor: 'grey.50',
                  '&:hover': {
                    borderColor: 'text.secondary',
                    cursor: 'pointer'
                  }
                }}
                onClick={handleOpenComprobantesPicker}
              >
                <AttachFileIcon color="action" sx={{ mb: 1 }} />
                <Box>
                  <Typography component="span" color="primary" sx={{ fontWeight: 'medium', '&:hover': { textDecoration: 'underline' } }}>
                    Subir comprobantes
                  </Typography>
                  <Typography component="span" variant="body2" color="text.secondary">
                    {' '}o arrastra y suelta aquí
                  </Typography>
                </Box>
                <input
                  ref={comprobantesInputRef}
                  type="file"
                  hidden
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleComprobantesChange}
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  PNG, JPG, PDF hasta 10MB
                </Typography>
              </Paper>

              {comprobantes.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  {comprobantes.map((file, index) => (
                    <Paper key={`${file.name}-${index}`} variant="outlined" sx={{ p: 1, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" noWrap sx={{ mr: 2 }}>
                        {file.name}
                      </Typography>
                      <IconButton size="small" color="error" onClick={() => handleRemoveComprobante(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>

            {/* Botones de acción */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                color="inherit"
                startIcon={<CancelIcon />}
                sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
              >
                Cancelar
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<SaveIcon />}
                sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                onClick={handleSaveReport}
                disabled={saving}
              >
                {saving ? 'Procesando...' : 'Guardar'}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={2}>
          <Box sx={{ px: 3, py: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              Reportes anteriores
            </Typography>
          </Box>

          {historyError && (
            <Alert severity="error" sx={{ m: 2 }}>
              {historyError}
            </Alert>
          )}

          {loadingHistory ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : reports.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <DescriptionIcon color="disabled" sx={{ fontSize: 42, mb: 1 }} />
              <Typography color="text.secondary">No hay reportes de becas registrados aún.</Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              {reports.map((report) => (
                <Paper
                  key={report.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ width: '100%', minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{report.title}</Typography>
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

export default ReporteBecas;