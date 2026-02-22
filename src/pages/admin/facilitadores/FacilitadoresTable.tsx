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
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import type { SocialFacilitator, UserApi } from '../../../types/api';

interface FacilitadoresTableProps {
  facilitators: SocialFacilitator[];
  userMap: Map<string, UserApi>;
  regionMap: Map<string, string>;
  selectedFacilitatorId: string | null;
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  getStatusLabel: (facilitator?: SocialFacilitator, user?: UserApi) => string;
  getStatusColor: (facilitator?: SocialFacilitator, user?: UserApi) => 'default' | 'success' | 'warning';
  onSelect: (facilitator: SocialFacilitator) => void;
  onEdit: (facilitator: SocialFacilitator) => void;
  onDelete: (facilitator: SocialFacilitator) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const FacilitadoresTable: React.FC<FacilitadoresTableProps> = ({
  facilitators,
  userMap,
  regionMap,
  selectedFacilitatorId,
  isLoading,
  page,
  rowsPerPage,
  totalCount,
  getStatusLabel,
  getStatusColor,
  onSelect,
  onEdit,
  onDelete,
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
              <TableCell>Region</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilitators.map((facilitator) => {
              const user = userMap.get(facilitator.id_user);
              const isSelected = selectedFacilitatorId === facilitator.id;
              const statusLabel = getStatusLabel(facilitator, user);
              const statusColor = getStatusColor(facilitator, user);

              return (
                <TableRow key={facilitator.id} hover selected={isSelected}>
                  <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Sin datos'}</TableCell>
                  <TableCell>{user?.email ?? 'Sin correo'}</TableCell>
                  <TableCell>{regionMap.get(facilitator.id_region) ?? 'Sin region'}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabel}
                      color={statusColor}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver detalle">
                      <Button
                        size="small"
                        variant={isSelected ? 'contained' : 'outlined'}
                        startIcon={<VisibilityIcon />}
                        onClick={() => onSelect(facilitator)}
                        sx={{ mr: 1 }}
                      >
                        Detalle
                      </Button>
                    </Tooltip>
                    <Tooltip title="Editar facilitador">
                      <span>
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EditIcon />}
                          onClick={() => onEdit(facilitator)}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Eliminar facilitador">
                      <span>
                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => onDelete(facilitator)}
                        >
                          Eliminar
                        </Button>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {facilitators.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay facilitadores para mostrar.
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

export default FacilitadoresTable;
