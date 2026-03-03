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
import { archiveService } from '../../services/api/archive';
import { reportService } from '../../services/api/report';
import { buildExcelFile } from '../../utils/reportExcel';


const ReporteBecas = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const comprobantesInputRef = useRef<HTMLInputElement | null>(null);
  const [gastos, setGastos] = useState([
    { id: 1, fecha: '', emisor: '', concepto: '', totalCompra: '', totalGastos: '', nuevoSaldo: '' },
    { id: 2, fecha: '', emisor: '', concepto: '', totalCompra: '', totalGastos: '', nuevoSaldo: '' }
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
    setGastos([...gastos, { 
      id: nuevoId, 
      fecha: '', 
      emisor: '', 
      concepto: '', 
      totalCompra: '', 
      totalGastos: '', 
      nuevoSaldo: '' 
    }]);
  };

  const eliminarGasto = (id: number) => {
    if (gastos.length > 1) {
      setGastos(gastos.filter(gasto => gasto.id !== id));
    }
  };

  const actualizarGasto = (id: any, campo: any, valor: any) => {
    setGastos(gastos.map(gasto => 
      gasto.id === id ? { ...gasto, [campo]: valor } : gasto
    ));
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

    const hasRows = gastos.some((item) => item.fecha || item.emisor || item.concepto || item.totalCompra || item.totalGastos);
    if (!hasRows) {
      showToast('Completa al menos un registro de gasto.', 'warning');
      return;
    }

    try {
      setSaving(true);

      const reportTitle = `Reporte de Becas - ${new Date().toLocaleDateString('es-MX')}`;

      const excelFile = await buildExcelFile({
        sheetName: 'Becas',
        fileName: `${reportTitle.replace(/\s+/g, '_')}.xlsx`,
        evidences: comprobantes,
        metadata: {
          Titulo: reportTitle,
          Usuario: user.email,
          Fecha: new Date().toLocaleString('es-MX'),
          Comentarios: comentarios,
          ComprobantesAdjuntos: comprobantes.length,
        },
        rows: gastos.map((item) => ({
          FechaCompra: item.fecha,
          Emisor: item.emisor,
          Concepto: item.concepto,
          TotalCompra: item.totalCompra,
          TotalGastos: item.totalGastos,
          NuevoSaldo: item.nuevoSaldo,
        })),
      });

      const archiveResponse = await archiveService.uploadFile(
        excelFile,
        user.id,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'reportes/becas'
      );

      await reportService.create({
        title: reportTitle,
        description: comentarios || 'Reporte bimestral de becas y materiales',
        type: 'BECAS',
        id_archive: archiveResponse.data.id,
      });

      showToast('Reporte de becas exportado y guardado correctamente.', 'success');
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
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(6, 1fr)' },
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

                  {/* Total de la compra */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Total de la compra
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={gasto.totalCompra}
                      onChange={(e) => actualizarGasto(gasto.id, 'totalCompra', e.target.value)}
                      placeholder="0.00"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Box>

                  {/* Total de gastos */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Total de gastos
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={gasto.totalGastos}
                      onChange={(e) => actualizarGasto(gasto.id, 'totalGastos', e.target.value)}
                      placeholder="0.00"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Box>

                  {/* Nuevo Saldo */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Nuevo Saldo
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
                      <Typography variant="body2" color="text.secondary">
                        ${gasto.nuevoSaldo || '0.00'}
                      </Typography>
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
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="inherit"
                startIcon={<CancelIcon />}
                sx={{ textTransform: 'none' }}
              >
                Cancelar
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<SaveIcon />}
                sx={{ textTransform: 'none' }}
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
                <Paper key={report.id} variant="outlined" sx={{ p: 1.5, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{report.title}</Typography>
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

export default ReporteBecas;