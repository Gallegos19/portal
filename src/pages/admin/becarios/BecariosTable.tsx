import React from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import type { Intern, UserApi } from '../../../types/api';

interface BecariosTableProps {
  interns: Intern[];
  userMap: Map<string, UserApi>;
  selectedInternId: string | null;
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onSelect: (intern: Intern) => void;
  onEdit: (intern: Intern) => void;
  onDelete: (intern: Intern) => void;
  onCopyEmail: (email?: string) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  formatDate: (value?: string) => string;
}

const BecariosTable: React.FC<BecariosTableProps> = ({
  interns,
  userMap,
  selectedInternId,
  isLoading,
  page,
  rowsPerPage,
  totalCount,
  onSelect,
  onEdit,
  onDelete,
  onCopyEmail,
  onPageChange,
  onRowsPerPageChange,
  formatDate
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>CHID</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interns.map((intern) => {
              const user = userMap.get(intern.id_user);
              const isSelected = selectedInternId === intern.id;

              return (
                <TableRow key={intern.id} hover selected={isSelected}>
                  <TableCell>
                    {user ? `${user.first_name} ${user.last_name}` : 'Sin datos'}
                  </TableCell>
                  <TableCell>{user?.email ?? 'Sin correo'}</TableCell>
                  <TableCell>{intern.chid}</TableCell>
                  <TableCell>
                    <Chip
                      label={intern.status ? 'Activo' : 'Inactivo'}
                      color={intern.status ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(intern.start_date)}</TableCell>
                  <TableCell>{formatDate(intern.end_date)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver detalle">
                      <Button
                        size="small"
                        variant={isSelected ? 'contained' : 'outlined'}
                        startIcon={<VisibilityIcon />}
                        onClick={() => onSelect(intern)}
                        sx={{ mr: 1 }}
                      >
                        Detalle
                      </Button>
                    </Tooltip>
                    <Tooltip title="Editar becario">
                      <span>
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EditIcon />}
                          onClick={() => onEdit(intern)}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Eliminar becario">
                      <span>
                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => onDelete(intern)}
                        >
                          Eliminar
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Copiar correo">
                      <span>
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<ContentCopyIcon />}
                          onClick={() => onCopyEmail(user?.email)}
                          disabled={!user?.email}
                        >
                          Copiar
                        </Button>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {interns.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay becarios para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
        labelRowsPerPage="Filas por pagina:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </>
  );
};

export default BecariosTable;
