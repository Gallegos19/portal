import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import type { Region } from '../../../types/api';

interface RegionesDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  region: Region;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const RegionesDeleteDialog: React.FC<RegionesDeleteDialogProps> = ({
  open,
  onClose,
  region,
  onConfirm,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar Región</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography>
          ¿Está seguro de que desea eliminar la región <strong>{region.name_region ?? region.name}</strong>?
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegionesDeleteDialog;
