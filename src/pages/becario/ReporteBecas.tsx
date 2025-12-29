import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  Grid,
  IconButton,
  Divider,
  TextareaAutosize,
  styled,
  Tooltip
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AttachFile as AttachFileIcon,
  Add as AddIcon,
  Message as MessageIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';


const ReporteBecas = () => {
  const [gastos, setGastos] = useState([
    { id: 1, fecha: '', emisor: '', concepto: '', totalCompra: '', totalGastos: '', nuevoSaldo: '' },
    { id: 2, fecha: '', emisor: '', concepto: '', totalCompra: '', totalGastos: '', nuevoSaldo: '' }
  ]);

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
              >
                <AttachFileIcon color="action" sx={{ mb: 1 }} />
                <Box>
                  <Typography component="span" color="primary" sx={{ fontWeight: 'medium', '&:hover': { textDecoration: 'underline' } }}>
                    Subir comprobantes
                    <input type="file" hidden multiple accept="image/*,.pdf" />
                  </Typography>
                  <Typography component="span" variant="body2" color="text.secondary">
                    {' '}o arrastra y suelta aquí
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  PNG, JPG, PDF hasta 10MB
                </Typography>
              </Paper>
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
              >
                Guardar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReporteBecas;