import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export interface TrainingFormValues {
  title: string;
  description: string;
  url: string;
  tiempo: string;
  target_audience: string;
}

interface CapacitacionesFormDialogProps {
  open: boolean;
  title: string;
  initialValues: TrainingFormValues;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: TrainingFormValues) => void;
}

const CapacitacionesFormDialog: React.FC<CapacitacionesFormDialogProps> = ({
  open,
  title,
  initialValues,
  submitting,
  onClose,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState<TrainingFormValues>(initialValues);

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton edge="end" onClick={onClose} disabled={submitting}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Título"
              value={formValues.title}
              onChange={(e) => setFormValues((prev) => ({ ...prev, title: e.target.value }))}
              required
            />

            <TextField
              fullWidth
              size="small"
              label="Descripción"
              multiline
              rows={3}
              value={formValues.description}
              onChange={(e) => setFormValues((prev) => ({ ...prev, description: e.target.value }))}
            />

            <TextField
              fullWidth
              size="small"
              label="URL"
              placeholder="https://..."
              value={formValues.url}
              onChange={(e) => setFormValues((prev) => ({ ...prev, url: e.target.value }))}
              required
            />

            <TextField
              fullWidth
              size="small"
              label="Duración"
              type="time"
              value={formValues.tiempo}
              onChange={(e) => setFormValues((prev) => ({ ...prev, tiempo: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />

            <FormControl fullWidth size="small" required>
              <InputLabel>Audiencia</InputLabel>
              <Select
                value={formValues.target_audience}
                label="Audiencia"
                onChange={(e: SelectChangeEvent) =>
                  setFormValues((prev) => ({ ...prev, target_audience: e.target.value }))
                }
              >
                <MenuItem value="Becario">Becario</MenuItem>
                <MenuItem value="Facilitador">Facilitador</MenuItem>
                <MenuItem value="Ambos">Ambos</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CapacitacionesFormDialog;
