import React, { useState } from 'react';
import {
  Box,
  Button,
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
  TableRow,
  TextField,
  Typography,
  TablePagination,
  Avatar,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  PictureAsPdf as PdfIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Interfaz para el formulario de subida
interface FormularioSubida {
  tipoFormato: string;
  rolDestino: string;
  archivo: File | null;
  descripcion: string;
}

// Estado inicial del formulario
const initialFormState: FormularioSubida = {
  tipoFormato: '',
  rolDestino: 'Becario',
  archivo: null,
  descripcion: ''
};

// Tipos de formatos disponibles
const tiposFormatos = [
  'Formato de Evaluación',
  'Formato de Reporte Mensual',
  'Formato de Informe de Actividades',
  'Formato de Evaluación de Capacitación'
];

// Datos de ejemplo para la tabla de formatos
const formatosData = [
  {
    id: 1,
    nombre: 'Formato de Evaluación',
    tipo: 'PDF',
    categoria: 'Evaluación',
    tamano: '2.4 MB',
    descargas: 124,
    estado: 'Activo',
    previewUrl: '#',
    rol: 'Becario'
  },
  {
    id: 2,
    nombre: 'Formato de Reporte Mensual',
    tipo: 'PDF',
    categoria: 'Reporte',
    tamano: '1.8 MB',
    descargas: 89,
    estado: 'Activo',
    previewUrl: '#',
    rol: 'Personal'
  },
  {
    id: 3,
    nombre: 'Formato de Solicitud de Vacaciones',
    tipo: 'PDF',
    categoria: 'RRHH',
    tamano: '1.2 MB',
    descargas: 156,
    estado: 'Activo',
    previewUrl: '#',
    rol: 'Ambos'
  }
];

const Formatos = () => {
  // Estados
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<FormularioSubida>(initialFormState);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rolFiltro, setRolFiltro] = useState('Todos');

  // Manejadores de eventos
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData(initialFormState);
  };

  // Manejador de cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        archivo: e.target.files![0]
      }));
    }
  };

  // Manejador de cambio de input
  const handleInputChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  // Manejador de cambio de rol
  const handleRolChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setRolFiltro(e.target.value as string);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    handleCloseModal();
  };

  // Manejador de cambio de página
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Manejador de cambio de filas por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtrar formatos por búsqueda y rol
  const filteredForms = formatosData.filter(formato => {
    const matchesSearch = formato.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = rolFiltro === 'Todos' || formato.rol === rolFiltro || formato.rol === 'Ambos';
    return matchesSearch && matchesRol;
  });

  // Función para manejar la descarga de archivos
  const handleDownload = (id: number) => {
    const formato = formatosData.find(f => f.id === id);
    if (formato) {
      // Simular descarga
      const link = document.createElement('a');
      link.href = formato.previewUrl;
      link.download = `${formato.nombre}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Formatos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administra y descarga los formatos disponibles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleOpenModal}
        >
          Subir Formato
        </Button>
      </Box>

      {/* Filtros */}
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
            sx: { borderRadius: 4, bgcolor: 'background.paper' }
          }}
          sx={{ width: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por rol</InputLabel>
          <Select
            value={rolFiltro}
            label="Filtrar por rol"
            onChange={handleRolChange}
            sx={{ borderRadius: 4 }}
          >
            <MenuItem value="Todos">Todos los roles</MenuItem>
            <MenuItem value="Becario">Becario</MenuItem>
            <MenuItem value="Personal">Personal</MenuItem>
            <MenuItem value="Ambos">Ambos</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Modal para subir formato */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Subir Nuevo Formato</Typography>
            <IconButton edge="end" onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth size="small" margin="normal">
                <InputLabel id="tipo-formato-label">Tipo de Formato</InputLabel>
                <Select
                  labelId="tipo-formato-label"
                  name="tipoFormato"
                  value={formData.tipoFormato}
                  onChange={handleInputChange}
                  label="Tipo de Formato"
                  required
                >
                  {tiposFormatos.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" margin="normal">
                <InputLabel id="rol-destino-label">Rol Destino</InputLabel>
                <Select
                  labelId="rol-destino-label"
                  name="rolDestino"
                  value={formData.rolDestino}
                  onChange={handleInputChange}
                  label="Rol Destino"
                  required
                >
                  <MenuItem value="Becario">Becario</MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Ambos">Ambos</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Subir Archivo
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                  />
                </Button>
                {formData.archivo && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Archivo seleccionado: {formData.archivo.name}
                  </Typography>
                )}
              </Box>

              <TextField
                fullWidth
                size="small"
                margin="normal"
                name="descripcion"
                label="Descripción"
                multiline
                rows={3}
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Ingrese una descripción del formato"
                required
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseModal} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Tabla de formatos */}
      <Paper elevation={0} sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre del Formato</TableCell>
                <TableCell align="center">Tipo</TableCell>
                <TableCell align="center">Rol</TableCell>
                <TableCell align="center">Tamaño</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredForms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((formato) => (
                  <TableRow key={formato.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: 'grey.100', color: 'error.main', mr: 2 }}>
                          <PdfIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {formato.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formato.categoria}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{formato.tipo}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={formato.rol} 
                        size="small" 
                        variant="outlined"
                        color={formato.rol === 'Becario' ? 'primary' : formato.rol === 'Personal' ? 'secondary' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {formato.tamano}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleDownload(formato.id)}
                        title="Descargar"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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
