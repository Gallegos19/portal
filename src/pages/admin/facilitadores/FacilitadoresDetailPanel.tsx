import React from 'react';
import { Box, Button, Chip, Divider, Tooltip, Typography } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import type { SocialFacilitator, UserApi } from '../../../types/api';

interface FacilitadoresDetailPanelProps {
  selectedFacilitator: SocialFacilitator | null;
  selectedUser: UserApi | null | undefined;
  selectedRegionName?: string;
  statusLabel: string;
  statusColor: 'default' | 'success' | 'warning';
  onClear: () => void;
}

const FacilitadoresDetailPanel: React.FC<FacilitadoresDetailPanelProps> = ({
  selectedFacilitator,
  selectedUser,
  selectedRegionName,
  statusLabel,
  statusColor,
  onClear
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Detalle del facilitador
        </Typography>
        {selectedFacilitator && (
          <Tooltip title="Limpiar seleccion">
            <Button size="small" variant="text" startIcon={<ClearIcon />} onClick={onClear}>
              Limpiar
            </Button>
          </Tooltip>
        )}
      </Box>

      {!selectedFacilitator ? (
        <Typography variant="body2" color="text.secondary">
          Selecciona un facilitador para ver su informacion detallada.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Nombre
            </Typography>
            <Typography variant="body1">
              {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : 'Sin datos'}
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
              Estado
            </Typography>
            <Chip
              label={statusLabel}
              color={statusColor}
              size="small"
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Region
            </Typography>
            <Typography variant="body1">{selectedRegionName ?? 'Sin region'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              ID facilitador
            </Typography>
            <Typography variant="body2">{selectedFacilitator.id}</Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default FacilitadoresDetailPanel;
