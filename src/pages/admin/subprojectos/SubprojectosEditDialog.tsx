import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Box } from '@mui/material';
import { Status } from '../../../types/api';
import type { Subproject, Region, Coordinator, SocialFacilitator } from '../../../types/api';

interface SubprojectosEditDialogProps {
  open: boolean;
  onClose: () => void;
  subproject: Subproject;
  onSubmit: (data: Partial<Subproject>) => Promise<void>;
  loading: boolean;
  regiones: Region[];
  coordinadores: Coordinator[];
  facilitadores: SocialFacilitator[];
}

const SubprojectosEditDialog: React.FC<SubprojectosEditDialogProps> = ({
  open,
  onClose,
  subproject,
  onSubmit,
  loading,
  regiones,
  coordinadores,
  facilitadores,
}) => {
  const [formData, setFormData] = useState({
    name_subproject: '',
    id_region: '',
    id_coordinator: '',
    id_social_facilitator: '',
    status_id: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && subproject) {
      setFormData({
        name_subproject: subproject.name_subproject ?? '',
        id_region: subproject.id_region ?? subproject.region_id ?? '',
        id_coordinator: subproject.coordinator_id ?? '',
        id_social_facilitator: subproject.social_facilitator_id ?? '',
        status_id: subproject.status_id ?? '',
      });
      setErrors({});
    }
  }, [open, subproject]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name_subproject.trim()) newErrors.name_subproject = 'El nombre es requerido';
    if (!formData.status_id) newErrors.status_id = 'El estado es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error updating subproject:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name_subproject: '',
      id_region: '',
      id_coordinator: '',
      id_social_facilitator: '',
      status_id: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Subproyecto</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre del subproyecto"
            value={formData.name_subproject}
            onChange={(e) => {
              setFormData({ ...formData, name_subproject: e.target.value });
              if (errors.name_subproject) setErrors({ ...errors, name_subproject: '' });
            }}
            error={!!errors.name_subproject}
            helperText={errors.name_subproject}
            fullWidth
          />
          <TextField
            label="Región"
            value={formData.id_region}
            onChange={(e) => setFormData({ ...formData, id_region: e.target.value })}
            select
            fullWidth
          >
            <MenuItem value="">Seleccionar región</MenuItem>
            {regiones.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name_region ?? region.name ?? 'Sin nombre'}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Coordinador"
            value={formData.id_coordinator}
            onChange={(e) => setFormData({ ...formData, id_coordinator: e.target.value })}
            select
            fullWidth
          >
            <MenuItem value="">Seleccionar coordinador</MenuItem>
            {coordinadores.map((coordinador) => (
              <MenuItem key={coordinador.id} value={coordinador.id}>
                Coordinador {coordinador.id.substring(0, 8)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Facilitador Social"
            value={formData.id_social_facilitator}
            onChange={(e) => setFormData({ ...formData, id_social_facilitator: e.target.value })}
            select
            fullWidth
          >
            <MenuItem value="">Seleccionar facilitador</MenuItem>
            {facilitadores.map((facilitador) => (
              <MenuItem key={facilitador.id} value={facilitador.id}>
                Facilitador {facilitador.id.substring(0, 8)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Estado"
            value={formData.status_id}
            onChange={(e) => {
              setFormData({ ...formData, status_id: e.target.value });
              if (errors.status_id) setErrors({ ...errors, status_id: '' });
            }}
            select
            error={!!errors.status_id}
            helperText={errors.status_id}
            fullWidth
          >
            {Object.entries(Status).map(([id, value]) => (
              <MenuItem key={id} value={id}>
                {`${value.charAt(0)}${value.slice(1).toLowerCase()}`}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubprojectosEditDialog;
