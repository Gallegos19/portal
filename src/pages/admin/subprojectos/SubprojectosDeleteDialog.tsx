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
import type { Subproject } from '../../../types/api';

interface SubprojectosDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  subproject: Subproject;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const SubprojectosDeleteDialog: React.FC<SubprojectosDeleteDialogProps> = ({
  open,
  onClose,
  subproject,
  onConfirm,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar Subproyecto</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography>
          ¿Está seguro de que desea eliminar el subproyecto <strong>{subproject.name_subproject}</strong>?
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

export default SubprojectosDeleteDialog;
