import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
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
  Typography
} from '@mui/material';
import {
  Download as DownloadIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import type { Report, UserApi } from '../../../types/api';

interface ReportesReportsSectionProps {
  selectedInternLabel: string;
  hasSelectedIntern: boolean;
  onClearSelection: () => void;
  reportSearch: string;
  onReportSearchChange: (value: string) => void;
  isLoadingReports: boolean;
  reports: Report[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  userMap: Map<string, UserApi>;
  getUserLabel: (userMap: Map<string, UserApi>, userId: string) => string;
  formatDate: (value?: string) => string;
  activeArchiveId: string | null;
  onOpenArchive: (report: Report, mode: 'view' | 'download') => void;
}

const ReportesReportsSection: React.FC<ReportesReportsSectionProps> = ({
  selectedInternLabel,
  hasSelectedIntern,
  onClearSelection,
  reportSearch,
  onReportSearchChange,
  isLoadingReports,
  reports,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  userMap,
  getUserLabel,
  formatDate,
  activeArchiveId,
  onOpenArchive
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {hasSelectedIntern ? `Reportes de ${selectedInternLabel}` : 'Todos los reportes'}
          </Typography>
          {hasSelectedIntern && (
            <Button size="small" onClick={onClearSelection} sx={{ mt: 1 }}>
              Limpiar seleccion
            </Button>
          )}
        </Box>
        <TextField
          size="small"
          placeholder="Buscar reportes por titulo, tipo o becario..."
          value={reportSearch}
          onChange={(event) => onReportSearchChange(event.target.value)}
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
                {reports.map((report) => {
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
                              onClick={() => onOpenArchive(report, 'view')}
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
                              onClick={() => onOpenArchive(report, 'download')}
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
                {reports.length === 0 && (
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
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => onPageChange(newPage)}
            onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
            labelRowsPerPage="Filas por pagina:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </>
      )}
    </Paper>
  );
};

export default ReportesReportsSection;
