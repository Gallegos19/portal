import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { Status } from '../../../types/api';
import type { Region } from '../../../types/api';

interface EditUserForm {
  first_name: string;
  last_name: string;
  email: string;
  status_id: string;
}

interface EditFacilitatorForm {
  id_region: string;
  status_id: string;
}

interface FacilitadoresEditDialogProps {
  open: boolean;
  isLoading: boolean;
  userForm: EditUserForm;
  facilitatorForm: EditFacilitatorForm;
  regions: Region[];
  onClose: () => void;
  onUserChange: (field: keyof EditUserForm, value: string) => void;
  onFacilitatorChange: (field: keyof EditFacilitatorForm, value: string) => void;
  onSubmit: () => void;
}

const formatStatusLabel = (value: string): string => {
  return `${value.charAt(0)}${value.slice(1).toLowerCase()}`;
};

const FacilitadoresEditDialog: React.FC<FacilitadoresEditDialogProps> = ({
  open,
  isLoading,
  userForm,
  facilitatorForm,
  regions,
  onClose,
  onUserChange,
  onFacilitatorChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar facilitador</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField
            size="small"
            label="Nombre"
            value={userForm.first_name}
            onChange={(event) => onUserChange('first_name', event.target.value)}
          />

          <TextField
            size="small"
            label="Apellidos"
            value={userForm.last_name}
            onChange={(event) => onUserChange('last_name', event.target.value)}
          />

          <TextField
            size="small"
            type="email"
            label="Correo"
            value={userForm.email}
            onChange={(event) => onUserChange('email', event.target.value)}
          />

          <FormControl size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={facilitatorForm.status_id}
              label="Estado"
              onChange={(event) => onFacilitatorChange('status_id', event.target.value)}
            >
              {Object.entries(Status).map(([statusId, statusLabel]) => (
                <MenuItem key={statusId} value={statusId}>
                  {formatStatusLabel(statusLabel)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>Region</InputLabel>
            <Select
              value={facilitatorForm.id_region}
              label="Region"
              onChange={(event) => onFacilitatorChange('id_region', event.target.value)}
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name_region ?? region.name ?? 'Sin nombre'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={isLoading}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export type { EditFacilitatorForm, EditUserForm };
export default FacilitadoresEditDialog;
