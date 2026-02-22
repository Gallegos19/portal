import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import type { Event } from '../../../types/api';

interface EventosDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const EventosDeleteDialog: React.FC<EventosDeleteDialogProps> = ({
  open,
  onClose,
  event,
  onConfirm,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon sx={{ color: '#ef4444' }} />
        Confirmar Eliminación
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            ¿Estás seguro de que deseas eliminar el evento "{event.title}"?
          </Typography>
          <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 500 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventosDeleteDialog;
