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
import type { Intern, Region, SocialFacilitator, Subproject, UserApi } from '../../types/api';
import { USER_ROLES } from '../../utils/constants';
import { useToast } from '../../hooks/useToast';
import { internService } from '../../services/api/intern';
import { regionService } from '../../services/api/region';
import { socialFacilitatorService } from '../../services/api/socialFacilitator';
import { subprojectService } from '../../services/api/subproject';
import { userService } from '../../services/api/user';
import BecariosCreateDialog from './becarios/BecariosCreateDialog';
import BecariosDeleteDialog from './becarios/BecariosDeleteDialog';
import BecariosDetailPanel from './becarios/BecariosDetailPanel';
import BecariosEditDialog from './becarios/BecariosEditDialog';
import BecariosFilters from './becarios/BecariosFilters';
import BecariosTable from './becarios/BecariosTable';
import type { CreateInternForm, CreateUserForm } from './becarios/BecariosCreateDialog';

const formatDate = (value?: string): string => {
  if (!value) {
    return 'Sin fecha';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }

  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
};

const buildUserMap = (users: UserApi[]): Map<string, UserApi> => {
  return new Map(users.map((user) => [user.id, user]));
};

const buildSubprojectMap = (subprojects: Subproject[]): Map<string, Subproject> => {
  return new Map(subprojects.map((subproject) => [subproject.id, subproject]));
};

const getSubprojectRegionId = (subproject?: Subproject): string | undefined => {
  if (!subproject) {
    return undefined;
  }

  return subproject.id_region ?? subproject.region_id;
};

const buildFacilitatorMap = (
  facilitators: SocialFacilitator[],
  userMap: Map<string, UserApi>
): Map<string, string> => {
  const entries = facilitators.map((facilitator) => {
    const user = userMap.get(facilitator.id_user);
    const label = user ? `${user.first_name} ${user.last_name}`.trim() : 'Sin nombre';

    return [facilitator.id, label] as const;
  });

  return new Map(entries);
};

const initialCreateUserForm: CreateUserForm = {
  first_name: '',
  last_name: '',
  email: '',
  password: ''
};

const initialCreateInternForm: CreateInternForm = {
  chid: '',
  status: true,
  address: '',
  education_level: '',
  career_name: '',
  grade: '',
  name_tutor: '',
  service: '',
  documentation: '',
  id_subproject: '',
  id_social_facilitator: '',
  start_date: '',
  end_date: ''
};

type CreateUserErrors = Partial<Record<keyof CreateUserForm, string>>;

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

