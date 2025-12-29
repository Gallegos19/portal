import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  type SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  PersonAdd as PersonAddIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

interface Student {
  id: number;
  name: string;
  email: string;
  status: 'Activo' | 'Inactivo' | 'En proceso' | 'Rechazado' | 'En espera' | 'Finalizado';
  program: string;
  progress: number;
  lastActivity: string;
  avatar: string;
}

const statusColors = {
  'Activo': 'success',
  'Inactivo': 'error',
  'En proceso': 'info',
  'Rechazado': 'error',
  'En espera': 'warning',
  'Finalizado': 'secondary'
};

const students: Student[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    status: 'Activo',
    program: 'Beca Universitaria',
    progress: 75,
    lastActivity: 'Hace 2 días',
    avatar: '/static/images/avatar/1.jpg'
  },
  {
    id: 2,
    name: 'María González',
    email: 'maria.gonzalez@example.com',
    status: 'En proceso',
    program: 'Beca Técnica',
    progress: 45,
    lastActivity: 'Hace 1 semana',
    avatar: '/static/images/avatar/2.jpg'
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos.lopez@example.com',
    status: 'En espera',
    program: 'Beca Universitaria',
    progress: 15,
    lastActivity: 'Hace 3 días',
    avatar: '/static/images/avatar/3.jpg'
  },
  {
    id: 4,
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    status: 'Finalizado',
    program: 'Beca Técnica',
    progress: 100,
    lastActivity: 'Hace 1 mes',
    avatar: '/static/images/avatar/4.jpg'
  },
  {
    id: 5,
    name: 'Luis Ramírez',
    email: 'luis.ramirez@example.com',
    status: 'Rechazado',
    program: 'Beca Universitaria',
    progress: 0,
    lastActivity: 'Hace 2 semanas',
    avatar: '/static/images/avatar/5.jpg'
  }
];

const Becarios: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [statusFilter, setStatusFilter] = React.useState<string>('todos');
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredStudents.length) : 0;

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Lista de Becarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{ bgcolor: '#26C6DA', '&:hover': { bgcolor: '#00BCD4' } }}
        >
          Agregar Becario
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar por nombre o correo..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ minWidth: 250, flexGrow: 1 }}
          />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filtrar por estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Filtrar por estado"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="todos">Todos los estados</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
                <MenuItem value="En proceso">En proceso</MenuItem>
                <MenuItem value="En espera">En espera</MenuItem>
                <MenuItem value="Finalizado">Finalizado</MenuItem>
                <MenuItem value="Rechazado">Rechazado</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ color: '#26C6DA', borderColor: '#26C6DA' }}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Programa</TableCell>
                <TableCell>Progreso</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Última actividad</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredStudents
              ).map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={student.avatar} alt={student.name} />
                      <Box>
                        <Typography variant="body1">{student.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{student.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{student.program}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: '100%', bgcolor: '#e0e0e0', borderRadius: 5, height: 8 }}>
                        <Box 
                          sx={{ 
                            width: `${student.progress}%`, 
                            height: 8, 
                            bgcolor: '#26C6DA',
                            borderRadius: 5
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {student.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={student.status}
                      color={statusColors[student.status] as any}
                      size="small"
                      sx={{ 
                        fontWeight: 'bold',
                        minWidth: 100,
                        bgcolor: `${statusColors[student.status]}.light`,
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>{student.lastActivity}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Ver detalles">
                        <IconButton size="small">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton size="small">
                        <MoreIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStudents.length}
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
    </Box>
  );
};

export default Becarios;