import React from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Status } from '../../types/api';
import type { Region, SocialFacilitator, UserApi } from '../../types/api';
import { USER_ROLES } from '../../utils/constants';
import { useToast } from '../../hooks/useToast';
import { regionService } from '../../services/api/region';
import { socialFacilitatorService } from '../../services/api/socialFacilitator';
import { userService } from '../../services/api/user';
import FacilitadoresCreateDialog from './facilitadores/FacilitadoresCreateDialog';
import FacilitadoresDeleteDialog from './facilitadores/FacilitadoresDeleteDialog';
import FacilitadoresDetailPanel from './facilitadores/FacilitadoresDetailPanel';
import FacilitadoresEditDialog from './facilitadores/FacilitadoresEditDialog';
import FacilitadoresFilters from './facilitadores/FacilitadoresFilters';
import FacilitadoresTable from './facilitadores/FacilitadoresTable';
import type {
  CreateFacilitatorForm,
  CreateUserForm as CreateFacilitatorUserForm
} from './facilitadores/FacilitadoresCreateDialog';
import type {
  EditFacilitatorForm,
  EditUserForm
} from './facilitadores/FacilitadoresEditDialog';

const STATUS_ID_BY_VALUE = Object.entries(Status).reduce(
  (accumulator, [statusId, statusValue]) => {
    accumulator[statusValue] = statusId;
    return accumulator;
  },
  {} as Record<string, string>
);

const ACTIVE_STATUS_ID = STATUS_ID_BY_VALUE.ACTIVO ?? '';

const buildUserMap = (users: UserApi[]): Map<string, UserApi> => {
  return new Map(users.map((user) => [user.id, user]));
};

const buildRegionMap = (regions: Region[]): Map<string, string> => {
  return new Map(
    regions.map((region) => [region.id, region.name_region ?? region.name ?? 'Sin nombre'])
  );
};

const getFacilitatorStatusId = (
  facilitator?: SocialFacilitator | null,
  user?: UserApi | null
): string | undefined => {
  return facilitator?.status_id ?? user?.status_id;
};

const getStatusLabel = (
  facilitator?: SocialFacilitator | null,
  user?: UserApi | null
): string => {
  const statusId = getFacilitatorStatusId(facilitator, user);
  const statusValue = statusId ? Status[statusId as keyof typeof Status] : undefined;

  if (statusValue) {
    return `${statusValue.charAt(0)}${statusValue.slice(1).toLowerCase()}`;
  }

  return 'Sin estado';
};

const getStatusColor = (
  facilitator?: SocialFacilitator | null,
  user?: UserApi | null
): 'default' | 'success' | 'warning' => {
  const statusId = getFacilitatorStatusId(facilitator, user);
  const statusValue = statusId ? Status[statusId as keyof typeof Status] : undefined;
  
  if (statusValue === 'ACTIVO') {
    return 'success';
  }

  if (statusValue === 'ELIMINADO') {
    return 'warning';
  }

  return 'default';
};

const validateEmail = (value: string): string | null => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'El correo es obligatorio';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedValue)) {
    return 'Ingresa un correo valido';
  }

  return null;
};

const validatePassword = (value: string): string | null => {
  if (!value) {
    return 'La contrasena es obligatoria';
  }

  if (value.length < 8) {
    return 'Debe tener al menos 8 caracteres';
  }

  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return 'Usa mayuscula, minuscula y numero';
  }

  return null;
};

const initialCreateUserForm: CreateFacilitatorUserForm = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  status_id: ACTIVE_STATUS_ID
};

const initialCreateFacilitatorForm: CreateFacilitatorForm = {
  id_region: ''
};

const initialEditUserForm: EditUserForm = {
  first_name: '',
  last_name: '',
  email: '',
  status_id: ACTIVE_STATUS_ID
};

const initialEditFacilitatorForm: EditFacilitatorForm = {
  id_region: '',
  status_id: ACTIVE_STATUS_ID
};

