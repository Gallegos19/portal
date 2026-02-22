import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Box } from '@mui/material';
import { Status } from '../../../types/api';
import type { Region } from '../../../types/api';

interface RegionesCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Region, 'id'>) => Promise<void>;
  loading: boolean;
}

const RegionesCreateDialog: React.FC<RegionesCreateDialogProps> = ({ open, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name_region: '',
    status_id: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name_region.trim()) newErrors.name_region = 'El nombre es requerido';
    if (!formData.status_id) newErrors.status_id = 'El estado es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await onSubmit(formData);
      setFormData({ name_region: '', status_id: '' });
      setErrors({});
    } catch (error) {
      console.error('Error creating region:', error);
    }
  };

  const handleClose = () => {
    setFormData({ name_region: '', status_id: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nueva Región</DialogTitle>
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
          {loading ? 'Creando...' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegionesCreateDialog;
