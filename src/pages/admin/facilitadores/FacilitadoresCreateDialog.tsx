import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { Status } from '../../../types/api';
import type { Region } from '../../../types/api';

interface CreateUserForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  status_id: string;
}

interface CreateFacilitatorForm {
  id_region: string;
}

interface FacilitadoresCreateDialogProps {
  open: boolean;
  activeStep: number;
  isLoading: boolean;
  userForm: CreateUserForm;
  userFormErrors: Partial<Record<keyof CreateUserForm, string>>;
  facilitatorForm: CreateFacilitatorForm;
  regions: Region[];
  onClose: () => void;
  onUserChange: (field: keyof CreateUserForm, value: string) => void;
  onFacilitatorChange: (field: keyof CreateFacilitatorForm, value: string) => void;
  onNextStep: () => void;
  onBackStep: () => void;
  onSubmit: () => void;
}

const steps = ['Crear usuario', 'Datos del facilitador'];

const formatStatusLabel = (value: string): string => {
  return `${value.charAt(0)}${value.slice(1).toLowerCase()}`;
};

const FacilitadoresCreateDialog: React.FC<FacilitadoresCreateDialogProps> = ({
  open,
  activeStep,
  isLoading,
  userForm,
  userFormErrors,
  facilitatorForm,
  regions,
  onClose,
  onUserChange,
  onFacilitatorChange,
  onNextStep,
  onBackStep,
  onSubmit
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setIsPasswordVisible(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nuevo facilitador</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Primero crea el usuario que quedara asociado al facilitador.
            </Typography>
            <TextField
              size="small"
              label="Nombre"
              value={userForm.first_name}
              onChange={(event) => onUserChange('first_name', event.target.value)}
              error={Boolean(userFormErrors.first_name)}
              helperText={userFormErrors.first_name}
              required
            />
            <TextField
              size="small"
              label="Apellidos"
              value={userForm.last_name}
              onChange={(event) => onUserChange('last_name', event.target.value)}
              error={Boolean(userFormErrors.last_name)}
              helperText={userFormErrors.last_name}
              required
            />
            <TextField
              size="small"
              type="email"
              label="Correo"
              value={userForm.email}
              onChange={(event) => onUserChange('email', event.target.value)}
              error={Boolean(userFormErrors.email)}
              helperText={userFormErrors.email}
              required
            />
            <TextField
              size="small"
              type={isPasswordVisible ? 'text' : 'password'}
              label="Contrasena"
              value={userForm.password}
              onChange={(event) => onUserChange('password', event.target.value)}
              error={Boolean(userFormErrors.password)}
              helperText={userFormErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setIsPasswordVisible((current) => !current)}
                      aria-label={isPasswordVisible ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                    >
                      {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              required
            />
            <FormControl size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={userForm.status_id}
                label="Estado"
                onChange={(event) => onUserChange('status_id', event.target.value)}
              >
                {Object.entries(Status).map(([statusId, statusLabel]) => (
                  <MenuItem key={statusId} value={statusId}>
                    {formatStatusLabel(statusLabel)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Completa la informacion del facilitador para finalizar el alta.
            </Typography>

            <FormControl size="small">
              <InputLabel>Region</InputLabel>
              <Select
                value={facilitatorForm.id_region}
                label="Region"
                onChange={(event) => onFacilitatorChange('id_region', event.target.value)}
              >
                {regions.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.name_region ?? region.name ?? 'Sin nombre'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          Cancelar
        </Button>

        {activeStep > 0 && (
          <Button onClick={onBackStep} color="inherit" disabled={isLoading}>
            Atras
          </Button>
        )}

        {activeStep === 0 ? (
          <Button onClick={onNextStep} variant="contained" disabled={isLoading}>
            Continuar
          </Button>
        ) : (
          <Button onClick={onSubmit} variant="contained" disabled={isLoading}>
            Crear facilitador
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export type { CreateFacilitatorForm, CreateUserForm };
export default FacilitadoresCreateDialog;
