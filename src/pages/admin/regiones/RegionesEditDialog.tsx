import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Box } from '@mui/material';
import type { Region, Coordinator } from '../../../types/api';
import type { UpdateRegionPayload } from '../../../services/api/region';

interface RegionesEditDialogProps {
  open: boolean;
  onClose: () => void;
  region: Region;
  onSubmit: (data: UpdateRegionPayload) => Promise<void>;
  loading: boolean;
  coordinadores: Coordinator[];
  coordinatorLabelMap: Map<string, string>;
}

const RegionesEditDialog: React.FC<RegionesEditDialogProps> = ({
  open,
  onClose,
  region,
  onSubmit,
  loading,
  coordinadores,
  coordinatorLabelMap,
}) => {
  const [formData, setFormData] = useState<UpdateRegionPayload>({
    name_region: '',
    id_coordinator: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && region) {
      setFormData({
        name_region: region.name_region ?? region.name ?? '',
        id_coordinator: region.id_coordinator ?? '',
      });
      setErrors({});
    }
  }, [open, region]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name_region?.trim()) newErrors.name_region = 'El nombre es requerido';
    if (!formData.id_coordinator) newErrors.id_coordinator = 'El coordinador es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error updating region:', error);
    }
  };

  const handleClose = () => {
    setFormData({ name_region: '', id_coordinator: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Región</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre de la región"
            value={formData.name_region}
            onChange={(e) => {
              setFormData({ ...formData, name_region: e.target.value });
              if (errors.name_region) setErrors({ ...errors, name_region: '' });
            }}
            error={!!errors.name_region}
            helperText={errors.name_region}
            fullWidth
          />
          <TextField
            label="Coordinador"
            value={formData.id_coordinator}
            onChange={(e) => {
              setFormData({ ...formData, id_coordinator: e.target.value });
              if (errors.id_coordinator) setErrors({ ...errors, id_coordinator: '' });
            }}
            select
            error={!!errors.id_coordinator}
            helperText={errors.id_coordinator}
            fullWidth
          >
            <MenuItem value="">Seleccionar coordinador</MenuItem>
            {coordinadores.map((coordinador) => (
              <MenuItem key={coordinador.id} value={coordinador.id}>
                {coordinatorLabelMap.get(coordinador.id) ?? `Coordinador ${coordinador.id.substring(0, 8)}`}
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

export default RegionesEditDialog;