const Becarios: React.FC = () => {
  const [interns, setInterns] = React.useState<Intern[]>([]);
  const [users, setUsers] = React.useState<UserApi[]>([]);
  const [subprojects, setSubprojects] = React.useState<Subproject[]>([]);
  const [regions, setRegions] = React.useState<Region[]>([]);
  const [facilitators, setFacilitators] = React.useState<SocialFacilitator[]>([]);
  const [selectedIntern, setSelectedIntern] = React.useState<Intern | null>(null);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [createStep, setCreateStep] = React.useState(0);
  const [createUserForm, setCreateUserForm] = React.useState<CreateUserForm>(initialCreateUserForm);
  const [createUserErrors, setCreateUserErrors] = React.useState<CreateUserErrors>({});
  const [createInternForm, setCreateInternForm] = React.useState<CreateInternForm>(initialCreateInternForm);
  const [createdUserId, setCreatedUserId] = React.useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState<Partial<Intern>>({});

  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('todos');
  const [facilitatorFilter, setFacilitatorFilter] = React.useState('todos');
  const [regionFilter, setRegionFilter] = React.useState('todos');
  const [subprojectFilter, setSubprojectFilter] = React.useState('todos');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const { toast, showToast, closeToast } = useToast();
  const [internPendingDelete, setInternPendingDelete] = React.useState<Intern | null>(null);

  const userMap = React.useMemo(() => buildUserMap(users), [users]);
  const subprojectMap = React.useMemo(() => buildSubprojectMap(subprojects), [subprojects]);
  const facilitatorMap = React.useMemo(
    () => buildFacilitatorMap(facilitators, userMap),
    [facilitators, userMap]
  );

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [internResponse, userResponse, subprojectResponse, regionResponse, facilitatorResponse] = await Promise.all([
        internService.getAll(),
        userService.getAll(),
        subprojectService.getAll(),
        regionService.getAll(),
        socialFacilitatorService.getAll()
      ]);

      setInterns(internResponse.data);
      setUsers(userResponse.data);
      setSubprojects(subprojectResponse.data);
      setRegions(regionResponse.data);
      setFacilitators(facilitatorResponse.data);
    } catch (error) {
      console.error('Error cargando becarios:', error);
      setErrorMessage('No se pudieron cargar los becarios.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredInterns = interns.filter((intern) => {
    const user = userMap.get(intern.id_user);
    const name = user ? `${user.first_name} ${user.last_name}` : '';
    const email = user?.email ?? '';
    const searchValue = searchTerm.toLowerCase();

    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'activo' && intern.status) ||
      (statusFilter === 'inactivo' && !intern.status);

    const matchesFacilitator =
      facilitatorFilter === 'todos' || intern.id_social_facilitator === facilitatorFilter;

    const internSubproject = intern.id_subproject ? subprojectMap.get(intern.id_subproject) : undefined;
    const matchesRegion =
      regionFilter === 'todos' || getSubprojectRegionId(internSubproject) === regionFilter;

    const matchesSubproject =
      subprojectFilter === 'todos' || intern.id_subproject === subprojectFilter;

    return (
      (name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        intern.chid.toLowerCase().includes(searchValue)) &&
      matchesStatus &&
      matchesFacilitator &&
      matchesRegion &&
      matchesSubproject
    );
  });

  const paginatedInterns = filteredInterns.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const selectedUser = selectedIntern ? userMap.get(selectedIntern.id_user) : null;
  const selectedSubproject = selectedIntern?.id_subproject
    ? subprojectMap.get(selectedIntern.id_subproject)
    : undefined;
  const selectedFacilitator = selectedIntern?.id_social_facilitator
    ? facilitatorMap.get(selectedIntern.id_social_facilitator)
    : undefined;

  const handleSelectIntern = (intern: Intern) => {
    setSelectedIntern(intern);
  };

  const handleClearSelection = () => {
    setSelectedIntern(null);
  };

  const formatDateInput = (value?: string): string => {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().slice(0, 10);
  };

  const handleOpenEdit = (intern: Intern) => {
    setEditForm({
      ...intern,
      start_date: formatDateInput(intern.start_date),
      end_date: formatDateInput(intern.end_date)
    });
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditForm({});
  };

  const handleEditChange = (field: keyof Intern, value: string | boolean) => {
    setEditForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleCopyEmail = async (email?: string) => {
    if (!email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      showToast('Correo copiado');
    } catch (error) {
      console.error('No se pudo copiar el correo:', error);
    }
  };

  const resetCreateFlow = () => {
    setIsCreateOpen(false);
    setCreateStep(0);
    setCreateUserForm(initialCreateUserForm);
    setCreateUserErrors({});
    setCreateInternForm(initialCreateInternForm);
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

  const handleCreateUserChange = (field: keyof CreateUserForm, value: string) => {
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

  const handleCreateInternChange = (field: keyof CreateInternForm, value: string | boolean) => {
    setCreateInternForm((current) => ({
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
        role: USER_ROLES.BECARIO
      });

      setCreatedUserId(userResponse.data.id);
      setCreateStep(1);
      showToast('Usuario creado, completa datos del becario');
    } catch (error) {
      console.error('Error creando usuario para becario:', error);
      setErrorMessage('No se pudo crear el usuario del becario.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditIntern = (intern: Intern) => {
    handleOpenEdit(intern);
  };

  const handleRequestDeleteIntern = (intern: Intern) => {
    setInternPendingDelete(intern);
  };

  const handleCloseDeleteDialog = () => {
    if (isLoading) {
      return;
    }

    setInternPendingDelete(null);
  };

  const handleSubmitEdit = async () => {
    if (!editForm.id) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await internService.updateById(editForm.id, {
        status: editForm.status,
        address: editForm.address,
        education_level: editForm.education_level,
        career_name: editForm.career_name,
        grade: editForm.grade,
        name_tutor: editForm.name_tutor,
        service: editForm.service,
        documentation: editForm.documentation,
        id_subproject: editForm.id_subproject,
        id_social_facilitator: editForm.id_social_facilitator,
        start_date: editForm.start_date || undefined,
        end_date: editForm.end_date || undefined
      });

      handleCloseEdit();
      await loadData();
    } catch (error) {
      console.error('Error actualizando becario:', error);
      setErrorMessage('No se pudo actualizar el becario.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateIntern = async () => {
    if (!createdUserId) {
      showToast('Primero crea el usuario del becario', 'warning');
      return;
    }

    if (!createInternForm.chid.trim()) {
      showToast('El CHID es obligatorio', 'warning');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await internService.create({
        chid: createInternForm.chid.trim(),
        id_user: createdUserId,
        status: createInternForm.status,
        address: createInternForm.address || undefined,
        education_level: createInternForm.education_level || undefined,
        career_name: createInternForm.career_name || undefined,
        grade: createInternForm.grade || undefined,
        name_tutor: createInternForm.name_tutor || undefined,
        service: createInternForm.service || undefined,
        documentation: createInternForm.documentation || undefined,
        id_subproject: createInternForm.id_subproject || undefined,
        id_social_facilitator: createInternForm.id_social_facilitator || undefined,
        start_date: createInternForm.start_date || undefined,
        end_date: createInternForm.end_date || undefined
      });

      resetCreateFlow();
      showToast('Becario creado correctamente');
      await loadData();
    } catch (error) {
      console.error('Error creando becario:', error);
      setErrorMessage('No se pudo crear el becario.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDeleteIntern = async () => {
    if (!internPendingDelete) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await internService.deleteById(internPendingDelete.id);
      setSelectedIntern((current) => (current?.id === internPendingDelete.id ? null : current));
      setInternPendingDelete(null);
      showToast('Eliminado correctamente');
      await loadData();
    } catch (error) {
      console.error('Error eliminando becario:', error);
      setErrorMessage('No se pudo eliminar el becario.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Becarios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta y administra la informacion general de los becarios
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
            Nuevo becario
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
          <BecariosFilters
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setPage(0);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(value) => {
              setStatusFilter(value);
              setPage(0);
            }}
            facilitatorFilter={facilitatorFilter}
            onFacilitatorFilterChange={(value) => {
              setFacilitatorFilter(value);
              setPage(0);
            }}
            regionFilter={regionFilter}
            onRegionFilterChange={(value) => {
              setRegionFilter(value);
              setPage(0);
            }}
            subprojectFilter={subprojectFilter}
            onSubprojectFilterChange={(value) => {
              setSubprojectFilter(value);
              setPage(0);
            }}
            facilitators={facilitators}
            facilitatorMap={facilitatorMap}
            regions={regions}
            subprojects={subprojects}
            totalCount={filteredInterns.length}
          />

          <BecariosTable
            interns={paginatedInterns}
            userMap={userMap}
            selectedInternId={selectedIntern?.id ?? null}
            isLoading={isLoading}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={filteredInterns.length}
            onSelect={handleSelectIntern}
            onEdit={handleEditIntern}
            onDelete={handleRequestDeleteIntern}
            onCopyEmail={handleCopyEmail}
            onPageChange={setPage}
            onRowsPerPageChange={(value) => {
              setRowsPerPage(value);
              setPage(0);
            }}
            formatDate={formatDate}
          />
        </Paper>

        <Paper sx={{ p: 3, flex: 1, minWidth: { xs: '100%', lg: 320 } }}>
          <BecariosDetailPanel
            selectedIntern={selectedIntern}
            selectedUser={selectedUser}
            selectedSubproject={selectedSubproject}
            selectedFacilitator={selectedFacilitator}
            onClear={handleClearSelection}
            formatDate={formatDate}
          />
        </Paper>
      </Box>

      <BecariosCreateDialog
        open={isCreateOpen}
        activeStep={createStep}
        isLoading={isLoading}
        userForm={createUserForm}
        userFormErrors={createUserErrors}
        internForm={createInternForm}
        subprojects={subprojects}
        facilitators={facilitators}
        facilitatorMap={facilitatorMap}
        onClose={handleCloseCreate}
        onUserChange={handleCreateUserChange}
        onInternChange={handleCreateInternChange}
        onNextStep={handleCreateNextStep}
        onBackStep={() => setCreateStep(0)}
        onSubmit={handleCreateIntern}
      />

      <BecariosEditDialog
        open={isEditOpen}
        isLoading={isLoading}
        editForm={editForm}
        subprojects={subprojects}
        facilitators={facilitators}
        facilitatorMap={facilitatorMap}
        onClose={handleCloseEdit}
        onChange={handleEditChange}
        onSubmit={handleSubmitEdit}
      />

      <BecariosDeleteDialog
        open={Boolean(internPendingDelete)}
        isLoading={isLoading}
        internLabel={
          internPendingDelete
            ? `${userMap.get(internPendingDelete.id_user)?.first_name ?? ''} ${userMap.get(internPendingDelete.id_user)?.last_name ?? ''}`.trim() || internPendingDelete.chid
            : ''
        }
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteIntern}
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

export default Becarios;
