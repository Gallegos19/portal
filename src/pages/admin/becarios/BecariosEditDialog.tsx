import React from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button
} from '@mui/material';
import type { Intern, SocialFacilitator, Subproject } from '../../../types/api';

interface BecariosEditDialogProps {
  open: boolean;
  isLoading: boolean;
  editForm: Partial<Intern>;
  subprojects: Subproject[];
  facilitators: SocialFacilitator[];
  facilitatorMap: Map<string, string>;
  onClose: () => void;
  onChange: (field: keyof Intern, value: string | boolean) => void;
  onSubmit: () => void;
}

const BecariosEditDialog: React.FC<BecariosEditDialogProps> = ({
  open,
  isLoading,
  editForm,
  subprojects,
  facilitators,
  facilitatorMap,
  onClose,
  onChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar becario</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <FormControl size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={editForm.status ? 'activo' : 'inactivo'}
              label="Estado"
              onChange={(event) => onChange('status', event.target.value === 'activo')}
            >
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Direccion"
            value={editForm.address ?? ''}
            onChange={(event) => onChange('address', event.target.value)}
          />

          <TextField
            size="small"
            label="Nivel educativo"
            value={editForm.education_level ?? ''}
            onChange={(event) => onChange('education_level', event.target.value)}
          />

          <TextField
            size="small"
            label="Carrera"
            value={editForm.career_name ?? ''}
            onChange={(event) => onChange('career_name', event.target.value)}
          />

          <TextField
            size="small"
            label="Grado"
            value={editForm.grade ?? ''}
            onChange={(event) => onChange('grade', event.target.value)}
          />

          <TextField
            size="small"
            label="Tutor"
            value={editForm.name_tutor ?? ''}
            onChange={(event) => onChange('name_tutor', event.target.value)}
          />

          <TextField
            size="small"
            label="Servicio"
            value={editForm.service ?? ''}
            onChange={(event) => onChange('service', event.target.value)}
          />

          <TextField
            size="small"
            label="Documentacion"
            value={editForm.documentation ?? ''}
            onChange={(event) => onChange('documentation', event.target.value)}
          />

          <FormControl size="small">
            <InputLabel>Subproyecto</InputLabel>
            <Select
              value={editForm.id_subproject ?? ''}
              label="Subproyecto"
              onChange={(event) => onChange('id_subproject', event.target.value)}
            >
              <MenuItem value="">Sin subproyecto</MenuItem>
              {subprojects.map((subproject) => (
                <MenuItem key={subproject.id} value={subproject.id}>
                  {subproject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>Facilitador</InputLabel>
            <Select
              value={editForm.id_social_facilitator ?? ''}
              label="Facilitador"
              onChange={(event) => onChange('id_social_facilitator', event.target.value)}
            >
              <MenuItem value="">Sin facilitador</MenuItem>
              {facilitators.map((facilitator) => (
                <MenuItem key={facilitator.id} value={facilitator.id}>
                  {facilitatorMap.get(facilitator.id) ?? 'Sin nombre'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Inicio"
            type="date"
            value={editForm.start_date ?? ''}
            onChange={(event) => onChange('start_date', event.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            size="small"
            label="Fin"
            type="date"
            value={editForm.end_date ?? ''}
            onChange={(event) => onChange('end_date', event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
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

export default BecariosEditDialog;
