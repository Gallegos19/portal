import React from 'react';
import { Alert, Box, Button, Container, Paper, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import type { Intern, Region, Report, SocialFacilitator, Subproject, UserApi } from '../../types/api';
import { archiveService } from '../../services/api/archive';
import { internService } from '../../services/api/intern';
import { regionService } from '../../services/api/region';
import { reportService } from '../../services/api/report';
import { socialFacilitatorService } from '../../services/api/socialFacilitator';
import { subprojectService } from '../../services/api/subproject';
import { userService } from '../../services/api/user';
import { useAuthStore } from '../../store/authStore';
import {
  ReportesInternsFilters,
  ReportesInternsTable,
  ReportesReportsSection
} from '../admin/reportes/index';

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

const getFileExtension = (url: string): string => {
  const pathname = new URL(url).pathname;
  const filename = pathname.split('/').pop() ?? '';

  if (!filename.includes('.')) {
    return '';
  }

  return filename.split('.').pop()?.toLowerCase() ?? '';
};

const isSpreadsheet = (url: string): boolean => {
  const extension = getFileExtension(url);

  return ['xls', 'xlsx', 'csv'].includes(extension);
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

const getUserLabel = (userMap: Map<string, UserApi>, userId: string): string => {
  const user = userMap.get(userId);

  if (!user) {
    return 'Usuario sin datos';
  }

  return `${user.first_name} ${user.last_name}`.trim();
};

const Reportes: React.FC = () => {
  const { user } = useAuthStore();

  const [interns, setInterns] = React.useState<Intern[]>([]);
  const [users, setUsers] = React.useState<UserApi[]>([]);
  const [reports, setReports] = React.useState<Report[]>([]);
  const [subprojects, setSubprojects] = React.useState<Subproject[]>([]);
  const [regions, setRegions] = React.useState<Region[]>([]);
  const [facilitators, setFacilitators] = React.useState<SocialFacilitator[]>([]);
  const [currentFacilitator, setCurrentFacilitator] = React.useState<SocialFacilitator | null>(null);

  const [internReports, setInternReports] = React.useState<Report[]>([]);
  const [selectedIntern, setSelectedIntern] = React.useState<Intern | null>(null);

  const [internSearch, setInternSearch] = React.useState('');
  const [reportSearch, setReportSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('todos');
  const [facilitatorFilter, setFacilitatorFilter] = React.useState('todos');
  const [regionFilter, setRegionFilter] = React.useState('todos');
  const [subprojectFilter, setSubprojectFilter] = React.useState('todos');

  const [internPage, setInternPage] = React.useState(0);
  const [internRowsPerPage, setInternRowsPerPage] = React.useState(5);
  const [reportPage, setReportPage] = React.useState(0);
  const [reportRowsPerPage, setReportRowsPerPage] = React.useState(5);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingReports, setIsLoadingReports] = React.useState(false);
  const [activeArchiveId, setActiveArchiveId] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const userMap = React.useMemo(() => buildUserMap(users), [users]);
  const subprojectMap = React.useMemo(() => buildSubprojectMap(subprojects), [subprojects]);
  const facilitatorMap = React.useMemo(
    () => buildFacilitatorMap(facilitators, userMap),
    [facilitators, userMap]
  );

  const loadBaseData = React.useCallback(async () => {
    if (!user?.id) {
      setErrorMessage('No se pudo identificar al facilitador actual.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const facilitatorResponse = await socialFacilitatorService.getByUserId(user.id);
      const facilitator = facilitatorResponse.data;

      if (!facilitator?.id) {
        setErrorMessage('No se encontro un facilitador social asociado a tu usuario.');
        setInterns([]);
        setUsers([]);
        setReports([]);
        setSubprojects([]);
        setRegions([]);
        setFacilitators([]);
        setCurrentFacilitator(null);
        return;
      }

      setCurrentFacilitator(facilitator);
      setFacilitators([facilitator]);
      setFacilitatorFilter(facilitator.id);
      setRegionFilter(facilitator.id_region);

      const [
        internResponse,
        userResponse,
        reportResponse,
        subprojectResponse,
        regionResponse
      ] = await Promise.all([
        internService.getByFacilitatorId(facilitator.id),
        userService.getAll(),
        reportService.getAll(),
        subprojectService.getByRegionId(facilitator.id_region),
        regionService.getById(facilitator.id_region)
      ]);

      const facilitatorInterns = internResponse.data || [];
      const allowedCreatorIds = new Set(facilitatorInterns.map((intern) => intern.id_user));

      const regionSubprojects = subprojectResponse.data || [];
      const facilitatorSubprojects = regionSubprojects.filter(
        (subproject) => subproject.social_facilitator_id === facilitator.id
      );

      setInterns(facilitatorInterns);
      setUsers(userResponse.data || []);
      setReports((reportResponse.data || []).filter((report) => allowedCreatorIds.has(report.created_by)));
      setSubprojects(facilitatorSubprojects.length > 0 ? facilitatorSubprojects : regionSubprojects);
      setRegions(regionResponse.data ? [regionResponse.data] : []);
    } catch (error) {
      console.error('Error cargando datos de reportes del facilitador:', error);
      setErrorMessage('No se pudieron cargar los datos de reportes.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

  const handleSelectIntern = async (intern: Intern) => {
    setSelectedIntern(intern);
    setReportPage(0);
    setIsLoadingReports(true);
    setErrorMessage(null);

    try {
      const response = await reportService.getByCreatorId(intern.id_user);
      setInternReports(response.data || []);
    } catch (error) {
      console.error('Error cargando reportes del becario:', error);
      setErrorMessage('No se pudieron cargar los reportes del becario.');
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedIntern(null);
    setInternReports([]);
    setReportPage(0);
  };

  const handleOpenArchive = async (report: Report, mode: 'view' | 'download') => {
    if (!report.id_archive) {
      return;
    }

    setActiveArchiveId(report.id_archive);
    setErrorMessage(null);

    try {
      const response = await archiveService.getSignedUrl(report.id_archive);
      const signedUrl = response.data.signed_url;

      if (mode === 'view') {
        const targetUrl = isSpreadsheet(signedUrl)
          ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(signedUrl)}`
          : signedUrl;

        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = report.title || 'reporte';
      link.rel = 'noopener';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error obteniendo URL firmada:', error);
      setErrorMessage('No se pudo abrir el archivo del reporte.');
    } finally {
      setActiveArchiveId(null);
    }
  };

  const filteredInterns = interns.filter((intern) => {
    const internUser = userMap.get(intern.id_user);
    const name = internUser ? `${internUser.first_name} ${internUser.last_name}` : '';
    const email = internUser?.email ?? '';
    const searchValue = internSearch.toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(searchValue) ||
      email.toLowerCase().includes(searchValue) ||
      intern.chid.toLowerCase().includes(searchValue);

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

    const belongsToCurrentFacilitator =
      !currentFacilitator || intern.id_social_facilitator === currentFacilitator.id;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesFacilitator &&
      matchesRegion &&
      matchesSubproject &&
      belongsToCurrentFacilitator
    );
  });

  const reportList = selectedIntern
    ? internReports
    : reports;

  const filteredReports = reportList.filter((report) => {
    const searchValue = reportSearch.toLowerCase();
    const titleMatch = report.title.toLowerCase().includes(searchValue);
    const typeMatch = report.type?.toLowerCase().includes(searchValue) ?? false;
    const creatorMatch = getUserLabel(userMap, report.created_by)
      .toLowerCase()
      .includes(searchValue);

    return titleMatch || typeMatch || creatorMatch;
  });

  const paginatedInterns = filteredInterns.slice(
    internPage * internRowsPerPage,
    internPage * internRowsPerPage + internRowsPerPage
  );

  const paginatedReports = filteredReports.slice(
    reportPage * reportRowsPerPage,
    reportPage * reportRowsPerPage + reportRowsPerPage
  );

  const selectedInternLabel = selectedIntern
    ? getUserLabel(userMap, selectedIntern.id_user)
    : '';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Reportes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta los reportes de tus becarios y descarga sus archivos relacionados
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadBaseData}
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

      <Paper sx={{ p: 3, mb: 4 }}>
        <ReportesInternsFilters
          internSearch={internSearch}
          onInternSearchChange={(value) => {
            setInternSearch(value);
            setInternPage(0);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setInternPage(0);
          }}
          facilitatorFilter={facilitatorFilter}
          onFacilitatorFilterChange={(value) => {
            setFacilitatorFilter(value);
            setInternPage(0);
          }}
          regionFilter={regionFilter}
          onRegionFilterChange={(value) => {
            setRegionFilter(value);
            setInternPage(0);
          }}
          subprojectFilter={subprojectFilter}
          onSubprojectFilterChange={(value) => {
            setSubprojectFilter(value);
            setInternPage(0);
          }}
          facilitators={facilitators}
          facilitatorMap={facilitatorMap}
          regions={regions}
          subprojects={subprojects}
          totalCount={filteredInterns.length}
          showFacilitatorFilter={false}
          showRegionFilter={false}
        />

        <ReportesInternsTable
          interns={paginatedInterns}
          userMap={userMap}
          selectedInternId={selectedIntern?.id ?? null}
          isLoading={isLoading}
          page={internPage}
          rowsPerPage={internRowsPerPage}
          totalCount={filteredInterns.length}
          onSelect={handleSelectIntern}
          onPageChange={setInternPage}
          onRowsPerPageChange={(value) => {
            setInternRowsPerPage(value);
            setInternPage(0);
          }}
        />
      </Paper>

      <ReportesReportsSection
        selectedInternLabel={selectedInternLabel}
        hasSelectedIntern={Boolean(selectedIntern)}
        onClearSelection={handleClearSelection}
        reportSearch={reportSearch}
        onReportSearchChange={(value) => {
          setReportSearch(value);
          setReportPage(0);
        }}
        isLoadingReports={isLoadingReports}
        reports={paginatedReports}
        totalCount={filteredReports.length}
        page={reportPage}
        rowsPerPage={reportRowsPerPage}
        onPageChange={setReportPage}
        onRowsPerPageChange={(value) => {
          setReportRowsPerPage(value);
          setReportPage(0);
        }}
        userMap={userMap}
        getUserLabel={getUserLabel}
        formatDate={formatDate}
        activeArchiveId={activeArchiveId}
        onOpenArchive={handleOpenArchive}
      />
    </Container>
  );
};

export default Reportes;