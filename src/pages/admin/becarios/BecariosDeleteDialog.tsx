import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';

interface BecariosDeleteDialogProps {
  open: boolean;
  isLoading: boolean;
  internLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

const BecariosDeleteDialog: React.FC<BecariosDeleteDialogProps> = ({
  open,
  isLoading,
  internLabel,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Confirmar eliminacion</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Vas a eliminar este becario de forma permanente.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {internLabel || 'Becario seleccionado'}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={isLoading}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BecariosDeleteDialog;
