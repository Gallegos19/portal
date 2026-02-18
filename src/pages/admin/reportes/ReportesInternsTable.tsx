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
  TableRow
} from '@mui/material';
import type { Intern, UserApi } from '../../../types/api';

interface ReportesInternsTableProps {
  interns: Intern[];
  userMap: Map<string, UserApi>;
  selectedInternId: string | null;
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onSelect: (intern: Intern) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const ReportesInternsTable: React.FC<ReportesInternsTableProps> = ({
  interns,
  userMap,
  selectedInternId,
  isLoading,
  page,
  rowsPerPage,
  totalCount,
  onSelect,
  onPageChange,
  onRowsPerPageChange
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
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interns.map((intern) => {
              const user = userMap.get(intern.id_user);
              const isSelected = selectedInternId === intern.id;

              return (
                <TableRow key={intern.id} hover selected={isSelected}>
                  <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Sin datos'}</TableCell>
                  <TableCell>{user?.email ?? 'Sin correo'}</TableCell>
                  <TableCell>{intern.chid}</TableCell>
                  <TableCell>
                    <Chip
                      label={intern.status ? 'Activo' : 'Inactivo'}
                      color={intern.status ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant={isSelected ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => onSelect(intern)}
                    >
                      {isSelected ? 'Seleccionado' : 'Ver reportes'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {interns.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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

export default ReportesInternsTable;
