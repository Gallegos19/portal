import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import type { Event } from '../../../types/api';
import { Status } from '../../../types/api';

interface EventosEditDialogProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  onSubmit: (data: Partial<Event>) => Promise<void>;
  loading: boolean;
}

const EventosEditDialog: React.FC<EventosEditDialogProps> = ({
  open,
  onClose,
  event,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.description || '',
    status_id: event.status_id || Object.keys(Status)[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        status_id: event.status_id || Object.keys(Status)[0],
      });
    }
  }, [open, event]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onSubmit({
          title: formData.title,
          description: formData.description,
          status_id: formData.status_id,
        });
      } catch {
        // Error handling is done in parent component
      }
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Editar Evento</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Título del Evento"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            disabled={loading}
            multiline
            rows={3}
          />
          <TextField
            label="Estado"
            value={formData.status_id}
            onChange={(e) => setFormData({ ...formData, status_id: e.target.value })}
            select
            fullWidth
            disabled={loading}
          >
            {Object.entries(Status).map(([id, label]) => (
              <MenuItem key={id} value={id}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)',
            color: 'white',
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventosEditDialog;
