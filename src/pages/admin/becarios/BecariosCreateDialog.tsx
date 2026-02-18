import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material';
import type { SocialFacilitator, Subproject } from '../../../types/api';

interface CreateUserForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface CreateInternForm {
  chid: string;
  status: boolean;
  address: string;
  education_level: string;
  career_name: string;
  grade: string;
  name_tutor: string;
  service: string;
  documentation: string;
  id_subproject: string;
  id_social_facilitator: string;
  start_date: string;
  end_date: string;
}

interface BecariosCreateDialogProps {
  open: boolean;
  activeStep: number;
  isLoading: boolean;
  userForm: CreateUserForm;
  internForm: CreateInternForm;
  subprojects: Subproject[];
  facilitators: SocialFacilitator[];
  facilitatorMap: Map<string, string>;
  onClose: () => void;
  onUserChange: (field: keyof CreateUserForm, value: string) => void;
  onInternChange: (field: keyof CreateInternForm, value: string | boolean) => void;
  onNextStep: () => void;
  onBackStep: () => void;
  onSubmit: () => void;
}

const steps = ['Crear usuario', 'Datos del becario'];

const BecariosCreateDialog: React.FC<BecariosCreateDialogProps> = ({
  open,
  activeStep,
  isLoading,
  userForm,
  internForm,
  subprojects,
  facilitators,
  facilitatorMap,
  onClose,
  onUserChange,
  onInternChange,
  onNextStep,
  onBackStep,
  onSubmit
}) => {
  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nuevo becario</DialogTitle>
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
              Primero crea el usuario que quedara asociado al becario.
            </Typography>
            <TextField
              size="small"
              label="Nombre"
              value={userForm.first_name}
              onChange={(event) => onUserChange('first_name', event.target.value)}
              required
            />
            <TextField
              size="small"
              label="Apellidos"
              value={userForm.last_name}
              onChange={(event) => onUserChange('last_name', event.target.value)}
              required
            />
            <TextField
              size="small"
              type="email"
              label="Correo"
              value={userForm.email}
              onChange={(event) => onUserChange('email', event.target.value)}
              required
            />
            <TextField
              size="small"
              type="password"
              label="Contrasena"
              value={userForm.password}
              onChange={(event) => onUserChange('password', event.target.value)}
              required
            />
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Completa la informacion del becario para finalizar el alta.
            </Typography>

            <TextField
              size="small"
              label="CHID"
              value={internForm.chid}
              onChange={(event) => onInternChange('chid', event.target.value)}
              required
            />

            <FormControl size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={internForm.status ? 'activo' : 'inactivo'}
                label="Estado"
                onChange={(event) => onInternChange('status', event.target.value === 'activo')}
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Direccion"
              value={internForm.address}
              onChange={(event) => onInternChange('address', event.target.value)}
            />

            <TextField
              size="small"
              label="Nivel educativo"
              value={internForm.education_level}
              onChange={(event) => onInternChange('education_level', event.target.value)}
            />

            <TextField
              size="small"
              label="Carrera"
              value={internForm.career_name}
              onChange={(event) => onInternChange('career_name', event.target.value)}
            />

            <TextField
              size="small"
              label="Grado"
              value={internForm.grade}
              onChange={(event) => onInternChange('grade', event.target.value)}
            />

            <TextField
              size="small"
              label="Tutor"
              value={internForm.name_tutor}
              onChange={(event) => onInternChange('name_tutor', event.target.value)}
            />

            <TextField
              size="small"
              label="Servicio"
              value={internForm.service}
              onChange={(event) => onInternChange('service', event.target.value)}
            />

            <TextField
              size="small"
              label="Documentacion"
              value={internForm.documentation}
              onChange={(event) => onInternChange('documentation', event.target.value)}
            />

            <FormControl size="small">
              <InputLabel>Subproyecto</InputLabel>
              <Select
                value={internForm.id_subproject}
                label="Subproyecto"
                onChange={(event) => onInternChange('id_subproject', event.target.value)}
              >
                <MenuItem value="">Sin subproyecto</MenuItem>
                {subprojects.map((subproject) => (
                  <MenuItem key={subproject.id} value={subproject.id}>
                    {subproject.name_subproject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>Facilitador</InputLabel>
              <Select
                value={internForm.id_social_facilitator}
                label="Facilitador"
                onChange={(event) => onInternChange('id_social_facilitator', event.target.value)}
              >
                <MenuItem value="">Sin facilitador</MenuItem>
                {facilitators.map((facilitator) => (
                  <MenuItem key={facilitator.id} value={facilitator.id}>
                    {facilitatorMap.get(facilitator.id) ?? 'Sin nombre'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Inicio"
              type="date"
              value={internForm.start_date}
              onChange={(event) => onInternChange('start_date', event.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              size="small"
              label="Fin"
              type="date"
              value={internForm.end_date}
              onChange={(event) => onInternChange('end_date', event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
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
            Crear becario
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export type { CreateInternForm, CreateUserForm };
export default BecariosCreateDialog;
