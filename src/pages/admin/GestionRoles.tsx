import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  type SelectChangeEvent as MuiSelectChangeEvent,
  Button,
  Grid,
  InputAdornment,
  TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';

// Mock data - replace with actual API call
const mockUsers = [
  { id: 1, nombre: 'Juan Pérez', correo: 'juan@example.com', rol: 'Becario', ciclo: '2025-2026' },
  { id: 2, nombre: 'María García', correo: 'maria@example.com', rol: 'Personal', ciclo: '2025-2026' },
  // Add more mock data as needed
];

const GestionRoles: React.FC = () => {
  const [selectedCycle, setSelectedCycle] = useState('2025-2026');
  const [selectedRole, setSelectedRole] = useState('Becario');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState(mockUsers);

  const handleCycleChange = (event: MuiSelectChangeEvent) => {
    setSelectedCycle(event.target.value);
    // Here you would typically fetch users for the selected cycle
  };

  const handleRoleChange = (event: MuiSelectChangeEvent) => {
    setSelectedRole(event.target.value);
    // Here you would typically filter users by the selected role
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Here you would typically implement search functionality
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSave = () => {
    // Here you would typically save the changes to the backend
    console.log('Changes saved');
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Roles
        </Typography>
        
        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="cycle-select-label">Ciclo</InputLabel>
              <Select
                labelId="cycle-select-label"
                value={selectedCycle}
                onChange={handleCycleChange}
                label="Ciclo"
              >
                <MenuItem value="2025-2026">2025-2026</MenuItem>
                {/* Add more cycles as needed */}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="role-select-label">Rol</InputLabel>
              <Select
                labelId="role-select-label"
                value={selectedRole}
                onChange={handleRoleChange}
                label="Rol"
              >
                <MenuItem value="Becario">Becario</MenuItem>
                <MenuItem value="Personal">Personal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ mb: 2 }}
        >
          Guardar Cambios
        </Button>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo Electrónico</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.correo}</TableCell>
                  <TableCell>
                    <Select
                      value={user.rol}
                      onChange={(e) => {
                        const updatedUsers = users.map(u => 
                          u.id === user.id ? { ...u, rol: e.target.value } : u
                        );
                        setUsers(updatedUsers);
                      }}
                      size="small"
                    >
                      <MenuItem value="Becario">Becario</MenuItem>
                      <MenuItem value="Personal">Personal</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" color="primary">
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </TableContainer>
      </Box>
    </Box>
  );
};

export default GestionRoles;
