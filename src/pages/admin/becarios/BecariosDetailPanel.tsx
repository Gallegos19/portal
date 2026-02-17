import React from 'react';
import { Box, Button, Chip, Divider, Tooltip, Typography } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import type { Intern, Subproject, UserApi } from '../../../types/api';

interface BecariosDetailPanelProps {
  selectedIntern: Intern | null;
  selectedUser: UserApi | null | undefined;
  selectedSubproject?: Subproject;
  selectedFacilitator?: string;
  onClear: () => void;
  formatDate: (value?: string) => string;
}

const BecariosDetailPanel: React.FC<BecariosDetailPanelProps> = ({
  selectedIntern,
  selectedUser,
  selectedSubproject,
  selectedFacilitator,
  onClear,
  formatDate
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Detalle del becario
        </Typography>
        {selectedIntern && (
          <Tooltip title="Limpiar seleccion">
            <Button size="small" variant="text" startIcon={<ClearIcon />} onClick={onClear}>
              Limpiar
            </Button>
          </Tooltip>
        )}
      </Box>

      {!selectedIntern ? (
        <Typography variant="body2" color="text.secondary">
          Selecciona un becario para ver su informacion detallada.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Nombre
            </Typography>
            <Typography variant="body1">
              {selectedUser
                ? `${selectedUser.first_name} ${selectedUser.last_name}`
                : 'Sin datos'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Correo
            </Typography>
            <Typography variant="body1">{selectedUser?.email ?? 'Sin correo'}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              CHID
            </Typography>
            <Typography variant="body1">{selectedIntern.chid}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Estado
            </Typography>
            <Chip
              label={selectedIntern.status ? 'Activo' : 'Inactivo'}
              color={selectedIntern.status ? 'success' : 'default'}
              size="small"
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Subproyecto
            </Typography>
            <Typography variant="body1">
              {selectedSubproject?.name ?? 'Sin subproyecto'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Facilitador
            </Typography>
            <Typography variant="body1">
              {selectedFacilitator ?? 'Sin facilitador'}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Direccion
            </Typography>
            <Typography variant="body2">{selectedIntern.address ?? 'Sin direccion'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Carrera
            </Typography>
            <Typography variant="body2">{selectedIntern.career_name ?? 'Sin dato'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Nivel educativo
            </Typography>
            <Typography variant="body2">{selectedIntern.education_level ?? 'Sin dato'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Inicio
            </Typography>
            <Typography variant="body2">{formatDate(selectedIntern.start_date)}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Fin
            </Typography>
            <Typography variant="body2">{formatDate(selectedIntern.end_date)}</Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default BecariosDetailPanel;
