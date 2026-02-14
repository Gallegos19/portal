import React from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import type { Intern, Report, UserApi } from '../../types/api';
import { internService } from '../../services/api/intern';
import { userService } from '../../services/api/user';
import { reportService } from '../../services/api/report';
import { archiveService } from '../../services/api/archive';

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

const getUserLabel = (userMap: Map<string, UserApi>, userId: string): string => {
  const user = userMap.get(userId);

  if (!user) {
    return 'Usuario sin datos';
  }

  return `${user.first_name} ${user.last_name}`.trim();
};

const Reportes: React.FC = () => {
  const [interns, setInterns] = React.useState<Intern[]>([]);
  const [users, setUsers] = React.useState<UserApi[]>([]);
  const [reports, setReports] = React.useState<Report[]>([]);
  const [internReports, setInternReports] = React.useState<Report[]>([]);
  const [selectedIntern, setSelectedIntern] = React.useState<Intern | null>(null);
  const [internSearch, setInternSearch] = React.useState('');
  const [reportSearch, setReportSearch] = React.useState('');
  const [internPage, setInternPage] = React.useState(0);
  const [internRowsPerPage, setInternRowsPerPage] = React.useState(5);
  const [reportPage, setReportPage] = React.useState(0);
  const [reportRowsPerPage, setReportRowsPerPage] = React.useState(5);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingReports, setIsLoadingReports] = React.useState(false);
  const [activeArchiveId, setActiveArchiveId] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const userMap = React.useMemo(() => buildUserMap(users), [users]);

  const loadBaseData = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [internResponse, userResponse, reportResponse] = await Promise.all([
        internService.getAll(),
        userService.getAll(),
        reportService.getAll()
      ]);

      setInterns(internResponse.data);
      setUsers(userResponse.data);
      setReports(reportResponse.data);
    } catch (error) {
      console.error('Error cargando datos de reportes:', error);
      setErrorMessage('No se pudieron cargar los datos de reportes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      setInternReports(response.data);
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
    const user = userMap.get(intern.id_user);
    const name = user ? `${user.first_name} ${user.last_name}` : '';
    const email = user?.email ?? '';
    const matchesSearch = name.toLowerCase().includes(internSearch.toLowerCase()) ||
      email.toLowerCase().includes(internSearch.toLowerCase()) ||
      intern.chid.toLowerCase().includes(internSearch.toLowerCase());

    return matchesSearch;
  });

  const reportList = selectedIntern ? internReports : reports;

  const filteredReports = reportList.filter((report) => {
    const titleMatch = report.title.toLowerCase().includes(reportSearch.toLowerCase());
    const typeMatch = report.type?.toLowerCase().includes(reportSearch.toLowerCase()) ?? false;
    const creatorMatch = getUserLabel(userMap, report.created_by)
      .toLowerCase()
      .includes(reportSearch.toLowerCase());

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
            Consulta los reportes y descarga sus archivos relacionados
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Lista de becarios
          </Typography>
          <TextField
            size="small"
            placeholder="Buscar por nombre, correo o CHID..."
            value={internSearch}
            onChange={(event) => {
              setInternSearch(event.target.value);
              setInternPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 280 }}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>CHID</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedInterns.map((intern) => {
                    const user = userMap.get(intern.id_user);
                    const isSelected = selectedIntern?.id === intern.id;

                    return (
                      <TableRow key={intern.id} hover selected={isSelected}>
                        <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Sin datos'}</TableCell>
                        <TableCell>{user?.email ?? 'Sin correo'}</TableCell>
                        <TableCell>{intern.chid}</TableCell>
                        <TableCell>
                          <Chip
                            label={intern.status ? 'Activo' : 'Inactivo'}
                            color={intern.status ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant={isSelected ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => handleSelectIntern(intern)}
                          >
                            {isSelected ? 'Seleccionado' : 'Ver reportes'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {paginatedInterns.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No hay becarios para mostrar.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 25]}
              count={filteredInterns.length}
              rowsPerPage={internRowsPerPage}
              page={internPage}
              onPageChange={(_, page) => setInternPage(page)}
              onRowsPerPageChange={(event) => {
                setInternRowsPerPage(parseInt(event.target.value, 10));
                setInternPage(0);
              }}
              labelRowsPerPage="Filas por pagina:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedIntern ? `Reportes de ${selectedInternLabel}` : 'Todos los reportes'}
            </Typography>
            {selectedIntern && (
              <Button size="small" onClick={handleClearSelection} sx={{ mt: 1 }}>
                Limpiar seleccion
              </Button>
            )}
          </Box>
          <TextField
            size="small"
            placeholder="Buscar reportes por titulo, tipo o becario..."
            value={reportSearch}
            onChange={(event) => {
              setReportSearch(event.target.value);
              setReportPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 280 }}
          />
        </Box>

        {isLoadingReports ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Titulo</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Becario</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="right">Archivo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReports.map((report) => {
                    const hasArchive = Boolean(report.id_archive);
                    const isArchiveLoading = activeArchiveId === report.id_archive;

                    return (
                      <TableRow key={report.id} hover>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{report.type ?? 'Sin tipo'}</TableCell>
                        <TableCell>{getUserLabel(userMap, report.created_by)}</TableCell>
                        <TableCell>{formatDate(report.created_at)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title={hasArchive ? 'Ver archivo' : 'Sin archivo'}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenArchive(report, 'view')}
                                disabled={!hasArchive || isArchiveLoading}
                              >
                                {isArchiveLoading ? <CircularProgress size={18} /> : <VisibilityIcon fontSize="small" />}
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title={hasArchive ? 'Descargar archivo' : 'Sin archivo'}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenArchive(report, 'download')}
                                disabled={!hasArchive || isArchiveLoading}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {paginatedReports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No hay reportes para mostrar.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 25]}
              count={filteredReports.length}
              rowsPerPage={reportRowsPerPage}
              page={reportPage}
              onPageChange={(_, page) => setReportPage(page)}
              onRowsPerPageChange={(event) => {
                setReportRowsPerPage(parseInt(event.target.value, 10));
                setReportPage(0);
              }}
              labelRowsPerPage="Filas por pagina:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Reportes;
