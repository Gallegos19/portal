import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Chip,
  Button,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import { subprojectService } from '../../services/api/subproject';
import { regionService } from '../../services/api/region';
import { coordinatorService } from '../../services/api/coordinator';
import { socialFacilitatorService } from '../../services/api/socialFacilitator';
import { useToast } from '../../hooks/useToast';
import type { Subproject, Region, Coordinator, SocialFacilitator } from '../../types/api';
import { Status } from '../../types/api';

// Sub-components
import SubprojectosFilters from './subprojectos/SubprojectosFilters';
import SubprojectosDetailPanel from './subprojectos/SubprojectosDetailPanel';
import SubprojectosCreateDialog from './subprojectos/SubprojectosCreateDialog';
import SubprojectosEditDialog from './subprojectos/SubprojectosEditDialog';
import SubprojectosDeleteDialog from './subprojectos/SubprojectosDeleteDialog';

interface LoadingState {
  list: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

const Subprojectos: React.FC = () => {
  const { showToast } = useToast();

  // State for data
  const [subprojectos, setSubprojectos] = useState<Subproject[]>([]);
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [coordinadores, setCoordinadores] = useState<Coordinator[]>([]);
  const [facilitadores, setFacilitadores] = useState<SocialFacilitator[]>([]);
  const [selectedSubproject, setSelectedSubproject] = useState<Subproject | null>(null);

  // State for UI
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('');

  // State for modals
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // State for loading
  const [loading, setLoading] = useState<LoadingState>({
    list: true,
    create: false,
    update: false,
    delete: false,
  });

  // Comentado: No se usa en esta versión
  // const STATUS_ID_BY_VALUE = useMemo(() => {
  //   return Object.entries(Status).reduce(...
  // }, []);

  const getStatusLabel = useCallback((statusId?: string): string => {
    if (!statusId) return 'Sin estado';
    const statusValue = Status[statusId as keyof typeof Status];
    if (statusValue) {
      return `${statusValue.charAt(0)}${statusValue.slice(1).toLowerCase()}`;
    }
    return 'Sin estado';
  }, []);

  const getStatusColor = useCallback((statusId?: string): string => {
    if (!statusId) return '#9ca3af';
    const statusValue = Status[statusId as keyof typeof Status];
    if (statusValue === 'ACTIVO') return '#26C6DA';
    if (statusValue === 'ELIMINADO') return '#ef4444';
    if (statusValue === 'INACTIVO') return '#3b82f6';
    return '#9ca3af';
  }, []);

  // Mapas para mostrar en la UI
  const regionMap = useMemo(() => {
    return new Map(regiones.map((r) => [r.id, r.name_region ?? r.name ?? 'Sin nombre']));
  }, [regiones]);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, list: true }));
      const [subprojectsRes, regionsRes, coordinatorsRes, facilitatorsRes] = await Promise.all([
        subprojectService.getAll(),
        regionService.getAll(),
        coordinatorService.getAll(),
        socialFacilitatorService.getAll(),
      ]);
      setSubprojectos(subprojectsRes?.data || []);
      setRegiones(regionsRes?.data || []);
      setCoordinadores(coordinatorsRes?.data || []);
      setFacilitadores(facilitatorsRes?.data || []);
      setSelectedSubproject(null);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Error al cargar los datos', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, list: false }));
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter subprojects
  const filteredSubprojectos = useMemo(() => {
    return subprojectos.filter((subproject) => {
      const searchMatch = (subproject.name_subproject ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let statusMatch = true;
      if (statusFilter) {
        const subprojectStatusValue = subproject.status_id ? Status[subproject.status_id as keyof typeof Status] : undefined;
        statusMatch = subprojectStatusValue === statusFilter.toUpperCase();
      }

      let regionMatch = true;
      if (regionFilter) {
        regionMatch = (subproject.id_region ?? subproject.region_id) === regionFilter;
      }

      return searchMatch && statusMatch && regionMatch;
    });
  }, [subprojectos, searchTerm, statusFilter, regionFilter]);

  // Pagination
  const paginatedSubprojectos = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredSubprojectos.slice(start, start + rowsPerPage);
  }, [filteredSubprojectos, page, rowsPerPage]);

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Create subproject
  const handleCreateSubproject = useCallback(
    async (data: Omit<Subproject, 'id'>) => {
      try {
        setLoading((prev) => ({ ...prev, create: true }));
        const newSubproject = await subprojectService.create(data);
        setSubprojectos((prev) => [...prev, newSubproject?.data || newSubproject]);
        setShowCreateDialog(false);
        showToast('Subproyecto creado exitosamente', 'success');
      } catch (error) {
        console.error('Error creating subproject:', error);
        showToast('Error al crear el subproyecto', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, create: false }));
      }
    },
    [showToast]
  );

  // Update subproject
  const handleUpdateSubproject = useCallback(
    async (id: string, data: Partial<Subproject>) => {
      try {
        setLoading((prev) => ({ ...prev, update: true }));
        const updatedSubproject = await subprojectService.updateById(id, data);
        setSubprojectos((prev) => prev.map((s) => (s.id === id ? (updatedSubproject?.data || updatedSubproject) : s)));
        setSelectedSubproject(updatedSubproject?.data || updatedSubproject);
        setShowEditDialog(false);
        showToast('Subproyecto actualizado exitosamente', 'success');
      } catch (error) {
        console.error('Error updating subproject:', error);
        showToast('Error al actualizar el subproyecto', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, update: false }));
      }
    },
    [showToast]
  );

  // Delete subproject
  const handleDeleteSubproject = useCallback(
    async (id: string) => {
      try {
        setLoading((prev) => ({ ...prev, delete: true }));
        await subprojectService.deleteById(id);
        setSubprojectos((prev) => prev.filter((s) => s.id !== id));
        setSelectedSubproject(null);
        setShowDeleteDialog(false);
        showToast('Subproyecto eliminado exitosamente', 'success');
      } catch (error) {
        console.error('Error deleting subproject:', error);
        showToast('Error al eliminar el subproyecto', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, delete: false }));
      }
    },
    [showToast]
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
          Subproyectos
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
          Gestión de subproyectos del sistema
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 1.5,
            padding: '8px 16px',
            '&:hover': {
              background: 'linear-gradient(135deg, #1ea7b5 0%, #0098a8 100%)',
              boxShadow: '0 4px 12px rgba(38, 198, 218, 0.4)',
            },
          }}
        >
          Nuevo Subproyecto
        </Button>
      </Box>

      {/* Filters */}
      <SubprojectosFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        regionFilter={regionFilter}
        onRegionFilterChange={setRegionFilter}
        regiones={regiones}
        resultCount={filteredSubprojectos.length}
      />

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', flexDirection: { xs: 'column', lg: 'row-reverse' } }}>
        {/* Detail Panel - Right side on large screens */}
        <Box sx={{ flex: '0 0 320px', minWidth: 0 }}>
          <SubprojectosDetailPanel
            subproject={selectedSubproject}
            getStatusLabel={getStatusLabel}
            getStatusColor={getStatusColor}
            regionMap={regionMap}
          />
        </Box>

        {/* Table - Left side on large screens */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {loading.list ? (
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            </Card>
          ) : (
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                overflow: 'hidden',
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow sx={{ '& th': { textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>Nombre</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>Región</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px', width: 140 }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedSubprojectos.map((subproject) => (
                      <TableRow
                        key={subproject.id}
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f0f9fa',
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500, color: '#1e293b' }}>
                          {subproject.name_subproject}
                        </TableCell>
                        <TableCell sx={{ color: '#475569' }}>
                          {regionMap.get(subproject.id_region ?? subproject.region_id ?? '') ?? 'Sin región'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(subproject.status_id)}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(subproject.status_id),
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Button
                              size="small"
                              startIcon={<InfoIcon />}
                              onClick={() => setSelectedSubproject(subproject)}
                              variant="text"
                              sx={{
                                color: '#26C6DA',
                                '&:hover': { backgroundColor: 'rgba(38, 198, 218, 0.08)' },
                              }}
                            />
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                setSelectedSubproject(subproject);
                                setShowEditDialog(true);
                              }}
                              variant="text"
                              sx={{
                                color: '#0ea5e9',
                                '&:hover': { backgroundColor: 'rgba(14, 165, 233, 0.08)' },
                              }}
                            />
                            <Button
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                setSelectedSubproject(subproject);
                                setShowDeleteDialog(true);
                              }}
                              variant="text"
                              color="error"
                              sx={{
                                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' },
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredSubprojectos.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: '1px solid #e2e8f0',
                  '& .MuiTablePagination-toolbar': {
                    minHeight: 56,
                  },
                }}
              />
            </Card>
          )}
        </Box>
      </Box>

      {/* Dialogs */}
      <SubprojectosCreateDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateSubproject}
        loading={loading.create}
        regiones={regiones}
        coordinadores={coordinadores}
        facilitadores={facilitadores}
      />

      {selectedSubproject && (
        <SubprojectosEditDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          subproject={selectedSubproject}
          onSubmit={(data: Partial<Subproject>) => handleUpdateSubproject(selectedSubproject.id, data)}
          loading={loading.update}
          regiones={regiones}
          coordinadores={coordinadores}
          facilitadores={facilitadores}
        />
      )}

      {selectedSubproject && (
        <SubprojectosDeleteDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          subproject={selectedSubproject}
          onConfirm={() => handleDeleteSubproject(selectedSubproject.id)}
          loading={loading.delete}
        />
      )}
    </Box>
  );
};

export default Subprojectos;
