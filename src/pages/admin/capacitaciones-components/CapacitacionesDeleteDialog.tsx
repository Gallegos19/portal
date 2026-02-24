import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface CapacitacionesDeleteDialogProps {
  open: boolean;
  title?: string;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CapacitacionesDeleteDialog: React.FC<CapacitacionesDeleteDialogProps> = ({
  open,
  title,
  deleting,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar capacitación</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary">
          ¿Seguro que deseas eliminar la capacitación{' '}
          <Typography component="span" fontWeight={600} color="text.primary">
            {title || ''}
          </Typography>
          ?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={deleting}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={deleting}>
          {deleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CapacitacionesDeleteDialog;
