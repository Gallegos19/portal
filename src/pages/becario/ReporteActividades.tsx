import React, { useState } from 'react';
import {
  Box,
  Button,
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
  Save as SaveIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const ReporteActividades: React.FC = () => {
  const [periodo, setPeriodo] = useState('');
  const [actividades, setActividades] = useState('');
  const [logros, setLogros] = useState('');
  const [dificultades, setDificultades] = useState('');
  const [archivos, setArchivos] = useState<File[]>([]);

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Lógica para enviar el formulario
    console.log({ periodo, actividades, logros, dificultades, archivos });
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
                <MenuItem value="Q1 2024">Q1 2024</MenuItem>
                <MenuItem value="Q2 2024">Q2 2024</MenuItem>
                <MenuItem value="Q3 2024">Q3 2024</MenuItem>
                <MenuItem value="Q4 2024">Q4 2024</MenuItem>
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
              >
                Guardar borrador
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                type="submit"
              >
                Enviar reporte
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
          
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <DescriptionIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              No hay reportes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aún no has enviado ningún reporte. Tu primer reporte aparecerá aquí una vez que lo envíes.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReporteActividades;