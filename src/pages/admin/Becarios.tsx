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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import type { AlertColor } from '@mui/material';
import type { Intern, Region, SocialFacilitator, Subproject, UserApi } from '../../types/api';
import { internService } from '../../services/api/intern';
import { regionService } from '../../services/api/region';
import { socialFacilitatorService } from '../../services/api/socialFacilitator';
import { subprojectService } from '../../services/api/subproject';
import { userService } from '../../services/api/user';
import {
  BecariosDeleteDialog,
  BecariosDetailPanel,
  BecariosEditDialog,
  BecariosFilters,
  BecariosTable
} from './becarios/index';

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

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const Becarios: React.FC = () => {
  const [interns, setInterns] = React.useState<Intern[]>([]);
  const [users, setUsers] = React.useState<UserApi[]>([]);
  const [subprojects, setSubprojects] = React.useState<Subproject[]>([]);
  const [regions, setRegions] = React.useState<Region[]>([]);
  const [facilitators, setFacilitators] = React.useState<SocialFacilitator[]>([]);
  const [selectedIntern, setSelectedIntern] = React.useState<Intern | null>(null);
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
  const [toast, setToast] = React.useState<ToastState>({
    open: false,
    message: '',
    severity: 'success'
  });
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
      setToast({
        open: true,
        message: 'Correo copiado',
        severity: 'success'
      });
    } catch (error) {
      console.error('No se pudo copiar el correo:', error);
    }
  };

  const handleCloseToast = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setToast((current) => ({
      ...current,
      open: false
    }));
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
      setToast({
        open: true,
        message: 'Eliminado correctamente',
        severity: 'success'
      });
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
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadData}
          disabled={isLoading}
        >
          Actualizar
        </Button>
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
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Becarios;