type CreateUserErrors = Partial<Record<keyof CreateFacilitatorUserForm, string>>;

const Facilitadores: React.FC = () => {
  const [facilitators, setFacilitators] = React.useState<SocialFacilitator[]>([]);
  const [users, setUsers] = React.useState<UserApi[]>([]);
  const [regions, setRegions] = React.useState<Region[]>([]);

  const [selectedFacilitator, setSelectedFacilitator] = React.useState<SocialFacilitator | null>(null);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('todos');
  const [regionFilter, setRegionFilter] = React.useState('todos');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const { toast, showToast, closeToast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [createStep, setCreateStep] = React.useState(0);
  const [createUserForm, setCreateUserForm] = React.useState<CreateFacilitatorUserForm>(initialCreateUserForm);
  const [createUserErrors, setCreateUserErrors] = React.useState<CreateUserErrors>({});
  const [createFacilitatorForm, setCreateFacilitatorForm] = React.useState<CreateFacilitatorForm>(initialCreateFacilitatorForm);
  const [createdUserId, setCreatedUserId] = React.useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editUserForm, setEditUserForm] = React.useState<EditUserForm>(initialEditUserForm);
  const [editFacilitatorForm, setEditFacilitatorForm] = React.useState<EditFacilitatorForm>(initialEditFacilitatorForm);
  const [editingFacilitatorId, setEditingFacilitatorId] = React.useState<string | null>(null);
  const [editingUserId, setEditingUserId] = React.useState<string | null>(null);

  const [facilitatorPendingDelete, setFacilitatorPendingDelete] = React.useState<SocialFacilitator | null>(null);

  const userMap = React.useMemo(() => buildUserMap(users), [users]);
  const regionMap = React.useMemo(() => buildRegionMap(regions), [regions]);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [facilitatorResponse, userResponse, regionResponse] = await Promise.all([
        socialFacilitatorService.getAll(),
        userService.getAll(),
        regionService.getAll()
      ]);

      setFacilitators(facilitatorResponse.data);
      setUsers(userResponse.data);
      setRegions(regionResponse.data);
    } catch (error) {
      console.error('Error cargando facilitadores:', error);
      setErrorMessage('No se pudieron cargar los facilitadores.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredFacilitators = facilitators.filter((facilitator) => {
    const user = userMap.get(facilitator.id_user);
    const name = user ? `${user.first_name} ${user.last_name}` : '';
    const email = user?.email ?? '';

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const statusId = getFacilitatorStatusId(facilitator, user);
    const statusValue = statusId ? Status[statusId as keyof typeof Status] : undefined;
    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'activo' && statusValue === 'ACTIVO') ||
      (statusFilter === 'inactivo' && statusValue === 'INACTIVO') ||
      (statusFilter === 'eliminado' && statusValue === 'ELIMINADO');

    const matchesRegion = regionFilter === 'todos' || facilitator.id_region === regionFilter;

    return matchesSearch && matchesStatus && matchesRegion;
  });

  const paginatedFacilitators = filteredFacilitators.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const selectedUser = selectedFacilitator ? userMap.get(selectedFacilitator.id_user) : null;
  const selectedRegionName = selectedFacilitator
    ? regionMap.get(selectedFacilitator.id_region)
    : undefined;

  const resetCreateFlow = () => {
    setIsCreateOpen(false);
    setCreateStep(0);
    setCreateUserForm(initialCreateUserForm);
    setCreateUserErrors({});
    setCreateFacilitatorForm(initialCreateFacilitatorForm);
    setCreatedUserId(null);
  };

  const handleOpenCreate = () => {
    resetCreateFlow();
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    if (isLoading) {
      return;
    }

    resetCreateFlow();
  };

  const handleCreateUserChange = (field: keyof CreateFacilitatorUserForm, value: string) => {
    setCreateUserForm((current) => ({
      ...current,
      [field]: value
    }));

    if (createUserErrors[field]) {
      setCreateUserErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors[field];

        return nextErrors;
      });
    }
  };

  const handleCreateFacilitatorChange = (field: keyof CreateFacilitatorForm, value: string) => {
    setCreateFacilitatorForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleCreateNextStep = async () => {
    if (createdUserId) {
      setCreateStep(1);
      return;
    }

    const nextErrors: CreateUserErrors = {};

    if (!createUserForm.first_name.trim()) {
      nextErrors.first_name = 'El nombre es obligatorio';
    }

    if (!createUserForm.last_name.trim()) {
      nextErrors.last_name = 'Los apellidos son obligatorios';
    }

    const emailError = validateEmail(createUserForm.email);
    if (emailError) {
      nextErrors.email = emailError;
    }

    const passwordError = validatePassword(createUserForm.password);
    if (passwordError) {
      nextErrors.password = passwordError;
    }

    setCreateUserErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showToast('Completa los datos del usuario', 'warning');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userResponse = await userService.create({
        first_name: createUserForm.first_name.trim(),
        last_name: createUserForm.last_name.trim(),
        email: createUserForm.email.trim().toLowerCase(),
        password: createUserForm.password,
        role: USER_ROLES.FACILITADOR,
        status_id: createUserForm.status_id
      });

      setCreatedUserId(userResponse.data.id);
      setCreateStep(1);
      showToast('Usuario creado, completa datos del facilitador');
    } catch (error) {
      console.error('Error creando usuario para facilitador:', error);
      setErrorMessage('No se pudo crear el usuario del facilitador.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFacilitator = async () => {
    if (!createdUserId) {
      showToast('Primero crea el usuario del facilitador', 'warning');
      return;
    }

    if (!createFacilitatorForm.id_region) {
      showToast('Selecciona una region', 'warning');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await socialFacilitatorService.create({
        id_user: createdUserId,
        id_region: createFacilitatorForm.id_region,
        status_id: createUserForm.status_id
      });

      resetCreateFlow();
      showToast('Facilitador creado correctamente');
      await loadData();
    } catch (error) {
      console.error('Error creando facilitador:', error);
      setErrorMessage('No se pudo crear el facilitador.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (facilitator: SocialFacilitator) => {
    const user = userMap.get(facilitator.id_user);

    setEditingFacilitatorId(facilitator.id);
    setEditingUserId(facilitator.id_user);

    const statusId = getFacilitatorStatusId(facilitator, user) ?? ACTIVE_STATUS_ID;

    setEditUserForm({
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      status_id: statusId
    });

    setEditFacilitatorForm({
      id_region: facilitator.id_region,
      status_id: statusId
    });

    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditUserForm(initialEditUserForm);
    setEditFacilitatorForm(initialEditFacilitatorForm);
    setEditingFacilitatorId(null);
    setEditingUserId(null);
  };

  const handleEditUserChange = (field: keyof EditUserForm, value: string) => {
    setEditUserForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleEditFacilitatorChange = (field: keyof EditFacilitatorForm, value: string) => {
    setEditFacilitatorForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmitEdit = async () => {
    if (!editingFacilitatorId || !editingUserId) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await userService.updateById(editingUserId, {
        first_name: editUserForm.first_name.trim(),
        last_name: editUserForm.last_name.trim(),
        email: editUserForm.email.trim().toLowerCase(),
        status_id: editUserForm.status_id
      });

      await socialFacilitatorService.updateById(editingFacilitatorId, {
        id_region: editFacilitatorForm.id_region,
        status_id: editFacilitatorForm.status_id
      });

      handleCloseEdit();
      showToast('Facilitador actualizado correctamente');
      await loadData();
    } catch (error) {
      console.error('Error actualizando facilitador:', error);
      setErrorMessage('No se pudo actualizar el facilitador.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestDelete = (facilitator: SocialFacilitator) => {
    setFacilitatorPendingDelete(facilitator);
  };

  const handleCloseDeleteDialog = () => {
    if (isLoading) {
      return;
    }

    setFacilitatorPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!facilitatorPendingDelete) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await socialFacilitatorService.deleteById(facilitatorPendingDelete.id);
      setSelectedFacilitator((current) =>
        current?.id === facilitatorPendingDelete.id ? null : current
      );
      setFacilitatorPendingDelete(null);
      showToast('Eliminado correctamente');
      await loadData();
    } catch (error) {
      console.error('Error eliminando facilitador:', error);
      setErrorMessage('No se pudo eliminar el facilitador.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Facilitadores
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta y administra la informacion general de los facilitadores
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={isLoading}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            disabled={isLoading}
          >
            Nuevo facilitador
          </Button>
        </Box>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        <Paper sx={{ p: 3, flex: 2 }}>
          <FacilitadoresFilters
            searchTerm={searchTerm}
            onSearchChange={(value: string) => {
              setSearchTerm(value);
              setPage(0);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(value: string) => {
              setStatusFilter(value);
              setPage(0);
            }}
            regionFilter={regionFilter}
            onRegionFilterChange={(value: string) => {
              setRegionFilter(value);
              setPage(0);
            }}
            regions={regions}
            totalCount={filteredFacilitators.length}
          />

          <FacilitadoresTable
            facilitators={paginatedFacilitators}
            userMap={userMap}
            regionMap={regionMap}
            selectedFacilitatorId={selectedFacilitator?.id ?? null}
            isLoading={isLoading}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={filteredFacilitators.length}
            getStatusLabel={getStatusLabel}
            getStatusColor={getStatusColor}
            onSelect={setSelectedFacilitator}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
            onPageChange={setPage}
            onRowsPerPageChange={(value: number) => {
              setRowsPerPage(value);
              setPage(0);
            }}
          />
        </Paper>

        <Paper sx={{ p: 3, flex: 1, minWidth: { xs: '100%', lg: 320 } }}>
          <FacilitadoresDetailPanel
            selectedFacilitator={selectedFacilitator}
            selectedUser={selectedUser}
            selectedRegionName={selectedRegionName}
            statusLabel={getStatusLabel(selectedFacilitator, selectedUser)}
            statusColor={getStatusColor(selectedFacilitator, selectedUser)}
            onClear={() => setSelectedFacilitator(null)}
          />
        </Paper>
      </Box>

      <FacilitadoresCreateDialog
        open={isCreateOpen}
        activeStep={createStep}
        isLoading={isLoading}
        userForm={createUserForm}
        userFormErrors={createUserErrors}
        facilitatorForm={createFacilitatorForm}
        regions={regions}
        onClose={handleCloseCreate}
        onUserChange={handleCreateUserChange}
        onFacilitatorChange={handleCreateFacilitatorChange}
        onNextStep={handleCreateNextStep}
        onBackStep={() => setCreateStep(0)}
        onSubmit={handleCreateFacilitator}
      />

      <FacilitadoresEditDialog
        open={isEditOpen}
        isLoading={isLoading}
        userForm={editUserForm}
        facilitatorForm={editFacilitatorForm}
        regions={regions}
        onClose={handleCloseEdit}
        onUserChange={handleEditUserChange}
        onFacilitatorChange={handleEditFacilitatorChange}
        onSubmit={handleSubmitEdit}
      />

      <FacilitadoresDeleteDialog
        open={Boolean(facilitatorPendingDelete)}
        isLoading={isLoading}
        facilitatorLabel={
          facilitatorPendingDelete
            ? `${userMap.get(facilitatorPendingDelete.id_user)?.first_name ?? ''} ${userMap.get(facilitatorPendingDelete.id_user)?.last_name ?? ''}`.trim() || facilitatorPendingDelete.id
            : ''
        }
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={2200}
        onClose={(_, reason) => closeToast(reason)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => closeToast()} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Facilitadores;
